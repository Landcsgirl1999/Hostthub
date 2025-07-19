# Google Calendar Integration Setup

This guide will help you set up Google Calendar integration for automatic consultation scheduling.

## Step 1: Enable Google Calendar API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

## Step 2: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to Google Calendar API for security

## Step 3: Configure Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following variables:

```env
# Google Calendar Integration
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CALENDAR_ID=your_email@gmail.com

# API URL for the application
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Step 4: Calendar Permissions

Make sure your Google Calendar is set up to allow events to be created:
1. Go to your Google Calendar settings
2. Under "Access permissions for events", make sure "Make available to public" is enabled (if you want public access)
3. Or use a service account for more secure access

## Step 5: Test the Integration

1. Start your development server
2. Go to the consultation page
3. Fill out the form and select a time slot
4. Submit the form
5. Check your Google Calendar to see if the event was created

## Features Included

- **Automatic Calendar Events**: Creates events in your Google Calendar
- **Google Meet Integration**: Automatically adds video call links for video consultations
- **Email Notifications**: Sends calendar invitations to both you and the client
- **Reminders**: Sets up 24-hour email and 15-minute popup reminders
- **Time Zone Support**: Handles time zones properly
- **Analytics Tracking**: Tracks consultation bookings for insights

## Customization Options

You can customize the following in the API route (`apps/web/src/app/api/consultation/schedule/route.ts`):

- **Event Duration**: Change from 30 minutes to any duration
- **Available Time Slots**: Modify the `generateAvailableSlots()` function
- **Time Zone**: Update the timezone in the event creation
- **Email Addresses**: Change the sales email address
- **Event Description**: Customize the event description format

## Troubleshooting

### Common Issues:

1. **API Key Not Working**: Make sure the Google Calendar API is enabled
2. **Calendar Not Found**: Verify your calendar ID is correct
3. **Permission Denied**: Check calendar sharing settings
4. **Time Zone Issues**: Verify the timezone setting in the code

### Debug Mode:

The API logs all events to the console. Check your server logs for detailed information about what's happening during the scheduling process.

## Security Notes

- Keep your API key secure and never commit it to version control
- Consider using a service account for production environments
- Restrict API key permissions to only what's needed
- Regularly rotate your API keys

## Production Deployment

For production, make sure to:
1. Use environment variables for all sensitive data
2. Set up proper error handling and logging
3. Consider using a service account instead of API key
4. Implement rate limiting to prevent abuse
5. Add proper validation for all inputs 

To achieve this, here’s what you need to do:

1. **Add a CONSULTATION type to your TaskType enum in your Prisma schema:**

```prisma
enum TaskType {
  CLEANING
  MAINTENANCE
  INSPECTION
  RESTOCKING
  REPAIR
  CONSULTATION // <-- Add this line
  OTHER
}
```
After editing, run `npx prisma migrate dev` to update your database.

2. **Update your consultation scheduling API (`apps/web/src/app/api/consultation/schedule/route.ts`) to also create a Task for the super admin:**

After the Google Calendar integration and before returning the response, add code to create a task. You’ll need to use your backend API for task creation. Here’s a simplified example (assuming you have an endpoint for creating tasks):

```ts
<code_block_to_apply_changes_from>
```

3. **Update your admin task calendar UI to show CONSULTATION tasks:**
If your UI already shows all task types, you’re done. If it filters by type, make sure CONSULTATION is included.

---

**Summary:**  
- Add `CONSULTATION` to your `TaskType` enum.
- Update the consultation scheduling API to create a task of type `CONSULTATION` for the super admin.
- Ensure your admin task calendar displays these tasks.

Would you like the exact code for the API update, or do you want to handle the schema migration first? 