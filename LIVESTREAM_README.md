# Financial Gurkha Livestreaming Feature

## Overview

The Financial Gurkha livestreaming feature provides real-time video/audio streaming with live chat, ticker feeds, and drawing tools for collaborative trading analysis.

## Features

### 🎥 Live Video/Audio Streaming
- **WebRTC Integration**: Real-time peer-to-peer video/audio communication
- **Multi-participant Support**: Host and participant video streams
- **Screen Sharing**: Share charts and analysis screens
- **Audio Level Detection**: Visual indicators for speaking participants

### 💬 Live Chat
- **Real-time Messaging**: Instant chat during streams
- **System Messages**: Automated notifications for participant actions
- **Host Indicators**: Special highlighting for host messages
- **Message History**: Persistent chat during session

### 📊 Live Ticker Feed
- **Real-time Stock Data**: Live price updates for major stocks
- **Customizable Tickers**: Add/remove stocks to track
- **Price Change Indicators**: Color-coded gains/losses
- **Volume Information**: Trading volume display

### ✏️ Drawing Tools
- **Interactive Canvas**: Draw on screen during analysis
- **Multiple Tools**: Pen, highlighter, and eraser
- **Color Selection**: 10 different colors for annotations
- **Real-time Sync**: All participants see drawings instantly
- **Undo/Clear**: Remove drawings as needed

### 👥 Participant Management
- **Host Controls**: Mute, remove, or promote participants
- **Participant List**: View all connected users
- **Speaking Indicators**: Visual feedback for active speakers
- **Join/Leave Notifications**: Real-time participant updates

## Architecture

### Frontend Components

```
src/app/components/LiveStream/
├── LiveStreamHub.tsx          # Main livestream interface
├── LiveVideo.tsx              # Video streaming component
├── LiveChat.tsx               # Chat functionality
├── TickerFeed.tsx             # Real-time ticker display
├── DrawingCanvas.tsx          # Drawing tools overlay
├── LiveControls.tsx           # Audio/video controls
└── ParticipantList.tsx        # Participant management
```

### WebSocket Communication

The livestream uses WebSocket connections for real-time communication:

```typescript
// Message Types
interface LiveStreamMessage {
  type: 'stream_created' | 'participant_joined' | 'participant_left' | 
        'chat_message' | 'drawing_update' | 'ticker_update' | 
        'audio_level' | 'stream_ended' | 'error'
  data?: any
  streamId?: string
  participantId?: string
  message?: string
  drawingData?: any
  tickerData?: any
  audioLevel?: number
}
```

### Key Hooks

- `useLiveStreamSocket()`: Manages WebSocket connections and real-time data
- `useGurkhaSocket()`: Existing WebSocket hook for general communication

## Usage

### Starting a Stream

1. Navigate to Profile page
2. Click "🔴 Go LIVE" button
3. Choose "Start New Stream"
4. Enter stream title and max participants
5. Grant camera/microphone permissions
6. Stream begins with WebRTC connection

### Joining a Stream

1. Navigate to `/live` page
2. Choose "Join Stream"
3. Enter stream ID
4. Grant camera/microphone permissions
5. Join existing livestream

### Drawing Tools

1. Click "Drawing" button during stream
2. Select tool (pen, highlighter, eraser)
3. Choose color and width
4. Draw on screen - all participants see in real-time
5. Use Undo/Clear buttons as needed

## WebSocket Endpoints

### Connection
```
ws://your-domain/gurkha/live
```

### Authentication
```json
{
  "type": "authenticate",
  "token": "jwt_token"
}
```

### Stream Management
```json
// Start stream
{
  "type": "start_stream",
  "title": "Trading Analysis",
  "maxParticipants": 10
}

// Join stream
{
  "type": "join_stream",
  "streamId": "stream_123"
}

// End stream
{
  "type": "end_stream",
  "streamId": "stream_123"
}
```

### Real-time Updates
```json
// Chat message
{
  "type": "chat_message",
  "message": "Great analysis!",
  "streamId": "stream_123"
}

// Drawing update
{
  "type": "drawing_update",
  "drawingData": {
    "stroke": {
      "points": [...],
      "color": "#ff0000",
      "width": 2,
      "tool": "pen"
    }
  },
  "streamId": "stream_123"
}
```

## Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_GURKHA_WS_URL=ws://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Backend Requirements

The backend needs to implement these WebSocket handlers:

1. **Authentication**: Verify JWT tokens
2. **Stream Management**: Create/join/end streams
3. **Participant Tracking**: Track connected users
4. **Message Broadcasting**: Relay messages to all participants
5. **Drawing Sync**: Broadcast drawing updates
6. **Ticker Data**: Provide real-time stock data

## Security Considerations

- **JWT Authentication**: All WebSocket connections require valid tokens
- **Stream Permissions**: Only hosts can end streams or remove participants
- **Rate Limiting**: Prevent spam in chat and drawing
- **Media Permissions**: Browser-level camera/microphone permissions

## Performance Optimizations

- **WebRTC Optimization**: Adaptive bitrate for different connections
- **Drawing Throttling**: Limit drawing update frequency
- **Message Batching**: Batch chat messages for efficiency
- **Connection Pooling**: Reuse WebSocket connections

## Browser Support

- **WebRTC**: Chrome, Firefox, Safari, Edge
- **WebSocket**: All modern browsers
- **Canvas API**: All modern browsers
- **MediaDevices API**: All modern browsers

## Future Enhancements

1. **Recording**: Save streams for later viewing
2. **Polls**: Interactive polls during streams
3. **Screen Recording**: Record screen shares
4. **Advanced Drawing**: Shapes, text, charts
5. **Stream Analytics**: Viewership metrics
6. **Mobile Support**: Optimized mobile interface
7. **Stream Discovery**: Browse active streams
8. **Moderation Tools**: Advanced host controls

## Troubleshooting

### Common Issues

1. **Camera/Microphone Access**
   - Ensure browser permissions are granted
   - Check if another app is using camera/mic

2. **WebSocket Connection**
   - Verify WebSocket server is running
   - Check network connectivity
   - Ensure valid JWT token

3. **Drawing Not Syncing**
   - Check WebSocket connection status
   - Verify drawing data format
   - Clear browser cache

4. **Video Quality Issues**
   - Check internet connection
   - Reduce participant count
   - Lower video resolution

### Debug Mode

Enable debug logging:

```typescript
// In browser console
localStorage.setItem('debug', 'live-stream:*')
```

## API Reference

### LiveStreamHub Props
```typescript
interface LiveStreamHubProps {
  // Component manages its own state
}
```

### LiveVideo Props
```typescript
interface LiveVideoProps {
  stream: MediaStream | null
  isHost: boolean
  participants: Participant[]
}
```

### LiveChat Props
```typescript
interface LiveChatProps {
  streamId: string
  onSendMessage: (message: string) => void
}
```

### TickerFeed Props
```typescript
interface TickerFeedProps {
  streamId: string
}
```

### DrawingCanvas Props
```typescript
interface DrawingCanvasProps {
  onClose: () => void
  onUpdate: (drawingData: any) => void
}
```

### LiveControls Props
```typescript
interface LiveControlsProps {
  isHost: boolean
  stream: MediaStream | null
  onToggleDrawing: () => void
}
```

### ParticipantList Props
```typescript
interface ParticipantListProps {
  participants: Participant[]
  isHost: boolean
  onClose: () => void
}
```

## Contributing

1. Follow existing code patterns
2. Add TypeScript types for new features
3. Include error handling
4. Test WebSocket connections
5. Update documentation

## License

This feature is part of the Financial Gurkha Explorer project. 