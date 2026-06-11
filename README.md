# Devsu QA — Framework de Automatización E2E

Framework de automatización de pruebas end-to-end construido con **Playwright** y **Cucumber (BDD)** en TypeScript. Cubre pruebas de UI y API bajo el enfoque Screenplay Pattern, con soporte para ejecución en múltiples navegadores, ambientes y reporte automático de resultados.

---

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18.0.0 | Runtime |
| TypeScript | ^5.8 | Lenguaje principal |
| Playwright | ^1.52 | Automatización UI y cliente HTTP |
| Cucumber.js | ^11.3 | Motor BDD / Gherkin |
| Winston | ^3.13 | Logging |
| dotenv | ^16.4 | Gestión de variables de entorno |
| concurrently | ^8.2 | Ejecución cross-browser en paralelo |
| SonarQube | — | Análisis estático de código |

---

## Estructura del proyecto

```
src/
├── helper/
│   ├── browser/        # BrowserManager — Singleton para gestión del navegador (local y LambdaTest)
│   ├── env/            # Carga de variables de entorno por ambiente (.env.dev, .env.stg, .env.prod)
│   ├── mock/           # Sistema de mocks para interceptación de red
│   ├── report/         # Generación, merge y publicación de reportes HTML
│   ├── types/          # Tipado global de variables de entorno (env.d.ts)
│   ├── util/           # Logger configurado con Winston
│   └── wrapper/
│       ├── asserts/    # Wrappers de aserciones reutilizables
│       └── interactions/ # Wrappers de interacciones con la UI
├── hooks/
│   ├── hooks.ts        # Hooks de Cucumber (BeforeAll, Before, After, AfterAll)
│   └── pageFixture.ts  # Contenedor de estado compartido entre steps, tasks y pages
├── models/             # Modelos de datos / DTOs
├── pages/              # Page Objects (capa de abstracción de UI)
├── resources/
│   ├── data/           # Datos de prueba
│   └── loadfiles/      # Archivos de carga: mocks y respuestas simuladas
├── setup/              # Configuración inicial del framework
├── tasks/
│   ├── api/            # Tasks de API (Screenplay Pattern)
│   └── ui/             # Tasks de UI (Screenplay Pattern)
└── test/
    ├── features/
    │   ├── API/        # Escenarios Gherkin para pruebas de API
    │   └── UI/         # Escenarios Gherkin para pruebas de UI
    ├── navigateTo/     # Helpers de navegación
    └── steps/
        ├── api/        # Step definitions de API
        └── ui/         # Step definitions de UI
```

---

## Prerrequisitos

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

---

## Instalación

```bash
npm install
```

Esto instala dependencias, descarga los binarios de Playwright e inicializa el reporte automáticamente gracias a los scripts `pretest` y `postinstall`.

---

## Configuración de ambientes

Las variables de entorno se cargan desde `src/helper/env/` según el valor de la variable `ENV`:

| Archivo | Ambiente |
|---|---|
| `.env.dev` | Desarrollo |
| `.env.stg` | Staging |
| `.env.prod` | Producción |

Variables principales requeridas en cada archivo:

```env
BASEURL=https://...
API_BASE_URL=https://...
BROWSER=chrome_latest
ENV=dev
```

> Los archivos `.env.*` están excluidos del repositorio. Solicítalos al equipo de QA.

---

## Ejecución de pruebas

### Todos los tests
```bash
npm test
```

### Por tag específico
```bash
npm run test --TAGS="@nombre_del_tag"
```

### Por navegador
```bash
npm run chrome:test
npm run firefox:test
npm run safari:test
```

### Cross-browser en paralelo
```bash
npm run parallelCrossBrowser
```

### Reejecutar tests fallidos
```bash
npm run test:failed
```

---

## Tags disponibles

Los escenarios se etiquetan para controlar su ejecución:

| Tag | Descripción |
|---|---|
| `@layer:Frontend` | Pruebas de UI — activa el navegador |
| `@API` | Pruebas de API — solo contexto HTTP |
| `@TEST_TC-XXX` | Identificador del caso de prueba (Xray) |

---

## Reportes

Los reportes se generan automáticamente en `target/site/cypress/` al finalizar la ejecución.

```bash
# Generar reporte HTML consolidado
npm run generate:merged:html

# Mergear múltiples reportes JSON
npm run mergeReports
```

---

## Arquitectura

El framework sigue el **Screenplay Pattern**:

- **Features** → describen el comportamiento en Gherkin
- **Steps** → traducen los pasos Gherkin a acciones
- **Tasks** → agrupan acciones de negocio reutilizables
- **Pages** → encapsulan los selectores y acciones sobre la UI
- **PageFixture** → estado compartido entre todos los componentes del escenario

Los hooks de Cucumber gestionan el ciclo de vida:
- `BeforeAll` → carga el ambiente e inicializa el BrowserManager
- `Before` → lanza el navegador (UI) o crea contexto HTTP (API) según los tags
- `After` → captura screenshot en caso de fallo y registra el resultado
- `AfterAll` → cierra recursos

---

## Ejecución remota — LambdaTest

Para ejecutar en LambdaTest, configurar en el archivo `.env` correspondiente:

```env
ltDevice=true
LT_USERNAME=tu_usuario
LT_ACCESS_KEY=tu_access_key
```

---

## Análisis de código — SonarQube

```bash
npm run sonar
```

Requiere las variables de entorno:
```env
SONAR_ORGANIZATION=...
SONAR_URL=https://sonarcloud.io
SONAR_TOKEN=...
```

---

## Flujo de ramas

```
master
  └── develop
        └── feature/devsu
```

Los cambios se desarrollan en `feature/devsu`, se integran a `develop` y finalmente a `master`.
