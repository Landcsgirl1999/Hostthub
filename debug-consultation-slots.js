#!/usr/bin/env node

const API_BASE = 'http://localhost:3003';

async function debugConsultationSlots() {
  console.log('🔍 Debugging Consultation Time Slots\n');

  try {
    // Test 1: Check if the API endpoint exists
    console.log('1️⃣ Testing calendar availability endpoint...');
    const response = await fetch(`${API_BASE}/api/calendar/check-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: '2024-12-20',
        endDate: '2024-12-27'
      }),
    });

    console.log('   Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API response:', JSON.stringify(data, null, 2));
      
      if (data.availableSlots) {
        console.log(`   Found ${data.availableSlots.length} total slots`);
        const availableCount = data.availableSlots.filter(slot => slot.available).length;
        console.log(`   ${availableCount} slots are available`);
        
        // Show first few slots
        console.log('   First 5 slots:');
        data.availableSlots.slice(0, 5).forEach((slot, index) => {
          console.log(`     ${index + 1}. ${slot.date} ${slot.time} - ${slot.available ? 'Available' : 'Unavailable'}`);
        });
      }
    } else {
      const errorData = await response.text();
      console.log('❌ API error:', errorData);
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

debugConsultationSlots(); 