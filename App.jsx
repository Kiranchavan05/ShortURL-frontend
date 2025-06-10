import { useState } from 'react'
import './App.css'

const BACKEND_URL = 'https://backend-shorturl-6gsk.onrender.com';

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Store the full backend URL with the short code
      setShortUrl(`yourShortURL/${data.shortUrl.split('/').pop()}`)
      // Store the original URL from the response
      setOriginalUrl(data.originalUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        alert('URL copied to clipboard!')
        // Open the shortened URL in a new tab
        window.open(shortUrl, '_blank')
      })
      .catch(err => console.error('Failed to copy:', err))
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your URL here (e.g., google.com)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {shortUrl && (
        <div className="result">
          <p>Your shortened URL:</p>
          <div className="short-url-container">
            <a href={originalUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
            {/* <button onClick={copyToClipboard} className="copy-btn">
              Copy & Open
            </button> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
