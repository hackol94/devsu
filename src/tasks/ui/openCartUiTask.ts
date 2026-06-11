import { Page } from '@playwright/test';
import { OpenCartHomePage } from '../../pages/opencart/OpenCartHomePage';
import { OpenCartCartPage } from '../../pages/opencart/OpenCartCartPage';
import { OpenCartCheckoutPage, GuestFormData } from '../../pages/opencart/OpenCartCheckoutPage';
import * as guestData from '../../resources/data/opencart-guest.json';

export class OpenCartUiTask {
  static async addTwoProducts(page: Page): Promise<void> {
    const homePage = new OpenCartHomePage(page);
    await homePage.addProductToCart(0);
    await homePage.addProductToCart(1);
  }

  static async completeGuestCheckout(page: Page): Promise<string> {
    const checkoutPage = new OpenCartCheckoutPage(page);
    await checkoutPage.selectGuestCheckout();
    await checkoutPage.fillGuestForm(guestData as GuestFormData);
    await checkoutPage.selectShippingMethod();
    await checkoutPage.selectPaymentMethod();
    await checkoutPage.confirmOrder();
    return checkoutPage.getConfirmationText();
  }
}
