import { Browser, BrowserContext, Page } from '@playwright/test';
import { Logger } from 'winston';
import { Pickle } from '@cucumber/messages';

/**
 * PageFixture - State Container
 * 
 * Centralized container for managing shared state between steps, tasks, and pages.
 * This class maintains all necessary context for test execution including:
 * - Playwright instances (Page, Browser, BrowserContext)
 * - Test configuration and metadata
 * - Logger instance
 * 
 * @class PageFixture
 */
export class PageFixture {
  // Playwright instances
  page: Page;
  context: BrowserContext;
  browser: Browser;

  // Logger
  logger: Logger;

  // Test context
  pickle: Pickle | null = null;
  testId: string | null = null;

  /**
   * Constructor for PageFixture
   * 
   * @param page - Playwright Page instance
   * @param context - Playwright BrowserContext instance
   * @param browser - Playwright Browser instance
   * @param logger - Winston Logger instance
   */
  constructor(page: Page, context: BrowserContext, browser: Browser, logger: Logger) {
    this.page = page;
    this.context = context;
    this.browser = browser;
    this.logger = logger;
  }

  /**
   * Reset state between scenarios
   * 
   * Clears volatile state that should not persist between test scenarios:
   * - Test ID and pickle reference
   */
  public resetState(): void {
    this.testId = null;
    this.pickle = null;
  }
}
