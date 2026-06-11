import { Page } from '@playwright/test';

export class OpenCartCartPage {
  constructor(private page: Page) {}

  async getItemCount(): Promise<number> {
    const productRows = this.page.locator('.table-bordered tbody tr').filter({
      has: this.page.locator('button[data-original-title="Remove"]')
    });
    return productRows.count();
  }

  async clickCheckout(): Promise<void> {
    await this.page.locator('a.btn-primary').filter({ hasText: 'Checkout' }).click();
    await this.page.waitForLoadState('networkidle');
  }
}
