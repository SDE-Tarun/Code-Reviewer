import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(``)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.post('https://code-reviewer-backend-vokl.onrender.com/ai/get-review', { code })
      setReview(response.data)
    } catch (error) {
      console.error('Error getting review:', error)
      setError('Failed to get review. Please try again.')
      setReview('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Code Reviewer</h1>
          <p>Get instant AI-powered code reviews and suggestions</p>
        </div>
      </header>

      <main className="main-content">
        <div className="editor-section">
          <div className="section-header">
            <div className="header-left">
              <h2>Your Code</h2>
              <span className="language-badge">JavaScript</span>
            </div>
            <button 
              className="review-button"
              onClick={reviewCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-spinner"></span>
                  <span>Reviewing...</span>
                </>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  <span>Review Code</span>
                </>
              )}
            </button>
          </div>
          <div className="code-editor">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={15}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                lineHeight: '1.5',
                minHeight: '400px'
              }}
            />
          </div>
        </div>

        <div className="review-section">
          <div className="section-header">
            <div className="header-left">
              <h2>Code Review</h2>
              {review && <span className="review-badge">AI Analysis</span>}
            </div>
          </div>
          <div className="review-content">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Analyzing your code...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            ) : (
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review || (
                  <div className="empty-state">
                    <span className="empty-icon">👋</span>
                    <p>Welcome! Write or paste your code and click "Review Code" to get started.</p>
                  </div>
                )}
              </Markdown>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by AI • Code Reviewer v1.0</p>
      </footer>
    </div>
  )
}

export default App
