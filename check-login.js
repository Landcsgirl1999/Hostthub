async function checkLogin() {
  try {
    console.log('🔍 Checking login credentials...');
    
    // Test the login endpoint
    const response = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'Sierra.reynolds@Hostit.com',
        password: 'Sierra123!'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User:', data.user);
      console.log('Token:', data.token.substring(0, 50) + '...');
    } else {
      console.log('❌ Login failed:', data.error);
      
      // If login fails, let's check what users exist
      console.log('🔍 Checking available users...');
      const usersResponse = await fetch('http://localhost:4000/api/v1/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('Available users:', usersData.data?.map(u => ({ email: u.email, role: u.role, isActive: u.isActive })));
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLogin(); 