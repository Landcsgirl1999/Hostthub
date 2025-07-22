import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: 'subscription' | 'setup' | 'overage' | 'addon';
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  accountId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  terms?: string;
}

export class InvoicingService {
  /**
   * Generate a new invoice number
   */
  static async generateInvoiceNumber(accountId: string): Promise<string> {
    const companySettings = await prisma.companySettings.findUnique({
      where: { accountId }
    });

    const prefix = companySettings?.invoicePrefix || 'INV';
    const nextNumber = (companySettings?.invoiceNumber || 0) + 1;

    // Update the invoice number
    await prisma.companySettings.update({
      where: { accountId },
      data: { invoiceNumber: nextNumber }
    });

    const year = new Date().getFullYear();
    return `${prefix}-${year}-${nextNumber.toString().padStart(4, '0')}`;
  }

  /**
   * Create a new invoice
   */
  static async createInvoice(invoiceData: InvoiceData): Promise<any> {
    try {
      // Create the invoice record
      const invoice = await prisma.billingRecord.create({
        data: {
          id: invoiceData.invoiceNumber,
          amount: invoiceData.totalAmount,
          currency: 'USD',
          status: 'PENDING',
          dueDate: invoiceData.dueDate,
          description: `Invoice ${invoiceData.invoiceNumber}`,
          metadata: {
            invoiceNumber: invoiceData.invoiceNumber,
            issueDate: invoiceData.issueDate.toISOString(),
            items: invoiceData.items,
            subtotal: invoiceData.subtotal,
            taxAmount: invoiceData.taxAmount,
            notes: invoiceData.notes,
            terms: invoiceData.terms
          } as any,
          accountId: invoiceData.accountId
        },
        include: {
          account: {
            include: {
              companySettings: true,
              users: {
                where: { role: 'ADMIN' },
                take: 1
              }
            }
          }
        }
      });

      // Create property charges for each item
      for (const item of invoiceData.items) {
        await prisma.propertyCharge.create({
          data: {
            amount: item.amount,
            chargeType: item.type.toUpperCase() as any,
            status: 'PENDING',
            description: item.description,
            metadata: {
              invoiceNumber: invoiceData.invoiceNumber,
              quantity: item.quantity,
              unitPrice: item.unitPrice
            },
            billingRecordId: invoice.id,
            propertyId: 'system' // For system-level charges
          }
        });
      }

      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Generate PDF invoice content (HTML template)
   */
  static async generateInvoiceHTML(invoiceId: string): Promise<string> {
    const invoice = await prisma.billingRecord.findUnique({
      where: { id: invoiceId },
      include: {
        account: {
          include: {
            companySettings: true,
            users: {
              where: { role: 'ADMIN' },
              take: 1
            }
          }
        }
      }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const metadata = invoice.metadata as any;
    const company = invoice.account.companySettings;
    const adminUser = invoice.account.users[0];

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${metadata.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { float: left; width: 50%; }
          .invoice-info { float: right; width: 50%; text-align: right; }
          .clear { clear: both; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f5f5f5; }
          .totals { float: right; width: 300px; }
          .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .total-row.grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
        </div>
        
        <div class="company-info">
          <h3>${company?.companyName || 'HostItHub'}</h3>
          <p>${company?.address || ''}<br>
          ${company?.city || ''}, ${company?.state || ''} ${company?.zipCode || ''}<br>
          ${company?.phoneNumber || ''}<br>
          ${company?.contactEmail || ''}</p>
        </div>
        
        <div class="invoice-info">
          <h3>Invoice #${metadata.invoiceNumber}</h3>
          <p>Issue Date: ${format(new Date(metadata.issueDate), 'MMM dd, yyyy')}<br>
          Due Date: ${format(invoice.dueDate, 'MMM dd, yyyy')}</p>
        </div>
        
        <div class="clear"></div>
        
        <div class="bill-to">
          <h3>Bill To:</h3>
          <p>${adminUser?.name || 'Account Owner'}<br>
          ${adminUser?.email || ''}<br>
          ${adminUser?.phoneNumber || ''}</p>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${metadata.items.map((item: any) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.unitPrice.toFixed(2)}</td>
                <td>$${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${metadata.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>$${metadata.taxAmount.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>$${invoice.amount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="clear"></div>
        
        ${metadata.notes ? `<div class="notes"><h3>Notes:</h3><p>${metadata.notes}</p></div>` : ''}
        ${metadata.terms ? `<div class="terms"><h3>Terms:</h3><p>${metadata.terms}</p></div>` : ''}
        
        <div class="footer" style="margin-top: 50px; text-align: center; color: #666;">
          <p>Thank you for your business!</p>
          <p>Powered by HostItHub - Complete Vacation Rental Management Platform</p>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Send invoice via email
   */
  static async sendInvoiceEmail(invoiceId: string, recipientEmail?: string): Promise<boolean> {
    try {
      const invoice = await prisma.billingRecord.findUnique({
        where: { id: invoiceId },
        include: {
          account: {
            include: {
              companySettings: true,
              users: {
                where: { role: 'ADMIN' },
                take: 1
              }
            }
          }
        }
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const metadata = invoice.metadata as any;
      const company = invoice.account.companySettings;
      const adminUser = invoice.account.users[0];
      const email = recipientEmail || adminUser?.email || '';

      if (!email) {
        throw new Error('No recipient email found');
      }

      // Generate invoice HTML
      const invoiceHTML = await this.generateInvoiceHTML(invoiceId);

      // Send email (you'll need to implement your email service)
      // For now, we'll just log the email details
      console.log('📧 Sending invoice email:', {
        to: email,
        subject: `Invoice ${metadata.invoiceNumber} from ${company?.companyName || 'HostItHub'}`,
        invoiceNumber: metadata.invoiceNumber,
        amount: invoice.amount,
        dueDate: invoice.dueDate
      });

      // TODO: Integrate with your email service (SendGrid, Resend, etc.)
      // await emailService.send({
      //   to: email,
      //   subject: `Invoice ${metadata.invoiceNumber} from ${company?.companyName || 'HostItHub'}`,
      //   html: invoiceHTML
      // });

      return true;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return false;
    }
  }

  /**
   * Mark invoice as paid
   */
  static async markInvoiceAsPaid(invoiceId: string, paymentMethodId?: string): Promise<boolean> {
    try {
      await prisma.billingRecord.update({
        where: { id: invoiceId },
        data: {
          status: 'PAID',
          paidDate: new Date(),
          paymentMethodId
        }
      });

      // Update related property charges
      await prisma.propertyCharge.updateMany({
        where: { billingRecordId: invoiceId },
        data: { status: 'PAID' }
      });

      return true;
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      return false;
    }
  }

  /**
   * Get invoice by ID
   */
  static async getInvoice(invoiceId: string) {
    return await prisma.billingRecord.findUnique({
      where: { id: invoiceId },
      include: {
        account: {
          include: {
            companySettings: true,
            users: {
              where: { role: 'ADMIN' },
              take: 1
            }
          }
        },
        propertyCharges: true
      }
    });
  }

  /**
   * Get all invoices for an account
   */
  static async getAccountInvoices(accountId: string, status?: string) {
    const where: any = { accountId };
    if (status) {
      where.status = status;
    }

    return await prisma.billingRecord.findMany({
      where,
      include: {
        propertyCharges: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
} 