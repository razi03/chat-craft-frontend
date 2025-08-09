/**
 * Form validation utility functions
 */
import type { BusinessInfo, FormErrors } from '@/types'

export const validateUrl = (url: string): boolean => {
  if (!url) return true // URL is optional
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateBusinessForm = (data: Partial<BusinessInfo>): FormErrors => {
  const errors: FormErrors = {}
  
  // Business name validation
  if (!data.name?.trim()) {
    errors.name = 'Business name is required'
  } else if (data.name.length > 80) {
    errors.name = 'Business name must be 80 characters or less'
  }
  
  // Description validation
  if (!data.description?.trim()) {
    errors.description = 'Business description is required'
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters'
  } else if (data.description.length > 300) {
    errors.description = 'Description must be 300 characters or less'
  }
  
  // Website URL validation
  if (data.website_url && !validateUrl(data.website_url)) {
    errors.website_url = 'Please enter a valid URL (e.g., https://example.com)'
  }
  
  // Tone validation
  if (!data.tone) {
    errors.tone = 'Please select a tone for your chatbot'
  }
  
  // FAQs validation
  if (!data.faqs || data.faqs.length === 0) {
    errors.faqs = 'Please add at least one FAQ'
  } else {
    const invalidFaqs = data.faqs.some(faq => !faq.q?.trim() || !faq.a?.trim())
    if (invalidFaqs) {
      errors.faqs = 'All FAQs must have both question and answer'
    }
  }
  
  return errors
}

export const parseFaqText = (text: string): Array<{ q: string; a: string }> => {
  if (!text.trim()) return []
  
  try {
    // Try parsing as JSON first
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item.q && item.a)
    }
  } catch {
    // Not JSON, try parsing as plain text
  }
  
  // Parse as plain text (one Q/A per line)
  const lines = text.split('\n').filter(line => line.trim())
  const faqs: Array<{ q: string; a: string }> = []
  
  for (let i = 0; i < lines.length; i += 2) {
    const question = lines[i]?.trim()
    const answer = lines[i + 1]?.trim()
    
    if (question && answer) {
      faqs.push({
        q: question.replace(/^Q:?\s*/i, ''),
        a: answer.replace(/^A:?\s*/i, '')
      })
    }
  }
  
  return faqs
}

export const formatFaqsForDisplay = (faqs: Array<{ q: string; a: string }>): string => {
  return faqs.map(faq => `Q: ${faq.q}\nA: ${faq.a}`).join('\n\n')
}