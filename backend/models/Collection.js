import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  posts: {
    type: [Number],
    default: []
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  isPublic: {
    type: Boolean,
    default: false
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

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
