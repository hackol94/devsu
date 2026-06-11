import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { DemoBlazeHomePage } from '../../../pages/demoblaze/DemoBlazeHomePage';
import { captureAndAttach } from '../../../helper/util/screenshotHelper';

let demoBlazeHomePage: DemoBlazeHomePage;

Given('que navego a la pagina principal de DemoBlaze', async function () {
  demoBlazeHomePage = new DemoBlazeHomePage(fixture.page);
  await demoBlazeHomePage.navigate();
  await captureAndAttach(this, fixture.page, 'Navegación a DemoBlaze');
});

Then('debo ver el catalogo de productos disponibles', async function () {
  const isVisible = await demoBlazeHomePage.isCatalogVisible();
  expect(isVisible).toBeTruthy();
  await captureAndAttach(this, fixture.page, 'Catálogo visible');
});

When('agrego el primer producto al carrito de DemoBlaze', async function () {
  await demoBlazeHomePage.clickProduct(0);
  await captureAndAttach(this, fixture.page, 'Producto 1 - detalle');
  await demoBlazeHomePage.addToCart();
  await captureAndAttach(this, fixture.page, 'Producto 1 - agregado al carrito');
  await demoBlazeHomePage.goBack();
});

When('agrego el segundo producto al carrito de DemoBlaze', async function () {
  await demoBlazeHomePage.clickProduct(1);
  await captureAndAttach(this, fixture.page, 'Producto 2 - detalle');
  await demoBlazeHomePage.addToCart();
  await captureAndAttach(this, fixture.page, 'Producto 2 - agregado al carrito');
});

When('navego al carrito de DemoBlaze', async function () {
  await demoBlazeHomePage.goToCart();
  await captureAndAttach(this, fixture.page, 'Vista del carrito');
});

Then('el carrito debe mostrar 2 productos', async function () {
  const itemCount = await demoBlazeHomePage.getCartItemCount();
  expect(itemCount).toBe(2);
  await captureAndAttach(this, fixture.page, 'Verificación: 2 productos en carrito');
});

When('inicio el proceso de pago con datos validos de DemoBlaze', async function () {
  await demoBlazeHomePage.clickPlaceOrder();
  const checkoutData = require('../../../resources/data/demoblaze-checkout.json');
  await demoBlazeHomePage.fillOrderForm(
    checkoutData.name,
    checkoutData.card,
    checkoutData.month
  );
  await captureAndAttach(this, fixture.page, 'Formulario de pago completado');
});

When('confirmo la orden en DemoBlaze', async function () {
  await demoBlazeHomePage.confirmPurchase();
  await captureAndAttach(this, fixture.page, 'Orden confirmada');
});

Then('debo ver el mensaje de confirmacion de compra de DemoBlaze', async function () {
  const confirmText = await demoBlazeHomePage.getConfirmationText();
  expect(confirmText).toContain('Thank you for your purchase');
  await captureAndAttach(this, fixture.page, 'Mensaje de confirmación visible');
});
