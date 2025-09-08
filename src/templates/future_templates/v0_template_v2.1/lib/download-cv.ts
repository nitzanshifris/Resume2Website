/**
 * CV Download Utility
 * Handles CV file downloads with proper error handling
 */

export async function downloadCV(fileName: string = 'CV.pdf') {
  try {
    // First, check if the file exists
    const response = await fetch('/Emma-Wilson-CV.pdf', { method: 'HEAD' });
    
    if (!response.ok) {
      console.warn('CV file not found, creating placeholder');
      // If no CV file exists, you could generate one or show a message
      // For now, we'll just log a warning
      throw new Error('CV file not available');
    }
    
    // If file exists, proceed with download
    const link = document.createElement('a');
    link.href = '/Emma-Wilson-CV.pdf';
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error downloading CV:', error);
    return false;
  }
}