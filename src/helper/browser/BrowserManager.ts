import { Browser, BrowserContext, Page, chromium, firefox, webkit, LaunchOptions } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for test results
 */
export interface TestResult {
  testKey: string;
  start: string;
  finish: string;
  comment: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  steps: StepResult[];
}

/**
 * Interface for step results
 */
export interface StepResult {
  status: 'PASS' | 'FAIL' | 'SKIP';
  comment: string;
}

/**
 * BrowserManager - Singleton class for managing browser instances
 * 
 * Responsibilities:
 * - Launch and manage browser instances (Chromium, Firefox, WebKit)
 * - Support local and remote (LambdaTest) execution
 * - Capture screenshots during test execution
 * - Manage test results
 * 
 * Requirements: 2.1-2.8, 17.1-17.8, 58.1-58.4, 66.1-66.3, 85.1-85.3
 */
export class BrowserManager {
  private static instance: BrowserManager;
  public browser: Browser | null = null;
  public context: BrowserContext | null = null;
  public page: Page | null = null;
  public screenshots: string[] = [];
  public resultTest: TestResult[] = [];

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get singleton instance of BrowserManager
   * @returns BrowserManager instance
   */
  public static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  /**
   * Launch browser based on type and environment configuration
   * @param browserType - Type of browser to launch (chrome, firefox, webkit, safari)
   */
  public async launchBrowser(browserType: string): Promise<void> {
    const isLambdaTest = process.env.ltDevice === 'true';

    if (isLambdaTest) {
      await this.connectToLambdaTest(browserType);
    } else {
      await this.launchLocalBrowser(browserType);
    }
  }

  /**
   * Launch browser locally with specified configuration
   * @param browserType - Type of browser to launch
   */
  private async launchLocalBrowser(browserType: string): Promise<void> {
    const launchOptions: LaunchOptions = {
      headless: false,
      args: ['--start-maximized']
    };

    switch (browserType.toLowerCase()) {
      case 'chrome':
      case 'chrome_latest':
        this.browser = await chromium.launch(launchOptions);
        break;
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
      case 'safari':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        this.browser = await chromium.launch(launchOptions);
    }

    this.context = await this.browser.newContext({
      viewport: null,
      ignoreHTTPSErrors: true
    });

    this.page = await this.context.newPage();
  }

  /**
   * Connect to LambdaTest for remote browser execution
   * @param browserType - Type of browser to connect
   */
  private async connectToLambdaTest(browserType: string): Promise<void> {
    const capabilities = this.getLambdaTestCapabilities(browserType);
    const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;

    this.browser = await chromium.connect(wsEndpoint);
    this.context = this.browser.contexts()[0];
    this.page = this.context.pages()[0];
  }

  /**
   * Get LambdaTest capabilities configuration
   * @param browserType - Type of browser
   * @returns Capabilities object for LambdaTest
   */
  private getLambdaTestCapabilities(browserType: string): object {
    const tunnelName = `BrayanMartinez${Math.floor(Math.random() * 1000)}`;

    return {
      browserName: this.mapBrowserName(browserType),
      browserVersion: 'latest',
      'LT:Options': {
        platform: 'Windows 10',
        build: `Build-${new Date().toISOString()}`,
        name: 'Playwright Test',
        user: process.env.LT_USERNAME,
        accessKey: process.env.LT_ACCESS_KEY,
        network: true,
        video: true,
        tunnel: true,
        tunnelName: tunnelName,
        console: true
      }
    };
  }

  /**
   * Map browser type to LambdaTest browser name
   * @param browserType - Browser type string
   * @returns Mapped browser name
   */
  private mapBrowserName(browserType: string): string {
    const mapping: Record<string, string> = {
      'chrome': 'Chrome',
      'chrome_latest': 'Chrome',
      'firefox': 'Firefox',
      'safari': 'Safari',
      'webkit': 'Safari'
    };
    return mapping[browserType.toLowerCase()] || 'Chrome';
  }

  /**
   * Close browser and cleanup resources
   */
  public async closeBrowser(): Promise<void> {
    try {
      if (this.page) await this.page.close();
      if (this.context) await this.context.close();
      if (this.browser) await this.browser.close();
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }

  /**
   * Capture screenshot of current page
   * @param scenarioName - Name of the scenario for screenshot filename
   * @returns Path to the captured screenshot
   */
  public async captureScreenshot(scenarioName: string): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${scenarioName}-${timestamp}.jpeg`;
    const screenshotPath = path.join('target', 'site', 'cypress', 'screenshots', filename);

    // Ensure directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'jpeg',
      quality: 15
    });

    this.screenshots.push(screenshotPath);
    return screenshotPath;
  }

  /**
   * Add test result to results array
   * @param result - Test result to add
   */
  public addTestResult(result: TestResult): void {
    this.resultTest.push(result);
  }

  /**
   * Get all test results
   * @returns Array of test results
   */
  public getTestResults(): TestResult[] {
    return this.resultTest;
  }
}
