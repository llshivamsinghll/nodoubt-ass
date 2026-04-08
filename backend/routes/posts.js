import express from 'express';
import {
  fetchAndSavePosts,
  getAllPosts,
  getPostById,
  toggleFavorite,
  toggleBookmark,
  getFavorites,
  getBookmarks,
  ratePost,
  addTags,
  removeTags,
  updateReadingStatus,
  addNotes
} from '../controllers/postController.js';

const router = express.Router();

// POST - Fetch posts from JSONPlaceholder and save to MongoDB
router.post('/fetch-and-save', fetchAndSavePosts);

// GET - Get all posts
router.get('/', getAllPosts);

// GET - Get favorites
router.get('/filter/favorites', getFavorites);

// GET - Get bookmarks
router.get('/filter/bookmarks', getBookmarks);

// GET - Get single post by ID
router.get('/:id', getPostById);

// PATCH - Toggle favorite
router.patch('/:id/favorite', toggleFavorite);

// PATCH - Toggle bookmark
router.patch('/:id/bookmark', toggleBookmark);

// PATCH - Rate post
router.patch('/:id/rate', ratePost);

// PATCH - Add tags
router.patch('/:id/tags/add', addTags);

// PATCH - Remove tags
router.patch('/:id/tags/remove', removeTags);

// PATCH - Update reading status
router.patch('/:id/reading-status', updateReadingStatus);

// PATCH - Add notes
router.patch('/:id/notes', addNotes);

export default router;
