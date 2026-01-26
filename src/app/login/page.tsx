'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.detail || 'Invalid username or password')
      }

      // Redirect to user page
      window.location.href = '/user'
    } catch (err) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">



      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">
            Sign in to your account
          </h1>

          <div className="bg-[#252b3b] border border-[#1F2228] rounded-lg p-8">
            <div>
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#1a1f2e] border border-[#1F2228] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500"

                  required
                />
              </div>

              <div className="mb-6">
  <div className="flex items-center justify-between mb-2">
    <label htmlFor="password" className="block text-sm font-medium">
      Password
    </label>
  </div>

  <input
    type="password"
    id="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    className="w-full bg-[#1a1f2e] border border-[#1F2228] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500"

    required
  />

<div className="mt-2 flex justify-end">
  <a
    href="#"
    className="text-sm text-blue-500 hover:text-blue-400"
  >
    Forgot your password?
  </a>
</div>
</div>


              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <a href="/" className="block text-xs text-gray-400 hover:text-gray-300">
                Back to Home
              </a>
              <p className="text-sm text-gray-400">
                New to Reddify?{' '}
                <a href="/register" className="text-blue-500 hover:text-blue-400">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Badge */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-500 text-lg">😊</span>
          </div>
          Made in Bettermode
        </div>
      </div>
    </div>
  )
}