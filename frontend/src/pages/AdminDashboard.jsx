import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function getRoleFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role
  } catch {
    return null
  }
}

function AdminDashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      navigate('/login')
      return
    }

    const role = getRoleFromToken()
    if (role !== 'admin') {
      navigate('/sweets')
      return
    }
  }, [navigate])

  const role = getRoleFromToken()
  if (!role || role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-8 text-center">
          Admin Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-primary-100">
          <p className="text-primary-700">Welcome to the admin dashboard</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

