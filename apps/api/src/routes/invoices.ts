import { Router } from 'express';
import { InvoicingService } from '../services/invoicing.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { PrismaClient } from '@hostit/db';

const router = Router();
const prisma = new PrismaClient();

/**
 * Create a new invoice
 */
router.post('/', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      accountId,
      items,
      subtotal,
      taxAmount,
      totalAmount,
      dueDate,
      notes,
      terms
    } = req.body;

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true }
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Generate invoice number
    const invoiceNumber = await InvoicingService.generateInvoiceNumber(user.account.id);

    // Create invoice data
    const invoiceData = {
      invoiceNumber,
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      accountId: user.account.id,
      items,
      subtotal,
      taxAmount,
      totalAmount,
      notes,
      terms
    };

    // Create the invoice
    const invoice = await InvoicingService.createInvoice(invoiceData);

    res.status(201).json({
      success: true,
      invoice,
      message: 'Invoice created successfully'
    });
    return;
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to create invoice' 
    });
    return;
  }
});

/**
 * Get all invoices for an account
 */
router.get('/account/:accountId', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const { accountId } = req.params;
    const { status } = req.query;

    const invoices = await InvoicingService.getAccountInvoices(accountId, status as string);

    res.json({
      success: true,
      invoices,
      count: invoices.length
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch invoices' 
    });
  }
});

/**
 * Get a specific invoice by ID
 */
router.get('/:invoiceId', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await InvoicingService.getInvoice(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({
      success: true,
      invoice
    });
    return;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch invoice' 
    });
    return;
  }
});

/**
 * Generate invoice HTML/PDF
 */
router.get('/:invoiceId/html', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const html = await InvoicingService.generateInvoiceHTML(invoiceId);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating invoice HTML:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate invoice' 
    });
  }
});

/**
 * Send invoice via email
 */
router.post('/:invoiceId/send', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { recipientEmail } = req.body;

    const success = await InvoicingService.sendInvoiceEmail(invoiceId, recipientEmail);

    if (success) {
      res.json({
        success: true,
        message: 'Invoice sent successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to send invoice' });
    }
  } catch (error) {
    console.error('Error sending invoice:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to send invoice' 
    });
  }
});

/**
 * Mark invoice as paid
 */
router.put('/:invoiceId/mark-paid', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paymentMethodId } = req.body;

    const success = await InvoicingService.markInvoiceAsPaid(invoiceId, paymentMethodId);

    if (success) {
      res.json({
        success: true,
        message: 'Invoice marked as paid'
      });
    } else {
      res.status(500).json({ error: 'Failed to mark invoice as paid' });
    }
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to mark invoice as paid' 
    });
  }
});

/**
 * Generate monthly invoice for subscription
 */
router.post('/generate-monthly', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { month, year } = req.body;

    // Get user's account and subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        account: {
          include: {
            companySettings: true,
            billingSettings: true
          }
        },
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { plan: true }
        },
        ownedProperties: true
      }
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const subscription = user.subscriptions[0];
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Calculate billing amount
    const propertyCount = user.ownedProperties.length;
    const baseAmount = Number(subscription.plan.basePrice) * propertyCount;
    
    // Apply tax if configured
    const billingSettings = user.account.billingSettings;
    const taxRate = Number(billingSettings?.taxRate || 0);
    const taxAmount = baseAmount * (taxRate / 100);
    const totalAmount = baseAmount + taxAmount;

    // Create invoice items
    const items = [
      {
        description: `${subscription.plan.name} - ${propertyCount} properties`,
        quantity: propertyCount,
        unitPrice: Number(subscription.plan.basePrice),
        amount: baseAmount,
        type: 'subscription' as const
      }
    ];

    // Generate invoice number
    const invoiceNumber = await InvoicingService.generateInvoiceNumber(user.account.id);

    // Set due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice data
    const invoiceData = {
      invoiceNumber,
      issueDate: new Date(),
      dueDate,
      accountId: user.account.id,
      items,
      subtotal: baseAmount,
      taxAmount,
      totalAmount,
      notes: `Monthly subscription invoice for ${month} ${year}`,
      terms: 'Net 30 days'
    };

    // Create the invoice
    const invoice = await InvoicingService.createInvoice(invoiceData);

    // Send invoice email if auto-send is enabled
    if (billingSettings?.autoGenerateInvoices) {
      await InvoicingService.sendInvoiceEmail(invoice.id);
    }

    res.status(201).json({
      success: true,
      invoice,
      message: 'Monthly invoice generated successfully'
    });
    return;
  } catch (error) {
    console.error('Error generating monthly invoice:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate monthly invoice' 
    });
    return;
  }
});

/**
 * Get invoice statistics
 */
router.get('/stats/:accountId', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const { accountId } = req.params;

    const invoices = await prisma.billingRecord.findMany({
      where: { accountId },
      select: {
        status: true,
        amount: true,
        createdAt: true,
        paidDate: true,
        dueDate: true
      }
    });

    const stats = {
      total: invoices.length,
      pending: invoices.filter(i => i.status === 'PENDING').length,
      paid: invoices.filter(i => i.status === 'PAID').length,
      overdue: invoices.filter(i => i.status === 'PENDING' && i.dueDate < new Date()).length,
      totalAmount: invoices.reduce((sum, i) => sum + Number(i.amount), 0),
      paidAmount: invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + Number(i.amount), 0),
      pendingAmount: invoices.filter(i => i.status === 'PENDING').reduce((sum, i) => sum + Number(i.amount), 0)
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch invoice statistics' 
    });
  }
});

export default router; 