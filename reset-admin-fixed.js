const { PrismaClient } = require('@hostit/db');
const bcrypt = require('bcryptjs');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();

// Simple HTTP request function
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function resetAdmin() {
  try {
    console.log('🔍 Resetting super admin account...');
    
    // Find the super admin user
    const admin = await prisma.user.findFirst({
      where: {
        email: {
          equals: 'Sierra.reynolds@Hostit.com',
          mode: 'insensitive'
        }
      }
    });

    if (!admin) {
      console.log('❌ Super admin not found, creating new one...');
      
      // Create new super admin
      const hashedPassword = await bcrypt.hash('Tigerpie5678!', 12);
      const newAdmin = await prisma.user.create({
        data: {
          email: 'Sierra.reynolds@Hostit.com',
          name: 'Sierra Reynolds',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true,
          canCreateUsers: true
        }
      });
      
      console.log('✅ New super admin created:', newAdmin.email);
    } else {
      console.log('✅ Found existing admin:', admin.email);
      console.log('Current status:', { isActive: admin.isActive, role: admin.role });
      
      // Update password and ensure active
      const hashedPassword = await bcrypt.hash('Tigerpie5678!', 12);
      const updatedAdmin = await prisma.user.update({
        where: { id: admin.id },
        data: {
          password: hashedPassword,
          isActive: true,
          role: 'SUPER_ADMIN',
          canCreateUsers: true
        }
      });
      
      console.log('✅ Super admin updated and activated');
    }
    
    // Test login using the correct port (3003)
    console.log('🔍 Testing login on port 3003...');
    try {
      const testResponse = await makeRequest('http://localhost:3003/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'Sierra.reynolds@Hostit.com',
          password: 'Tigerpie5678!'
        })
      });
      
      if (testResponse.status === 200) {
        console.log('✅ Login test successful!');
        console.log('User:', testResponse.data.user);
      } else {
        console.log('❌ Login test failed:', testResponse.data);
      }
    } catch (error) {
      console.log('❌ Login test error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin(); 