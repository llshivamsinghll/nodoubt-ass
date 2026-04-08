import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import collectionRoutes from './routes/collections.js';
import { searchPosts } from './controllers/postController.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/collections', collectionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend running' });
});

// MongoDB Connection
let isDBConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/postsdb';
    await mongoose.connect(mongoURI);
    console.log('[✓] MongoDB connected');
    isDBConnected = true;
  } catch (error) {
    console.error('[✗] MongoDB connection error:', error.message);
    isDBConnected = false;
    // Continue startup even if MongoDB fails
    console.log('[!] Starting server without MongoDB connection (will retry)');
  }
};

// WebSocket handling for real-time search
wss.on('connection', (ws) => {
  console.log('[✓] New WebSocket client connected');

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connection',
    status: 'connected'
  }));

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'search') {
        const query = message.query;
        
        // Check if database is connected
        if (!isDBConnected) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Database not connected. Performing local search only.'
          }));
          return;
        }

        const results = await searchPosts(query);
        
        ws.send(JSON.stringify({
          type: 'search_results',
          query: query,
          results: results
        }));
      }
    } catch (error) {
      console.error('[✗] WebSocket message error:', error.message);
      try {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Search failed: ' + error.message
        }));
      } catch (sendError) {
        console.error('Failed to send error to client:', sendError.message);
      }
    }
  });

  ws.on('close', () => {
    console.log('[↔] WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('[✗] WebSocket error:', error.message);
  });
});

// Start server - don't wait for MongoDB
const PORT = process.env.PORT || 5000;

// Connect to MongoDB asynchronously
connectDB();

// Start HTTP/WebSocket server immediately
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[✓] Server running on http://localhost:${PORT}`);
  console.log(`[↔] WebSocket server running on ws://localhost:${PORT}`);
  console.log(`[📊] Database status: ${isDBConnected ? 'Connected' : 'Connecting...'}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('[✗] Server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[⏹] Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close();
    process.exit(0);
  });
});

export default app;
