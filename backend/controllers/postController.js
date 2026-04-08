import Post from '../models/Post.js';

export const fetchAndSavePosts = async (req, res) => {
  try {
    // Check if posts already exist
    const existingCount = await Post.countDocuments();
    if (existingCount > 0) {
      return res.status(200).json({
        message: 'Posts already in database',
        count: existingCount
      });
    }

    // Fetch from JSONPlaceholder API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Failed to fetch from JSONPlaceholder');
    const posts = await response.json();

    // Save to MongoDB
    await Post.insertMany(posts);

    res.status(201).json({
      message: 'Posts fetched and saved successfully',
      count: posts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().limit(50);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ id: parseInt(id) });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { body: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    return posts;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// Shortlisting Methods
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ id: parseInt(id) });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isFavorited = !post.isFavorited;
    await post.save();

    res.status(200).json({
      message: post.isFavorited ? 'Added to favorites' : 'Removed from favorites',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ id: parseInt(id) });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isBookmarked = !post.isBookmarked;
    await post.save();

    res.status(200).json({
      message: post.isBookmarked ? 'Added to bookmarks' : 'Removed from bookmarks',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const posts = await Post.find({ isFavorited: true }).limit(50);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const posts = await Post.find({ isBookmarked: true }).limit(50);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const ratePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    const post = await Post.findOne({ id: parseInt(id) });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.rating = rating;
    await post.save();

    res.status(200).json({
      message: 'Post rated successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;

    const post = await Post.findOne({ id: parseInt(id) });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add new tags, avoiding duplicates
    post.tags = Array.from(new Set([...post.tags, ...tags]));
    await post.save();

    res.status(200).json({
      message: 'Tags added successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;

    const post = await Post.findOne({ id: parseInt(id) });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.tags = post.tags.filter(tag => !tags.includes(tag));
    await post.save();

    res.status(200).json({
      message: 'Tags removed successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReadingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['unread', 'reading', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid reading status' });
    }

    const post = await Post.findOne({ id: parseInt(id) });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.readingStatus = status;
    await post.save();

    res.status(200).json({
      message: `Reading status updated to ${status}`,
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const post = await Post.findOne({ id: parseInt(id) });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.userNotes = notes;
    await post.save();

    res.status(200).json({
      message: 'Notes added successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
