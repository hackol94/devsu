import { Page } from '@playwright/test';
import { SauceDemoLoginPage } from '../../pages/saucedemo/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '../../pages/saucedemo/SauceDemoInventoryPage';
import { SauceDemoCartPage } from '../../pages/saucedemo/SauceDemoCartPage';
import { SauceDemoCheckoutPage } from '../../pages/saucedemo/SauceDemoCheckoutPage';

export class SauceDemoUiTask {
  static async login(page: Page, username: string, password: string): Promise<void> {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.navigate();
    await loginPage.login(username, password);
  }

  static async addTwoProductsToCart(page: Page): Promise<void> {
    const inventoryPage = new SauceDemoInventoryPage(page);
    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
  }

  static async completeCheckout(
    page: Page,
    firstName: string,
    lastName: string,
    zipCode: string
  ): Promise<string> {
    const cartPage = new SauceDemoCartPage(page);
    await cartPage.clickCheckout();
    const checkoutPage = new SauceDemoCheckoutPage(page);
    await checkoutPage.fillCheckoutInfo(firstName, lastName, zipCode);
    await checkoutPage.clickFinish();
    return checkoutPage.getConfirmationText();
  }
}
