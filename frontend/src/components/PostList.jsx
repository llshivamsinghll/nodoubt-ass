import { useState } from 'react'
import { HeartIcon, BookmarkIcon, StarIcon } from '../icons'
import './PostList.css'

export default function PostList({ posts, loading, searchQuery }) {
  const [expandedPostId, setExpandedPostId] = useState(null)
  const [postStates, setPostStates] = useState({})

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const toggleFavorite = async (postId) => {
    try {
      const response = await fetch(`${API_BASE}/api/posts/${postId}/favorite`, {
        method: 'PATCH'
      })
      if (response.ok) {
        setPostStates(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            isFavorited: !prev[postId]?.isFavorited
          }
        }))
      } else {
        // If API fails, state won't update
      }
    } catch (error) {
      // Network error - state remains unchanged
    }
  }

  const toggleBookmark = async (postId) => {
    try {
      const response = await fetch(`${API_BASE}/api/posts/${postId}/bookmark`, {
        method: 'PATCH'
      })
      if (response.ok) {
        setPostStates(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            isBookmarked: !prev[postId]?.isBookmarked
          }
        }))
      } else {
        // If API fails, state won't update
      }
    } catch (error) {
      // Network error - state remains unchanged
    }
  }

  const ratePost = async (postId, rating) => {
    try {
      const response = await fetch(`${API_BASE}/api/posts/${postId}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      })
      if (response.ok) {
        setPostStates(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            rating
          }
        }))
      } else {
        // If API fails, state won't update
      }
    } catch (error) {
      // Network error - state remains unchanged
    }
  }

  if (loading) {
    return <div className="loading">Loading posts...</div>
  }

  if (posts.length === 0) {
    return (
      <div className="no-posts">
        {searchQuery ? 'No posts matching your search' : 'No posts available'}
      </div>
    )
  }

  return (
    <div className="posts-container">
      <div className="posts-count">
        {searchQuery ? `Found ${posts.length} post(s)` : `Displaying ${posts.length} posts`}
      </div>
      <div className="posts-grid">
        {posts.map((post) => {
          const state = postStates[post.id] || {}
          const isFavorited = post.isFavorited || state.isFavorited || false
          const isBookmarked = post.isBookmarked || state.isBookmarked || false
          const rating = post.rating || state.rating || 0

          return (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-actions">
                  <button
                    className={`action-btn favorite ${isFavorited ? 'active' : ''}`}
                    onClick={() => toggleFavorite(post.id)}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <HeartIcon filled={isFavorited} />
                  </button>
                  <button
                    className={`action-btn bookmark ${isBookmarked ? 'active' : ''}`}
                    onClick={() => toggleBookmark(post.id)}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    <BookmarkIcon filled={isBookmarked} />
                  </button>
                </div>
              </div>

              <p className="post-body">{post.body}</p>

              <div className="post-rating">
                <div className="stars" role="group" aria-label="Post rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star ${rating >= star ? 'filled' : ''}`}
                      onClick={() => ratePost(post.id, star)}
                      aria-label={`Rate ${star} out of 5 stars`}
                      title={`Rate ${star} out of 5 stars`}
                    >
                      <StarIcon filled={rating >= star} />
                    </button>
                  ))}
                </div>
                <span className="rating-value" aria-label={`Current rating: ${rating > 0 ? rating : 'not rated'}`}>
                  {rating > 0 ? `${rating}/5` : 'Rate'}
                </span>
              </div>

              <div className="post-meta">
                <span className="post-created">Post from JSONPlaceholder</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
