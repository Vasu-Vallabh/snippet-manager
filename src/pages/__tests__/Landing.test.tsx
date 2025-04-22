import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import Landing from '../Landing'

describe('Landing Page', () => {
  it('renders hero section with title and CTA', () => {
    renderWithRouter(<Landing />)
    
    expect(screen.getByText(/Your Code Snippets/i)).toBeInTheDocument()
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument()
  })

  it('displays all feature cards', () => {
    renderWithRouter(<Landing />)
    
    expect(screen.getByText('Save Snippets')).toBeInTheDocument()
    expect(screen.getByText('Syntax Highlighting')).toBeInTheDocument()
    expect(screen.getByText('Share Easily')).toBeInTheDocument()
    expect(screen.getByText('Organize by Tags')).toBeInTheDocument()
  })

  it('includes navigation links', () => {
    renderWithRouter(<Landing />)
    
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument()
  })
})