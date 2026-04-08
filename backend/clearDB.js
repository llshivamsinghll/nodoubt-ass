import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    console.log('[↻] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[✓] Connected to MongoDB');

    console.log('[🗑] Clearing posts collection...');
    const result = await Post.deleteMany({});
    console.log(`[✓] Deleted ${result.deletedCount} posts`);

    console.log('[↔] Disconnecting from MongoDB...');
    await mongoose.connection.close();
    console.log('[✓] Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[✗] Error clearing database:', error.message);
    process.exit(1);
  }
};

clearDatabase();
