import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import AdminDashboard from '../AdminDashboard'
import apiClient from '../../lib/api'

vi.mock('../../lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

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

describe('Admin CRUD Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', createAdminToken())
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Admin', email: 'admin@test.com' }))
    window.confirm = vi.fn(() => true)
  })

  it('admin can add a new sweet', async () => {
    const user = userEvent.setup()
    const mockSweet = {
      id: '1',
      name: 'New Sweet',
      category: 'Candy',
      price: 2.99,
      quantity: 10,
    }

    apiClient.get.mockResolvedValue({ data: [] })
    apiClient.post.mockResolvedValue({ data: mockSweet })

    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument()
    }, { timeout: 3000 })

    const addButton = screen.getByRole('button', { name: /add sweet/i })
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/name/i)
    const categoryInput = screen.getByLabelText(/category/i)
    const priceInput = screen.getByLabelText(/price/i)
    const quantityInput = screen.getByLabelText(/quantity/i)

    await user.type(nameInput, 'New Sweet')
    await user.type(categoryInput, 'Candy')
    await user.type(priceInput, '2.99')
    await user.type(quantityInput, '10')
    
    const form = nameInput.closest('form')
    await user.click(form.querySelector('button[type="submit"]'))

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/sweets', expect.objectContaining({
        name: 'New Sweet',
        category: 'Candy',
      }))
    })
  })

  it('blocks non-admin user from adding sweet', () => {
    const userPayload = { userId: '1', role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 }
    const userToken = `header.${btoa(JSON.stringify(userPayload))}.signature`
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', email: 'user@test.com' }))

    renderWithRouter(<AdminDashboard />)

    expect(mockNavigate).toHaveBeenCalledWith('/sweets')
  })

  it('admin can update a sweet', async () => {
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

    apiClient.get.mockResolvedValue({ data: mockSweets })
    apiClient.put.mockResolvedValue({ data: { ...mockSweets[0], price: 6.99 } })

    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    }, { timeout: 3000 })

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    const editButton = editButtons[0]
    await user.click(editButton)

    const priceInput = screen.getByLabelText(/price/i)
    await user.clear(priceInput)
    await user.type(priceInput, '6.99')
    await user.click(screen.getByRole('button', { name: /update sweet/i }))

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith('/sweets/1', expect.objectContaining({
        price: 6.99,
      }))
    })
  })

  it('admin can delete a sweet', async () => {
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

    apiClient.get.mockResolvedValue({ data: mockSweets })
    apiClient.delete.mockResolvedValue({ data: { message: 'Sweet deleted successfully' } })

    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    }, { timeout: 3000 })

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    const deleteButton = deleteButtons[0]
    await user.click(deleteButton)

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/sweets/1')
    })
  })
})

