const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

module.exports = {
  default: {
    require: [
      'src/test/steps/**/*.ts',
      'src/hooks/hooks.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      `json:target/site/cypress/json-report-${timestamp}.json`,
      `html:target/site/cypress/html-report-${timestamp}.html`,
      'rerun:@rerun.txt'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    paths: ['src/test/features/**/*.feature'],
    publishQuiet: true,
    dryRun: false,
    parallel: 1
  },
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
if (process.env.npm_config_TAGS) {
  module.exports.default.tags = process.env.npm_config_TAGS;
  module.exports.rerun.tags = process.env.npm_config_TAGS;
}
