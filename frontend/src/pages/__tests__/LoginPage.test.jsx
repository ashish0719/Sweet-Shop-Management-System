import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'
import apiClient from '../../lib/api'

vi.mock('../../lib/api')

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders login form with email and password fields', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('successfully logs in with valid credentials', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      token: 'test-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    }

    apiClient.post = vi.fn().mockResolvedValue({ data: mockResponse })

    renderWithRouter(<LoginPage />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      })
    })

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token')
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user))
    })
  })

  it('displays error on invalid credentials', async () => {
    const user = userEvent.setup()

    apiClient.post = vi.fn().mockRejectedValue({
      response: {
        status: 401,
        data: { message: 'Invalid credentials' },
      },
    })

    renderWithRouter(<LoginPage />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})

