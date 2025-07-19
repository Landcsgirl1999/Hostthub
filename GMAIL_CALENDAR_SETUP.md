# 📅 Gmail Calendar Integration Setup Guide

This guide will help you sync your consultation calendar with your Gmail calendar so that when someone books a consultation, it automatically creates an event in your Gmail calendar.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Google API Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Gmail account

2. **Create a New Project**
   - Click "Select a project" at the top
   - Click "New Project"
   - Name it: "Hostithub Calendar Integration"
   - Click "Create"

3. **Enable Google Calendar API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
   - Click "Restrict Key" and limit it to Google Calendar API

### Step 2: Configure Environment Variables

Create a `.env.local` file in the `apps/web` directory with:

```env
# Google Calendar Integration
GOOGLE_API_KEY=your_api_key_from_step_1
GOOGLE_CALENDAR_ID=sierra.reynolds@hostithub.com

# Admin Details
ADMIN_EMAIL=sierra.reynolds@hostithub.com
ADMIN_NAME=Sierra Reynolds

# Consultation Settings
CONSULTATION_DURATION=30
TIMEZONE=America/New_York

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here
```

### Step 3: Test the Integration

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test the consultation booking**
   - Go to: http://localhost:3000/consultation
   - Fill out the form and select a time
   - Submit the form
   - Check your Gmail calendar for the new event

## 🔧 Advanced Configuration

### Calendar Permissions

Make sure your Gmail calendar allows API access:

1. **Go to Google Calendar**
   - Visit: https://calendar.google.com/
   - Find your calendar in the left sidebar

2. **Calendar Settings**
   - Click the three dots next to your calendar
   - Select "Settings and sharing"
   - Scroll down to "Access permissions for events"
   - Check "Make available to public"
   - Set "See all event details" to "Make available to public"

### Customize Business Hours

Edit the time slots in `apps/web/src/lib/google-calendar.ts`:

```typescript
// Business hours: 9 AM to 5 PM
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];
```

### Customize Event Details

The consultation events will include:
- **Event Title**: "Hostithub Consultation - [Client Name]"
- **Description**: All consultation details
- **Duration**: 30 minutes (configurable)
- **Attendees**: Client email + your admin email
- **Reminders**: 24-hour email + 15-minute popup
- **Google Meet**: Automatically added for video consultations

## 🎯 Features Included

### ✅ Automatic Calendar Events
- Creates events in your Gmail calendar
- Includes all consultation details
- Sets proper time zones

### ✅ Smart Availability Checking
- Checks your existing calendar events
- Prevents double-bookings
- Shows only available time slots

### ✅ Google Meet Integration
- Automatically adds video call links for video consultations
- No manual setup required

### ✅ Email Notifications
- Sends calendar invitations to both you and the client
- Includes all meeting details

### ✅ Reminders
- 24-hour email reminder
- 15-minute popup reminder
- Configurable reminder settings

### ✅ Time Zone Support
- Handles time zones properly
- Configurable timezone setting

## 🔍 Troubleshooting

### Common Issues

**1. "Calendar not initialized" error**
- Check that `GOOGLE_API_KEY` is set correctly
- Verify the API key has Calendar API access

**2. "Calendar not found" error**
- Make sure `GOOGLE_CALENDAR_ID` is your Gmail address
- Check calendar sharing permissions

**3. "Permission denied" error**
- Ensure calendar is set to "Make available to public"
- Check API key restrictions

**4. Events not appearing in calendar**
- Check that `sendUpdates: 'all'` is set
- Verify attendee email addresses are correct

### Debug Mode

The system logs all calendar operations. Check your server console for:
- ✅ Success messages
- ❌ Error messages with details
- 📅 Event creation confirmations

## 🔒 Security Best Practices

### API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Restrict API keys to specific domains/IPs in production

### Calendar Permissions
- Only grant necessary permissions
- Regularly review calendar access
- Use service accounts for production environments

## 🚀 Production Deployment

For production deployment:

1. **Use Environment Variables**
   ```env
   GOOGLE_API_KEY=your_production_api_key
   GOOGLE_CALENDAR_ID=your_production_email@gmail.com
   ```

2. **Set Up Monitoring**
   - Monitor calendar API usage
   - Set up error alerts
   - Track consultation booking success rates

3. **Backup Systems**
   - Maintain backup calendar systems
   - Set up fallback booking methods
   - Document emergency procedures

## 📊 Analytics & Insights

The system tracks:
- Consultation booking success rates
- Calendar integration performance
- Popular booking times
- Client engagement metrics

## 🎉 Success!

Once configured, your consultation system will:
1. ✅ Show real-time availability from your Gmail calendar
2. ✅ Create events automatically when consultations are booked
3. ✅ Send calendar invitations to all attendees
4. ✅ Include Google Meet links for video calls
5. ✅ Set up automatic reminders
6. ✅ Prevent double-bookings

Your consultation calendar is now fully synced with Gmail! 🎯 