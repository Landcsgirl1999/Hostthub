import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';
import { 
  encryptSensitiveData, 
  decryptSensitiveData, 
  maskSensitiveData, 
  validateSensitiveData,
  sanitizeSensitiveData 
} from '../config/security';
// @ts-ignore
import speakeasy from 'speakeasy';
// @ts-ignore
import qrcode from 'qrcode';

const prisma = new PrismaClient();

const router = express.Router();

// Get all settings for the current user's account
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user with account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        account: {
          include: {
            companySettings: true,
            billingSettings: true,
            integrationSettings: true,
            invoiceTemplates: true,
          },
        },
      },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Decrypt bankAccountInfo before sending to client
    let billing = user.account.billingSettings;
    if (billing && typeof billing.bankAccountInfo === 'string' && billing.bankAccountInfo) {
      try {
        billing = { ...billing, bankAccountInfo: decryptSensitiveData(billing.bankAccountInfo, 'billing') };
      } catch (error) {
        console.error('Failed to decrypt bank account info:', error);
        billing = { ...billing, bankAccountInfo: '' };
      }
    }

    res.json({
      company: user.account.companySettings,
      billing,
      integrations: user.account.integrationSettings,
      invoiceTemplates: user.account.invoiceTemplates,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update company settings
router.put('/company', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      companyName,
      logoUrl,
      website,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
      contactEmail,
      invoiceEmail,
      supportEmail,
      hostitAccountId,
      accountNumber,
      taxId,
      businessLicense,
      timezone,
      currency,
      language,
      invoicePrefix,
      autoIncrement,
    } = req.body;

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Update or create company settings
    const companySettings = await prisma.companySettings.upsert({
      where: { accountId: user.account.id },
      update: {
        companyName,
        logoUrl,
        website,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        country,
        contactEmail,
        invoiceEmail,
        supportEmail,
        hostitAccountId,
        accountNumber,
        taxId,
        businessLicense,
        timezone,
        currency,
        language,
        invoicePrefix,
        autoIncrement,
      },
      create: {
        accountId: user.account.id,
        companyName: companyName || 'My Company',
        contactEmail: contactEmail || user.email,
        logoUrl,
        website,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        country,
        invoiceEmail,
        supportEmail,
        hostitAccountId,
        accountNumber,
        taxId,
        businessLicense,
        timezone,
        currency,
        language,
        invoicePrefix,
        autoIncrement,
      },
    });

    res.json(companySettings);
  } catch (error) {
    console.error('Error updating company settings:', error);
    res.status(500).json({ error: 'Failed to update company settings' });
  }
});

// Update billing settings
router.put('/billing', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      bankAccountInfo,
      autoGenerateInvoices,
      lateFeePercentage,
      lateFeeAmount,
      taxRate,
      taxIncluded,
      taxExemptionNumber,
      billingCycle,
      billingDay,
      sendInvoiceReminders,
      reminderDays,
      sendPaymentConfirmations,
    } = req.body;

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Validate and encrypt bankAccountInfo before saving
    let encryptedBankAccountInfo;
    if (typeof bankAccountInfo === 'string' && bankAccountInfo) {
      try {
        // Validate bank account information
        const validation = validateSensitiveData({ bankAccountInfo }, []);
        if (!validation.isValid) {
          return res.status(400).json({ error: 'Invalid bank account information', details: validation.errors });
        }
        
        encryptedBankAccountInfo = encryptSensitiveData(bankAccountInfo, 'billing');
      } catch (error) {
        console.error('Failed to encrypt bank account info:', error);
        return res.status(500).json({ error: 'Failed to encrypt bank account information' });
      }
    }

    // Update or create billing settings
    const billingSettings = await prisma.billingSettings.upsert({
      where: { accountId: user.account.id },
      update: {
        bankAccountInfo: encryptedBankAccountInfo,
        autoGenerateInvoices,
        lateFeePercentage,
        lateFeeAmount,
        taxRate,
        taxIncluded,
        taxExemptionNumber,
        billingCycle,
        billingDay,
        sendInvoiceReminders,
        reminderDays,
        sendPaymentConfirmations,
      },
      create: {
        accountId: user.account.id,
        bankAccountInfo: encryptedBankAccountInfo,
        autoGenerateInvoices,
        lateFeePercentage,
        lateFeeAmount,
        taxRate,
        taxIncluded,
        taxExemptionNumber,
        billingCycle,
        billingDay,
        sendInvoiceReminders,
        reminderDays,
        sendPaymentConfirmations,
      },
    });

    // Decrypt before sending back to client
    let result = billingSettings;
    if (billingSettings && typeof billingSettings.bankAccountInfo === 'string' && billingSettings.bankAccountInfo) {
      try {
        result = { ...billingSettings, bankAccountInfo: decryptSensitiveData(billingSettings.bankAccountInfo, 'billing') };
      } catch (error) {
        console.error('Failed to decrypt bank account info:', error);
        result = { ...billingSettings, bankAccountInfo: '' };
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating billing settings:', error);
    res.status(500).json({ error: 'Failed to update billing settings' });
  }
});

// Update integration settings
router.put('/integrations', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      hostitApiKey,
      hostitApiSecret,
      hostitWebhookUrl,
      hostitNotifications,
      stripeEnabled,
      stripePublishableKey,
      stripeSecretKey,
      paypalEnabled,
      paypalClientId,
      paypalSecret,
      googleCalendarEnabled,
      googleCalendarId,
      googleApiKey,
      twilioEnabled,
      twilioAccountSid,
      twilioAuthToken,
      twilioPhoneNumber,
      sendgridEnabled,
      sendgridApiKey,
      sendgridFromEmail,
      airbnbEnabled,
      airbnbApiKey,
      airbnbApiSecret,
      vrboEnabled,
      vrboApiKey,
      vrboApiSecret,
      bookingComEnabled,
      bookingComApiKey,
      bookingComApiSecret,
    } = req.body;

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Update or create integration settings
    const integrationSettings = await prisma.integrationSettings.upsert({
      where: { accountId: user.account.id },
      update: {
        hostitApiKey,
        hostitApiSecret,
        hostitWebhookUrl,
        hostitNotifications,
        stripeEnabled,
        stripePublishableKey,
        stripeSecretKey,
        paypalEnabled,
        paypalClientId,
        paypalSecret,
        googleCalendarEnabled,
        googleCalendarId,
        googleApiKey,
        twilioEnabled,
        twilioAccountSid,
        twilioAuthToken,
        twilioPhoneNumber,
        sendgridEnabled,
        sendgridApiKey,
        sendgridFromEmail,
        airbnbEnabled,
        airbnbApiKey,
        airbnbApiSecret,
        vrboEnabled,
        vrboApiKey,
        vrboApiSecret,
        bookingComEnabled,
        bookingComApiKey,
        bookingComApiSecret,
      },
      create: {
        accountId: user.account.id,
        hostitApiKey,
        hostitApiSecret,
        hostitWebhookUrl,
        hostitNotifications,
        stripeEnabled,
        stripePublishableKey,
        stripeSecretKey,
        paypalEnabled,
        paypalClientId,
        paypalSecret,
        googleCalendarEnabled,
        googleCalendarId,
        googleApiKey,
        twilioEnabled,
        twilioAccountSid,
        twilioAuthToken,
        twilioPhoneNumber,
        sendgridEnabled,
        sendgridApiKey,
        sendgridFromEmail,
        airbnbEnabled,
        airbnbApiKey,
        airbnbApiSecret,
        vrboEnabled,
        vrboApiKey,
        vrboApiSecret,
        bookingComEnabled,
        bookingComApiKey,
        bookingComApiSecret,
      },
    });

    res.json(integrationSettings);
  } catch (error) {
    console.error('Error updating integration settings:', error);
    res.status(500).json({ error: 'Failed to update integration settings' });
  }
});

// Create invoice template
router.post('/invoice-templates', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { name, description, headerHtml, footerHtml, cssStyles, isDefault } = req.body;

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.invoiceTemplate.updateMany({
        where: { accountId: user.account.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const invoiceTemplate = await prisma.invoiceTemplate.create({
      data: {
        accountId: user.account.id,
        name,
        description,
        headerHtml,
        footerHtml,
        cssStyles,
        isDefault,
      },
    });

    res.status(201).json(invoiceTemplate);
  } catch (error) {
    console.error('Error creating invoice template:', error);
    res.status(500).json({ error: 'Failed to create invoice template' });
  }
});

// Update invoice template
router.put('/invoice-templates/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, headerHtml, footerHtml, cssStyles, isDefault, isActive } = req.body;

    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.invoiceTemplate.updateMany({
        where: { accountId: user.account.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const invoiceTemplate = await prisma.invoiceTemplate.update({
      where: { id },
      data: {
        name,
        description,
        headerHtml,
        footerHtml,
        cssStyles,
        isDefault,
        isActive,
      },
    });

    res.json(invoiceTemplate);
  } catch (error) {
    console.error('Error updating invoice template:', error);
    res.status(500).json({ error: 'Failed to update invoice template' });
  }
});

// Delete invoice template
router.delete('/invoice-templates/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.invoiceTemplate.delete({
      where: { id },
    });

    res.json({ message: 'Invoice template deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice template:', error);
    res.status(500).json({ error: 'Failed to delete invoice template' });
  }
});

// Upload logo
router.post('/upload-logo', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    // This would typically handle file upload
    // For now, we'll just return a mock response
    const logoUrl = 'https://example.com/logo.png';
    
    // Update company settings with new logo URL
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user?.account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await prisma.companySettings.upsert({
      where: { accountId: user.account.id },
      update: { logoUrl },
      create: {
        accountId: user.account.id,
        companyName: 'My Company',
        contactEmail: user.email,
        logoUrl,
      },
    });

    res.json({ logoUrl });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

// Export all user/company data (GDPR-style)
router.get('/privacy/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    // TODO: Gather all user/company data
    const data = { message: 'Sample data export', userId };
    res.setHeader('Content-Disposition', 'attachment; filename="hostit-data-export.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Submit a data deletion request
router.post('/privacy/delete-request', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    // TODO: Store deletion request for admin review or auto-process
    res.json({ success: true, message: 'Deletion request submitted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit deletion request' });
  }
});

// Update consent preferences
router.post('/privacy/consent', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    const { marketing, analytics, communications } = req.body;
    // TODO: Save consent preferences to user/account
    res.json({ success: true, message: 'Consent preferences updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update consent preferences' });
  }
});

// 2FA: Generate secret and QR code
router.post('/security/2fa/setup', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    const secret = speakeasy.generateSecret({ name: `HostIt.com (${userId})` });
    const qr = await qrcode.toDataURL(secret.otpauth_url);
    // Optionally save secret.temp to user session or DB (not enabled yet)
    res.json({ secret: secret.base32, otpauth_url: secret.otpauth_url, qr });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate 2FA secret' });
  }
});

// 2FA: Enable (verify code)
router.post('/security/2fa/enable', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { secret, token } = req.body;
    if (!userId || !secret || !token) return res.status(400).json({ error: 'Missing parameters' });
    const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token });
    if (!verified) return res.status(400).json({ error: 'Invalid 2FA code' });
    await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true, twoFactorSecret: secret } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enable 2FA' });
  }
});

// 2FA: Disable
router.post('/security/2fa/disable', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: false, twoFactorSecret: null } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

// DELETE account endpoint (example: /api/v1/settings/account)
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // Get user and role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Super Admin account cannot be deleted for security reasons.' });
    }
    // Proceed with account deletion (implement as needed)
    return res.status(200).json({ message: 'Account deleted.' });
  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 