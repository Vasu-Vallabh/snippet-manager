import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/test-utils'
import Account from '../Account'
import * as firebase from 'firebase/auth'

// Mock Firebase auth functions
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth') as typeof firebase
  return {
    ...actual,
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    GithubAuthProvider: vi.fn(),
  }
})

describe('Account Page', () => {
  const mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => ({
    ...await vi.importActual('react-router-dom'),
    useNavigate: () => mockNavigate
  }))

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign in and sign up tabs', () => {
    renderWithRouter(<Account />)
    
    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument()
  })

  it('validates sign up form fields', async () => {
    renderWithRouter(<Account />)
    const user = userEvent.setup()

    // Switch to sign up tab
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    
    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /create account/i }))

    // Check validation messages
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('validates password match in sign up', async () => {
    renderWithRouter(<Account />)
    const user = userEvent.setup()

    // Switch to sign up tab
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    
    // Fill form with mismatched passwords
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password456')
    
    await user.click(screen.getByRole('button', { name: /create account/i }))

    // Check validation message
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('handles successful sign up', async () => {
    const mockCreateUser = vi.mocked(firebase.createUserWithEmailAndPassword)
    mockCreateUser.mockResolvedValueOnce({} as any)

    renderWithRouter(<Account />)
    const user = userEvent.setup()

    // Switch to sign up tab
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    
    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    
    await user.click(screen.getByRole('button', { name: /create account/i }))

    // Verify Firebase was called and navigation occurred
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles successful sign in', async () => {
    const mockSignIn = vi.mocked(firebase.signInWithEmailAndPassword)
    mockSignIn.mockResolvedValueOnce({} as any)

    renderWithRouter(<Account />)
    const user = userEvent.setup()
    
    // Fill sign in form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    // Verify Firebase was called and navigation occurred
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles social sign in', async () => {
    const mockSignInWithPopup = vi.mocked(firebase.signInWithPopup)
    mockSignInWithPopup.mockResolvedValueOnce({} as any)

    renderWithRouter(<Account />)
    const user = userEvent.setup()
    
    // Click Google sign in
    await user.click(screen.getByRole('button', { name: /google/i }))

    // Verify Firebase was called and navigation occurred
    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles sign in error', async () => {
    const mockSignIn = vi.mocked(firebase.signInWithEmailAndPassword)
    mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'))

    renderWithRouter(<Account />)
    const user = userEvent.setup()
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    // Verify error is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})