import { Page } from '@playwright/test';

export class DemoBlazeHomePage {
  private readonly url = 'https://www.demoblaze.com/';

  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.card-title a', { state: 'visible', timeout: 15000 });
  }

  async isCatalogVisible(): Promise<boolean> {
    return this.page.locator('#tbodyid').isVisible();
  }

  async clickProduct(index: number): Promise<void> {
    await this.page.waitForSelector('.card-title a', { state: 'visible' });
    const products = this.page.locator('.card-title a');
    await products.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.btn-success', { state: 'visible', timeout: 10000 });
  }

  async addToCart(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.page.locator('.btn-success >> text=Add to cart').click();
    await this.page.waitForTimeout(1000);
  }

  async goBack(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.card-title a', { state: 'visible', timeout: 10000 });
  }

  async goToCart(): Promise<void> {
    await this.page.locator('#cartur').click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('#tbodyid', { state: 'visible' });
    await this.page.waitForTimeout(2000);
  }

  async getCartItemCount(): Promise<number> {
    const rows = this.page.locator('#tbodyid tr');
    return rows.count();
  }

  async clickPlaceOrder(): Promise<void> {
    await this.page.locator('.btn-success:has-text("Place Order")').click();
    await this.page.waitForSelector('#orderModal.show, #orderModal.in', { state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async fillOrderForm(name: string, card: string, month: string): Promise<void> {
    await this.page.locator('#name').fill(name);
    await this.page.locator('#card').fill(card);
    await this.page.locator('#month').fill(month);
  }

  async confirmPurchase(): Promise<void> {
    const purchaseBtn = this.page.locator('#orderModal .modal-footer button').nth(1);
    await purchaseBtn.waitFor({ state: 'visible', timeout: 10000 });
    await purchaseBtn.click();
    await this.page.waitForSelector('.sweet-alert', { state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  async getConfirmationText(): Promise<string> {
    const alertHeader = this.page.locator('.sweet-alert h2');
    await alertHeader.waitFor({ state: 'visible' });
    return alertHeader.innerText();
  }

  async closeConfirmationAlert(): Promise<void> {
    await this.page.locator('.sweet-alert .confirm').click();
  }
}
