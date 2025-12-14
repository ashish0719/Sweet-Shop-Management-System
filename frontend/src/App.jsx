import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SweetsListingPage from './pages/SweetsListingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sweets" element={<SweetsListingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

