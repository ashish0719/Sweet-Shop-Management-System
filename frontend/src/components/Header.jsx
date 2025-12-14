import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Header() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      if (token) {
        setIsLoggedIn(true)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          setIsAdmin(payload.role === 'admin')
        } catch {
          setIsAdmin(false)
        }
      } else {
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    }
    
    checkAuth()
    
    const handleCustomEvent = () => {
      checkAuth()
    }
    
    window.addEventListener('authChange', handleCustomEvent)
    
    return () => {
      window.removeEventListener('authChange', handleCustomEvent)
    }
  }, [])

  const handleAdminClick = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/sweets')
      }
    } catch {
      navigate('/login')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setIsAdmin(false)
    window.dispatchEvent(new Event('authChange'))
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-primary-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Sweet Shop
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/sweets"
              className="text-primary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Explore
            </Link>
            {isAdmin && (
              <button
                onClick={handleAdminClick}
                className="text-primary-700 hover:text-primary-600 font-medium transition-colors"
              >
                Admin
              </button>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors rounded-lg"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-4 ml-auto">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 font-medium rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 font-medium rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

