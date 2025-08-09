/**
 * Unit tests for BusinessForm component
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import BusinessForm from '@/components/BusinessForm'

const mockOnSubmit = vi.fn()

describe('BusinessForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders form fields correctly', () => {
    render(<BusinessForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/business description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/chatbot tone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/frequently asked questions/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<BusinessForm onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /create chatbot/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/business name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    render(<BusinessForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: 'Test Business' }
    })
    fireEvent.change(screen.getByLabelText(/business description/i), {
      target: { value: 'A test business description that is long enough' }
    })
    
    const faqTextarea = screen.getByLabelText(/frequently asked questions/i)
    fireEvent.change(faqTextarea, {
      target: { value: 'Q: Test question?\nA: Test answer.' }
    })
    
    const submitButton = screen.getByRole('button', { name: /create chatbot/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Business',
          description: 'A test business description that is long enough',
          tone: 'friendly',
          faqs: expect.arrayContaining([
            expect.objectContaining({
              q: 'Test question?',
              a: 'Test answer.'
            })
          ])
        })
      )
    })
  })
})