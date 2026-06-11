PROYECTO DE AUTOMATIZACION E2E Y API
Playwright + Cucumber + TypeScript

---

DESCRIPCION

Repositorio con 6 ejercicios de automatización:
- 3 pruebas API (DemoBlaze registro/login, PetStore mascotas CRUD, PetStore usuarios CRUD)
- 3 pruebas E2E (DemoBlaze compra, SauceDemo compra, OpenCart guest checkout)

Framework BDD con archivos .feature, step definitions, page objects y tasks.

---

PRE-REQUISITOS

- Node.js >= 18
- npm >= 9

---

INSTALACION

git clone <URL_DEL_REPOSITORIO>
cd devsu-qa-playwrigth-api-e2e
npm install
npx playwright install

---

EJECUCION

Todas las pruebas:
  npm test

Solo API:
  npm run test --TAGS="@API"

Solo E2E:
  npm run test --TAGS="@layer:Frontend"

Por ejercicio:
  npm run test --TAGS="@demoblaze-api"
  npm run test --TAGS="@petstore-pets"
  npm run test --TAGS="@petstore-users"
  npm run test --TAGS="@demoblaze-ui"
  npm run test --TAGS="@saucedemo-ui"
  npm run test --TAGS="@opencart-ui"

---

REPORTES

Se generan automaticamente en target/site/cypress/ despues de cada ejecucion.
Abrir index.html para el reporte consolidado con evidencias.

---

NOTAS

- E2E corre con navegador visible (no headless). Para headless cambiar en BrowserManager.ts
- API no requiere navegador, usa request context de Playwright
- IDs y usernames se generan con timestamps para evitar colisiones entre ejecuciones
- PetStore es servidor publico compartido, si falla por colision solo re-ejecutar
