# WebSocket Setup Guide for Financial Gurkha Livestreaming

## Environment Variables Setup

You need to create a `.env.local` file in your project root with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# WebSocket Configuration
NEXT_PUBLIC_GURKHA_WS_URL=ws://localhost:8080

# PostHog Analytics (if using)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## WebSocket Server Options

### Option 1: Use Your Existing Backend

If you already have a backend server, add WebSocket support to it:

#### Node.js/Express with Socket.io
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.username = decoded.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Livestream namespace
const liveNamespace = io.of('/gurkha/live');

liveNamespace.on('connection', (socket) => {
  console.log(`User ${socket.username} connected to livestream`);
  
  // Join stream
  socket.on('join_stream', (data) => {
    const { streamId } = data;
    socket.join(streamId);
    
    // Notify others
    socket.to(streamId).emit('participant_joined', {
      id: socket.userId,
      username: socket.username,
      isHost: false,
      joinedAt: new Date().toISOString(),
      isSpeaking: false
    });
  });
  
  // Chat messages
  socket.on('chat_message', (data) => {
    const { message, streamId } = data;
    socket.to(streamId).emit('chat_message', {
      id: Date.now().toString(),
      username: socket.username,
      message,
      timestamp: new Date().toISOString(),
      isHost: false,
      isSystem: false
    });
  });
  
  // Drawing updates
  socket.on('drawing_update', (data) => {
    const { drawingData, streamId } = data;
    socket.to(streamId).emit('drawing_update', drawingData);
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);
  });
});

server.listen(8080, () => {
  console.log('WebSocket server running on port 8080');
});
```

#### Python/FastAPI with WebSockets
```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import jwt
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, websocket: WebSocket, stream_id: str):
        await websocket.accept()
        if stream_id not in self.active_connections:
            self.active_connections[stream_id] = []
        self.active_connections[stream_id].append(websocket)

    def disconnect(self, websocket: WebSocket, stream_id: str):
        if stream_id in self.active_connections:
            self.active_connections[stream_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, stream_id: str):
        if stream_id in self.active_connections:
            for connection in self.active_connections[stream_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/gurkha/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "authenticate":
                # Verify JWT token
                token = message["token"]
                # Add your JWT verification logic here
                
            elif message["type"] == "join_stream":
                stream_id = message["streamId"]
                await manager.connect(websocket, stream_id)
                
            elif message["type"] == "chat_message":
                stream_id = message["streamId"]
                await manager.broadcast(json.dumps(message), stream_id)
                
    except WebSocketDisconnect:
        # Handle disconnect
        pass
```

### Option 2: Standalone WebSocket Server

Create a separate WebSocket server:

```javascript
// websocket-server.js
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const wss = new WebSocket.Server({ port: 8080 });

// Store active streams
const streams = new Map();

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'authenticate':
          // Verify JWT token
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          ws.userId = decoded.id;
          ws.username = decoded.username;
          ws.send(JSON.stringify({ type: 'authenticated' }));
          break;
          
        case 'start_stream':
          const streamId = `stream_${Date.now()}`;
          streams.set(streamId, {
            hostId: ws.userId,
            hostUsername: ws.username,
            title: data.title,
            maxParticipants: data.maxParticipants,
            participants: [ws.userId]
          });
          ws.streamId = streamId;
          ws.send(JSON.stringify({
            type: 'stream_created',
            data: { ...streams.get(streamId), streamId }
          }));
          break;
          
        case 'join_stream':
          const stream = streams.get(data.streamId);
          if (stream && stream.participants.length < stream.maxParticipants) {
            stream.participants.push(ws.userId);
            ws.streamId = data.streamId;
            ws.send(JSON.stringify({
              type: 'stream_joined',
              data: stream
            }));
          }
          break;
          
        case 'chat_message':
          // Broadcast to all participants in the stream
          wss.clients.forEach((client) => {
            if (client.streamId === data.streamId && client !== ws) {
              client.send(JSON.stringify({
                type: 'chat_message',
                data: {
                  id: Date.now().toString(),
                  username: ws.username,
                  message: data.message,
                  timestamp: new Date().toISOString(),
                  isHost: false,
                  isSystem: false
                }
              }));
            }
          });
          break;
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on port 8080');
```

### Option 3: Use a Cloud WebSocket Service

#### Pusher
```javascript
// In your backend
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: "your_app_id",
  key: "your_key",
  secret: "your_secret",
  cluster: "your_cluster",
  useTLS: true
});

// Trigger events
pusher.trigger('livestream-channel', 'chat-message', {
  username: 'user',
  message: 'Hello!'
});
```

#### Socket.io Cloud
```javascript
const io = require('socket.io-client');

const socket = io('https://your-socketio-cloud-url', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

## Testing Your WebSocket Connection

### 1. Test with Browser Console
```javascript
// Open browser console and test
const ws = new WebSocket('ws://localhost:8080/gurkha/live');

ws.onopen = () => {
  console.log('Connected to WebSocket');
  ws.send(JSON.stringify({
    type: 'authenticate',
    token: 'your_jwt_token'
  }));
};

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

### 2. Test with wscat
```bash
# Install wscat
npm install -g wscat

# Test connection
wscat -c ws://localhost:8080/gurkha/live

# Send test message
{"type": "authenticate", "token": "your_jwt_token"}
```

## Production Deployment

### Environment Variables for Production
```env
# Development
NEXT_PUBLIC_GURKHA_WS_URL=ws://localhost:8080

# Production (with SSL)
NEXT_PUBLIC_GURKHA_WS_URL=wss://your-domain.com

# Staging
NEXT_PUBLIC_GURKHA_WS_URL=wss://staging.your-domain.com
```

### SSL/HTTPS Setup
For production, you need SSL certificates:

```javascript
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('/path/to/cert.pem'),
  key: fs.readFileSync('/path/to/key.pem')
});

const wss = new WebSocket.Server({ server });

server.listen(443, () => {
  console.log('Secure WebSocket server running on port 443');
});
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if WebSocket server is running
   - Verify port 8080 is not blocked
   - Check firewall settings

2. **CORS Errors**
   - Ensure CORS is properly configured
   - Check origin settings

3. **Authentication Errors**
   - Verify JWT token is valid
   - Check token expiration
   - Ensure proper token format

4. **Message Not Received**
   - Check WebSocket connection status
   - Verify message format
   - Check server logs

### Debug Mode
```javascript
// Enable WebSocket debugging
localStorage.setItem('debug', 'socket.io-client:*');
```

## Next Steps

1. **Choose a WebSocket solution** (standalone server, existing backend, or cloud service)
2. **Set up environment variables** in `.env.local`
3. **Test the connection** using browser console or wscat
4. **Deploy to production** with proper SSL certificates
5. **Monitor performance** and add logging as needed

The livestreaming feature will work once you have a WebSocket server running and the environment variables properly configured! 