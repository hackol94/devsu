# Tareas de Implementación — Automatización E2E Frontend: Login + Creación de Clientes

## Tarea 1: Actualizar LoginPage con localizadores reales de Siigo
- [ ] 1.1 Inspeccionar la página `https://qastaging.siigo.com/#/login` e identificar los selectores CSS/XPath reales para: campo de email, campo de contraseña, botón de login, mensaje de error y un elemento indicador del Dashboard post-login
- [ ] 1.2 Actualizar el objeto `Elements` en `src/pages/LoginPage.ts` reemplazando los localizadores genéricos por los selectores reales de Siigo, manteniendo las convenciones de nomenclatura (TXT_, BTN_, LBL_)
- [ ] 1.3 Actualizar los getters y métodos de acción (`fillEmail`, `fillPassword`, `clickLogin`, `login`) para que usen los nuevos localizadores
- [ ] 1.4 Agregar el getter `dashboardIndicator` y los métodos `isDashboardLoaded()` y `waitForDashboard(timeout?)` para validar la carga del Dashboard post-login
- [ ] 1.5 Verificar que `isPageLoaded()` y `waitForPageLoad()` funcionan con los nuevos localizadores

## Tarea 2: Crear ClientesPage
- [ ] 2.1 Crear el archivo `src/pages/ClientesPage.ts` con la estructura base siguiendo el patrón de `GoogleSearchPage.ts`: imports, clase con Elements readonly, constructor que recibe `Page`
- [ ] 2.2 Definir el objeto `Elements` con localizadores para: BTN_CREAR (botón "+Crear"), BTN_OPCION_CLIENTES (opción "Clientes" del menú), SEL_TIPO_DOCUMENTO, TXT_NUMERO_DOCUMENTO, TXT_PRIMER_NOMBRE, TXT_SEGUNDO_NOMBRE, TXT_PRIMER_APELLIDO, TXT_SEGUNDO_APELLIDO, TXT_EMAIL, TXT_TELEFONO, BTN_GUARDAR, LBL_NOTIFICACION_EXITO, LBL_TITULO_FORMULARIO
- [ ] 2.3 Implementar getters para cada elemento del formulario que retornen `Locator`
- [ ] 2.4 Implementar el método `navigateToClientesForm()` que haga clic en "+Crear" y luego en "Clientes", esperando la carga del formulario
- [ ] 2.5 Implementar métodos de acción para llenar cada campo: `selectTipoDocumento()`, `fillNumeroDocumento()`, `fillPrimerNombre()`, `fillSegundoNombre()`, `fillPrimerApellido()`, `fillSegundoApellido()`, `fillEmail()`, `fillTelefono()`, `clickGuardar()`
- [ ] 2.6 Implementar métodos de validación: `isFormLoaded()`, `waitForFormLoad()`, `isCreacionExitosa()`, `waitForCreacionExitosa()`

## Tarea 3: Crear LoginTask
- [ ] 3.1 Crear el archivo `src/tasks/ui/LoginTask.ts` con la estructura base siguiendo el patrón de Tasks del proyecto: clase con métodos estáticos que reciben `PageFixture`
- [ ] 3.2 Implementar el método estático `performLogin(fixture, email, password)` que: navegue a la URL de login, espere la carga de la página, llene credenciales, envíe el formulario y espere la carga del Dashboard, registrando cada paso en el logger
- [ ] 3.3 Implementar el método estático `verifyDashboardLoaded(fixture)` que retorne `boolean` indicando si el Dashboard está cargado

## Tarea 4: Crear ClientesTask
- [ ] 4.1 Crear el archivo `src/tasks/ui/ClientesTask.ts` con la estructura base siguiendo el patrón de Tasks del proyecto: clase con métodos estáticos que reciben `PageFixture`
- [ ] 4.2 Definir la interfaz `ClienteData` con los campos: tipoDocumento, numeroDocumento, primerNombre, segundoNombre (opcional), primerApellido, segundoApellido (opcional), email, telefono
- [ ] 4.3 Implementar el método estático `navigateToClientesForm(fixture)` que use ClientesPage para navegar al formulario desde el Dashboard, registrando cada paso en el logger
- [ ] 4.4 Implementar el método estático `createCliente(fixture, data)` que: navegue al formulario, llene todos los campos con los datos proporcionados, haga clic en guardar y espere la confirmación, registrando cada paso en el logger
- [ ] 4.5 Implementar el método estático `verifyCreacionExitosa(fixture)` que retorne `boolean` indicando si la notificación de éxito es visible

## Tarea 5: Crear Feature File de Clientes
- [ ] 5.1 Crear el archivo `src/test/features/UI/clientes.feature` con la directiva `# language: es`, tag `@layer:Frontend`, historia de usuario y sección de Antecedentes con el paso de login
- [ ] 5.2 Agregar el escenario `@TEST_TC-201 @smoke` "Creación exitosa de un cliente con datos válidos" con pasos: navegación al formulario, llenado con datos válidos, guardado y verificación de notificación de éxito
- [ ] 5.3 Agregar el escenario `@TEST_TC-202` "Navegación al formulario de clientes desde el Dashboard" con pasos: navegación al formulario y verificación de que el formulario está cargado

## Tarea 6: Crear Step Definitions de Clientes
- [ ] 6.1 Crear el archivo `src/test/steps/ui/clientesSteps.ts` con imports de `@cucumber/cucumber`, `@playwright/test`, `fixture` desde hooks, `LoginTask`, `ClientesTask`, `ClientesPage` y configurar `setDefaultTimeout(30000)`
- [ ] 6.2 Implementar el paso Given `que el usuario inicia sesión en Siigo` que ejecute `LoginTask.performLogin()` con las credenciales de Siigo QA Staging
- [ ] 6.3 Implementar los pasos When: `el usuario navega al formulario de creación de clientes`, `el usuario llena el formulario con datos válidos de cliente`, `el usuario guarda el formulario de cliente`
- [ ] 6.4 Implementar los pasos Then: `el usuario debe ver el Dashboard de Siigo`, `el usuario debe ver el formulario de creación de clientes`, `el usuario debe ver una notificación de creación exitosa`

## Tarea 7: Verificación e Integración
- [ ] 7.1 Verificar que el proyecto compila sin errores de TypeScript ejecutando `npx tsc --noEmit`
- [ ] 7.2 Verificar que los imports y dependencias entre archivos son correctos (Steps → Tasks → Pages → Playwright)
- [ ] 7.3 Ejecutar un dry-run de Cucumber para verificar que los steps están correctamente vinculados al feature file: `npx cucumber-js --dry-run --tags "@TEST_TC-201 or @TEST_TC-202"`
