import { Page } from '@playwright/test';
import { DemoBlazeHomePage } from '../../pages/demoblaze/DemoBlazeHomePage';
import * as checkoutData from '../../resources/data/demoblaze-checkout.json';

export class DemoBlazeUiTask {
  static async addTwoProducts(page: Page): Promise<void> {
    const homePage = new DemoBlazeHomePage(page);
    await homePage.clickProduct(0);
    await homePage.addToCart();
    await homePage.goBack();
    await homePage.clickProduct(1);
    await homePage.addToCart();
  }

  static async completeCheckout(page: Page): Promise<string> {
    const homePage = new DemoBlazeHomePage(page);
    await homePage.clickPlaceOrder();
    await homePage.fillOrderForm(checkoutData.name, checkoutData.card, checkoutData.month);
    await homePage.confirmPurchase();
    return homePage.getConfirmationText();
  }
}
