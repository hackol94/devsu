import { Page } from '@playwright/test';

export class SauceDemoLoginPage {
  private readonly url = 'https://www.saucedemo.com/';

  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async isOnInventoryPage(): Promise<boolean> {
    return this.page.url().includes('/inventory.html');
  }
}
