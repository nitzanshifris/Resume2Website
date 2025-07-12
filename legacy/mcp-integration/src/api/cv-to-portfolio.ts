// CV to Portfolio API - Integrates with existing CV2WEB pipeline
import { PortfolioGenerator } from '../services/portfolio-generator';
import { CVData, PortfolioStyle, PortfolioConfig } from '../types/portfolio.types';
import fs from 'fs/promises';
import path from 'path';

export class CVToPortfolioAPI {
  private generator: PortfolioGenerator;
  
  constructor() {
    this.generator = new PortfolioGenerator();
  }
  
  /**
   * Main entry point - connects to existing CV extraction pipeline
   */
  async generatePortfolioFromCV(
    cvDataPath: string,
    outputDir: string,
    config: PortfolioConfig
  ): Promise<{ success: boolean; portfolioPath?: string; error?: string }> {
    try {
      // 1. Read CV data from extraction pipeline
      const cvDataRaw = await fs.readFile(cvDataPath, 'utf-8');
      const cvData: CVData = JSON.parse(cvDataRaw);
      
      // 2. Validate CV data
      if (!this.validateCVData(cvData)) {
        return { success: false, error: 'Invalid CV data format' };
      }
      
      // 3. Generate portfolio code
      const portfolioCode = await this.generator.generatePortfolio(cvData, config);
      
      // 4. Create portfolio directory structure
      const portfolioDir = path.join(outputDir, `portfolio-${config.style}`);
      await this.createPortfolioStructure(portfolioDir, cvData, portfolioCode);
      
      // 5. Return success with path
      return { 
        success: true, 
        portfolioPath: portfolioDir 
      };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Batch generation for multiple styles
   */
  async generateMultiplePortfolios(
    cvDataPath: string,
    outputDir: string,
    styles: PortfolioStyle[]
  ): Promise<Array<{ style: PortfolioStyle; result: any }>> {
    const results = [];
    
    for (const style of styles) {
      const config: PortfolioConfig = {
        style,
        colorScheme: 'auto',
        fontScale: 1.2, // Slightly larger text as discussed
        spacing: 'normal',
        animations: true
      };
      
      const result = await this.generatePortfolioFromCV(
        cvDataPath,
        outputDir,
        config
      );
      
      results.push({ style, result });
    }
    
    return results;
  }
  
  private validateCVData(data: any): data is CVData {
    return (
      data.hero?.fullName &&
      data.contact?.email &&
      data.experience?.experienceItems &&
      data.education?.educationItems &&
      data.skills?.skillCategories
    );
  }
  
  private async createPortfolioStructure(
    portfolioDir: string,
    cvData: CVData,
    portfolioCode: string
  ): Promise<void> {
    // Create directory
    await fs.mkdir(portfolioDir, { recursive: true });
    await fs.mkdir(path.join(portfolioDir, 'app'), { recursive: true });
    
    // Write CV data
    await fs.writeFile(
      path.join(portfolioDir, 'cv-data.json'),
      JSON.stringify(cvData, null, 2)
    );
    
    // Write portfolio page
    await fs.writeFile(
      path.join(portfolioDir, 'app', 'page.tsx'),
      portfolioCode
    );
    
    // Copy configuration files
    const configFiles = [
      'package.json',
      'tsconfig.json',
      'tailwind.config.ts',
      'next.config.js',
      'postcss.config.mjs'
    ];
    
    // These would be copied from a template directory
    // For now, using the existing portfolio structure
  }
}

// Example usage that connects to existing pipeline
export async function connectToExistingPipeline(pdfPath: string): Promise<void> {
  const api = new CVToPortfolioAPI();
  
  // 1. First use existing extraction (from test_comprehensive_portfolio_generation)
  // This would call your existing Python extraction script
  const extractedDataPath = '/tmp/extracted_cv_data.json';
  
  // 2. Generate portfolios with design rules applied
  const styles = [
    PortfolioStyle.MINIMALIST,
    PortfolioStyle.RETRO_CYBERPUNK,
    PortfolioStyle.CREATIVE_SHOWCASE,
    PortfolioStyle.BOLD_TYPOGRAPHY,
    PortfolioStyle.MAGAZINE_LAYOUT
  ];
  
  const results = await api.generateMultiplePortfolios(
    extractedDataPath,
    './generated-portfolios',
    styles
  );
  
  console.log('Portfolio generation results:', results);
}