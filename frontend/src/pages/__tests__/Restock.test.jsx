import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import AdminDashboard from '../AdminDashboard'
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

function createAdminToken() {
  const adminPayload = { userId: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }
  return `header.${btoa(JSON.stringify(adminPayload))}.signature`
}

describe('Restock Sweet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', createAdminToken())
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Admin', email: 'admin@test.com' }))
  })

  it('admin can restock a sweet', async () => {
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

    apiClient.get = vi.fn().mockResolvedValue({ data: mockSweets })
    apiClient.post = vi.fn().mockResolvedValue({
      data: { ...mockSweets[0], quantity: 20 },
    })

    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    })

    const restockButtons = screen.getAllByRole('button', { name: /restock/i })
    await user.click(restockButtons[0])

    const quantityInput = screen.getByLabelText(/quantity/i)
    await user.type(quantityInput, '10')
    
    const form = quantityInput.closest('form')
    await user.click(form.querySelector('button[type="submit"]'))

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/sweets/1/restock', {
        quantity: 10,
      })
    })
  })

  it('blocks non-admin user from restocking', () => {
    const userPayload = { userId: '1', role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 }
    const userToken = `header.${btoa(JSON.stringify(userPayload))}.signature`
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', email: 'user@test.com' }))

    renderWithRouter(<AdminDashboard />)

    expect(mockNavigate).toHaveBeenCalledWith('/sweets')
  })
})


