import { generate } from 'multiple-cucumber-html-reporter';

/**
 * Generates HTML report from merged Cucumber JSON reports.
 * 
 * This script:
 * - Reads merged JSON report from target/site/cypress/unified/
 * - Generates professional HTML report using multiple-cucumber-html-reporter
 * - Includes metadata (browser, device, platform)
 * - Includes custom project information
 * - Uses timestamp in report name to avoid overwriting
 * 
 * Requirements: 9.1-9.6, 60.1-60.5, 77.1-77.4
 */
export async function generateHTMLReport(): Promise<void> {
  // Generate timestamp in ISO format with special characters replaced
  // Format: YYYY-MM-DDTHH-MM-SS-mmmZ
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  console.log('Generating HTML report...');
  
  // Generate HTML report using multiple-cucumber-html-reporter
  generate({
    // Directory containing the merged JSON report
    jsonDir: 'target/site/cypress/unified',
    
    // Output directory for HTML report
    reportPath: 'target/site/cypress/',
    
    // Report name with timestamp to avoid overwriting
    reportName: `cucumber-report-${timestamp}.html`,
    
    // Page title displayed in browser tab
    pageTitle: 'Playwright + Cucumber Test Report',
    
    // Display test execution duration
    displayDuration: true,
    
    // Metadata about the test execution environment
    metadata: {
      browser: {
        name: process.env.BROWSER || 'chrome',
        version: 'latest'
      },
      device: process.env.ltDevice === 'true' ? 'LambdaTest Cloud' : 'Local',
      platform: {
        name: process.platform,
        version: process.version
      }
    },
    
    // Custom project information
    customData: {
      title: 'Test Execution Report',
      data: [
        { label: 'Project', value: 'devsu-qa-playwrigth-api-e2e' },
        { label: 'Environment', value: process.env.ENV || 'dev' },
        { label: 'Execution Date', value: new Date().toLocaleString() },
        { label: 'Base URL', value: process.env.BASEURL || 'N/A' }
      ]
    }
  });
  
  console.log(`HTML report generated successfully: cucumber-report-${timestamp}.html`);
  console.log('Report location: target/site/cypress/');
}

// Execute report generation if this file is run directly
if (require.main === module) {
  generateHTMLReport().catch(error => {
    console.error('Error generating HTML report:', error);
    process.exit(1);
  });
}
