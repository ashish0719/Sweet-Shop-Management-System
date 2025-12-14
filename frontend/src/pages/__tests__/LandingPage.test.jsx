import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from '../LandingPage'

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('LandingPage', () => {
  it('renders hero heading', () => {
    renderWithRouter(<LandingPage />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders "Explore Sweets" button that navigates to /sweets', () => {
    renderWithRouter(<LandingPage />)
    const button = screen.getByRole('link', { name: /explore sweets/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/sweets')
  })
})

