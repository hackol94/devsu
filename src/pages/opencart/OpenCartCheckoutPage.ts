import { Page } from '@playwright/test';

export interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address1: string;
  city: string;
  postcode: string;
  country: string;
  region: string;
}

export class OpenCartCheckoutPage {
  constructor(private page: Page) {}

  async selectGuestCheckout(): Promise<void> {
    await this.page.waitForSelector('input[name="account"]', { state: 'visible', timeout: 10000 });
    await this.page.locator('input[value="guest"]').click();
    await this.page.locator('#button-account').click();
    await this.page.waitForSelector('#input-payment-firstname', { state: 'visible', timeout: 10000 });
  }

  async fillGuestForm(data: GuestFormData): Promise<void> {
    await this.page.locator('#input-payment-firstname').fill(data.firstName);
    await this.page.locator('#input-payment-lastname').fill(data.lastName);
    await this.page.locator('#input-payment-email').fill(data.email);
    await this.page.locator('#input-payment-telephone').fill(data.telephone);
    await this.page.locator('#input-payment-address-1').fill(data.address1);
    await this.page.locator('#input-payment-city').fill(data.city);
    await this.page.locator('#input-payment-postcode').fill(data.postcode);

    await this.page.locator('#input-payment-country').selectOption({ label: data.country });
    await this.page.waitForTimeout(1500);
    await this.page.locator('#input-payment-zone').selectOption({ label: data.region });

    await this.page.locator('#button-guest').click();
    await this.page.waitForTimeout(2000);
  }

  async selectShippingMethod(): Promise<void> {
    await this.page.waitForSelector('#button-shipping-method', { state: 'visible', timeout: 10000 });
    await this.page.locator('#button-shipping-method').click();
    await this.page.waitForTimeout(2000);
  }

  async selectPaymentMethod(): Promise<void> {
    await this.page.waitForSelector('#button-payment-method', { state: 'visible', timeout: 10000 });
    const termsCheckbox = this.page.locator('input[name="agree"]');
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check();
    }
    await this.page.locator('#button-payment-method').click();
    await this.page.waitForTimeout(2000);
  }

  async confirmOrder(): Promise<void> {
    await this.page.waitForSelector('#button-confirm', { state: 'visible', timeout: 10000 });
    await this.page.locator('#button-confirm').click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async getConfirmationText(): Promise<string> {
    const heading = this.page.locator('#content h1');
    await heading.waitFor({ state: 'visible', timeout: 15000 });
    return heading.innerText();
  }
}
