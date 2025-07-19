async function testImpersonation() {
  try {
    console.log('🔍 Testing impersonation functionality...');
    
    // First, let's test the login to get a token
    const loginResponse = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'Sierra.reynolds@Hostit.com',
        password: 'Sierra123!'
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.error('❌ Login failed:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('Token:', loginData.token.substring(0, 50) + '...');

    // Now test the impersonation endpoint
    console.log('🔍 Testing impersonation endpoint...');
    
    // Get a list of users first
    const usersResponse = await fetch('http://localhost:4000/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
      },
    });

    if (!usersResponse.ok) {
      const errorData = await usersResponse.json();
      console.error('❌ Failed to fetch users:', errorData);
      return;
    }

    const usersData = await usersResponse.json();
    console.log('✅ Users fetched successfully');
    console.log('Available users:', usersData.data?.length || 0);

    // Find a user to impersonate (not the current user)
    const users = usersData.data || [];
    const userToImpersonate = users.find(user => user.id !== loginData.user.id);
    
    if (!userToImpersonate) {
      console.log('❌ No other users found to impersonate');
      return;
    }

    console.log('🔍 Attempting to impersonate user:', userToImpersonate.email);

    const impersonateResponse = await fetch('http://localhost:4000/api/v1/auth/impersonate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userToImpersonate.id
      }),
    });

    if (!impersonateResponse.ok) {
      const errorData = await impersonateResponse.json();
      console.error('❌ Impersonation failed:', errorData);
      return;
    }

    const impersonateData = await impersonateResponse.json();
    console.log('✅ Impersonation successful!');
    console.log('Impersonated user:', impersonateData.user.email);
    console.log('New token:', impersonateData.token.substring(0, 50) + '...');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testImpersonation(); 