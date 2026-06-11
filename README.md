# 📋 Análisis del Proyecto: `devsu-playwrigth-api-e2e`

## 🧱 Resumen Ejecutivo

Framework de automatización **E2E híbrido** (UI + API) construido sobre **Playwright + Cucumber (BDD)** con TypeScript. Su objetivo es probar la plataforma **Siigo/Devsu** de manera integral, cubriendo flujos de usuario en navegador y verificación de servicios REST.

---

## 🏗️ Stack Tecnológico

| Categoría | Herramienta | Versión |
|-----------|-------------|---------|
| Core UI/API | Playwright | `^1.52.0` |
| BDD Runner | Cucumber-JS | `^11.3.0` |
| Lenguaje | TypeScript | `^5.8.3` |
| Runtime | Node.js | `>=18.0.0` |
| Reportes | multiple-cucumber-html-reporter | `^3.6.2` |
| Logging | Winston | `^3.13.0` |
| Validación esquemas | Joi | `^17.13.3` |
| Ejecución remota | LambdaTest (CDPoverWS) | `^4.0.8` |
| Quality Gate | SonarScanner | `^3.1.0` |
| Cross-env | concurrently + cross-env | - |

---

## 🗂️ Arquitectura y Estructura de Carpetas

```
src/
├── pages/              # Page Object Model (POM)
│   ├── LoginPage.ts    # Localizadores + métodos de login
│   └── ClientPage.ts   # Localizadores + métodos de creación de clientes
│
├── tasks/              # Capa de Tareas (orquestación de acciones)
│   ├── ui/
│   │   ├── LoginTask.ts         # Flujo completo de login
│   │   └── CreateClientTask.ts  # Flujo completo de creación de cliente
│   └── api/
│       └── ReqResTask.ts        # Llamadas REST a ReqRes API
│
├── test/
│   ├── features/       # Archivos Gherkin (.feature)
│   │   ├── UI/
│   │   │   ├── login_siigo.feature
│   │   │   └── crear_cliente.feature
│   │   └── API/
│   │       └── reqres.feature
│   └── steps/          # Implementación de step definitions
│       ├── ui/
│       │   ├── loginSteps.ts
│       │   └── crearClienteSteps.ts
│       └── api/
│           └── reqresSteps.ts
│
├── hooks/
│   ├── hooks.ts        # Before/After hooks del ciclo Cucumber
│   └── pageFixture.ts  # Estado compartido entre pasos (contexto global)
│
├── helper/
│   ├── browser/
│   │   └── BrowserManager.ts   # Singleton de gestión del browser
│   ├── mock/
│   │   └── MockSystem.ts       # Sistema de intercepción de red
│   ├── report/
│   │   ├── init.ts
│   │   ├── mergeReports.ts     # Fusión de reportes JSON
│   │   ├── report.ts           # Generación HTML
│   │   └── postReport.ts
│   ├── util/
│   │   └── logger.ts           # Winston logger por escenario
│   └── wrapper/
│       ├── asserts/            # (Vacío - preparado para wrappers de assertions)
│       └── interactions/       # (Vacío - preparado para wrappers de interacción)
│
└── resources/
    ├── data/           # (Vacío - reservado para datos de prueba)
    └── loadfiles/      # Archivos de respuestas mock (mocks.json + JSONs)
```

---

## 🎯 Patrones de Diseño Implementados

### 1. Page Object Model (POM)
Cada página tiene una clase dedicada con:
- `Elements` (objeto `as const`) → centraliza todos los localizadores
- Getters para exponer `Locator` objetos tipados
- Métodos de acción (`fillForm`, `navigateToCreateClient`)
- Métodos de validación (`verifySuccess`, `isPageLoaded`)

### 2. Screenplay Pattern (Tareas)
Capa de `Tasks` que orquesta acciones del POM:
```
Step Definition → Task → Page Object → Playwright
```
Esto desacopla el "qué" (step) del "cómo" (task/page).

### 3. Singleton Pattern
- `BrowserManager` → instancia única del browser compartida entre hooks
- `MockSystem` → carga la configuración de mocks una sola vez

### 4. Fixture Pattern
`PageFixture` actúa como contenedor de estado compartido entre todos los steps de un escenario (page, context, browser, logger, testId, etc.)

---

## 🔄 Flujo de Ejecución

```mermaid
graph TD
    A[npm run test] --> B[BeforeAll: dotenv + BrowserManager init]
    B --> C[Before Hook por Escenario]
    C -->|@layer:Frontend| D[Lanzar Browser + PageFixture UI]
    C -->|Sin tag frontend| E[APIRequestContext + PageFixture API]
    D --> F[Network Capture: XHR/Fetch → Cucumber Attachments]
    E --> G[Steps API puras]
    F --> H[Steps UI: Login → Navegación → Formulario]
    H --> I[After Hook]
    G --> I
    I -->|FAILED| J[Screenshot automático → Embed en reporte]
    I --> K[TestResult → BrowserManager.addTestResult]
    K --> L[closeBrowser]
    L --> M[posttest: postReport.ts]
    M --> N[Reporte JSON + HTML en target/]
```

---

## 📝 Escenarios de Prueba Actuales

### 🖥️ UI Tests

| Tag | Feature | Descripción |
|-----|---------|-------------|
| `@TEST_TC-300` | login_siigo | Login exitoso con credenciales válidas |
| `@TEST_TC-200` | crear_cliente | Creación exitosa de cliente persona |

### 🌐 API Tests (ReqRes.in)

| Tag | Método | Descripción |
|-----|--------|-------------|
| `@GET @smoke` | GET /users | Listar usuarios pág. 2 |
| `@POST` | POST /users | Crear usuario |
| `@PUT` | PUT /users/2 | Actualizar usuario |
| `@DELETE` | DELETE /users/2 | Eliminar usuario |
| `@GET` | GET /users/2 | Usuario por ID |
| `@GET @negative` | GET /users/999 | Usuario inexistente (404) |
| `@POST @auth` | POST /login | Login exitoso |
| `@POST @auth @negative` | POST /login | Login sin password (400) |

---

## ⚙️ Configuración y Ambientes

El proyecto soporta **3 entornos** via variables de entorno:

```bash
ENV=dev   → .env.dev
ENV=stg   → .env.stg
ENV=prod  → .env.prod
```

Variables clave esperadas:
- `USER_EMAIL`, `USER_PASS` → Credenciales de login UI
- `REQRES_API_KEY` → API key para ReqRes
- `LT_USERNAME`, `LT_ACCESS_KEY` → Credenciales LambdaTest
- `BROWSER` → chrome_latest (default) / firefox / Safari
- `ltDevice=true` → Activa ejecución remota en LambdaTest
- `viewPort=true` + `viewPort_width/height` → Viewport personalizado

---

## 📊 Sistema de Reportes

1. **Durante ejecución**: Cucumber genera `json-report-{timestamp}.json` + `html-report-{timestamp}.html`
2. **mergeReports.ts**: Fusiona múltiples runs en un único JSON (útil en ejecución paralela/rerun)
3. **report.ts**: Genera reporte HTML consolidado con `multiple-cucumber-html-reporter`
4. **Screenshots automáticos**: En fallos, captura JPEG (quality=15) y los embebe en el reporte

---

## 🔧 Sistema de Mocks (MockSystem.ts)

Permite interceptar llamadas de red con `page.route()`:
- Configurado desde `src/resources/loadfiles/mocks.json`
- Respuestas JSON en `src/resources/loadfiles/response_mocks/`
- Soporta matching por `test_id` y lista de exclusión `exclude[]`
- Glob → RegEx para patrones de URL
- Validación de esquema con Joi (modo `updateSchema`)

> ⚠️ El mock system está implementado pero **no se activa en el hook actual** — está preparado para ser llamado desde `hooks.ts`.

---

## ✅ Fortalezas del Proyecto

- ✅ **Arquitectura limpia** con separación clara de responsabilidades (POM → Tasks → Steps → Hooks)
- ✅ **Soporte híbrido** UI + API en el mismo framework
- ✅ **Logging por escenario** con Winston (trazabilidad alta)
- ✅ **Network capture automático** embebido en reportes
- ✅ **Multi-browser**: Chrome, Firefox, WebKit/Safari
- ✅ **Ejecución remota** lista (LambdaTest)
- ✅ **Rerun automático** con `@rerun.txt`
- ✅ **Sistema de mocks** robusto y flexible
- ✅ **Multiambiente** (dev, stg, prod)
- ✅ **Integración SonarQube** configurada

---

## ⚠️ Áreas de Mejora Identificadas

### Críticas
1. **`LoginPage.ts` tiene getters rotos**: Los getters `cancelButton`, `welcomeLabel`, `pageTitleLabel`, `forgotPasswordLink`, `registerLink` referencian claves que **no existen** en el objeto `Elements` (`BTN_CANCEL`, `LBL_WELCOME`, `LBL_PAGE_TITLE`, `LINK_FORGOT_PASSWORD`, `LINK_REGISTER`). Causaría errores en runtime si se usan.

2. **Credenciales hardcodeadas en steps**: En `crearClienteSteps.ts`, las credenciales están como fallback literal en el código (`'J1h4{zMTV3'`). Deberían estar solo en `.env`.

3. **`wrapper/asserts/` y `wrapper/interactions/` vacíos**: La promesa de wrappers reutilizables no está implementada.

### Moderadas
4. **`parallel: 1` en cucumber.js**: El paralelismo está desactivado, por lo que `concurrently` para cross-browser no funcionaría correctamente sin ajustar esto.
5. **`waitForTimeout` hardcodeados**: Hay timeouts fijos (`1000ms`, `2000ms`) en `ClientPage.ts` que son frágiles; mejor usar esperas explícitas de Playwright.
6. **Screenshot quality muy baja**: `quality: 15` en JPEG hace los screenshots difícilmente legibles.
7. **`src/resources/data/` vacío**: No hay fixture de datos externos; los datos están en el `.feature` file.
8. **`models/` vacío**: La carpeta existe pero no tiene ningún modelo de datos TypeScript.

### Menores
9. El nombre del repo dice "playwrigth" (typo: debería ser "playwright").
10. El path de screenshots apunta a `target/site/cypress/screenshots` — nombre heredado de Cypress, confuso en un proyecto Playwright.

---

## 🏃 Comandos Principales

```bash
# Instalar + correr todos los tests
npm test

# Solo UI - Login
npm run test:login

# Solo UI - Crear Cliente
npm run test:crear-cliente

# Todos (Frontend + API)
npm run test:all

# Cross-browser paralelo
npm run parallelCrossBrowser

# Solo Chrome
npm run chrome:test

# Re-ejecutar fallidos
npm run test:failed

# Generar reporte HTML consolidado
npm run generate:merged:html
```
