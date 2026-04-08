import { useState } from 'react'
import { ConnectedDotIcon, DisconnectedDotIcon } from '../icons'
import './SearchBar.css'

export default function SearchBar({ onSearch, isConnected }) {
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search posts by title or content..."
        value={query}
        onChange={handleChange}
        className="search-input"
        aria-label="Search posts"
      />
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`} aria-live="polite" aria-label={isConnected ? 'Connected to server' : 'Disconnected from server'}>
        {isConnected ? (
          <>
            <ConnectedDotIcon /> Connected
          </>
        ) : (
          <>
            <DisconnectedDotIcon /> Disconnected
          </>
        )}
      </div>
    </div>
  )
}
