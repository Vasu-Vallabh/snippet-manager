import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import About from '../About'

describe('About Page', () => {
  it('renders the page title and subtitle', () => {
    renderWithRouter(<About />)
    
    expect(screen.getByText(/About/i)).toBeInTheDocument()
    expect(screen.getByText(/Empowering developers/i)).toBeInTheDocument()
  })

  it('displays mission and why choose us sections', () => {
    renderWithRouter(<About />)
    
    expect(screen.getByText('Our Mission')).toBeInTheDocument()
    expect(screen.getByText('Why Choose Us')).toBeInTheDocument()
  })

  it('shows team section', () => {
    renderWithRouter(<About />)
    
    expect(screen.getByText('Our Team')).toBeInTheDocument()
    expect(screen.getByText(/We're a passionate team/i)).toBeInTheDocument()
  })
})