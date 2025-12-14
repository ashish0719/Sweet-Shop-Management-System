import { useState, useEffect } from 'react'
import apiClient from '../lib/api'

function SweetsListingPage() {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchSweets()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <p className="text-primary-700 text-lg">Loading...</p>
      </div>
    )
  }

  if (sweets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-8 text-center">
            Our Sweets
          </h1>
          <div className="text-center py-12">
            <p className="text-primary-700 text-lg">No sweets available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-8 text-center">
          Our Sweets
        </h1>
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
              <p className="text-primary-700 text-sm">Stock: {sweet.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SweetsListingPage

