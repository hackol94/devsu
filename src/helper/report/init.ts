/**
 * Report Directory Initialization
 * 
 * This module initializes all required directories for report generation.
 * It is executed as part of the pretest script to ensure all necessary
 * folders exist before test execution begins.
 * It also cleans up previous JSON reports to ensure a fresh report each run.
 * 
 * Requirements: 45.1-45.4
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Cleans previous JSON reports and unified directory to ensure a fresh run.
 */
function cleanPreviousReports(): void {
  const reportsDir = path.resolve('target/site/cypress');
  const unifiedDir = path.resolve('target/site/cypress/unified');

  // Delete all json-report-*.json files
  if (fs.existsSync(reportsDir)) {
    const files = fs.readdirSync(reportsDir);
    let cleaned = 0;
    for (const file of files) {
      if (file.startsWith('json-report-') && file.endsWith('.json')) {
        try {
          fs.unlinkSync(path.join(reportsDir, file));
          cleaned++;
        } catch (_) {}
      }
    }
    if (cleaned > 0) console.log(`✓ Cleaned ${cleaned} old JSON report(s)`);
  }

  // Clean unified directory
  if (fs.existsSync(unifiedDir)) {
    const files = fs.readdirSync(unifiedDir);
    for (const file of files) {
      try {
        fs.unlinkSync(path.join(unifiedDir, file));
      } catch (_) {}
    }
    if (files.length > 0) console.log(`✓ Cleaned unified report directory`);
  }
}

/**
 * Initializes all required report directories
 * 
 * Creates the following directory structure:
 * - target/site/cypress/
 * - target/site/cypress/unified/
 * - target/site/cypress/logs/
 * - target/site/cypress/screenshots/
 * 
 * Handles errors gracefully without interrupting the process.
 * 
 * @returns {void}
 */
export function initializeReportDirectories(): void {
  const directories = [
    'target/site/cypress',
    'target/site/cypress/unified',
    'target/site/cypress/logs',
    'target/site/cypress/screenshots'
  ];

  console.log('Initializing report directories...');

  directories.forEach(dir => {
    try {
      const fullPath = path.resolve(dir);
      
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✓ Created directory: ${dir}`);
      } else {
        console.log(`✓ Directory already exists: ${dir}`);
      }
    } catch (error) {
      // Handle errors gracefully without interrupting (Requirement 45.4)
      console.warn(`⚠ Warning: Could not create directory ${dir}:`, error instanceof Error ? error.message : error);
    }
  });

  cleanPreviousReports();
  console.log('Report directories initialization completed.');
}

// Execute initialization when run directly
if (require.main === module) {
  initializeReportDirectories();
}
