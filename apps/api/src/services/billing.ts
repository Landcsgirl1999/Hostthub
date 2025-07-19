import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { PaymentMethodsService } from './payment-methods';

const prisma = new PrismaClient();

// Initialize Stripe conditionally
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
} else {
  console.warn('⚠️ STRIPE_SECRET_KEY not found - Stripe functionality will be disabled');
}

export class BillingService {
  /**
   * Get or create Stripe customer for an account
   */
  static async getOrCreateStripeCustomer(accountId: string): Promise<string> {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { users: true }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // If customer already exists, return it
    if (account.stripeCustomerId) {
      return account.stripeCustomerId;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: account.users[0]?.email || 'admin@hostit.com',
      name: account.name,
      metadata: {
        accountId: account.id,
        hostitAccount: 'true'
      }
    });

    // Save customer ID to database
    await prisma.account.update({
      where: { id: accountId },
      data: { stripeCustomerId: customer.id }
    });

    return customer.id;
  }

  /**
   * Charge account with Stripe
   */
  static async chargeAccountWithStripe(
    accountId: string, 
    amount: number, 
    description: string
  ): Promise<{ success: boolean; error?: string; paymentIntentId?: string }> {
    try {
      const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
          paymentMethods: {
            where: { isDefault: true, isActive: true }
          }
        }
      });

      if (!account) {
        return { success: false, error: 'Account not found' };
      }

      const customerId = await this.getOrCreateStripeCustomer(accountId);
      const paymentMethod = account.paymentMethods[0];

      if (!paymentMethod?.stripePaymentMethodId) {
        return { success: false, error: 'No payment method found' };
      }

      // Create payment intent
      if (!stripe) {
        return { success: false, error: 'Stripe not configured' };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: customerId,
        payment_method: paymentMethod.stripePaymentMethodId,
        confirm: true,
        description: description,
        metadata: {
          accountId: accountId,
          hostitBilling: 'true'
        }
      });

      if (paymentIntent.status === 'succeeded') {
        // Log successful payment
        await prisma.paymentLog.create({
          data: {
            accountId: accountId,
            amount: amount,
            currency: 'usd',
            status: 'SUCCESS',
            paymentMethod: 'STRIPE',
            stripePaymentIntentId: paymentIntent.id,
            description: description
          }
        });

        return { 
          success: true, 
          paymentIntentId: paymentIntent.id,
          amount: amount
        };
      } else {
        return { 
          success: false, 
          error: `Payment failed: ${paymentIntent.status}` 
        };
      }
    } catch (error) {
      console.error('Stripe charge error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get pricing tier based on property count
   */
  static async getPricingTier(propertyCount: number) {
    const tiers = [
      { min: 1, max: 1, basePrice: 50, description: '1 property' },
      { min: 2, max: 5, basePrice: 45, description: '2-5 properties' },
      { min: 6, max: 10, basePrice: 40, description: '6-10 properties' },
      { min: 11, max: 20, basePrice: 35, description: '11-20 properties' },
      { min: 21, max: 50, basePrice: 30, description: '21-50 properties' },
      { min: 51, max: 100, basePrice: 25, description: '51-100 properties' },
      { min: 101, max: 150, basePrice: 20, description: '101-150 properties' }
    ];

    return tiers.find(tier => propertyCount >= tier.min && propertyCount <= tier.max) || tiers[0];
  }

  /**
   * Process monthly billing for all active subscriptions
   */
  static async processMonthlyBilling() {
    try {
      console.log('🔄 Starting monthly billing process...');
      
      const today = new Date();
      const isFirstOfMonth = today.getDate() === 1;
      
      if (!isFirstOfMonth) {
        console.log('⏭️ Not the first of the month, skipping billing process');
        return;
      }

      // Get all active subscriptions
      const activeSubscriptions = await prisma.userSubscription.findMany({
        where: {
          status: 'ACTIVE',
          plan: {
            isActive: true
          }
        },
        include: {
          user: {
            include: {
              account: {
                include: {
                  paymentMethods: {
                    where: { isDefault: true, isActive: true },
                    include: {
                      cardDetails: true,
                      bankAccountDetails: true
                    }
                  }
                }
              }
            }
          },
          plan: true,
          billingCycleEnd: true,
          billingDay: true,
          nextBillingDate: true,
          billingRecord: true
        }
      });

      console.log(`📊 Processing ${activeSubscriptions.length} active subscriptions`);

      for (const subscription of activeSubscriptions) {
        try {
          const { userId, plan, billingCycleEnd, billingDay, nextBillingDate, billingRecord } = subscription;
          const user = subscription.user;
          const account = user.account;
          const paymentMethod = account.paymentMethods.find(pm => pm.isDefault && pm.isActive);

          if (!paymentMethod) {
            console.warn(`⚠️ No active payment method found for user ${userId}. Skipping billing for subscription ${subscription.id}`);
            continue;
          }

          const billingStartDate = new Date(nextBillingDate);
          const billingEndDate = new Date(billingCycleEnd);

          // Calculate total amount for the billing cycle
          const totalAmount = plan.basePrice * user.properties.length;

          console.log(`💰 User ${userId} (Account ${account.id}): ${user.properties.length} properties = $${totalAmount}`);

          // Simulate payment processing
          const chargeResult = await this.chargeAccountWithStripe(
            account.id,
            totalAmount,
            `Monthly billing for ${user.properties.length} properties`
          );

          if (chargeResult.success) {
            console.log(`✅ User ${userId} charged successfully`);
            
            // Update subscription billing cycle
            await prisma.userSubscription.update({
              where: { id: subscription.id },
              data: {
                billingCycleEnd: billingEndDate,
                nextBillingDate: billingStartDate,
                billingRecordId: billingRecord?.id || null
              }
            });

            // Update account status
            await prisma.account.update({
              where: { id: account.id },
              data: { 
                isOnHold: false,
                lastBillingDate: billingStartDate
              }
            });

            // Put all users and properties on hold if payment failed
            if (!chargeResult.success) {
              await prisma.user.updateMany({
                where: { accountId: account.id },
                data: { isOnHold: true }
              });

              await prisma.property.updateMany({
                where: { accountId: account.id },
                data: { isOnHold: true }
              });
            }
          } else {
            console.log(`❌ User ${userId} payment failed: ${chargeResult.error}`);
            
            // Put account on hold
            await prisma.account.update({
              where: { id: account.id },
              data: { 
                isOnHold: true,
                lastBillingDate: billingStartDate
              }
            });

            // Put all users and properties on hold
            await prisma.user.updateMany({
              where: { accountId: account.id },
              data: { isOnHold: true }
            });

            await prisma.property.updateMany({
              where: { accountId: account.id },
              data: { isOnHold: true }
            });
          }
        } catch (error) {
          console.error(`❌ Error processing subscription ${subscription.id}:`, error);
        }
      }

      console.log('✅ Monthly billing process completed');
    } catch (error) {
      console.error('❌ Error in monthly billing process:', error);
      throw error;
    }
  }
} 