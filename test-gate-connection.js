#!/usr/bin/env node

// Simple test script to verify gate controller connectivity
const GATE_CONTROLLER_URL = process.env.GATE_CONTROLLER_URL || 'http://gate-controller:3001';
const GATE_ID = '686eb0ee9984cab163af5d5b';

async function testGateConnection() {
  console.log('Testing gate controller connection...');
  console.log(`Gate controller URL: ${GATE_CONTROLLER_URL}`);
  
  try {
    // Test gate status endpoint
    console.log('\n1. Testing gate status endpoint...');
    const statusResponse = await fetch(`${GATE_CONTROLLER_URL}/gate/${GATE_ID}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });
    
    if (!statusResponse.ok) {
      throw new Error(`Status request failed: ${statusResponse.status} ${statusResponse.statusText}`);
    }
    
    const statusData = await statusResponse.json();
    console.log('✓ Gate status endpoint working');
    console.log('Status response:', JSON.stringify(statusData, null, 2));
    
    // Test gate toggle endpoint
    console.log('\n2. Testing gate toggle endpoint...');
    const toggleResponse = await fetch(`${GATE_CONTROLLER_URL}/gate/${GATE_ID}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });
    
    if (!toggleResponse.ok) {
      throw new Error(`Toggle request failed: ${toggleResponse.status} ${toggleResponse.statusText}`);
    }
    
    const toggleData = await toggleResponse.json();
    console.log('✓ Gate toggle endpoint working');
    console.log('Toggle response:', JSON.stringify(toggleData, null, 2));
    
    console.log('\n✅ All tests passed! Gate controller is communicating properly.');
    
  } catch (error) {
    console.error('\n❌ Gate controller test failed:');
    console.error('Error:', error.message);
    
    if (error.name === 'AbortError') {
      console.error('Connection timed out after 5 seconds');
    } else if (error.cause?.code === 'ECONNREFUSED' || 
               error.message.includes('fetch failed') || 
               error.message.includes('ECONNREFUSED')) {
      console.error('Connection refused - gate controller may not be running or accessible');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('DNS resolution failed - check service name and network configuration');
    }
    
    process.exit(1);
  }
}

testGateConnection();
