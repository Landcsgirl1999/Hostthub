#!/usr/bin/env node

const API_BASE = 'http://localhost:3003';

async function testGoogleCalendar() {
  console.log('🔍 Testing Google Calendar Integration\n');

  try {
    // Test 1: Check calendar availability for today
    console.log('1️⃣ Testing calendar availability...');
    const today = new Date().toISOString().split('T')[0];
    
    const response = await fetch(`${API_BASE}/api/calendar/check-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: today,
        endDate: today
      }),
    });

    console.log('   Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Success!');
      console.log('   Available slots:', data.availableSlots.length);
      console.log('   Sample slots:', data.availableSlots.slice(0, 3));
    } else {
      const errorData = await response.json();
      console.log('   ❌ Error:', errorData.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message 