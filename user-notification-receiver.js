/**
 * User Notification Receiver Test Client
 * 
 * Client để test nhận notification được gửi từ admin qua SSE
 * 
 * Sử dụng:
 * node test/sse/user-notification-receiver.js <USER_TOKEN>
 * 
 * Ví dụ:
 * node test/sse/user-notification-receiver.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

const http = require('http');
const https = require('https');

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  host: 'localhost',
  port: 3000,
  protocol: 'http',
  sseEndpoint: '/sse/stream',
  ackEndpoint: '/sse/stream/ack',
  reconnectDelay: 3000,
  maxReconnectAttempts: 5
};

// ============================================================================
// STATE TRACKING
// ============================================================================
const state = {
  token: null,
  userId: null,
  connectionId: null,
  isConnected: false,
  reconnectAttempts: 0,
  
  // Statistics
  stats: {
    connectedAt: null,
    totalNotifications: 0,
    notificationsByType: {},
    lastNotificationAt: null,
    heartbeatsReceived: 0,
    errors: 0,
    reconnections: 0
  },
  
  // Received notifications
  notifications: []
};

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================
function main() {
  // Parse token from command line
  state.token = process.argv[2];

  if (!state.token) {
    console.error('❌ Error: JWT token is required');
    console.error('Usage: node user-notification-receiver.js <USER_TOKEN>');
    process.exit(1);
  }

  // Extract user info from token (optional - for display)
  try {
    const payload = JSON.parse(Buffer.from(state.token.split('.')[1], 'base64').toString());
    state.userId = payload.sub;
  } catch (err) {
    // Ignore parse errors
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔔 User Notification Receiver Test Client');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Server: ${CONFIG.protocol}://${CONFIG.host}:${CONFIG.port}`);
  console.log(`👤 User ID: ${state.userId || 'Unknown'}`);
  console.log(`🔑 Token: ${state.token.substring(0, 30)}...`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Connect to SSE stream
  connectSSE();

  // Setup graceful shutdown
  setupShutdownHandlers();
}

// ============================================================================
// SSE CONNECTION
// ============================================================================
function connectSSE() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n[${timestamp}] 📡 Connecting to SSE stream...`);

  const requestModule = CONFIG.protocol === 'https' ? https : http;

  const options = {
    hostname: CONFIG.host,
    port: CONFIG.port,
    path: CONFIG.sseEndpoint,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${state.token}`,
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  };

  const req = requestModule.request(options, (res) => {
    const connTime = new Date().toLocaleTimeString();

    if (res.statusCode !== 200) {
      console.error(`\n[${connTime}] ❌ Connection failed: HTTP ${res.statusCode}`);
      console.error('Response headers:', res.headers);
      
      let errorBody = '';
      res.on('data', chunk => errorBody += chunk.toString());
      res.on('end', () => {
        console.error('Response body:', errorBody);
        handleReconnect();
      });
      return;
    }

    console.log(`[${connTime}] ✅ Connected successfully`);
    state.isConnected = true;
    state.reconnectAttempts = 0;
    state.stats.connectedAt = new Date();

    // Process SSE stream
    let buffer = '';
    let currentEvent = { type: 'message', data: '' };

    res.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      
      // Keep last incomplete line in buffer
      buffer = lines.pop() || '';

      // Process complete lines
      for (const line of lines) {
        if (line.startsWith('event:')) {
          currentEvent.type = line.substring(6).trim();
        } else if (line.startsWith('data:')) {
          currentEvent.data += line.substring(5).trim();
        } else if (line.startsWith(':')) {
          // Comment line - ignore
          continue;
        } else if (line === '') {
          // Empty line marks end of event
          if (currentEvent.data) {
            try {
              const parsedData = JSON.parse(currentEvent.data);
              handleSSEEvent(currentEvent.type, parsedData);
            } catch (err) {
              console.error(`⚠️  Failed to parse SSE event:`, err.message);
              console.error(`    Type: ${currentEvent.type}`);
              console.error(`    Data: ${currentEvent.data.substring(0, 100)}...`);
              state.stats.errors++;
            }
          }
          // Reset for next event
          currentEvent = { type: 'message', data: '' };
        }
      }
    });

    res.on('end', () => {
      const endTime = new Date().toLocaleTimeString();
      console.log(`\n[${endTime}] ⚠️  Connection closed by server`);
      state.isConnected = false;
      handleReconnect();
    });

    res.on('error', (err) => {
      const errTime = new Date().toLocaleTimeString();
      console.error(`\n[${errTime}] ❌ Stream error:`, err.message);
      state.isConnected = false;
      state.stats.errors++;
      handleReconnect();
    });
  });

  req.on('error', (err) => {
    const errTime = new Date().toLocaleTimeString();
    console.error(`\n[${errTime}] ❌ Request error:`, err.message);
    state.stats.errors++;
    handleReconnect();
  });

  req.end();
}

// ============================================================================
// SSE EVENT HANDLERS
// ============================================================================
function handleSSEEvent(eventType, data) {
  const timestamp = new Date().toLocaleTimeString();

  switch (eventType) {
    case 'connected':
      state.connectionId = data.connectionId;
      console.log(`\n[${timestamp}] 🎉 SSE Connected`);
      console.log(`   Connection ID: ${data.connectionId}`);
      console.log(`   Timestamp: ${data.timestamp}`);
      console.log(`\n✨ Waiting for notifications from admin...\n`);
      break;

    case 'heartbeat':
      state.stats.heartbeatsReceived++;
      process.stdout.write(`💚`);
      break;

    case 'notification':
      handleNotification(data, timestamp);
      break;

    case 'message':
      console.log(`\n[${timestamp}] 💬 Message:`, data);
      break;

    case 'error':
      console.error(`\n[${timestamp}] ⚠️  Error event:`, data.message);
      state.stats.errors++;
      break;

    default:
      console.log(`\n[${timestamp}] ❓ Unknown event: ${eventType}`, data);
  }
}

function handleNotification(notification, timestamp) {
  state.stats.totalNotifications++;
  state.stats.lastNotificationAt = new Date();
  
  // Track by type
  const type = notification.type || 'unknown';
  state.stats.notificationsByType[type] = (state.stats.notificationsByType[type] || 0) + 1;
  
  // Store notification
  state.notifications.push({
    ...notification,
    receivedAt: new Date()
  });

  // Display notification
  console.log(`\n${'━'.repeat(70)}`);
  console.log(`[${timestamp}] 📬 NEW NOTIFICATION RECEIVED`);
  console.log(`${'━'.repeat(70)}`);
  console.log(`📌 ID: ${notification.id}`);
  console.log(`📝 Title: ${notification.title}`);
  console.log(`📄 Content: ${notification.content}`);
  console.log(`🏷️  Type: ${notification.type}`);
  if (notification.linkUrl) {
    console.log(`🔗 Link: ${notification.linkUrl}`);
  }
  console.log(`⏰ Created: ${notification.createdAt}`);
  console.log(`${'━'.repeat(70)}`);

  // Play sound alert (macOS)
  try {
    require('child_process').exec('afplay /System/Library/Sounds/Glass.aiff');
  } catch (err) {
    // Ignore sound errors
  }

  // Auto-acknowledge notification
  acknowledgeNotification(notification.id, timestamp);
}

// ============================================================================
// NOTIFICATION ACKNOWLEDGMENT
// ============================================================================
function acknowledgeNotification(notificationId, receivedTime) {
  const requestModule = CONFIG.protocol === 'https' ? https : http;

  const options = {
    hostname: CONFIG.host,
    port: CONFIG.port,
    path: CONFIG.ackEndpoint,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${state.token}`,
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ notificationId });

  const req = requestModule.request(options, (res) => {
    const ackTime = new Date().toLocaleTimeString();
    
    if (res.statusCode === 204 || res.statusCode === 200) {
      console.log(`[${ackTime}] ✅ Notification acknowledged (ID: ${notificationId})`);
    } else {
      console.log(`[${ackTime}] ⚠️  ACK failed: HTTP ${res.statusCode}`);
    }
  });

  req.on('error', (err) => {
    console.error(`❌ ACK request error:`, err.message);
  });

  req.write(body);
  req.end();
}

// ============================================================================
// RECONNECTION LOGIC
// ============================================================================
function handleReconnect() {
  if (state.reconnectAttempts >= CONFIG.maxReconnectAttempts) {
    console.error(`\n❌ Max reconnection attempts (${CONFIG.maxReconnectAttempts}) reached`);
    console.log('\n🛑 Shutting down...');
    printStatistics();
    process.exit(1);
  }

  state.reconnectAttempts++;
  state.stats.reconnections++;

  const delay = CONFIG.reconnectDelay * Math.pow(2, state.reconnectAttempts - 1);
  const timestamp = new Date().toLocaleTimeString();

  console.log(`\n[${timestamp}] 🔄 Reconnecting in ${delay}ms... (Attempt ${state.reconnectAttempts}/${CONFIG.maxReconnectAttempts})`);

  setTimeout(() => {
    connectSSE();
  }, delay);
}

// ============================================================================
// STATISTICS & REPORTING
// ============================================================================
function printStatistics() {
  console.log('\n\n' + '═'.repeat(70));
  console.log('📊 SESSION STATISTICS');
  console.log('═'.repeat(70));
  
  console.log('\n📡 Connection:');
  console.log(`   Status: ${state.isConnected ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`   Connection ID: ${state.connectionId || 'N/A'}`);
  console.log(`   Connected At: ${state.stats.connectedAt ? state.stats.connectedAt.toLocaleString() : 'N/A'}`);
  if (state.stats.connectedAt) {
    const uptime = Date.now() - state.stats.connectedAt.getTime();
    console.log(`   Uptime: ${formatDuration(uptime)}`);
  }
  console.log(`   Reconnections: ${state.stats.reconnections}`);
  console.log(`   Heartbeats: ${state.stats.heartbeatsReceived}`);
  console.log(`   Errors: ${state.stats.errors}`);

  console.log('\n📬 Notifications:');
  console.log(`   Total Received: ${state.stats.totalNotifications}`);
  console.log(`   Last Received: ${state.stats.lastNotificationAt ? state.stats.lastNotificationAt.toLocaleString() : 'N/A'}`);
  
  if (Object.keys(state.stats.notificationsByType).length > 0) {
    console.log(`   By Type:`);
    Object.entries(state.stats.notificationsByType).forEach(([type, count]) => {
      console.log(`      ${type}: ${count}`);
    });
  }

  if (state.notifications.length > 0) {
    console.log('\n📋 Recent Notifications:');
    state.notifications.slice(-5).forEach((notif, idx) => {
      console.log(`   ${idx + 1}. [${notif.type}] ${notif.title} (ID: ${notif.id})`);
      console.log(`      Received: ${notif.receivedAt.toLocaleString()}`);
    });
  }

  console.log('\n' + '═'.repeat(70) + '\n');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

function setupShutdownHandlers() {
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Received shutdown signal...');
    printStatistics();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n🛑 Received termination signal...');
    printStatistics();
    process.exit(0);
  });
}

// ============================================================================
// START APPLICATION
// ============================================================================
main();
