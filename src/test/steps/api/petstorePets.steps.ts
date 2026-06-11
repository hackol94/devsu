import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { APIResponse } from '@playwright/test';
import { fixture } from '../../../hooks/hooks';
import { PetStorePetsTask, PetPayload } from '../../../tasks/api/petStorePetsTask';

let petId: number;
let petName: string;
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

Given('que genero un ID unico para la mascota de PetStore', async function () {
  petId = Date.now() % 999999;
  petName = 'Firulais';
});

Given('que existe una mascota previamente creada con ID dinamico en PetStore', async function () {
  petId = Date.now() % 999999;
  petName = 'Firulais';
  const pet: PetPayload = { id: petId, name: petName, status: 'available', photoUrls: ['https://example.com/firulais.jpg'] };
  const res = await PetStorePetsTask.createPet(fixture, pet);
  expect(res.status()).toBe(200);
});

Given('que existe al menos una mascota con status "sold" en PetStore', async function () {
  petId = Date.now() % 999999;
  const pet: PetPayload = { id: petId, name: 'MascotaSold', status: 'available', photoUrls: ['https://example.com/mascota.jpg'] };
  await PetStorePetsTask.createPet(fixture, pet);
  await PetStorePetsTask.updatePet(fixture, { ...pet, status: 'sold' });
});

When('envio una peticion POST pet con name "Firulais" y status "available"', async function () {
  const pet: PetPayload = { id: petId, name: 'Firulais', status: 'available', photoUrls: ['https://example.com/firulais.jpg'] };
  response = await PetStorePetsTask.createPet(fixture, pet);
  responseBody = await attachReport(this, 'POST', 'https://petstore.swagger.io/v2/pet', pet, response);
});

When('envio una peticion GET pet con el ID de la mascota creada', async function () {
  response = await PetStorePetsTask.getPetById(fixture, petId);
  responseBody = await attachReport(this, 'GET', `https://petstore.swagger.io/v2/pet/${petId}`, null, response);
});

When('envio una peticion PUT pet con el mismo ID y status "sold"', async function () {
  const updatedPet: PetPayload = { id: petId, name: petName, status: 'sold', photoUrls: ['https://example.com/firulais.jpg'] };
  response = await PetStorePetsTask.updatePet(fixture, updatedPet);
  responseBody = await attachReport(this, 'PUT', 'https://petstore.swagger.io/v2/pet', updatedPet, response);
});

When('envio una peticion GET pet findByStatus con status "sold"', async function () {
  response = await PetStorePetsTask.findPetsByStatus(fixture, 'sold');
  const body = await response.text();
  const parsedArray = JSON.parse(body);
  const htmlContent = `<div style="background:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;margin:8px 0;">` +
    `<strong style="color:#569cd6;">REQUEST</strong>\n` +
    `<span style="color:#ce9178;">GET</span> https://petstore.swagger.io/v2/pet/findByStatus?status=sold\n\n` +
    `<strong style="color:#569cd6;">RESPONSE</strong>\n` +
    `<strong>Status:</strong> <span style="color:#b5cea8;">${response.status()}</span>\n` +
    `<strong>Total Results:</strong> ${parsedArray.length}\n` +
    `<strong>First 3:</strong>\n${escapeHtml(JSON.stringify(parsedArray.slice(0, 3), null, 2))}` +
    `</div>`;
  await this.attach(htmlContent, 'text/html');
  responseBody = body;
});

Then('la respuesta de creacion de mascota debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('el body debe reflejar el name "Firulais" y status "available"', async function () {
  const body = JSON.parse(responseBody);
  expect(body.name).toBe('Firulais');
  expect(body.status).toBe('available');
  expect(body.id).toBe(petId);
});

Then('la respuesta de consulta de mascota debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('el body debe contener el name y status originales de la mascota', async function () {
  const body = JSON.parse(responseBody);
  expect(body.id).toBe(petId);
  expect(body.name).toBe(petName);
  expect(body.status).toBe('available');
});

Then('la respuesta de actualizacion de mascota debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('el body debe reflejar el status actualizado "sold"', async function () {
  const body = JSON.parse(responseBody);
  expect(body.id).toBe(petId);
  expect(body.status).toBe('sold');
});

Then('la respuesta de busqueda por estado debe tener status 200', async function () {
  expect(response.status()).toBe(200);
});

Then('el body debe ser un array que contenga al menos una mascota con status "sold"', async function () {
  const body = JSON.parse(responseBody);
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
  const allSold = body.every((pet: any) => pet.status === 'sold');
  expect(allSold).toBeTruthy();
});
