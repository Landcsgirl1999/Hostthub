# 🗓️ Google Calendar Integration Setup Guide

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project" or select existing
4. Name: "HostIt Calendar Integration"

### 1.2 Enable Google Calendar API
1. Go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### 1.3 Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" and limit to Google Calendar API

### 1.4 Create OAuth 2.0 Client
1. In "Credentials", click "Create Credentials" > "OAuth 2.0 Client IDs"
2. Choose "Web application"
3. Name: "HostIt Calendar Integration"
4. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   http://localhost:3002/api/auth/callback/google
   http://localhost:3003/api/auth/callback/google
   http://localhost:3004/api/auth/callback/google
   http://localhost:3005/api/auth/callback/google
   ```
5. Copy the Client ID and Client Secret

## Step 2: Environment Configuration

Create a `.env.local` file in the `apps/web` directory with:

```env
# Google Calendar Integration
GOOGLE_CALENDAR_ID=primary
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CLIENT_ID=your_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_oauth_client_secret_here

# Your Information
ADMIN_EMAIL=your_email@gmail.com
ADMIN_NAME=Your Name
CONSULTATION_DURATION=30
TIMEZONE=America/New_York
```

## Step 3: Calendar Permissions

### 3.1 Make Calendar Public (for API access)
1. Go to [Google Calendar](https://calendar.google.com/)
2. Find your calendar in the left sidebar
3. Click the three dots next to it
4. Select "Settings and sharing"
5. Scroll down to "Access permissions for events"
6. Check "Make available to public"
7. Set "See all event details" to "Make available to public"

### 3.2 Get Calendar ID
1. In calendar settings, scroll to "Integrate calendar"
2. Copy the "Calendar ID" (usually your email address)

## Step 4: Test the Integration

Once you've set up the environment variables:

1. Restart your development server
2. Go to the consultation page
3. Fill out the form and select a date/time
4. Submit to test the Google Calendar integration

## Troubleshooting

### Common Issues:
- **403 Forbidden**: Check API key restrictions and Calendar API enablement
- **Calendar not found**: Verify GOOGLE_CALENDAR_ID is correct
- **Authentication failed**: Check OAuth credentials and redirect URIs

### Security Notes:
- Never commit `.env.local` to version control
- Use environment-specific API keys for production
- Restrict API keys to specific domains/IPs in production

## Next Steps

After setup, the consultation form will:
1. Allow clients to select available time slots
2. Create Google Calendar events automatically
3. Send calendar invitations to both you and the client
4. Include Google Meet links for video consultations
5. Set up automatic reminders 