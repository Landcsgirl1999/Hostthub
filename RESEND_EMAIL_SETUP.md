# Resend Email Setup Guide

## Quick Setup for Real Email Sending

### 1. Sign Up for Resend (Free)
- Go to [resend.com](https://resend.com)
- Sign up for a free account (100 emails/day free)
- Verify your email address

### 2. Get Your API Key
- After signing up, go to your dashboard
- Click on "API Keys" in the sidebar
- Create a new API key
- Copy the API key (starts with `re_`)

### 3. Add to Environment Variables
Add this to your `.env.local` file in the `apps/web` directory:

```bash
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=reynoldspromanagement@gmail.com
ADMIN_NAME=Reynolds Property Management
```

### 4. Verify Your Domain (Optional but Recommended)
- In Resend dashboard, go to "Domains"
- Add your domain (e.g., `hostit.com`)
- Follow the DNS verification steps
- This allows you to send from `noreply@hostit.com` instead of the default Resend domain

### 5. Test the System
- Restart your development server
- Go to `http://localhost:3000/consultation`
- Fill out and submit a consultation form
- Check your Gmail inbox for the notification email

## Alternative: Use Gmail SMTP (if you prefer)

If you'd rather use Gmail directly, you can use Nodemailer instead:

```bash
npm install nodemailer
```

Then update the consultation API to use Gmail SMTP instead of Resend.

## Troubleshooting

- **Emails not sending**: Check that your RESEND_API_KEY is correct
- **Domain verification**: If using a custom domain, make sure DNS records are properly configured
- **Rate limits**: Free tier allows 100 emails/day, upgrade for more

## Next Steps

Once emails are working, you can:
1. Customize email templates with HTML
2. Add email tracking
3. Set up email automation workflows
4. Add email preferences for users 