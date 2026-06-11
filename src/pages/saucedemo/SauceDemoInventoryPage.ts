import { Page } from '@playwright/test';

export class SauceDemoInventoryPage {
  constructor(private page: Page) {}

  async addProductToCart(index: number): Promise<void> {
    const addButtons = this.page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(index).click();
  }

  async getCartCount(): Promise<string> {
    const badge = this.page.locator('[data-test="shopping-cart-badge"]');
    return badge.innerText();
  }

  async goToCart(): Promise<void> {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
    await this.page.waitForLoadState('networkidle');
  }
}
