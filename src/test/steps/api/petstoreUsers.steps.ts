import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { APIResponse } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { PetStoreUsersTask, UserPayload } from '../../../tasks/api/petStoreUsersTask';

let petStoreUsername: string;
let petStoreEmail: string;
let petStoreUserId: number;
let updatedEmail: string;
let response: APIResponse;
let responseBody: string;

async function attachReport(
  world: any,
  method: string,
  url: string,
  requestBody: object | null,
  res: APIResponse
): Promise<string> {
  const body = await res.text();
  let parsedBody: string;
  try { parsedBody = JSON.stringify(JSON.parse(body), null, 2); } catch { parsedBody = body; }
  const requestStr = requestBody ? JSON.stringify(requestBody, null, 2) : 'N/A';
  const htmlContent = `<div style="background:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;margin:8px 0;">` +
    `<strong style="color:#569cd6;">REQUEST</strong>\n` +
    `<span style="color:#ce9178;">${method}</span> ${escapeHtml(url)}\n` +
    `<strong>Body:</strong>\n${escapeHtml(requestStr)}\n\n` +
    `<strong style="color:#569cd6;">RESPONSE</strong>\n` +
    `<strong>Status:</strong> <span style="color:#b5cea8;">${res.status()}</span>\n` +
    `<strong>Body:</strong>\n${escapeHtml(parsedBody)}` +
    `</div>`;
  await world.attach(htmlContent, 'text/html');
  return body;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

Given('que genero un username unico para el usuario de PetStore', async function () {
  const timestamp = Date.now();
  petStoreUsername = `testuser_${timestamp}`;
  petStoreEmail = `testuser_${timestamp}@test.com`;
});

When('envio una peticion POST user con firstName "John" y email dinamico', async function () {
  const user: UserPayload = {
    id: Date.now() % 999999,
    username: petStoreUsername,
    firstName: 'John',
    lastName: 'Doe',
    email: petStoreEmail,
    password: 'Test1234!',
    phone: '3001234567',
    userStatus: 1
  };
  response = await PetStoreUsersTask.createUser(fixture, user);
  responseBody = await attachReport(this, 'POST', 'https://petstore.swagger.io/v2/user', user, response);
});

When('envio una peticion GET user por username para verificar creacion', async function () {
  await new Promise(resolve => setTimeout(resolve, 1000));
  response = await PetStoreUsersTask.getUserByUsername(fixture, petStoreUsername);
  responseBody = await attachReport(this, 'GET', `https://petstore.swagger.io/v2/user/${petStoreUsername}`, null, response);
  try {
    const body = JSON.parse(responseBody);
    petStoreUserId = body.id;
  } catch { /* ignore */ }
});

When('envio una peticion PUT user con firstName "Jane" y nuevo email', async function () {
  updatedEmail = `jane_${Date.now()}@test.com`;
  const updatedUser: UserPayload = {
    id: petStoreUserId,
    username: petStoreUsername,
    firstName: 'Jane',
    lastName: 'Doe',
    email: updatedEmail,
    password: 'Test1234!',
    phone: '3001234567',
    userStatus: 1
  };
  response = await PetStoreUsersTask.updateUser(fixture, petStoreUsername, updatedUser);
  responseBody = await attachReport(this, 'PUT', `https://petstore.swagger.io/v2/user/${petStoreUsername}`, updatedUser, response);
});

When('envio una peticion GET user por username para verificar actualizacion', async function () {
  await new Promise(resolve => setTimeout(resolve, 2000));
  response = await PetStoreUsersTask.getUserByUsername(fixture, petStoreUsername);
  responseBody = await attachReport(this, 'GET', `https://petstore.swagger.io/v2/user/${petStoreUsername}`, null, response);
});

When('envio una peticion DELETE user por username', async function () {
  response = await PetStoreUsersTask.deleteUser(fixture, petStoreUsername);
  responseBody = await attachReport(this, 'DELETE', `https://petstore.swagger.io/v2/user/${petStoreUsername}`, null, response);
});

Then('la respuesta de creacion de usuario debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('la respuesta de consulta de usuario debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('el body debe contener el username y firstName "John" originales', async function () {
  const body = JSON.parse(responseBody);
  expect(body.username).toBe(petStoreUsername);
  expect(body.firstName).toBe('John');
  expect(body.email).toBe(petStoreEmail);
});

Then('la respuesta de actualizacion de usuario debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('la respuesta de consulta actualizada debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('el body debe reflejar el firstName "Jane" actualizado', async function () {
  const body = JSON.parse(responseBody);
  expect(body.firstName).toBe('Jane');
  expect(body.email).toBe(updatedEmail);
});

Then('la respuesta de eliminacion de usuario debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});
