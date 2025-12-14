import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SweetsListingPage from '../SweetsListingPage'
import apiClient from '../../lib/api'

vi.mock('../../lib/api')

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

function createUserToken() {
  const userPayload = { userId: '1', role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 }
  return `header.${btoa(JSON.stringify(userPayload))}.signature`
}

describe('Purchase Sweet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('decreases stock when purchase is successful', async () => {
    const user = userEvent.setup()
    localStorage.setItem('token', createUserToken())
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', email: 'user@test.com' }))

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
    apiClient.post = vi.fn().mockResolvedValue({
      data: { ...mockSweets[0], quantity: 9 },
    })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    })

    const purchaseButtons = screen.getAllByRole('button', { name: /purchase/i })
    await user.click(purchaseButtons[0])

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/sweets/1/purchase')
    })

    await waitFor(() => {
      expect(screen.getByText(/stock: 9/i)).toBeInTheDocument()
    })
  })

  it('handles out of stock scenario', async () => {
    const user = userEvent.setup()
    localStorage.setItem('token', createUserToken())
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', email: 'user@test.com' }))

    const mockSweets = [
      {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 1,
      },
    ]

    apiClient.get = vi.fn().mockResolvedValue({ data: mockSweets })
    apiClient.post = vi.fn().mockRejectedValue({
      response: {
        status: 400,
        data: { message: 'Sweet out of stock' },
      },
    })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    })

    const purchaseButtons = screen.getAllByRole('button', { name: /purchase/i })
    await user.click(purchaseButtons[0])

    await waitFor(() => {
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})

