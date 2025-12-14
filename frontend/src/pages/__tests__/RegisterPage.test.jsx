import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import RegisterPage from '../RegisterPage'
import apiClient from '../../lib/api'

vi.mock('../../lib/api')

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders register form with name, email and password fields', () => {
    renderWithRouter(<RegisterPage />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('successfully registers with valid data', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      user: {
        id: '1',
        name: 'New User',
        email: 'new@example.com',
      },
    }

    apiClient.post = vi.fn().mockResolvedValue({ data: mockResponse })

    renderWithRouter(<RegisterPage />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const registerButton = screen.getByRole('button', { name: /register/i })

    await user.type(nameInput, 'New User')
    await user.type(emailInput, 'new@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(registerButton)

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      })
    })
  })

  it('displays error on duplicate email', async () => {
    const user = userEvent.setup()

    apiClient.post = vi.fn().mockRejectedValue({
      response: {
        status: 409,
        data: { message: 'Email already registered' },
      },
    })

    renderWithRouter(<RegisterPage />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const registerButton = screen.getByRole('button', { name: /register/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(registerButton)

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument()
    })
  })
})

