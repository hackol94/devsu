import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { SauceDemoLoginPage } from '../../../pages/saucedemo/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '../../../pages/saucedemo/SauceDemoInventoryPage';
import { SauceDemoCartPage } from '../../../pages/saucedemo/SauceDemoCartPage';
import { SauceDemoCheckoutPage } from '../../../pages/saucedemo/SauceDemoCheckoutPage';
import { SauceDemoUiTask } from '../../../tasks/ui/sauceDemoUiTask';
import { captureAndAttach } from '../../../helper/util/screenshotHelper';
import * as credentials from '../../../resources/data/saucedemo-credentials.json';
import * as checkoutData from '../../../resources/data/saucedemo-checkout.json';

let loginPage: SauceDemoLoginPage;
let inventoryPage: SauceDemoInventoryPage;
let cartPage: SauceDemoCartPage;
let checkoutPage: SauceDemoCheckoutPage;

Given('que navego a la pagina de login de SauceDemo', async function () {
  loginPage = new SauceDemoLoginPage(fixture.page);
  inventoryPage = new SauceDemoInventoryPage(fixture.page);
  cartPage = new SauceDemoCartPage(fixture.page);
  checkoutPage = new SauceDemoCheckoutPage(fixture.page);
  await loginPage.navigate();
  await captureAndAttach(this, fixture.page, 'Página de login SauceDemo');
});

When('ingreso las credenciales de standard_user en SauceDemo', async function () {
  await loginPage.login(credentials.username, credentials.password);
  await captureAndAttach(this, fixture.page, 'Login completado');
});

Then('debo ser redirigido a la pagina de inventario de SauceDemo', async function () {
  const isOnInventory = await loginPage.isOnInventoryPage();
  expect(isOnInventory).toBeTruthy();
  await captureAndAttach(this, fixture.page, 'Página de inventario');
});

When('agrego 2 productos distintos al carrito de SauceDemo', async function () {
  await SauceDemoUiTask.addTwoProductsToCart(fixture.page);
  await captureAndAttach(this, fixture.page, '2 productos agregados al carrito');
});

Then('el contador del carrito de SauceDemo debe mostrar {string}', async function (expectedCount: string) {
  const cartCount = await inventoryPage.getCartCount();
  expect(cartCount).toBe(expectedCount);
  await captureAndAttach(this, fixture.page, `Contador del carrito: ${cartCount}`);
});

When('navego al carrito de SauceDemo', async function () {
  await inventoryPage.goToCart();
  await captureAndAttach(this, fixture.page, 'Vista del carrito SauceDemo');
});

Then('debo ver los 2 productos seleccionados en el carrito de SauceDemo', async function () {
  const itemCount = await cartPage.getItemCount();
  expect(itemCount).toBe(2);
  await captureAndAttach(this, fixture.page, 'Verificación: 2 productos en carrito');
});

When('inicio el checkout de SauceDemo con datos de envio validos', async function () {
  await cartPage.clickCheckout();
  await captureAndAttach(this, fixture.page, 'Formulario de checkout');
  await checkoutPage.fillCheckoutInfo(
    checkoutData.firstName,
    checkoutData.lastName,
    checkoutData.zipCode
  );
  await captureAndAttach(this, fixture.page, 'Datos de checkout ingresados');
});

Then('debo ver la pantalla de revision del pedido de SauceDemo', async function () {
  const isOnOverview = await checkoutPage.isOnOverviewPage();
  expect(isOnOverview).toBeTruthy();
  await captureAndAttach(this, fixture.page, 'Pantalla de revisión del pedido');
});

When('confirmo la orden en SauceDemo', async function () {
  await checkoutPage.clickFinish();
  await captureAndAttach(this, fixture.page, 'Orden confirmada');
});

Then('debo ver el mensaje {string} en SauceDemo', async function (expectedMessage: string) {
  const confirmText = await checkoutPage.getConfirmationText();
  expect(confirmText.toUpperCase()).toContain(expectedMessage.toUpperCase());
  await captureAndAttach(this, fixture.page, 'Mensaje de confirmación');
});
