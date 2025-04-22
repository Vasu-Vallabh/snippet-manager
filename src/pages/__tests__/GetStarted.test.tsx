import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/test-utils'
import GetStarted from '../GetStarted'

describe('GetStarted Page', () => {
  it('renders main heading and CTA', () => {
    renderWithRouter(<GetStarted />)
    
    expect(screen.getByText(/Start Your Journey/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Create Account/i })).toBeInTheDocument()
  })

  it('displays all step cards', () => {
    renderWithRouter(<GetStarted />)
    
    expect(screen.getByText('Create an Account')).toBeInTheDocument()
    expect(screen.getByText('Create Your First Snippet')).toBeInTheDocument()
    expect(screen.getByText('Organize with Tags')).toBeInTheDocument()
  })

  it('shows FAQ section with expandable items', async () => {
    renderWithRouter(<GetStarted />)
    const user = userEvent.setup()
    
    // Check FAQ section title
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
    
    // Check all FAQ questions are present
    expect(screen.getByText('How do I save a snippet?')).toBeInTheDocument()
    expect(screen.getByText('Can I share my snippets with others?')).toBeInTheDocument()
    expect(screen.getByText('What programming languages are supported?')).toBeInTheDocument()
    expect(screen.getByText('Is there a limit to how many snippets I can save?')).toBeInTheDocument()

    // Test accordion functionality
    const firstQuestion = screen.getByText('How do I save a snippet?')
    await user.click(firstQuestion)
    
    // Answer should be visible after clicking
    expect(screen.getByText(/Click the 'New Snippet' button/i)).toBeInTheDocument()
  })
})