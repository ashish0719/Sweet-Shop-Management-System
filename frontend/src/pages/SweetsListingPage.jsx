import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../lib/api'
import Header from '../components/Header'

function SweetsListingPage() {
  const navigate = useNavigate()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchName, setSearchName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [categories, setCategories] = useState([])
  
  const allCategories = [
    'Milk', 'Dry Fruit', 'Sugar-Free', 'Chocolate', 'Halwa', 'Ladoo', 
    'Barfi', 'Gulab Jamun', 'Rasgulla', 'Jalebi', 'Kaju Katli', 
    'Soan Papdi', 'Besan Ladoo', 'Rasmalai', 'Kheer', 'Payasam', 
    'Kulfi', 'Gajar Halwa', 'Moong Dal Halwa', 'Badam Halwa', 'All'
  ]
  
  const priceRanges = [
    { label: 'All Prices', value: '', min: '', max: '' },
    { label: 'Under $5', value: 'under5', min: '0', max: '5' },
    { label: '$5 - $10', value: '5-10', min: '5', max: '10' },
    { label: '$10 - $15', value: '10-15', min: '10', max: '15' },
    { label: '$15 - $20', value: '15-20', min: '15', max: '20' },
    { label: 'Above $20', value: 'above20', min: '20', max: '' }
  ]
  const [error, setError] = useState('')
  const [selectedSweet, setSelectedSweet] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handlePurchase = async (sweetId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setError('')
    try {
      const response = await apiClient.post(`/sweets/${sweetId}/purchase`)
      setSweets((prev) =>
        prev.map((sweet) =>
          sweet.id === sweetId ? response.data : sweet
        )
      )
      if (showModal) {
        setSelectedSweet(response.data)
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError('Sweet out of stock')
      } else {
        console.error('Failed to purchase sweet:', error)
      }
    }
  }

  const handleViewDetails = (sweet) => {
    setSelectedSweet(sweet)
    setShowModal(true)
  }


  const handleCategoryChange = (category) => {
    const categoryValue = category === 'All' || category === '' ? '' : category
    setSelectedCategory(categoryValue)
  }
  
  const handlePriceRangeChange = (rangeValue) => {
    setSelectedPriceRange(rangeValue)
    const range = priceRanges.find(r => r.value === rangeValue)
    if (range && range.value !== '') {
      setMinPrice(range.min || '')
      setMaxPrice(range.max || '')
    } else {
      setMinPrice('')
      setMaxPrice('')
    }
  }

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const params = {}
      if (searchName) params.name = searchName
      if (selectedCategory) params.category = selectedCategory
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
  }, [searchName, selectedCategory, minPrice, maxPrice])

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true)
      try {
        const params = {}
        if (searchName && searchName.trim()) params.name = searchName.trim()
        if (selectedCategory && selectedCategory.trim()) params.category = selectedCategory.trim()
        if (minPrice && minPrice.trim()) params.minPrice = minPrice.trim()
        if (maxPrice && maxPrice.trim()) params.maxPrice = maxPrice.trim()

        const hasFilters = Object.keys(params).length > 0
        const response = hasFilters 
          ? await apiClient.get('/sweets/search', { params })
          : await apiClient.get('/sweets')

        setSweets(response.data || [])
        const uniqueCategories = [...new Set((response.data || []).map((s) => s.category))]
        setCategories((prev) => {
          const combined = [...new Set([...prev, ...uniqueCategories])]
          return combined
        })
      } catch (error) {
        console.error('Failed to fetch sweets:', error)
        setSweets([])
      } finally {
        setLoading(false)
      }
    }
    performSearch()
  }, [selectedCategory, searchName, minPrice, maxPrice])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-gray-900">Filter:</span>
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                const value = e.target.value
                setSelectedCategory(value === 'All' || value === '' ? '' : value)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-700 font-medium min-w-[180px]"
            >
              <option value="">All Categories</option>
              {allCategories.filter(cat => cat !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedPriceRange || ''}
              onChange={(e) => {
                const rangeValue = e.target.value
                setSelectedPriceRange(rangeValue)
                const range = priceRanges.find(r => r.value === rangeValue)
                if (range && range.value !== '') {
                  setMinPrice(range.min || '')
                  setMaxPrice(range.max || '')
                } else {
                  setMinPrice('')
                  setMaxPrice('')
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-700 font-medium min-w-[150px]"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            {(selectedCategory || selectedPriceRange) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedPriceRange('')
                  setMinPrice('')
                  setMaxPrice('')
                  setSearchName('')
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-700">Loading...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700">No sweets available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="relative mb-3">
                  {sweet.image ? (
                    <img
                      src={sweet.image}
                      alt={sweet.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-40 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🍬</span>
                    </div>
                  )}
                  {sweet.quantity > 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      IN STOCK ({sweet.quantity})
                    </div>
                  )}
                  {sweet.quantity === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{sweet.name}</h3>
                <p className="text-primary-600 font-bold mb-3">${sweet.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(sweet)}
                    className="flex-1 px-3 py-2 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handlePurchase(sweet.id)}
                    disabled={sweet.quantity === 0}
                    className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedSweet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-6">
                <div className="relative">
                  {selectedSweet.image ? (
                    <img
                      src={selectedSweet.image}
                      alt={selectedSweet.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-6xl">🍬</span>
                    </div>
                  )}
                  {selectedSweet.quantity > 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      IN STOCK ({selectedSweet.quantity})
                    </div>
                  )}
                  {selectedSweet.quantity === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary-600">${selectedSweet.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleViewDetails(selectedSweet)}
                    className="p-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handlePurchase(selectedSweet.id)}
                    disabled={selectedSweet.quantity === 0}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedSweet(null)
                  }}
                  className="float-right text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedSweet.name}</h2>
                <p className="text-gray-600 mb-4">
                  Delicious traditional sweet made with premium ingredients and authentic recipes.
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-green-600">${selectedSweet.price.toFixed(2)}</span>
                </div>
                {selectedSweet.quantity > 0 && (
                  <p className="text-sm text-gray-600 mb-4">Only {selectedSweet.quantity} left!</p>
                )}
                <button
                  onClick={() => handlePurchase(selectedSweet.id)}
                  disabled={selectedSweet.quantity === 0}
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SweetsListingPage

