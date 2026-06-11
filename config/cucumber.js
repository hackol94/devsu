/**
 * Cucumber Configuration
 * 
 * This file contains the configuration for Cucumber test execution.
 * It defines paths, formatters, and execution options.
 */

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

module.exports = {
  default: {
    // Paths to step definitions and hooks
    require: [
      'src/test/steps/**/*.ts',
      'src/hooks/hooks.ts'
    ],
    
    // Module loader for TypeScript
    requireModule: ['ts-node/register'],
    
    // Output formatters
    format: [
      'progress-bar',
      `json:target/site/cypress/json-report-${timestamp}.json`,
      `html:target/site/cypress/html-report-${timestamp}.html`,
      'rerun:@rerun.txt'
    ],
    
    // Format options
    formatOptions: {
      snippetInterface: 'async-await'
    },
    
    // Paths to feature files
    paths: ['src/test/features/**/*.feature'],
    
    // Suppress publish banner
    publishQuiet: true,
    
    // Dry run mode (false = execute tests)
    dryRun: false,
    
    // Parallel execution (1 = sequential)
    parallel: 1,
    
    // Retry failed scenarios
    retry: 0
  },
  
  // Configuration for rerun profile
  rerun: {
    require: [
      'src/test/steps/**/*.ts',
      'src/hooks/hooks.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      `json:target/site/cypress/json-report-rerun-${timestamp}.json`,
      `html:target/site/cypress/html-report-rerun-${timestamp}.html`
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    dryRun: false,
    parallel: 1
  }
};

// Support for tag filtering via npm config
// Usage: npm test --TAGS="@smoke"
if (process.env.npm_config_TAGS) {
  module.exports.default.tags = process.env.npm_config_TAGS;
  module.exports.rerun.tags = process.env.npm_config_TAGS;
}
