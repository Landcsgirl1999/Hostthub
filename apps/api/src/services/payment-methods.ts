import { PrismaClient } from '@hostit/db';
import { 
  encryptSensitiveData, 
  decryptSensitiveData, 
  validateSensitiveData 
} from '../config/security';

const prisma = new PrismaClient();

export interface CardPaymentMethod {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv?: string;
  cardholderName: string;
  nickname?: string;
}

export interface BankAccountPaymentMethod {
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  bankName: string;
  accountType: string;
  nickname?: string;
}

export interface PaymentMethodResponse {
  id: string;
  type: 'CARD' | 'BANK_ACCOUNT' | 'PAYPAL';
  isDefault: boolean;
  isActive: boolean;
  nickname?: string;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Masked display information
  displayInfo: {
    lastFourDigits: string;
    cardBrand?: string;
    bankName?: string;
    accountType?: string;
    expiryMonth?: string;
    expiryYear?: string;
  };
}

export class PaymentMethodsService {
  /**
   * Add a new card payment method
   */
  static async addCardPaymentMethod(
    accountId: string, 
    cardData: CardPaymentMethod
  ): Promise<PaymentMethodResponse> {
    try {
      // Validate card data
      const validation = validateSensitiveData({
        cardNumber: cardData.cardNumber,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cardholderName: cardData.cardholderName
      }, ['cardNumber', 'expiryMonth', 'expiryYear', 'cardholderName']);

      if (!validation.isValid) {
        throw new Error(`Invalid card data: ${validation.errors.join(', ')}`);
      }

      // Validate card number format
      const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cleanCardNumber)) {
        throw new Error('Invalid card number format');
      }

      // Validate expiry date
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expiryYear = parseInt(cardData.expiryYear);
      const expiryMonth = parseInt(cardData.expiryMonth);

      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        throw new Error('Card has expired');
      }

      // Get card brand from number
      const cardBrand = this.getCardBrand(cleanCardNumber);
      const lastFourDigits = cleanCardNumber.slice(-4);

      // Encrypt sensitive card data
      const encryptedCardNumber = encryptSensitiveData(cleanCardNumber, 'card');
      const encryptedExpiryMonth = encryptSensitiveData(cardData.expiryMonth, 'card');
      const encryptedExpiryYear = encryptSensitiveData(cardData.expiryYear, 'card');
      const encryptedCvv = cardData.cvv ? encryptSensitiveData(cardData.cvv, 'card') : null;

      // Check if this should be the default payment method
      const existingPaymentMethods = await prisma.storedPaymentMethod.findMany({
        where: { accountId, isActive: true }
      });

      const isDefault = existingPaymentMethods.length === 0 || cardData.nickname?.toLowerCase().includes('default');

      // If setting as default, unset other defaults
      if (isDefault) {
        await prisma.storedPaymentMethod.updateMany({
          where: { accountId, isDefault: true },
          data: { isDefault: false }
        });
      }

      // Create payment method with card details
      const paymentMethod = await prisma.storedPaymentMethod.create({
        data: {
          type: 'CARD',
          isDefault,
          isActive: true,
          nickname: cardData.nickname || `${cardBrand} ending in ${lastFourDigits}`,
          accountId,
          cardDetails: {
            create: {
              encryptedCardNumber,
              encryptedExpiryMonth,
              encryptedExpiryYear,
              encryptedCvv,
              cardholderName: cardData.cardholderName,
              lastFourDigits,
              cardBrand,
              expiryMonth: cardData.expiryMonth,
              expiryYear: cardData.expiryYear
            }
          }
        },
        include: {
          cardDetails: true,
          bankAccountDetails: true
        }
      });

      return this.formatPaymentMethodResponse(paymentMethod);
    } catch (error) {
      console.error('Error adding card payment method:', error);
      throw error;
    }
  }

  /**
   * Add a new bank account payment method
   */
  static async addBankAccountPaymentMethod(
    accountId: string, 
    bankData: BankAccountPaymentMethod
  ): Promise<PaymentMethodResponse> {
    try {
      // Validate bank account data
      const validation = validateSensitiveData({
        accountNumber: bankData.accountNumber,
        routingNumber: bankData.routingNumber,
        accountHolderName: bankData.accountHolderName,
        bankName: bankData.bankName
      }, ['accountNumber', 'routingNumber', 'accountHolderName', 'bankName']);

      if (!validation.isValid) {
        throw new Error(`Invalid bank account data: ${validation.errors.join(', ')}`);
      }

      // Validate account number format
      const cleanAccountNumber = bankData.accountNumber.replace(/\s/g, '');
      if (!/^\d{8,17}$/.test(cleanAccountNumber)) {
        throw new Error('Invalid account number format');
      }

      // Validate routing number format
      const cleanRoutingNumber = bankData.routingNumber.replace(/\s/g, '');
      if (!/^\d{9}$/.test(cleanRoutingNumber)) {
        throw new Error('Invalid routing number format');
      }

      const lastFourDigits = cleanAccountNumber.slice(-4);
      const routingNumberLastFour = cleanRoutingNumber.slice(-4);

      // Encrypt sensitive bank data
      const encryptedAccountNumber = encryptSensitiveData(cleanAccountNumber, 'bank');
      const encryptedRoutingNumber = encryptSensitiveData(cleanRoutingNumber, 'bank');

      // Check if this should be the default payment method
      const existingPaymentMethods = await prisma.storedPaymentMethod.findMany({
        where: { accountId, isActive: true }
      });

      const isDefault = existingPaymentMethods.length === 0 || bankData.nickname?.toLowerCase().includes('default');

      // If setting as default, unset other defaults
      if (isDefault) {
        await prisma.storedPaymentMethod.updateMany({
          where: { accountId, isDefault: true },
          data: { isDefault: false }
        });
      }

      // Create payment method with bank account details
      const paymentMethod = await prisma.storedPaymentMethod.create({
        data: {
          type: 'BANK_ACCOUNT',
          isDefault,
          isActive: true,
          nickname: bankData.nickname || `${bankData.bankName} ending in ${lastFourDigits}`,
          accountId,
          bankAccountDetails: {
            create: {
              encryptedAccountNumber,
              encryptedRoutingNumber,
              accountHolderName: bankData.accountHolderName,
              bankName: bankData.bankName,
              accountType: bankData.accountType,
              lastFourDigits,
              routingNumberLastFour,
              bankNameDisplay: bankData.bankName
            }
          }
        },
        include: {
          cardDetails: true,
          bankAccountDetails: true
        }
      });

      return this.formatPaymentMethodResponse(paymentMethod);
    } catch (error) {
      console.error('Error adding bank account payment method:', error);
      throw error;
    }
  }

  /**
   * Get all payment methods for an account
   */
  static async getPaymentMethods(accountId: string): Promise<PaymentMethodResponse[]> {
    try {
      const paymentMethods = await prisma.storedPaymentMethod.findMany({
        where: { accountId, isActive: true },
        include: {
          cardDetails: true,
          bankAccountDetails: true
        },
        orderBy: [
          { isDefault: 'desc' },
          { lastUsed: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      return paymentMethods.map(pm => this.formatPaymentMethodResponse(pm));
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  /**
   * Get a specific payment method
   */
  static async getPaymentMethod(paymentMethodId: string): Promise<PaymentMethodResponse | null> {
    try {
      const paymentMethod = await prisma.storedPaymentMethod.findUnique({
        where: { id: paymentMethodId },
        include: {
          cardDetails: true,
          bankAccountDetails: true
        }
      });

      if (!paymentMethod) {
        return null;
      }

      return this.formatPaymentMethodResponse(paymentMethod);
    } catch (error) {
      console.error('Error getting payment method:', error);
      throw error;
    }
  }

  /**
   * Set a payment method as default
   */
  static async setDefaultPaymentMethod(accountId: string, paymentMethodId: string): Promise<void> {
    try {
      // Unset all current defaults
      await prisma.storedPaymentMethod.updateMany({
        where: { accountId, isDefault: true },
        data: { isDefault: false }
      });

      // Set the new default
      await prisma.storedPaymentMethod.update({
        where: { id: paymentMethodId, accountId },
        data: { isDefault: true }
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  /**
   * Delete a payment method
   */
  static async deletePaymentMethod(accountId: string, paymentMethodId: string): Promise<void> {
    try {
      const paymentMethod = await prisma.storedPaymentMethod.findUnique({
        where: { id: paymentMethodId, accountId }
      });

      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      // If this was the default, we need to set another as default
      if (paymentMethod.isDefault) {
        const otherPaymentMethods = await prisma.storedPaymentMethod.findMany({
          where: { accountId, isActive: true, id: { not: paymentMethodId } }
        });

        if (otherPaymentMethods.length > 0) {
          await prisma.storedPaymentMethod.update({
            where: { id: otherPaymentMethods[0].id },
            data: { isDefault: true }
          });
        }
      }

      // Delete the payment method (cascade will delete card/bank details)
      await prisma.storedPaymentMethod.delete({
        where: { id: paymentMethodId }
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  /**
   * Get the default payment method for an account
   */
  static async getDefaultPaymentMethod(accountId: string): Promise<PaymentMethodResponse | null> {
    try {
      const paymentMethod = await prisma.storedPaymentMethod.findFirst({
        where: { accountId, isDefault: true, isActive: true },
        include: {
          cardDetails: true,
          bankAccountDetails: true
        }
      });

      if (!paymentMethod) {
        return null;
      }

      return this.formatPaymentMethodResponse(paymentMethod);
    } catch (error) {
      console.error('Error getting default payment method:', error);
      throw error;
    }
  }

  /**
   * Update payment method nickname
   */
  static async updatePaymentMethodNickname(
    accountId: string, 
    paymentMethodId: string, 
    nickname: string
  ): Promise<PaymentMethodResponse> {
    try {
      const paymentMethod = await prisma.storedPaymentMethod.update({
        where: { id: paymentMethodId, accountId },
        data: { nickname },
        include: {
          cardDetails: true,
          bankAccountDetails: true
        }
      });

      return this.formatPaymentMethodResponse(paymentMethod);
    } catch (error) {
      console.error('Error updating payment method nickname:', error);
      throw error;
    }
  }

  /**
   * Format payment method for response
   */
  private static formatPaymentMethodResponse(paymentMethod: any): PaymentMethodResponse {
    const response: PaymentMethodResponse = {
      id: paymentMethod.id,
      type: paymentMethod.type,
      isDefault: paymentMethod.isDefault,
      isActive: paymentMethod.isActive,
      nickname: paymentMethod.nickname,
      lastUsed: paymentMethod.lastUsed,
      createdAt: paymentMethod.createdAt,
      updatedAt: paymentMethod.updatedAt,
      displayInfo: {
        lastFourDigits: ''
      }
    };

    if (paymentMethod.cardDetails) {
      response.displayInfo = {
        lastFourDigits: paymentMethod.cardDetails.lastFourDigits,
        cardBrand: paymentMethod.cardDetails.cardBrand,
        expiryMonth: paymentMethod.cardDetails.expiryMonth,
        expiryYear: paymentMethod.cardDetails.expiryYear
      };
    } else if (paymentMethod.bankAccountDetails) {
      response.displayInfo = {
        lastFourDigits: paymentMethod.bankAccountDetails.lastFourDigits,
        bankName: paymentMethod.bankAccountDetails.bankNameDisplay,
        accountType: paymentMethod.bankAccountDetails.accountType
      };
    }

    return response;
  }

  /**
   * Get card brand from card number
   */
  private static getCardBrand(cardNumber: string): string {
    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');

    // Visa
    if (/^4/.test(cleanNumber)) {
      return 'visa';
    }
    // Mastercard
    if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
      return 'mastercard';
    }
    // American Express
    if (/^3[47]/.test(cleanNumber)) {
      return 'amex';
    }
    // Discover
    if (/^6(?:011|5)/.test(cleanNumber)) {
      return 'discover';
    }

    return 'unknown';
  }
} 