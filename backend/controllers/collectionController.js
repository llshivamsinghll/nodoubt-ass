import Collection from '../models/Collection.js';
import Post from '../models/Post.js';

export const createCollection = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const collection = new Collection({
      name,
      description: description || '',
      color: color || '#3b82f6'
    });

    await collection.save();

    res.status(201).json({
      message: 'Collection created successfully',
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Get full post details for posts in collection
    const posts = await Post.find({ id: { $in: collection.posts } });

    res.status(200).json({
      ...collection.toObject(),
      postDetails: posts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addPostToCollection = async (req, res) => {
  try {
    const { collectionId, postId } = req.params;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Check if post exists
    const post = await Post.findOne({ id: parseInt(postId) });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add post if not already in collection
    if (!collection.posts.includes(parseInt(postId))) {
      collection.posts.push(parseInt(postId));
      await collection.save();
    }

    res.status(200).json({
      message: 'Post added to collection',
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removePostFromCollection = async (req, res) => {
  try {
    const { collectionId, postId } = req.params;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    collection.posts = collection.posts.filter(id => id !== parseInt(postId));
    await collection.save();

    res.status(200).json({
      message: 'Post removed from collection',
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.status(200).json({
      message: 'Collection deleted successfully',
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;

    const collection = await Collection.findByIdAndUpdate(
      id,
      {
        name: name || undefined,
        description: description || undefined,
        color: color || undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.status(200).json({
      message: 'Collection updated successfully',
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
