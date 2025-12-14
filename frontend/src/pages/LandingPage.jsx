import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import apiClient from '../lib/api'

function LandingPage() {
  const [favorites, setFavorites] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

  const bannerImages = [
    {
      image: 'https://t3.ftcdn.net/jpg/06/67/70/34/240_F_667703458_M1wizjtEyjQ2cPsnsPCpG30s0i5eX362.jpg',
      title: 'Fresh Traditional Sweets',
      subtitle: 'Delivered with Love'
    },
    {
      image: 'https://t3.ftcdn.net/jpg/15/44/45/02/240_F_1544450286_DJJVW7V45R8UabddP8ujXsunbpakmpCX.jpg',
      title: 'Handcrafted with Care',
      subtitle: 'Premium Quality Ingredients'
    },
    {
      image: 'https://t4.ftcdn.net/jpg/15/85/91/97/240_F_1585919783_5tIIuUBrYidRa40sOgnFZ6JAYIVbZEK5.jpg',
      title: 'Authentic Indian Flavors',
      subtitle: 'Made with Tradition'
    },
    {
      image: 'https://t3.ftcdn.net/jpg/08/59/81/04/240_F_859810429_7F9U0NSfLGLIRSorR7775NUZUCiZCSXc.jpg',
      title: 'Sweet Moments Await',
      subtitle: 'Order Your Favorites Today'
    },
    {
      image: 'https://t3.ftcdn.net/jpg/17/98/08/00/240_F_1798080003_MZbKshe6KqUflyt7KDxmyrKDBTrthYAZ.jpg',
      title: 'Celebrate Every Occasion',
      subtitle: 'With Our Delicious Sweets'
    }
  ]

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await apiClient.get('/sweets')
        setFavorites(response.data.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
      }
    }
    fetchFavorites()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [bannerImages.length])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 relative overflow-hidden">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl">
        {bannerImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-white px-4 z-10">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-primary-200 animate-fade-in-delay">
                  {slide.subtitle}
                </p>
                <Link
                  to="/sweets"
                  className="inline-block px-10 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-110 animate-fade-in-delay-2"
                >
                  Explore Sweets
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">

          <div className="mt-32">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Customer Favorites
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked by our customers, these sweets are always in demand
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {favorites.map((sweet, index) => (
                <div
                  key={sweet.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    {sweet.image ? (
                      <img
                        src={sweet.image}
                        alt={sweet.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <span className="text-8xl">🍬</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {sweet.quantity > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        IN STOCK ({sweet.quantity})
                      </div>
                    )}
                    {sweet.quantity === 0 && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{sweet.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-primary-600 font-bold text-2xl">${sweet.price.toFixed(2)}</p>
                      <Link
                        to="/sweets"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-32 mb-16">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Satisfy Your Sweet Cravings?
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Browse our complete collection of traditional sweets
              </p>
              <Link
                to="/sweets"
                className="inline-block px-8 py-3 bg-white text-primary-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

