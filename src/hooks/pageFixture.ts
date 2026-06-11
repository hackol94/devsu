import { Browser, BrowserContext, Page } from '@playwright/test';
import { Logger } from 'winston';
import { Pickle } from '@cucumber/messages';

/**
 * Interface for Actor Data (User Information)
 */
export interface ActorData {
  documentID: string;
  documentNumber: string;
  cellphone: string;
  firstName: string;
  firstLastname: string;
  secondName?: string;
  secondLastname?: string;
  password: string;
}

/**
 * Interface for Inscription Data
 */
export interface InscriptionData {
  acctTypeToRegister: string;
  acctIdToRegister: string;
  nickname: string;
  legalName: string;
  documentType: string;
  documentNum: string;
  bankIdToRegister: string;
  email: string;
}

/**
 * PageFixture - Singleton State Container
 * 
 * Centralized container for managing shared state between steps, tasks, and pages.
 * This class maintains all necessary context for test execution including:
 * - Playwright instances (Page, Browser, BrowserContext)
 * - User data and authentication
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
  
  // User data
  currentUser: ActorData | null = null;
  deviceCookies: any = null;
  
  // Authentication
  jwtAuthPB: string | null = null;
  headersAuthV1: Record<string, string> = {};
  headersAuthV2: Record<string, string> = {};
  
  // Inscription data
  inscriptionData: InscriptionData = {
    acctTypeToRegister: '',
    acctIdToRegister: '',
    nickname: '',
    legalName: '',
    documentType: '',
    documentNum: '',
    bankIdToRegister: '',
    email: ''
  };
  
  // Crypto
  keyEncription: any = null;
  
  // Logger
  logger: Logger;
  
  // Test context
  pickle: Pickle | null = null;
  testId: string | null = null;
  itemAccount: any = null;
  productType: string | null = null;
  
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
   * - Current user data
   * - JWT tokens
   * - Encryption keys
   * - Item account data
   * - Test ID and pickle reference
   */
  public resetState(): void {
    this.currentUser = null;
    this.jwtAuthPB = null;
    this.keyEncription = null;
    this.itemAccount = null;
    this.testId = null;
    this.pickle = null;
  }
}
