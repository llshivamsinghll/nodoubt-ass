#!/usr/bin/env node
/**
 * Test script to verify backend connectivity
 * Run: node test-backend.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000';

console.log('[TEST] Testing Posts Backend Connection...\n');

// Test HTTP endpoint
function testHTTP() {
  return new Promise((resolve) => {
    console.log('[HTTP] Testing HTTP endpoint:', BASE_URL + '/api/health');
    
    const request = http.get(BASE_URL + '/api/health', (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('[✓] HTTP endpoint working');
          console.log('   Response:', data);
        } else {
          console.log('[✗] HTTP endpoint error:', res.statusCode);
        }
        resolve();
      });
    });
    
    request.on('error', (error) => {
      console.log('[✗] HTTP connection failed:', error.message);
      console.log('   Make sure backend is running: yarn dev');
      resolve();
    });
    
    request.setTimeout(5000, () => {
      console.log('[✗] HTTP request timeout');
      request.destroy();
      resolve();
    });
  });
}

// Test WebSocket endpoint
function testWebSocket() {
  return new Promise((resolve) => {
    console.log('\n[WS] Testing WebSocket endpoint:', WS_URL);
    
    try {
      const WebSocket = require('ws');
      const ws = new WebSocket(WS_URL);
      
      const timeout = setTimeout(() => {
        console.log('[✗] WebSocket handshake timeout');
        ws.close();
        resolve();
      }, 5000);
      
      ws.on('open', () => {
        clearTimeout(timeout);
        console.log('[✓] WebSocket connection established');
        
        // Send test message
        ws.send(JSON.stringify({
          type: 'search',
          query: 'test'
        }));
        
        ws.close();
        resolve();
      });
      
      ws.on('message', (data) => {
        console.log('   Server response:', JSON.parse(data));
      });
      
      ws.on('error', (error) => {
        clearTimeout(timeout);
        console.log('[✗] WebSocket error:', error.message);
        resolve();
      });
      
      ws.on('close', () => {
        resolve();
      });
    } catch (error) {
      console.log('[✗] WebSocket test failed:', error.message);
      console.log('   ws library needed: npm install ws');
      resolve();
    }
  });
}

async function runTests() {
  console.log('Backend URL:', BASE_URL);
  console.log('WebSocket URL:', WS_URL);
  console.log('---\n');
  
  await testHTTP();
  await testWebSocket();
  
  console.log('\n[✓] Test complete!');
}

runTests();
