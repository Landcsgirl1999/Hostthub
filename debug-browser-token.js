// Copy and paste this into your browser console when you're on the admin users page

console.log('=== Debugging Token Issue ===');

// Check if token exists
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token length:', token ? token.length : 0);

if (token) {
  // Decode the token (without verification)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token role:', payload.role);
    console.log('Token user ID:', payload.userId);
    console.log('Token email:', payload.email);
  } catch (error) {
    console.log('Error decoding token:', error);
  }
}

// Test the API call
async function testAPI() {
  try {
    const response = await fetch('/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response Data:', data);
      console.log('Users count:', data.data ? data.data.length : 0);
    } else {
      const errorText = await response.text();
      console.log('API Error Response:', errorText);
    }
  } catch (error) {
    console.log('API Call Error:', error);
  }
}

// Run the test
testAPI();

console.log('=== End Debug ==='); 