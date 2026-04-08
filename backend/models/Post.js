import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  isFavorited: {
    type: Boolean,
    default: false
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
  userNotes: {
    type: String,
    default: ''
  },
  readingStatus: {
    type: String,
    enum: ['unread', 'reading', 'completed'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update updatedAt on save
postSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Auto-update updatedAt on findByIdAndUpdate
postSchema.pre('findByIdAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
