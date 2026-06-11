import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { OpenCartHomePage } from '../../../pages/opencart/OpenCartHomePage';
import { OpenCartCartPage } from '../../../pages/opencart/OpenCartCartPage';
import { OpenCartCheckoutPage, GuestFormData } from '../../../pages/opencart/OpenCartCheckoutPage';
import { OpenCartUiTask } from '../../../tasks/ui/openCartUiTask';
import { captureAndAttach } from '../../../helper/util/screenshotHelper';
import * as guestData from '../../../resources/data/opencart-guest.json';

let openCartHomePage: OpenCartHomePage;
let openCartCartPage: OpenCartCartPage;
let openCartCheckoutPage: OpenCartCheckoutPage;

Given('que navego a la pagina principal de OpenCart', async function () {
  openCartHomePage = new OpenCartHomePage(fixture.page);
  openCartCartPage = new OpenCartCartPage(fixture.page);
  openCartCheckoutPage = new OpenCartCheckoutPage(fixture.page);
  await openCartHomePage.navigate();
  await captureAndAttach(this, fixture.page, 'Página principal OpenCart');
});

Then('debo ver productos disponibles en OpenCart', async function () {
  const isVisible = await openCartHomePage.areProductsVisible();
  expect(isVisible).toBeTruthy();
  await captureAndAttach(this, fixture.page, 'Productos visibles');
});

When('agrego 2 productos al carrito de OpenCart', async function () {
  await openCartHomePage.addProductToCart(0);
  await captureAndAttach(this, fixture.page, 'Producto 1 agregado');
  await openCartHomePage.addProductToCart(1);
  await captureAndAttach(this, fixture.page, 'Producto 2 agregado');
});

Then('el indicador del carrito debe reflejar 2 productos en OpenCart', async function () {
  const cartText = await openCartHomePage.getCartButtonText();
  expect(cartText).toContain('2 item(s)');
  await captureAndAttach(this, fixture.page, 'Indicador del carrito: 2 items');
});

When('navego al carrito de OpenCart', async function () {
  await openCartHomePage.goToCart();
  await captureAndAttach(this, fixture.page, 'Vista del carrito OpenCart');
});

Then('debo ver los 2 productos en el carrito de OpenCart', async function () {
  const itemCount = await openCartCartPage.getItemCount();
  expect(itemCount).toBe(2);
  await captureAndAttach(this, fixture.page, 'Verificación: 2 productos');
});

When('inicio el checkout de OpenCart', async function () {
  await openCartCartPage.clickCheckout();
  await captureAndAttach(this, fixture.page, 'Inicio checkout');
});

When('selecciono Guest Checkout en OpenCart', async function () {
  await openCartCheckoutPage.selectGuestCheckout();
  await captureAndAttach(this, fixture.page, 'Guest Checkout seleccionado');
});

When('completo el formulario de datos personales del invitado en OpenCart', async function () {
  await openCartCheckoutPage.fillGuestForm(guestData as GuestFormData);
  await captureAndAttach(this, fixture.page, 'Formulario de invitado completado');
});

When('selecciono el metodo de envio disponible en OpenCart', async function () {
  await openCartCheckoutPage.selectShippingMethod();
  await captureAndAttach(this, fixture.page, 'Método de envío seleccionado');
});

When('selecciono el metodo de pago disponible en OpenCart', async function () {
  await openCartCheckoutPage.selectPaymentMethod();
  await captureAndAttach(this, fixture.page, 'Método de pago seleccionado');
});

When('confirmo la orden en OpenCart', async function () {
  await openCartCheckoutPage.confirmOrder();
  await captureAndAttach(this, fixture.page, 'Orden confirmada');
});

Then('debo ver el mensaje {string} en OpenCart', async function (expectedMessage: string) {
  const confirmText = await openCartCheckoutPage.getConfirmationText();
  expect(confirmText).toContain(expectedMessage);
  await captureAndAttach(this, fixture.page, 'Mensaje de confirmación');
});
