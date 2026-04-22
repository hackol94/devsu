/**
 * Post-Test Report Orchestrator
 * 
 * This script is executed automatically after test runs via the "posttest" npm script.
 * It chains the two report generation steps:
 *   1. mergeReports  → combines all json-report-*.json into unified/merged-cucumber-report.json
 *   2. generateHTMLReport → reads the unified JSON and produces the HTML report
 */

import { mergeReports } from './mergeReports';
import { generateHTMLReport } from './report';

async function run(): Promise<void> {
  console.log('\n========================================');
  console.log('  Post-Test Report Generation');
  console.log('========================================\n');

  // Step 1: Merge JSON reports
  console.log('[1/2] Merging Cucumber JSON reports...');
  await mergeReports();

  // Step 2: Generate HTML report from merged JSON
  console.log('\n[2/2] Generating HTML report...');
  await generateHTMLReport();

  console.log('\n========================================');
  console.log('  Report generation completed ✓');
  console.log('========================================\n');
}

run().catch(error => {
  console.error('Report generation failed:', error);
  // Exit with 0 so a report failure does not mask the actual test result
  process.exit(0);
});
