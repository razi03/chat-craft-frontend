/**
 * Chatbot API service functions
 */
import { apiClient } from './api'
import type { 
  CreateChatbotRequest, 
  CreateChatbotResponse, 
  ChatRequest, 
  ChatResponse, 
  ChatbotInfo 
} from '@/types'

/**
 * Create a new chatbot
 */
export const createChatbot = async (data: CreateChatbotRequest): Promise<CreateChatbotResponse> => {
  const response = await apiClient.post<CreateChatbotResponse>('/chatbot/create', data)
  return response.data
}

/**
 * Send a message to a chatbot and get a response
 */
export const sendMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>('/chatbot/respond', data)
  return response.data
}

/**
 * Get chatbot information by ID (optional endpoint)
 */
export const getChatbotInfo = async (chatbotId: string): Promise<ChatbotInfo> => {
  const response = await apiClient.get<ChatbotInfo>(`/chatbot/${chatbotId}`)
  return response.data
}

// Mock functions for development/testing when backend is not available
export const mockCreateChatbot = async (data: CreateChatbotRequest): Promise<CreateChatbotResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    chatbot_id: `mock-${Date.now()}`,
    embed_script_url: `${window.location.origin}/widget.js`,
    created_at: new Date().toISOString(),
    config: {
      ...data,
      bot_display_name: data.name,
    }
  }
}

export const mockSendMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  // Simulate typing delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const responses = [
    "Thank you for your message! I'm here to help with any questions about our business.",
    "I'd be happy to assist you. Can you provide more details about what you're looking for?",
    "That's a great question! Let me help you with that information.",
    "Hello! Welcome to our chat. How can I assist you today?",
    "I understand your inquiry. Based on our business information, here's what I can tell you...",
  ]
  
  return {
    reply: responses[Math.floor(Math.random() * responses.length)],
    meta: {
      confidence: 0.85 + Math.random() * 0.15
    }
  }
}

export const mockGetChatbotInfo = async (chatbotId: string): Promise<ChatbotInfo> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    chatbot_id: chatbotId,
    name: "Demo Store Bot",
    description: "A helpful assistant for our online store",
    tone: "friendly",
    faqs: [
      { q: "What are your hours?", a: "We're open 9 AM to 6 PM, Monday through Saturday." },
      { q: "Do you offer shipping?", a: "Yes, we offer worldwide shipping with tracking." }
    ]
  }
}