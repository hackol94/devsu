import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { ReqResTask } from '../../../tasks/api/ReqResTask';

let response: any;
let responseBody: any;

// ─── WHEN ──────────────────────────────────────────────────────────────

When('el usuario solicita la lista de usuarios de la página {int}', async function (page: number) {
  response = await ReqResTask.getUsers(fixture, page);
  responseBody = await response.json();
});

When('el usuario solicita los datos del usuario con ID {int}', async function (id: number) {
  response = await ReqResTask.getUserById(fixture, id);
  // Solo parsear JSON si la respuesta tiene body (no 404 vacío)
  if (response.status() !== 404) {
    responseBody = await response.json();
  } else {
    responseBody = {};
  }
});

When('el usuario envía una petición POST para crear un usuario con nombre {string} y trabajo {string}', async function (name: string, job: string) {
  response = await ReqResTask.createUser(fixture, { name, job });
  responseBody = await response.json();
});

When('el usuario envía una petición PUT para actualizar el usuario {int} con nombre {string} y trabajo {string}', async function (id: number, name: string, job: string) {
  response = await ReqResTask.updateUser(fixture, id, { name, job });
  responseBody = await response.json();
});

When('el usuario envía una petición DELETE para el usuario {int}', async function (id: number) {
  response = await ReqResTask.deleteUser(fixture, id);
  responseBody = null;
});

When('el usuario envía una petición de login con email {string} y password {string}', async function (email: string, password: string) {
  response = await ReqResTask.login(fixture, email, password);
  responseBody = await response.json();
});

When('el usuario envía una petición de login con email {string} sin password', async function (email: string) {
  response = await ReqResTask.login(fixture, email);
  responseBody = await response.json();
});

// ─── THEN ──────────────────────────────────────────────────────────────

Then('el código de respuesta debe ser {int}', async function (statusCode: number) {
  expect(response.status()).toBe(statusCode);
});

Then('la respuesta debe contener una lista de usuarios', async function () {
  expect(responseBody.data).toBeDefined();
  expect(Array.isArray(responseBody.data)).toBe(true);
  expect(responseBody.data.length).toBeGreaterThan(0);
});

Then('cada usuario debe tener los campos {string}, {string}, {string} y {string}', async function (f1: string, f2: string, f3: string, f4: string) {
  const fields = [f1, f2, f3, f4];
  for (const user of responseBody.data) {
    for (const field of fields) {
      expect(user).toHaveProperty(field);
    }
  }
});

Then('la respuesta debe contener el nombre {string} y un ID asignado', async function (name: string) {
  expect(responseBody.name).toBe(name);
  expect(responseBody.id).toBeDefined();
});

Then('la respuesta debe contener un campo {string} con fecha válida', async function (field: string) {
  expect(responseBody[field]).toBeDefined();
  const date = new Date(responseBody[field]);
  expect(date.getTime()).not.toBeNaN();
});

Then('la respuesta debe contener el trabajo {string}', async function (job: string) {
  expect(responseBody.job).toBe(job);
});

Then('la respuesta debe contener el email {string}', async function (email: string) {
  expect(responseBody.data.email).toBe(email);
});

Then('la respuesta debe contener un token de autenticación', async function () {
  expect(responseBody.token).toBeDefined();
  expect(responseBody.token.length).toBeGreaterThan(0);
});

Then('la respuesta debe contener el error {string}', async function (errorMsg: string) {
  expect(responseBody.error).toBe(errorMsg);
});
