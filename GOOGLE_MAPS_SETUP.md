# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the smart address integration in HostIt.com.

## Prerequisites

1. A Google Cloud Platform account
2. A billing account set up (Google Maps API requires billing to be enabled)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Places API** - For address autocomplete functionality
   - **Maps JavaScript API** - For map functionality (if needed later)
   - **Geocoding API** - For address validation and geocoding

## Step 3: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 4: Restrict API Key (Recommended)

1. Click on the API key you just created
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s):
   - `localhost:3000/*` (for development)
   - `yourdomain.com/*` (for production)
4. Under "API restrictions", select "Restrict key"
5. Select the APIs you enabled in Step 2
6. Click "Save"

## Step 5: Configure Environment Variables

1. In your project root, create or update `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. For production, add the environment variable to your hosting platform:
   - **Vercel**: Add in Project Settings > Environment Variables
   - **Netlify**: Add in Site Settings > Environment Variables
   - **Other platforms**: Follow their specific instructions

## Step 6: Test the Integration

1. Start your development server
2. Go to the User Management or Property Management page
3. Try editing a user or creating a property
4. In the address field, start typing an address
5. You should see address suggestions appear

## Troubleshooting

### No address suggestions appearing
- Check that the API key is correctly set in your environment variables
- Verify that the Places API is enabled
- Check the browser console for any error messages
- Ensure billing is enabled on your Google Cloud project

### API key restrictions too strict
- Temporarily remove restrictions for testing
- Add your exact domain and port for development
- Remember to re-enable restrictions for production

### Billing issues
- Google Maps API has a generous free tier
- Check your billing dashboard for usage
- Set up billing alerts if needed

## Cost Considerations

- **Places API**: $17 per 1000 requests after free tier
- **Maps JavaScript API**: $7 per 1000 requests after free tier
- **Geocoding API**: $5 per 1000 requests after free tier

The free tier includes:
- Places API: 28,500 requests per month
- Maps JavaScript API: 28,500 requests per month
- Geocoding API: 40,000 requests per month

## Security Best Practices

1. **Always restrict your API key** to specific domains
2. **Use environment variables** instead of hardcoding the key
3. **Monitor usage** in Google Cloud Console
4. **Set up billing alerts** to avoid unexpected charges
5. **Rotate keys periodically** for enhanced security

## Support

If you encounter issues:
1. Check the [Google Maps API documentation](https://developers.google.com/maps/documentation)
2. Review the [Places API documentation](https://developers.google.com/maps/documentation/places/web-service)
3. Check the browser console for error messages
4. Verify your API key and restrictions are correct 