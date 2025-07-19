import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';
import { PaymentMethodsService } from '../services/payment-methods';

const router = express.Router();
const prisma = new PrismaClient();

// Get all payment methods for the current user's account
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const paymentMethods = await PaymentMethodsService.getPaymentMethods(user.account.id);
    res.json({ paymentMethods });
  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({ error: 'Failed to get payment methods' });
  }
});

// Get default payment method
router.get('/default', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const defaultPaymentMethod = await PaymentMethodsService.getDefaultPaymentMethod(user.account.id);
    res.json({ defaultPaymentMethod });
  } catch (error) {
    console.error('Error getting default payment method:', error);
    res.status(500).json({ error: 'Failed to get default payment method' });
  }
});

// Add a new card payment method
router.post('/card', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'OWNER']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      cardholderName,
      nickname
    } = req.body;

    if (!cardNumber || !expiryMonth || !expiryYear || !cardholderName) {
      return res.status(400).json({ error: 'Missing required card information' });
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const paymentMethod = await PaymentMethodsService.addCardPaymentMethod(user.account.id, {
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      cardholderName,
      nickname
    });

    res.status(201).json({ paymentMethod });
  } catch (error) {
    console.error('Error adding card payment method:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to add card payment method' 
    });
  }
});

// Add a new bank account payment method
router.post('/bank-account', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'OWNER']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      accountNumber,
      routingNumber,
      accountHolderName,
      bankName,
      accountType,
      nickname
    } = req.body;

    if (!accountNumber || !routingNumber || !accountHolderName || !bankName || !accountType) {
      return res.status(400).json({ error: 'Missing required bank account information' });
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const paymentMethod = await PaymentMethodsService.addBankAccountPaymentMethod(user.account.id, {
      accountNumber,
      routingNumber,
      accountHolderName,
      bankName,
      accountType,
      nickname
    });

    res.status(201).json({ paymentMethod });
  } catch (error) {
    console.error('Error adding bank account payment method:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to add bank account payment method' 
    });
  }
});

// Set a payment method as default
router.put('/:paymentMethodId/default', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'OWNER']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { paymentMethodId } = req.params;

    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method ID is required' });
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await PaymentMethodsService.setDefaultPaymentMethod(user.account.id, paymentMethodId);
    res.json({ message: 'Default payment method updated successfully' });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to set default payment method' 
    });
  }
});

// Update payment method nickname
router.put('/:paymentMethodId/nickname', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'OWNER']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { paymentMethodId } = req.params;
    const { nickname } = req.body;

    if (!paymentMethodId || !nickname) {
      return res.status(400).json({ error: 'Payment method ID and nickname are required' });
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const paymentMethod = await PaymentMethodsService.updatePaymentMethodNickname(
      user.account.id, 
      paymentMethodId, 
      nickname
    );

    res.json({ paymentMethod });
  } catch (error) {
    console.error('Error updating payment method nickname:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to update payment method nickname' 
    });
  }
});

// Delete a payment method
router.delete('/:paymentMethodId', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'OWNER']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { paymentMethodId } = req.params;

    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method ID is required' });
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await PaymentMethodsService.deletePaymentMethod(user.account.id, paymentMethodId);
    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to delete payment method' 
    });
  }
});

// Get a specific payment method
router.get('/:paymentMethodId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { paymentMethodId } = req.params;

    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method ID is required' });
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const paymentMethod = await PaymentMethodsService.getPaymentMethod(paymentMethodId);
    
    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    res.json({ paymentMethod });
  } catch (error) {
    console.error('Error getting payment method:', error);
    res.status(500).json({ error: 'Failed to get payment method' });
  }
});

export default router; 