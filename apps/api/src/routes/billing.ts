import { Router } from 'express';
import { BillingService } from '../services/billing.js';
import { PrismaClient } from '@hostit/db';

const router = Router();
const prisma = new PrismaClient();

/**
 * Test simulated Stripe payment
 */
router.post('/test-payment', async (req, res) => {
  try {
    const { accountId, amount, description } = req.body;

    if (!accountId || !amount) {
      return res.status(400).json({ error: 'accountId and amount are required' });
    }

    console.log(`🧪 Testing simulated payment for account ${accountId}: $${amount}`);

    const result = await BillingService.chargeAccountWithStripe(
      accountId,
      amount,
      description || 'Test payment'
    );

    res.json({
      success: true,
      result,
      message: 'Simulated payment processed'
    });
  } catch (error) {
    console.error('Error testing payment:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get account billing information
 */
router.get('/account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        properties: true,
        users: {
          include: {
            subscriptions: {
              where: { status: { in: ['ACTIVE', 'TRIAL'] } },
              include: { plan: true }
            }
          }
        }
      }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const propertyCount = account.properties.length;
    const pricingTier = await BillingService.getPricingTier(propertyCount);
    const totalMonthlyCost = pricingTier.basePrice * propertyCount;

    res.json({
      account: {
        id: account.id,
        name: account.name,
        isOnHold: account.isOnHold,
        stripeCustomerId: account.stripeCustomerId,
        lastBillingDate: account.lastBillingDate,
        propertyCount,
        pricingTier,
        totalMonthlyCost
      }
    });
  } catch (error) {
    console.error('Error getting account billing info:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Process monthly billing for all accounts (manual trigger)
 */
router.post('/process-monthly-billing', async (req, res) => {
  try {
    console.log('🔄 Manual monthly billing trigger received');
    
    await BillingService.processMonthlyBilling();
    
    res.json({
      success: true,
      message: 'Monthly billing process completed'
    });
  } catch (error) {
    console.error('Error processing monthly billing:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get pricing tiers
 */
router.get('/pricing-tiers', async (req, res) => {
  try {
    const tiers = [
      { min: 1, max: 1, basePrice: 50, description: '1 property' },
      { min: 2, max: 5, basePrice: 45, description: '2-5 properties' },
      { min: 6, max: 10, basePrice: 40, description: '6-10 properties' },
      { min: 11, max: 20, basePrice: 35, description: '11-20 properties' },
      { min: 21, max: 50, basePrice: 30, description: '21-50 properties' },
      { min: 51, max: 100, basePrice: 25, description: '51-100 properties' },
      { min: 101, max: 150, basePrice: 20, description: '101-150 properties' }
    ];

    res.json({
      tiers,
      message: 'Pricing tiers retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting pricing tiers:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router; 