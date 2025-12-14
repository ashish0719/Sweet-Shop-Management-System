import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-800 mb-6">
            Welcome to Sweet Shop
          </h1>
          <p className="text-lg md:text-xl text-primary-700 mb-8">
            Discover our delightful collection of handcrafted sweets
          </p>
          <Link
            to="/sweets"
            className="inline-block px-8 py-4 bg-primary-500 text-white rounded-lg shadow-md hover:bg-primary-600 transition-colors font-semibold text-lg"
          >
            Explore Sweets
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

