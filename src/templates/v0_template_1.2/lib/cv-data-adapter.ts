import { initialData, type PortfolioData } from "./data"

// Define a simplified CV2WebData type based on usage in the adapter
// In a real scenario, this would be a more robust, shared type definition.
interface CV2WebData {
  hero?: any
  contact?: any
  summary?: { summaryText?: string }
  experience?: { sectionTitle?: string; experienceItems?: any[] }
  education?: { sectionTitle?: string; educationItems?: any[] }
  // Add other sections as needed based on the full CV data structure
}

// A mock function to simulate fetching data.
// Replace this with your actual API call.
async function fetchCVDataFromServer(sessionId: string): Promise<CV2WebData> {
  console.log(`Fetching CV data for session: ${sessionId}`)
  // This is where you would make a `fetch` call to your backend API.
  // For demonstration, we'll return a structure that can be adapted.
  // We'll return the initialData structure itself, wrapped to look like CV data.
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
  return {
    hero: initialData.hero,
    contact: initialData.contact,
    summary: initialData.summary,
    experience: initialData.experience,
    education: initialData.education,
  }
}

/**
 * Adapts the raw CV data to the PortfolioData format.
 * This is a simplified version based on the provided adapter logic.
 */
export function adaptCV2WebToTemplate(cv2webData: CV2WebData): PortfolioData {
  // This function should contain the logic to map fields from cv2webData
  // to the PortfolioData structure. For this example, we'll assume the fetched
  // data is already close to the target format and merge it with initialData
  // to ensure all fields are present.
  return {
    ...initialData, // Start with default data
    ...cv2webData, // Override with fetched data
    hero: { ...initialData.hero, ...cv2webData.hero },
    contact: { ...initialData.contact, ...cv2webData.contact },
    summary: { ...initialData.summary, ...cv2webData.summary },
    experience: { ...initialData.experience, ...cv2webData.experience },
    education: { ...initialData.education, ...cv2webData.education },
  }
}

/**
 * Fetches the latest CV data and adapts it for the portfolio.
 */
export async function fetchLatestCVData(sessionId: string): Promise<PortfolioData> {
  const rawCVData = await fetchCVDataFromServer(sessionId)
  return adaptCV2WebToTemplate(rawCVData)
}
