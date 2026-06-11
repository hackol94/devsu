/**
 * LoginPage - Page Object Model Example
 * 
 * This class demonstrates the complete Page Object Model pattern implementation
 * following the framework's conventions and best practices.
 * 
 * Naming Conventions for Elements:
 * - BTN_: Buttons (e.g., BTN_LOGIN, BTN_SUBMIT)
 * - TXT_: Text inputs (e.g., TXT_USERNAME, TXT_PASSWORD)
 * - LBL_: Labels and text elements (e.g., LBL_ERROR, LBL_WELCOME)
 * - SEL_: Select dropdowns (e.g., SEL_COUNTRY, SEL_LANGUAGE)
 * - OPT_: Options within selects (e.g., OPT_USA, OPT_ENGLISH)
 * - CHECK_: Checkboxes (e.g., CHECK_REMEMBER_ME, CHECK_TERMS)
 * - RADIO_: Radio buttons (e.g., RADIO_GENDER, RADIO_PAYMENT_METHOD)
 * - IMG_: Images (e.g., IMG_LOGO, IMG_AVATAR)
 * - LINK_: Links (e.g., LINK_FORGOT_PASSWORD, LINK_REGISTER)
 * 
 * Structure:
 * 1. Elements object (readonly) - Contains all locators
 * 2. Constructor - Initializes the page instance
 * 3. Element getters - Provide access to Locator objects
 * 4. Static methods - Generate dynamic locators
 * 5. Action methods - Perform interactions with elements
 * 6. Validation methods - Check element states and retrieve data
 */

import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  
  /**
   * Elements - Readonly object containing all element locators
   * 
   * This object centralizes all locators for the page, making them easy to maintain.
   * Locators can be CSS selectors, XPath expressions, or text-based selectors.
   * 
   * Benefits:
   * - Single source of truth for locators
   * - Easy to update when UI changes
   * - Type-safe with 'as const' assertion
   */
  private readonly Elements = {
    // Siigo Login Elements
    TXT_USERNAME: "input#siigoSignInName",
    TXT_PASSWORD: "input#siigoPassword",
    BTN_LOGIN: "button#siigoNext",
    
    // Labels and Text Elements
    LBL_ERROR: ".error-message",
    
    // Checkboxes
    CHECK_REMEMBER_ME: "input[type='checkbox'][name='remember']",
    
    // Select Dropdowns
    SEL_LANGUAGE: "select[name='language']",
    
    // Images
    IMG_LOGO: "img.company-logo"
  } as const;
  
  /**
   * Constructor
   * @param page - Playwright Page instance from PageFixture
   */
  constructor(page: Page) {
    this.page = page;
  }
  
  // ============================================================================
  // Element Getters
  // ============================================================================
  
  /**
   * Getters provide access to Locator objects for each element.
   * These can be used directly in assertions or passed to wrapper methods.
   * 
   * Example usage:
   *   await loginPage.usernameInput.fill('user@example.com');
   *   await expect(loginPage.errorLabel).toBeVisible();
   */
  
  get usernameInput(): Locator {
    return this.page.locator(this.Elements.TXT_USERNAME);
  }
  
  get passwordInput(): Locator {
    return this.page.locator(this.Elements.TXT_PASSWORD);
  }
  
  get loginButton(): Locator {
    return this.page.locator(this.Elements.BTN_LOGIN);
  }
  
  get cancelButton(): Locator {
    return this.page.locator(this.Elements.BTN_CANCEL);
  }
  
  get errorLabel(): Locator {
    return this.page.locator(this.Elements.LBL_ERROR);
  }
  
  get welcomeLabel(): Locator {
    return this.page.locator(this.Elements.LBL_WELCOME);
  }
  
  get pageTitleLabel(): Locator {
    return this.page.locator(this.Elements.LBL_PAGE_TITLE);
  }
  
  get forgotPasswordLink(): Locator {
    return this.page.locator(this.Elements.LINK_FORGOT_PASSWORD);
  }
  
  get registerLink(): Locator {
    return this.page.locator(this.Elements.LINK_REGISTER);
  }
  
  get rememberMeCheckbox(): Locator {
    return this.page.locator(this.Elements.CHECK_REMEMBER_ME);
  }
  
  get languageSelect(): Locator {
    return this.page.locator(this.Elements.SEL_LANGUAGE);
  }
  
  get logoImage(): Locator {
    return this.page.locator(this.Elements.IMG_LOGO);
  }
  
  // ============================================================================
  // Static Methods for Dynamic Locators
  // ============================================================================
  
  /**
   * Static methods generate dynamic locators based on runtime parameters.
   * These are useful when element identifiers depend on variable data.
   * 
   * Example usage:
   *   const accountLocator = LoginPage.getAccountByName('Savings Account');
   *   await page.locator(accountLocator).click();
   */
  
  /**
   * Generate a locator for an account element by account name
   * @param accountName - The name of the account to locate
   * @returns XPath locator string
   */
  static getAccountByName(accountName: string): string {
    return `//div[@class='account' and contains(text(), '${accountName}')]`;
  }
  
  /**
   * Generate a locator for a button by its text content
   * @param buttonText - The text displayed on the button
   * @returns XPath locator string
   */
  static getButtonByText(buttonText: string): string {
    return `//button[contains(text(), '${buttonText}')]`;
  }
  
  /**
   * Generate a locator for an error message by its type
   * @param errorType - The type of error (e.g., 'validation', 'authentication')
   * @returns CSS selector string
   */
  static getErrorByType(errorType: string): string {
    return `.error-message[data-error-type='${errorType}']`;
  }
  
  /**
   * Generate a locator for a form field by its label text
   * @param labelText - The label text of the form field
   * @returns XPath locator string
   */
  static getFieldByLabel(labelText: string): string {
    return `//label[contains(text(), '${labelText}')]/following-sibling::input`;
  }
  
  /**
   * Generate a locator for a language option in the dropdown
   * @param language - The language name (e.g., 'English', 'Spanish')
   * @returns CSS selector string
   */
  static getLanguageOption(language: string): string {
    return `select[name='language'] option[value='${language.toLowerCase()}']`;
  }
  
  // ============================================================================
  // Action Methods
  // ============================================================================
  
  /**
   * Action methods encapsulate interactions with page elements.
   * They provide a clean API for Tasks and Step Definitions to use.
   * 
   * Best practices:
   * - Use descriptive method names (fillUsername, not enterText)
   * - Keep methods focused on single actions
   * - Return Promise<void> for actions
   * - Add JSDoc comments for clarity
   */
  
  /**
   * Fill the username input field
   * @param username - The username to enter
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }
  
  /**
   * Fill the password input field
   * @param password - The password to enter
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }
  
  /**
   * Click the login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }
  
  /**
   * Click the cancel button
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }
  
  /**
   * Click the forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }
  
  /**
   * Click the register link
   */
  async clickRegister(): Promise<void> {
    await this.registerLink.click();
  }
  
  /**
   * Check or uncheck the "Remember Me" checkbox
   * @param checked - True to check, false to uncheck
   */
  async setRememberMe(checked: boolean): Promise<void> {
    const isChecked = await this.rememberMeCheckbox.isChecked();
    if (isChecked !== checked) {
      await this.rememberMeCheckbox.click();
    }
  }
  
  /**
   * Select a language from the dropdown
   * @param language - The language to select (e.g., 'en', 'es', 'fr')
   */
  async selectLanguage(language: string): Promise<void> {
    await this.languageSelect.selectOption(language);
  }
  
  /**
   * Perform a complete login action
   * This is a composite action that combines multiple steps
   * 
   * @param username - The username to enter
   * @param password - The password to enter
   * @param rememberMe - Whether to check the "Remember Me" checkbox (default: false)
   */
  async login(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.setRememberMe(true);
    }
    
    await this.clickLogin();
  }
  
  /**
   * Clear the login form
   * Clears both username and password fields
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
  
  // ============================================================================
  // Validation Methods
  // ============================================================================
  
  /**
   * Validation methods check element states and retrieve data.
   * They return boolean values or strings for assertions in tests.
   * 
   * Best practices:
   * - Use 'is' prefix for boolean checks (isErrorVisible)
   * - Use 'get' prefix for data retrieval (getErrorText)
   * - Return Promise<boolean> or Promise<string>
   * - Handle null/undefined cases gracefully
   */
  
  /**
   * Check if the error message is visible
   * @returns True if error is visible, false otherwise
   */
  async isErrorVisible(): Promise<boolean> {
    try {
      return await this.errorLabel.isVisible();
    } catch {
      return false;
    }
  }
  
  /**
   * Get the text content of the error message
   * @returns The error message text, or empty string if not found
   */
  async getErrorText(): Promise<string> {
    try {
      return await this.errorLabel.textContent() || '';
    } catch {
      return '';
    }
  }
  
  /**
   * Check if the welcome message is visible
   * @returns True if welcome message is visible, false otherwise
   */
  async isWelcomeVisible(): Promise<boolean> {
    try {
      return await this.welcomeLabel.isVisible();
    } catch {
      return false;
    }
  }
  
  /**
   * Get the welcome message text
   * @returns The welcome message text, or empty string if not found
   */
  async getWelcomeText(): Promise<string> {
    try {
      return await this.welcomeLabel.textContent() || '';
    } catch {
      return '';
    }
  }
  
  /**
   * Check if the login button is enabled
   * @returns True if button is enabled, false otherwise
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    try {
      return await this.loginButton.isEnabled();
    } catch {
      return false;
    }
  }
  
  /**
   * Check if the "Remember Me" checkbox is checked
   * @returns True if checked, false otherwise
   */
  async isRememberMeChecked(): Promise<boolean> {
    try {
      return await this.rememberMeCheckbox.isChecked();
    } catch {
      return false;
    }
  }
  
  /**
   * Get the currently selected language
   * @returns The selected language value, or empty string if not found
   */
  async getSelectedLanguage(): Promise<string> {
    try {
      return await this.languageSelect.inputValue() || '';
    } catch {
      return '';
    }
  }
  
  /**
   * Get the page title text
   * @returns The page title text, or empty string if not found
   */
  async getPageTitle(): Promise<string> {
    try {
      return await this.pageTitleLabel.textContent() || '';
    } catch {
      return '';
    }
  }
  
  /**
   * Check if the page is fully loaded
   * Validates that key elements are visible
   * @returns True if page is loaded, false otherwise
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      const usernameVisible = await this.usernameInput.isVisible();
      const passwordVisible = await this.passwordInput.isVisible();
      const loginButtonVisible = await this.loginButton.isVisible();
      
      return usernameVisible && passwordVisible && loginButtonVisible;
    } catch {
      return false;
    }
  }
  
  /**
   * Wait for the page to be fully loaded
   * @param timeout - Maximum time to wait in milliseconds (default: 30000)
   */
  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible', timeout });
    await this.passwordInput.waitFor({ state: 'visible', timeout });
    await this.loginButton.waitFor({ state: 'visible', timeout });
  }
}
