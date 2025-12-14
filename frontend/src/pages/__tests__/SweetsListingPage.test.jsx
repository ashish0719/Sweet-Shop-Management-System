import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('searches sweets by name', async () => {
    const user = userEvent.setup()
    const mockSweets = [
      {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
      },
    ]

    apiClient.get = vi.fn()
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: mockSweets })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sweets')
    })

    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.type(searchInput, 'Chocolate')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sweets/search', {
        params: { name: 'Chocolate' },
      })
    })
  })

  it('filters sweets by category', async () => {
    const user = userEvent.setup()
    const initialSweets = [
      {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
      },
    ]
    const mockSweets = [
      {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
      },
    ]

    apiClient.get = vi.fn()
      .mockResolvedValueOnce({ data: initialSweets })
      .mockResolvedValueOnce({ data: mockSweets })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sweets')
    })

    const categorySelect = screen.getByLabelText(/category/i)
    await user.selectOptions(categorySelect, 'Chocolate')

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sweets/search', {
        params: { category: 'Chocolate' },
      })
    })
  })

  it('filters sweets by price range', async () => {
    const user = userEvent.setup()
    const mockSweets = [
      {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
      },
    ]

    apiClient.get = vi.fn()
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: mockSweets })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sweets')
    })

    const minPriceInput = screen.getByLabelText(/min price/i)
    const maxPriceInput = screen.getByLabelText(/max price/i)

    await user.type(minPriceInput, '5')
    await user.type(maxPriceInput, '10')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sweets/search', {
        params: { minPrice: '5', maxPrice: '10' },
      })
    })
  })
})

