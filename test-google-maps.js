// Test script to check Google Maps API integration
console.log('🔍 Testing Google Maps API integration...');

// Check if environment variable is available
if (typeof process !== 'undefined' && process.env) {
  console.log('Environment variables available:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  console.log('API Key length:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length || 0);
} else {
  console.log('Environment variables not available in browser context');
}

// Check if Google Maps API is loaded
if (typeof window !== 'undefined') {
  console.log('Window object available');
  console.log('Google Maps API loaded:', !!window.google);
  
  if (window.google) {
    console.log('Google Maps API details:', {
      maps: !!window.google.maps,
      places: !!window.google.maps?.places,
      autocomplete: !!window.google.maps?.places?.AutocompleteService
    });
  }
} else {
  console.log('Window object not available (server-side)');
}

// Instructions for setup
console.log(`
📋 SETUP INSTRUCTIONS:

1. Get a Google Maps API key:
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable billing (required for Maps API)
   - Go to APIs & Services > Library
   - Enable "Places API"
   - Go to Credentials > Create Credentials > API Key
   - Copy the API key

2. Add the API key to your .env file:
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_api_key_here"

3. Restart your development server:
   npm run dev

4. Test the address autocomplete in the user or property forms

📖 Full setup guide: GOOGLE_MAPS_SETUP.md
`); 