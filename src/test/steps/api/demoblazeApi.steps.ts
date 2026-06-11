import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { APIResponse } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { DemoBlazeApiTask } from '../../../tasks/api/demoBlazeApiTask';

let demoBlazeUsername: string;
let demoBlazePassword: string = 'Test1234!';
let response: APIResponse;
let responseBody: string;

async function attachReport(
  world: any,
  method: string,
  url: string,
  requestBody: object,
  res: APIResponse
): Promise<string> {
  const body = await res.text();
  const requestStr = JSON.stringify(requestBody, null, 2);
  const htmlContent = `<div style="background:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;margin:8px 0;">` +
    `<strong style="color:#569cd6;">REQUEST</strong>\n` +
    `<span style="color:#ce9178;">${method}</span> ${escapeHtml(url)}\n` +
    `<strong>Body:</strong>\n${escapeHtml(requestStr)}\n\n` +
    `<strong style="color:#569cd6;">RESPONSE</strong>\n` +
    `<strong>Status:</strong> <span style="color:#b5cea8;">${res.status()}</span>\n` +
    `<strong>Body:</strong>\n${escapeHtml(body)}` +
    `</div>`;
  await world.attach(htmlContent, 'text/html');
  return body;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

Given('que tengo un username unico generado dinamicamente para DemoBlaze', async function () {
  demoBlazeUsername = `user_${Date.now()}`;
});

Given('que uso el username de DemoBlaze ya registrado previamente', async function () {
  demoBlazeUsername = `existing_${Date.now()}`;
  await DemoBlazeApiTask.signup(fixture, demoBlazeUsername, demoBlazePassword);
});

Given('que tengo un usuario previamente registrado en DemoBlaze', async function () {
  demoBlazeUsername = `loginuser_${Date.now()}`;
  await DemoBlazeApiTask.signup(fixture, demoBlazeUsername, demoBlazePassword);
});

Given('que tengo un username valido en DemoBlaze', async function () {
  demoBlazeUsername = `badpwd_${Date.now()}`;
  await DemoBlazeApiTask.signup(fixture, demoBlazeUsername, demoBlazePassword);
});

When('envio una peticion POST signup con el username y password en DemoBlaze', async function () {
  response = await DemoBlazeApiTask.signup(fixture, demoBlazeUsername, demoBlazePassword);
  responseBody = await attachReport(this, 'POST', 'https://api.demoblaze.com/signup',
    { username: demoBlazeUsername, password: `${Buffer.from(demoBlazePassword).toString('base64')}` }, response);
});

When('envio una peticion POST signup con el username ya existente en DemoBlaze', async function () {
  response = await DemoBlazeApiTask.signup(fixture, demoBlazeUsername, demoBlazePassword);
  responseBody = await attachReport(this, 'POST', 'https://api.demoblaze.com/signup',
    { username: demoBlazeUsername, password: `${Buffer.from(demoBlazePassword).toString('base64')}` }, response);
});

When('envio una peticion POST login con credenciales validas en DemoBlaze', async function () {
  response = await DemoBlazeApiTask.login(fixture, demoBlazeUsername, demoBlazePassword);
  responseBody = await attachReport(this, 'POST', 'https://api.demoblaze.com/login',
    { username: demoBlazeUsername, password: `${Buffer.from(demoBlazePassword).toString('base64')}` }, response);
});

When('envio una peticion POST login con password incorrecto en DemoBlaze', async function () {
  const wrongPassword = 'password_incorrecto_xyz';
  response = await DemoBlazeApiTask.login(fixture, demoBlazeUsername, wrongPassword);
  responseBody = await attachReport(this, 'POST', 'https://api.demoblaze.com/login',
    { username: demoBlazeUsername, password: `${Buffer.from(wrongPassword).toString('base64')}` }, response);
});

Then('la respuesta de DemoBlaze debe tener status 200', async function () {
  expect(response.status()).toBe(200);
  expect(responseBody).not.toContain('errorMessage');
});

Then('el body de la respuesta de DemoBlaze debe contener un indicador de error por duplicado', async function () {
  expect(response.status()).toBe(200);
  const parsed = JSON.parse(responseBody);
  expect(parsed.errorMessage).toContain('This user already exist');
});

Then('la respuesta de login de DemoBlaze debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('el body de login debe contener un token de autenticacion', async function () {
  expect(responseBody).toBeTruthy();
  expect(responseBody).toContain('Auth_token:');
});

Then('el body de la respuesta de login de DemoBlaze debe contener un mensaje de error de autenticacion', async function () {
  expect(response.status()).toBe(200);
  const parsed = JSON.parse(responseBody);
  expect(parsed.errorMessage).toContain('Wrong password');
});
