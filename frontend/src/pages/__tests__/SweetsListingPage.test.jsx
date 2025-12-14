import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SweetsListingPage from '../SweetsListingPage'
import apiClient from '../../lib/api'

vi.mock('../../lib/api')

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('SweetsListingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches sweets from API', async () => {
    const mockSweets = [
      {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
      },
    ]

    apiClient.get = vi.fn().mockResolvedValue({ data: mockSweets })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sweets')
    })
  })

  it('handles empty list', async () => {
    apiClient.get = vi.fn().mockResolvedValue({ data: [] })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sweets')
    })

    const emptyMessage = screen.queryByText(/no sweets available/i)
    expect(emptyMessage).toBeInTheDocument()
  })

  it('renders sweet cards with name, price, and stock', async () => {
    const mockSweets = [
      {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
      },
      {
        id: '2',
        name: 'Gummy Bears',
        category: 'Candy',
        price: 3.50,
        quantity: 25,
      },
    ]

    apiClient.get = vi.fn().mockResolvedValue({ data: mockSweets })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    })

    expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    expect(screen.getByText('$5.99')).toBeInTheDocument()
    expect(screen.getByText(/stock: 10/i)).toBeInTheDocument()

    expect(screen.getByText('Gummy Bears')).toBeInTheDocument()
    expect(screen.getByText('$3.50')).toBeInTheDocument()
    expect(screen.getByText(/stock: 25/i)).toBeInTheDocument()
  })
})

