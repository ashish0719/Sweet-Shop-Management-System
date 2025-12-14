import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import SweetsListingPage from '../SweetsListingPage'

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

describe('Purchase Auth Gate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('redirects to login when purchase button is clicked and user is unauthenticated', async () => {
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

    const apiClient = await import('../../lib/api')
    apiClient.default.get = vi.fn().mockResolvedValue({ data: mockSweets })

    renderWithRouter(<SweetsListingPage />)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    })

    const purchaseButtons = screen.getAllByRole('button', { name: /purchase/i })
    expect(purchaseButtons.length).toBeGreaterThan(0)

    await user.click(purchaseButtons[0])

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
})

