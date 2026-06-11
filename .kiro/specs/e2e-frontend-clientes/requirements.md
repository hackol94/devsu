# Requirements Document

## Introduction

Este documento define los requisitos para la automatización E2E de la funcionalidad de Clientes (Terceros) en la aplicación Siigo QA Staging. La automatización cubre el flujo completo desde el inicio de sesión hasta la creación exitosa de un cliente a través de la interfaz de usuario, utilizando el framework Playwright + Cucumber BDD con patrón Screenplay implementado en TypeScript.

## Glossary

- **Sistema_Automatización**: Framework de automatización E2E basado en Playwright + Cucumber BDD que ejecuta pruebas sobre la aplicación Siigo QA Staging.
- **LoginPage**: Page Object que encapsula los localizadores y acciones básicas de la página de inicio de sesión de Siigo.
- **ClientesPage**: Page Object que encapsula los localizadores y acciones básicas del formulario de creación de clientes (terceros).
- **LoginTask**: Task de nivel de negocio que orquesta el flujo completo de inicio de sesión utilizando LoginPage.
- **ClientesTask**: Task de nivel de negocio que orquesta el flujo completo de creación de un cliente utilizando ClientesPage.
- **Step_Definitions**: Definiciones de pasos Cucumber que conectan los escenarios Gherkin con las Tasks correspondientes.
- **Feature_File**: Archivo Gherkin en español que describe los escenarios E2E de creación de clientes.
- **Formulario_Clientes**: Formulario de la aplicación Siigo accesible desde el botón "+Crear" → opción "Clientes" que permite registrar un nuevo tercero.
- **Dashboard**: Página principal de la aplicación Siigo que se muestra después de un inicio de sesión exitoso.
- **Notificación_Éxito**: Mensaje o indicador visual que confirma la creación exitosa de un cliente en la aplicación.

## Requirements

### Requirement 1: Navegación e Inicio de Sesión

**User Story:** Como QA Engineer, quiero automatizar el inicio de sesión en la aplicación Siigo QA Staging, para que las pruebas E2E puedan autenticarse antes de ejecutar flujos de negocio.

#### Acceptance Criteria

1. WHEN el Sistema_Automatización navega a la URL `https://qastaging.siigo.com/#/login`, THE LoginPage SHALL mostrar los campos de usuario y contraseña en estado visible dentro de 30 segundos.
2. WHEN el usuario ingresa credenciales válidas (usuario y contraseña) y envía el formulario, THE LoginTask SHALL completar el inicio de sesión y redirigir al Dashboard dentro de 30 segundos.
3. WHEN el inicio de sesión es exitoso, THE Sistema_Automatización SHALL verificar que el Dashboard se encuentra cargado validando la presencia de un elemento identificador de la página principal.
4. IF el inicio de sesión falla por credenciales inválidas, THEN THE LoginPage SHALL mostrar un mensaje de error visible al usuario.
5. IF la página de login no carga dentro del tiempo esperado, THEN THE Sistema_Automatización SHALL registrar el error en el logger y lanzar una excepción descriptiva.

### Requirement 2: Page Object para LoginPage

**User Story:** Como QA Engineer, quiero que el LoginPage existente contenga los localizadores correctos para la página de login de Siigo, para que las interacciones con el formulario de login sean confiables.

#### Acceptance Criteria

1. THE LoginPage SHALL contener localizadores para el campo de correo electrónico, el campo de contraseña y el botón de inicio de sesión que correspondan a los elementos reales de la página `https://qastaging.siigo.com/#/login`.
2. THE LoginPage SHALL exponer métodos de acción para llenar el campo de usuario, llenar el campo de contraseña y hacer clic en el botón de login.
3. THE LoginPage SHALL exponer un método de validación que verifique si la página de login está completamente cargada.
4. THE LoginPage SHALL seguir las convenciones de nomenclatura del proyecto: prefijos TXT_ para inputs, BTN_ para botones, LBL_ para etiquetas.

### Requirement 3: Page Object para ClientesPage

**User Story:** Como QA Engineer, quiero un Page Object para el formulario de creación de clientes, para que los localizadores y acciones del formulario estén centralizados y sean mantenibles.

#### Acceptance Criteria

1. THE ClientesPage SHALL contener localizadores para todos los campos obligatorios del formulario de creación de clientes, incluyendo tipo de documento, número de documento, nombres, apellidos, correo electrónico y teléfono.
2. THE ClientesPage SHALL contener localizadores para el botón "+Crear" del menú superior y la opción "Clientes" del menú desplegable.
3. THE ClientesPage SHALL contener un localizador para el botón de guardar del formulario de creación de clientes.
4. THE ClientesPage SHALL exponer métodos de acción para llenar cada campo del formulario de creación de clientes.
5. THE ClientesPage SHALL exponer un método de acción para navegar al formulario de clientes desde el Dashboard usando el botón "+Crear" y la opción "Clientes".
6. THE ClientesPage SHALL exponer métodos de validación para verificar que el formulario de clientes está cargado y que la creación fue exitosa.
7. THE ClientesPage SHALL seguir las convenciones de nomenclatura del proyecto: prefijos TXT_ para inputs, BTN_ para botones, SEL_ para dropdowns, LBL_ para etiquetas.
8. THE ClientesPage SHALL seguir la misma estructura de código que GoogleSearchPage (Elements readonly, getters, métodos estáticos, métodos de acción, métodos de validación).

### Requirement 4: Task de Login

**User Story:** Como QA Engineer, quiero una Task que orqueste el flujo completo de inicio de sesión, para que los Step Definitions puedan ejecutar el login con una sola llamada.

#### Acceptance Criteria

1. THE LoginTask SHALL exponer un método estático que reciba el PageFixture, el usuario y la contraseña, y ejecute el flujo completo de inicio de sesión.
2. WHEN el LoginTask ejecuta el inicio de sesión, THE LoginTask SHALL navegar a la URL de login, esperar la carga de la página, llenar las credenciales y enviar el formulario.
3. WHEN el LoginTask completa el inicio de sesión, THE LoginTask SHALL esperar a que el Dashboard cargue antes de retornar.
4. THE LoginTask SHALL registrar cada paso del flujo en el logger del PageFixture.
5. THE LoginTask SHALL seguir la misma estructura de código que GoogleSearchTask (clase con métodos estáticos que reciben PageFixture).

### Requirement 5: Task de Creación de Clientes

**User Story:** Como QA Engineer, quiero una Task que orqueste el flujo completo de creación de un cliente, para que los Step Definitions puedan crear un cliente con una sola llamada.

#### Acceptance Criteria

1. THE ClientesTask SHALL exponer un método estático que reciba el PageFixture y los datos del cliente, y ejecute el flujo completo de creación.
2. WHEN el ClientesTask ejecuta la creación, THE ClientesTask SHALL navegar al formulario de clientes usando el botón "+Crear" y la opción "Clientes".
3. WHEN el ClientesTask llena el formulario, THE ClientesTask SHALL completar todos los campos obligatorios con los datos proporcionados.
4. WHEN el ClientesTask envía el formulario, THE ClientesTask SHALL hacer clic en el botón de guardar y esperar la confirmación de creación exitosa.
5. THE ClientesTask SHALL exponer un método estático para verificar que la creación del cliente fue exitosa validando la Notificación_Éxito.
6. THE ClientesTask SHALL registrar cada paso del flujo en el logger del PageFixture.
7. THE ClientesTask SHALL seguir la misma estructura de código que GoogleSearchTask (clase con métodos estáticos que reciben PageFixture).

### Requirement 6: Step Definitions para Clientes

**User Story:** Como QA Engineer, quiero Step Definitions en español que conecten los escenarios Gherkin con las Tasks de login y creación de clientes, para que los escenarios BDD sean ejecutables.

#### Acceptance Criteria

1. THE Step_Definitions SHALL implementar pasos Given en español para el inicio de sesión del usuario en la aplicación Siigo.
2. THE Step_Definitions SHALL implementar pasos When en español para la navegación al formulario de clientes y el llenado del formulario con datos válidos.
3. THE Step_Definitions SHALL implementar pasos Then en español para la verificación de creación exitosa del cliente.
4. THE Step_Definitions SHALL utilizar las Tasks (LoginTask y ClientesTask) para ejecutar las acciones, sin interactuar directamente con los Page Objects.
5. THE Step_Definitions SHALL utilizar el fixture exportado desde hooks.ts para acceder al PageFixture compartido.
6. THE Step_Definitions SHALL configurar un timeout por defecto de 30 segundos usando setDefaultTimeout.
7. THE Step_Definitions SHALL seguir la misma estructura de código que googleSearchSteps.ts (imports, timeout, bloques Given/When/Then con logging).

### Requirement 7: Feature File de Clientes

**User Story:** Como QA Engineer, quiero un archivo Feature en español con escenarios E2E para la creación de clientes, para que las pruebas estén documentadas en formato BDD ejecutable.

#### Acceptance Criteria

1. THE Feature_File SHALL estar escrito en español usando la directiva `# language: es`.
2. THE Feature_File SHALL incluir el tag `@layer:Frontend` a nivel de Característica.
3. THE Feature_File SHALL incluir tags `@TEST_TC-xxx` únicos para cada escenario.
4. THE Feature_File SHALL incluir un escenario E2E que cubra el flujo completo: inicio de sesión, navegación al formulario de clientes, llenado del formulario con datos válidos y verificación de creación exitosa.
5. THE Feature_File SHALL incluir un escenario que verifique la navegación al formulario de clientes desde el Dashboard.
6. THE Feature_File SHALL ubicarse en la ruta `src/test/features/UI/clientes.feature`.
7. THE Feature_File SHALL seguir la misma estructura que google-search.feature (encabezado con historia de usuario, Antecedentes si aplica, escenarios con tags).

### Requirement 8: Manejo de Esperas y Robustez

**User Story:** Como QA Engineer, quiero que la automatización maneje esperas explícitas y errores de forma robusta, para que las pruebas sean estables y no fallen por problemas de sincronización.

#### Acceptance Criteria

1. WHEN el Sistema_Automatización interactúa con un elemento de la página, THE Sistema_Automatización SHALL esperar a que el elemento sea visible antes de interactuar con un timeout configurable.
2. WHEN el Sistema_Automatización navega entre páginas, THE Sistema_Automatización SHALL esperar a que la página destino cargue completamente usando waitForLoadState o waitForSelector.
3. IF un elemento no se encuentra dentro del tiempo de espera, THEN THE Sistema_Automatización SHALL registrar un mensaje descriptivo en el logger antes de lanzar la excepción.
4. THE Sistema_Automatización SHALL utilizar las esperas nativas de Playwright (waitFor, waitForSelector, waitForLoadState) en lugar de esperas fijas (waitForTimeout) excepto cuando sea estrictamente necesario.
5. WHEN el Sistema_Automatización llena campos de formulario con dropdowns, THE Sistema_Automatización SHALL esperar a que las opciones del dropdown estén disponibles antes de seleccionar un valor.
