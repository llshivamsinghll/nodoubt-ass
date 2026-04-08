import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import PostList from './components/PostList'
import './App.css'

export default function App() {
  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef(null)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const WS_URL = (import.meta.env.VITE_WS_URL || '').trim()
  const enableWebSocket = Boolean(WS_URL)

  // Initialize WebSocket connection
  useEffect(() => {
    if (!enableWebSocket) {
      setIsConnected(false)
      return
    }

    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket(WS_URL)

        wsRef.current.onopen = () => {
          setIsConnected(true)
        }

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'search_results') {
              setPosts(data.results)
            }
          } catch (error) {
            // Silently handle parse errors
          }
        }

        wsRef.current.onerror = (error) => {
          setIsConnected(false)
        }

        wsRef.current.onclose = () => {
          setIsConnected(false)
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000)
        }
      } catch (error) {
        setIsConnected(false)
        setTimeout(connectWebSocket, 3000)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [WS_URL, enableWebSocket])

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)

        // First, trigger the fetch and save from JSONPlaceholder
        try {
          await fetch(`${API_BASE}/api/posts/fetch-and-save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error) {
          // Fetch/save already completed or cached
        }

        // Then fetch all posts
        const response = await fetch(`${API_BASE}/api/posts`)
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setAllPosts(data)
        setPosts(data)
      } catch (error) {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Handle search via WebSocket
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (query.trim() === '') {
      // If no query, show all posts
      setPosts(allPosts)
      return
    }

    // Send search query via WebSocket if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'search',
        query: query
      }))
    } else {
      // Fallback to client-side search if WebSocket not connected
      const filtered = allPosts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      )
      setPosts(filtered)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Posts Explorer</h1>
        <p>Search and explore posts in real-time</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} isConnected={isConnected} />
        <PostList posts={posts} loading={loading} searchQuery={searchQuery} />
      </main>

      <footer className="app-footer">
        <p>© 2024 Posts App | Powered by React + Vite + Node.js</p>
      </footer>
    </div>
  )
}
