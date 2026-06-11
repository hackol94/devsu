import { Page } from '@playwright/test';

export class OpenCartHomePage {
  private readonly url = 'http://opencart.abstracta.us/';

  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async areProductsVisible(): Promise<boolean> {
    const products = this.page.locator('.product-thumb');
    const count = await products.count();
    return count > 0;
  }

  async addProductToCart(index: number): Promise<void> {
    const productLinks = this.page.locator('.product-thumb .caption h4 a');
    await productLinks.nth(index).click();
    await this.page.waitForLoadState('networkidle');

    await this.page.locator('#button-cart').click();
    await this.page.waitForSelector('.alert-success', { state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);

    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async getCartButtonText(): Promise<string> {
    return this.page.locator('#cart-total').innerText();
  }

  async goToCart(): Promise<void> {
    await this.page.goto('http://opencart.abstracta.us/index.php?route=checkout/cart');
    await this.page.waitForLoadState('networkidle');
  }
}
