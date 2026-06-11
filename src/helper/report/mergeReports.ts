import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface representing a Cucumber JSON report feature
 */
interface CucumberReport {
  description: string;
  elements: CucumberScenario[];
  id: string;
  keyword: string;
  line: number;
  name: string;
  tags: any[];
  uri: string;
}

/**
 * Interface representing a Cucumber scenario
 */
interface CucumberScenario {
  name: string;
  steps?: CucumberStep[];
  [key: string]: any;
}

/**
 * Interface representing a Cucumber step
 */
interface CucumberStep {
  embeddings?: CucumberEmbedding[];
  [key: string]: any;
}

/**
 * Interface representing an embedding (screenshot, attachment, etc.)
 */
interface CucumberEmbedding {
  mime_type: string;
  data: string;
}

/**
 * Merges multiple Cucumber JSON reports into a single unified report.
 * 
 * This function:
 * - Reads all json-report-*.json files from the reports directory
 * - Merges features by description
 * - Merges scenarios by name within each feature (keeping the latest execution)
 * - Cleans embeddings to keep only PNG and JPEG images
 * - Writes the merged report to unified/merged-cucumber-report.json
 * 
 * Requirements: 9.7, 44.1-44.7
 */
export async function mergeReports(): Promise<void> {
  const reportsDir = 'target/site/cypress';
  const outputDir = 'target/site/cypress/unified';
  
  // Read all JSON report files matching the pattern json-report-*.json
  const files = fs.readdirSync(reportsDir)
    .filter(file => file.startsWith('json-report-') && file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('No reports to merge');
    return;
  }
  
  console.log(`Found ${files.length} report(s) to merge`);
  
  // Map to store merged features, keyed by feature description
  const mergedFeatures: Map<string, CucumberReport> = new Map();
  
  // Process each report file
  for (const file of files) {
    try {
      const filePath = path.join(reportsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const reports: CucumberReport[] = JSON.parse(content);
      
      console.log(`Processing ${file} with ${reports.length} feature(s)`);
      
      // Process each feature in the report
      for (const feature of reports) {
        // Use description as the primary key, fallback to name if description is empty
        const featureKey = feature.description || feature.name;
        
        if (mergedFeatures.has(featureKey)) {
          // Feature already exists, merge scenarios
          const existingFeature = mergedFeatures.get(featureKey)!;
          
          // Create a map of existing scenarios by name
          const scenarioMap = new Map(
            existingFeature.elements.map(el => [el.name, el])
          );
          
          // Add or replace scenarios from the current feature
          // This ensures the latest execution data is preserved
          for (const scenario of feature.elements) {
            scenarioMap.set(scenario.name, scenario);
          }
          
          // Update the feature's elements with the merged scenarios
          existingFeature.elements = Array.from(scenarioMap.values());
        } else {
          // New feature, add it to the map
          mergedFeatures.set(featureKey, feature);
        }
      }
    } catch (error) {
      // Handle JSON parsing errors without interrupting the process
      console.error(`Error processing file ${file}:`, error);
      // Continue processing other files
    }
  }
  
  // Convert the map to an array for output
  const mergedArray = Array.from(mergedFeatures.values());
  
  // Clean embeddings - keep only PNG and JPEG images
  console.log('Cleaning embeddings...');
  for (const feature of mergedArray) {
    for (const scenario of feature.elements) {
      if (scenario.steps) {
        for (const step of scenario.steps) {
          if (step.embeddings && Array.isArray(step.embeddings)) {
            // Filter embeddings to keep images and text attachments
            const originalCount = step.embeddings.length;
            step.embeddings = step.embeddings.filter((emb: CucumberEmbedding) => 
              emb.mime_type === 'image/png' || 
              emb.mime_type === 'image/jpeg' ||
              emb.mime_type === 'text/plain' ||
              emb.mime_type === 'text/html' ||
              emb.mime_type === 'application/json'
            );
            
            if (originalCount !== step.embeddings.length) {
              console.log(`Filtered ${originalCount - step.embeddings.length} non-image embedding(s)`);
            }
          }
        }
      }
    }
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write merged report to output file
  const outputPath = path.join(outputDir, 'merged-cucumber-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(mergedArray, null, 2));
  
  console.log(`Successfully merged ${files.length} report(s) into ${outputPath}`);
  console.log(`Total features: ${mergedArray.length}`);
  console.log(`Total scenarios: ${mergedArray.reduce((sum, f) => sum + f.elements.length, 0)}`);
}

// Execute merge if this file is run directly
if (require.main === module) {
  mergeReports().catch(error => {
    console.error('Error merging reports:', error);
    process.exit(1);
  });
}
