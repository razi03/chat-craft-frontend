/**
 * Utility function to copy text to clipboard with fallback
 */

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    return success
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export const showCopyNotification = (success: boolean, text: string = '') => {
  if (success) {
    console.log('✅ Copied to clipboard:', text.substring(0, 50) + (text.length > 50 ? '...' : ''))
  } else {
    console.error('❌ Failed to copy to clipboard')
  }
}