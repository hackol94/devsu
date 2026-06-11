import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { LoginPage } from '../../../pages/LoginPage';
import { ClientPage } from '../../../pages/ClientPage';

setDefaultTimeout(120000);

Given('que el usuario accede a la página de login de Siigo', async function () {
  await fixture.page.goto('https://qastaging.siigo.com/#/login');

  const loginPage = new LoginPage(fixture.page);
  await loginPage.waitForPageLoad();

  fixture.logger.info('Login page loaded successfully');
});

When('ingresa sus credenciales válidas', async function () {
  const user = process.env.USER_EMAIL || 'retoautomationsiigo2@yopmail.com';
  const pass = process.env.USER_PASS || 'J1h4{zMTV3';

  const loginPage = new LoginPage(fixture.page);
  await loginPage.fillUsername(user);
  await loginPage.fillPassword(pass);
  await loginPage.clickLogin();

  fixture.logger.info(`Login submitted for user: ${user}`);
});

Then('debe visualizar el dashboard principal', async function () {
  const clientPage = new ClientPage(fixture.page);

  // El botón "Crear" en el header indica que el dashboard cargó correctamente
  await clientPage.createButton.waitFor({ state: 'visible', timeout: 60000 });
  await expect(clientPage.createButton).toBeVisible();

  fixture.logger.info('Dashboard loaded — create button is visible');
});

Then('la URL debe contener el path del dashboard', async function () {
  const currentUrl = fixture.page.url();

  // Después del login la URL ya no debe estar en /login
  expect(currentUrl).not.toContain('/login');

  fixture.logger.info(`Current URL after login: ${currentUrl}`);
});
