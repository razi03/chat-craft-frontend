/**
 * Unit tests for EmbedCodeCard component
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import EmbedCodeCard from '@/components/EmbedCodeCard'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
})

const mockChatbotData = {
  chatbot_id: 'test-123',
  embed_script_url: 'https://api.example.com/widget.js',
  created_at: '2024-01-01T00:00:00Z',
  config: {}
}

describe('EmbedCodeCard', () => {
  it('renders chatbot data correctly', () => {
    render(<EmbedCodeCard chatbotData={mockChatbotData} />)
    
    expect(screen.getByText(/chatbot created successfully/i)).toBeInTheDocument()
    expect(screen.getByText(/test-123/)).toBeInTheDocument()
  })

  it('shows embed code tabs', () => {
    render(<EmbedCodeCard chatbotData={mockChatbotData} />)
    
    expect(screen.getByText('Script Tag')).toBeInTheDocument()
    expect(screen.getByText('iFrame')).toBeInTheDocument()
    expect(screen.getByText('Manual')).toBeInTheDocument()
  })

  it('copies embed code to clipboard', async () => {
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText')
    
    render(<EmbedCodeCard chatbotData={mockChatbotData} />)
    
    const copyButton = screen.getByText(/copy script/i)
    fireEvent.click(copyButton)
    
    expect(writeTextSpy).toHaveBeenCalledWith(
      expect.stringContaining('data-chatbot-id="test-123"')
    )
  })
})