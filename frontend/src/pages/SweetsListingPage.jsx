import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../lib/api'

function SweetsListingPage() {
  const navigate = useNavigate()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchName, setSearchName] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [categories, setCategories] = useState([])
  const allCategories = category && !categories.includes(category) 
    ? [...categories, category] 
    : categories

  const handlePurchase = (sweetId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
  }

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const response = await apiClient.get('/sweets')
        setSweets(response.data)
        const uniqueCategories = [...new Set(response.data.map((s) => s.category))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Failed to fetch sweets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSweets()
  }, [])

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const params = {}
      if (searchName) params.name = searchName
      if (category) params.category = category
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice

      const response = await apiClient.get('/sweets/search', { params })
      setSweets(response.data)
      const uniqueCategories = [...new Set(response.data.map((s) => s.category))]
      setCategories((prev) => {
        const combined = [...new Set([...prev, ...uniqueCategories])]
        return combined
      })
    } catch (error) {
      console.error('Failed to search sweets:', error)
    } finally {
      setLoading(false)
    }
  }, [searchName, category, minPrice, maxPrice])

  useEffect(() => {
    if (category) {
      const performSearch = async () => {
        setLoading(true)
        try {
          const params = { category }
          if (searchName) params.name = searchName
          if (minPrice) params.minPrice = minPrice
          if (maxPrice) params.maxPrice = maxPrice

          const response = await apiClient.get('/sweets/search', { params })
          setSweets(response.data)
          const uniqueCategories = [...new Set(response.data.map((s) => s.category))]
          setCategories((prev) => {
            const combined = [...new Set([...prev, ...uniqueCategories])]
            return combined
          })
        } catch (error) {
          console.error('Failed to search sweets:', error)
        } finally {
          setLoading(false)
        }
      }
      performSearch()
    }
  }, [category, searchName, minPrice, maxPrice])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-8 text-center">
          Our Sweets
        </h1>
        <form onSubmit={handleSearch} className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-primary-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-primary-700 mb-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-primary-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={async (e) => {
                  const value = e.target.value
                  if (value && !categories.includes(value)) {
                    setCategories((prev) => [...prev, value])
                  }
                  setCategory(value)
                  if (value) {
                    setLoading(true)
                    try {
                      const params = { category: value }
                      if (searchName) params.name = searchName
                      if (minPrice) params.minPrice = minPrice
                      if (maxPrice) params.maxPrice = maxPrice

                      const response = await apiClient.get('/sweets/search', { params })
                      setSweets(response.data)
                      const uniqueCategories = [...new Set(response.data.map((s) => s.category))]
                      setCategories((prev) => {
                        const combined = [...new Set([...prev, ...uniqueCategories])]
                        return combined
                      })
                    } catch (error) {
                      console.error('Failed to search sweets:', error)
                    } finally {
                      setLoading(false)
                    }
                  }
                }}
                className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-primary-700 mb-2">
                Min Price
              </label>
              <input
                id="minPrice"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-primary-700 mb-2">
                Max Price
              </label>
              <input
                id="maxPrice"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Search
          </button>
        </form>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-primary-700 text-lg">Loading...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary-700 text-lg">No sweets available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
            <div
              key={sweet.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-primary-100 hover:shadow-md transition-shadow"
            >
              {sweet.image && (
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-primary-800 mb-2">
                {sweet.name}
              </h2>
              <p className="text-primary-600 mb-2">${sweet.price.toFixed(2)}</p>
              <p className="text-primary-700 text-sm mb-4">Stock: {sweet.quantity}</p>
              <button
                onClick={() => handlePurchase(sweet.id)}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                Purchase
              </button>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SweetsListingPage

