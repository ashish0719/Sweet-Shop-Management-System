import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../lib/api'

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
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSweet, setEditingSweet] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    imageUrl: '',
  })

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

    fetchSweets()
  }, [navigate])

  const fetchSweets = async () => {
    try {
      const response = await apiClient.get('/sweets')
      setSweets(response.data)
    } catch (error) {
      console.error('Failed to fetch sweets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setFormData({ name: '', category: '', price: '', quantity: '', imageUrl: '' })
    setEditingSweet(null)
    setShowAddForm(true)
  }

  const handleEdit = (sweet) => {
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      imageUrl: sweet.image || '',
    })
    setEditingSweet(sweet)
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return

    try {
      await apiClient.delete(`/sweets/${id}`)
      fetchSweets()
    } catch (error) {
      console.error('Failed to delete sweet:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      }
      if (formData.imageUrl) {
        payload.imageUrl = formData.imageUrl
      }

      if (editingSweet) {
        await apiClient.put(`/sweets/${editingSweet.id}`, payload)
      } else {
        await apiClient.post('/sweets', payload)
      }

      setShowAddForm(false)
      setEditingSweet(null)
      fetchSweets()
    } catch (error) {
      console.error('Failed to save sweet:', error)
    }
  }

  const role = getRoleFromToken()
  if (!role || role !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <p className="text-primary-700 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-800">
            Admin Dashboard
          </h1>
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            Add Sweet
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-primary-100 mb-6">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-primary-700 mb-2">
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-primary-700 mb-2">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-primary-700 mb-2">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-primary-700 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                  {editingSweet ? 'Update' : 'Add'} Sweet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingSweet(null)
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <div
              key={sweet.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-primary-100"
            >
              {sweet.image && (
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-primary-800 mb-2">{sweet.name}</h2>
              <p className="text-primary-600 mb-2">${sweet.price.toFixed(2)}</p>
              <p className="text-primary-700 text-sm mb-4">Stock: {sweet.quantity}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(sweet)}
                  className="flex-1 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sweet.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

