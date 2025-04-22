import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders landing page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Your Code Snippets/i)).toBeInTheDocument()
  })

  it('renders about page on /about route', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/About Snippet Manager/i)).toBeInTheDocument()
  })

  it('renders contact page on /contact route', () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument()
  })

  it('renders get started page on /get-started route', () => {
    render(
      <MemoryRouter initialEntries={['/get-started']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Start Your Journey/i)).toBeInTheDocument()
  })

  it('renders account page on /account route', () => {
    render(
      <MemoryRouter initialEntries={['/account']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument()
  })
})