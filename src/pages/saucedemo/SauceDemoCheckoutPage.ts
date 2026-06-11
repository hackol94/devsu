import { Page } from '@playwright/test';

export class SauceDemoCheckoutPage {
  constructor(private page: Page) {}

  async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(zipCode);
    await this.page.locator('[data-test="continue"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async isOnOverviewPage(): Promise<boolean> {
    return this.page.url().includes('/checkout-step-two.html');
  }

  async clickFinish(): Promise<void> {
    await this.page.locator('[data-test="finish"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async getConfirmationText(): Promise<string> {
    const header = this.page.locator('[data-test="complete-header"]');
    await header.waitFor({ state: 'visible' });
    return header.innerText();
  }
}
