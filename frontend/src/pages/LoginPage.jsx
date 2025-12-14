import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../lib/api'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })

      localStorage.setItem('token', response.data.token)
      const userData = { ...response.data.user }
      try {
        const payload = JSON.parse(atob(response.data.token.split('.')[1]))
        userData.role = payload.role
      } catch {}
      localStorage.setItem('user', JSON.stringify(userData))
      navigate('/sweets')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md border border-primary-100">
        <h1 className="text-3xl font-bold text-primary-800 mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-4 text-center text-primary-700">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-800 font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

