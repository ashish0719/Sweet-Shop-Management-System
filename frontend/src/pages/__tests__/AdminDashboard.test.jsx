import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminDashboard from '../AdminDashboard'

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

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('allows admin to access dashboard', async () => {
    const adminPayload = { userId: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }
    const adminToken = `header.${btoa(JSON.stringify(adminPayload))}.signature`
    localStorage.setItem('token', adminToken)
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Admin', email: 'admin@test.com' }))

    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument()
    })
  })

  it('blocks non-admin user from accessing dashboard', () => {
    const regularUser = { id: '1', name: 'User', email: 'user@test.com', role: 'user' }
    localStorage.setItem('token', 'user-token')
    localStorage.setItem('user', JSON.stringify(regularUser))

    renderWithRouter(<AdminDashboard />)

    expect(mockNavigate).toHaveBeenCalledWith('/sweets')
  })

  it('redirects to login if not authenticated', () => {
    localStorage.clear()

    renderWithRouter(<AdminDashboard />)

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})

