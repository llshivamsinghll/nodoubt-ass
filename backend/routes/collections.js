import express from 'express';
import {
  createCollection,
  getAllCollections,
  getCollectionById,
  addPostToCollection,
  removePostFromCollection,
  deleteCollection,
  updateCollection
} from '../controllers/collectionController.js';

const router = express.Router();

// POST - Create new collection
router.post('/', createCollection);

// GET - Get all collections
router.get('/', getAllCollections);

// GET - Get collection by ID with post details
router.get('/:id', getCollectionById);

// PATCH - Update collection
router.patch('/:id', updateCollection);

// DELETE - Delete collection
router.delete('/:id', deleteCollection);

// POST - Add post to collection
router.post('/:collectionId/posts/:postId', addPostToCollection);

// DELETE - Remove post from collection
router.delete('/:collectionId/posts/:postId', removePostFromCollection);

export default router;
