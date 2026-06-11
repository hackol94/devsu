import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { LoginTask } from '../../../tasks/ui/LoginTask';
import { CreateClientTask } from '../../../tasks/ui/CreateClientTask';
import { ClientPage } from '../../../pages/ClientPage';

setDefaultTimeout(120000);

Given('que el usuario inicia sesión en Siigo con sus credenciales', async function () {
  const user = process.env.USER_EMAIL || 'retoautomationsiigo2@yopmail.com';
  const pass = process.env.USER_PASS || 'J1h4{zMTV3';
  await LoginTask.inSiigo(fixture, user, pass);
});

Given('que el usuario navega al formulario de creación de clientes', async function () {
  await CreateClientTask.navigateToForm(fixture);
});

When('registra un nuevo cliente con los siguientes datos:', async function (dataTable) {
  const data = dataTable.hashes()[0];
  const clientData = {
    id: data.identificacion,
    firstName: data.nombre,
    lastName: data.apellido,
    city: data.ciudad,
    address: data.direccion,
    email: data.email
  };
  await CreateClientTask.withData(fixture, clientData);
});

Then('el sistema debe mostrar el mensaje de éxito {string}', async function (expectedMessage) {
  const isSuccess = await CreateClientTask.verifySuccess(fixture);
  expect(isSuccess).toBe(true);
});

Then('el usuario debe ser redirigido a la vista de perfil del tercero', async function () {
  const clientPage = new ClientPage(fixture.page);
  await expect(clientPage.profileTitle).toBeVisible({ timeout: 10000 });
});
