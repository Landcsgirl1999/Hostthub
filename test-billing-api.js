const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hostit-super-secret-jwt-key-2024';

async function testBillingAPI() {
  try {
    // Create a test token for the super admin
    const token = jwt.sign(
      { 
        userId: 'cmcsfnwpp0002h1b1lipukfqv', 
        email: 'Sierra.reynolds@Hostit.com', 
        role: 'SUPER_ADMIN' 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Testing billing API with token...');

    // Test the frontend billing API route
    const response = await fetch('http://localhost:3005/api/v1/billing/current', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Billing API Response Status:', response.status);
    console.log('Billing API Response OK:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('Billing API Response Data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Billing API Error Response:', errorText);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testBillingAPI(); 