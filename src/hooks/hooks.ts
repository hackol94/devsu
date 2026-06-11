import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Page, request } from '@playwright/test';
import * as fs from 'fs';
import { BrowserManager } from '../helper/browser/BrowserManager';
import { PageFixture } from './pageFixture';
import { createLogger } from '../helper/util/logger';

// Timeout de 60 segundos para escenarios E2E
setDefaultTimeout(60000);

let fixture: PageFixture;
let browserManager: BrowserManager;

/**
 * BeforeAll Hook
 * 
 * Executes once before all scenarios.
 * Initializes environment configuration and browser manager.
 */
BeforeAll(async function() {
  const env = process.env.ENV || 'dev';
  console.log(`Initializing environment: ${env}`);
  require('dotenv').config({ path: `.env.${env}` });
  browserManager = BrowserManager.getInstance();
  console.log('Framework initialization completed');
});

/**
 * Before Hook
 * 
 * Executes before each scenario.
 */
Before(async function({ pickle }) {
  const scenarioName = pickle.name;
  const scenarioId = pickle.id;
  const tags = pickle.tags.map(tag => tag.name);
  
  // Check if scenario requires browser
  const requiresBrowser = tags.some(tag => tag.includes('@layer:Frontend'));
  const logger = createLogger(scenarioName, scenarioId);
  
  if (requiresBrowser) {
    const browserType = process.env.BROWSER || 'chrome_latest';
    await browserManager.launchBrowser(browserType);
    
    if (!browserManager.browser || !browserManager.context || !browserManager.page) {
      throw new Error('Failed to launch browser');
    }

    // Configure viewport if enabled
    if (process.env.viewPort === 'true') {
      const width = parseInt(process.env.viewPort_width || '1280');
      const height = parseInt(process.env.viewPort_height || '720');
      await browserManager.page.setViewportSize({ width, height });
    }

    fixture = new PageFixture(
      browserManager.page,
      browserManager.context,
      browserManager.browser,
      logger
    );
    
    // Network capture desactivado para evitar ruido en consola
    // await setupNetworkCapture(browserManager.page, this, tags.find(tag => tag.startsWith('@TEST_'))?.replace('@', '') || null);
  } else {
    // API ONLY: Use request context from playwright directly
    const apiContext = await request.newContext();
    fixture = new PageFixture(
      { request: apiContext } as any,
      null as any,
      null as any,
      logger
    );
  }
  
  fixture.resetState();
  fixture.pickle = pickle;
  fixture.testId = tags.find(tag => tag.startsWith('@TEST_'))?.replace('@', '') || null;
  
  logger.info(`Starting scenario: ${scenarioName}`);
});

/**
 * After Hook
 */
After(async function({ pickle, result }) {
  const scenarioName = pickle.name;
  const status = result?.status || Status.UNKNOWN;
  
  fixture.logger.info(`Scenario finished with status: ${status}`);
  
  if (status === Status.FAILED && browserManager.page) {
    try {
      const screenshotPath = await browserManager.captureScreenshot(scenarioName);
      const screenshotBuffer = await fs.promises.readFile(screenshotPath);
      await this.attach(screenshotBuffer, 'image/jpeg');
    } catch (error) {
      fixture.logger.error(`Failed to capture screenshot: ${error}`);
    }
  }
  
  const testResult = {
    testKey: fixture.testId || scenarioName,
    start: new Date().toISOString(),
    finish: new Date().toISOString(),
    comment: status === Status.FAILED ? result?.message || 'Test failed' : 'Test passed',
    status: (status === Status.PASSED ? 'PASS' : status === Status.FAILED ? 'FAIL' : 'SKIP') as 'PASS' | 'FAIL' | 'SKIP',
    steps: []
  };
  
  browserManager.addTestResult(testResult);
  await browserManager.closeBrowser();
});

AfterAll(async function() {
  console.log('Test execution completed');
});

async function setupNetworkCapture(page: Page, world: any, testId: string | null): Promise<void> {
  page.on('request', async (request) => {
    const url = request.url();
    const shouldSkip = url.includes('google-analytics') || url.includes('clarity') || url.endsWith('.svg');
    if (shouldSkip) return;
    const resourceType = request.resourceType();
    if (!['xhr', 'fetch'].includes(resourceType)) return;
    try {
      const requestData = { testId, url, method: request.method(), headers: request.headers() };
      await world.attach(JSON.stringify(requestData, null, 2), 'application/json');
    } catch (error) {}
  });
  
  page.on('response', async (response) => {
    const url = response.url();
    const shouldSkip = url.includes('google-analytics') || url.includes('clarity') || url.endsWith('.svg');
    if (shouldSkip) return;
    try {
      const responseData = { testId, url, status: response.status() };
      await world.attach(JSON.stringify(responseData, null, 2), 'application/json');
    } catch (error) {}
  });
}

export { fixture };
