import { Page } from '@playwright/test';

export class SauceDemoCartPage {
  constructor(private page: Page) {}

  async getItemCount(): Promise<number> {
    const items = this.page.locator('[data-test="inventory-item"]');
    return items.count();
  }

  async clickCheckout(): Promise<void> {
    await this.page.locator('[data-test="checkout"]').click();
    await this.page.waitForLoadState('networkidle');
  }
}
