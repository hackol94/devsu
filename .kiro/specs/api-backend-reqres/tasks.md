# Tareas de Implementación — Automatización Backend: Pruebas API ReqRes.in

## Tarea 1: Crear Modelos de Datos TypeScript
- [ ] 1.1 Crear el archivo `src/models/reqresModels.ts` con las interfaces de request: `CreateUserRequest` (campos `name`, `job`) y `UpdateUserRequest` (campos `name`, `job`)
- [ ] 1.2 Agregar las interfaces de response: `UserData` (campos `id`, `email`, `first_name`, `last_name`, `avatar`), `SupportData` (campos `url`, `text`), `CreateUserResponse` (campos `name`, `job`, `id`, `createdAt`), `UpdateUserResponse` (campos `name`, `job`, `updatedAt`), `SingleUserResponse` (campos `data: UserData`, `support: SupportData`), `ListUsersResponse` (campos `page`, `per_page`, `total`, `total_pages`, `data: UserData[]`, `support: SupportData`)
- [ ] 1.3 Exportar todas las interfaces para uso en Tasks y Steps

## Tarea 2: Crear Esquemas Joi de Validación
- [ ] 2.1 Crear el archivo `src/models/reqresSchemas.ts` con los esquemas base: `userDataSchema` (id: number, email: string email, first_name: string, last_name: string, avatar: string uri) y `supportSchema` (url: string uri, text: string)
- [ ] 2.2 Agregar el esquema `createUserResponseSchema` que valide los campos `name` (string requerido), `job` (string requerido), `id` (string requerido) y `createdAt` (string isoDate requerido)
- [ ] 2.3 Agregar el esquema `singleUserResponseSchema` que valide el objeto `data` con `userDataSchema` y el objeto `support` con `supportSchema`
- [ ] 2.4 Agregar el esquema `listUsersResponseSchema` que valide los campos de paginación (`page`, `per_page`, `total`, `total_pages` como numbers), `data` como array de `userDataSchema` con mínimo 1 elemento, y `support`
- [ ] 2.5 Agregar el esquema `updateUserResponseSchema` que valide los campos `name` (string requerido), `job` (string requerido) y `updatedAt` (string isoDate requerido)
- [ ] 2.6 Exportar todos los esquemas para uso en Steps

## Tarea 3: Crear API Task — ReqResUsersTask
- [ ] 3.1 Crear el archivo `src/tasks/api/ReqResUsersTask.ts` con la estructura base: imports de `APIRequestContext`, `APIResponse` de Playwright, `Logger` de Winston, y los modelos de request desde `reqresModels.ts`
- [ ] 3.2 Implementar el método estático `createUser(request, data, logger)` que envíe POST a `/api/users` con el body `CreateUserRequest`, registre en el logger el método, URL y status, y retorne el `APIResponse`
- [ ] 3.3 Implementar el método estático `listUsers(request, page, logger)` que envíe GET a `/api/users` con query param `page`, registre en el logger y retorne el `APIResponse`
- [ ] 3.4 Implementar el método estático `getUser(request, userId, logger)` que envíe GET a `/api/users/{userId}`, registre en el logger y retorne el `APIResponse`
- [ ] 3.5 Implementar el método estático `updateUser(request, userId, data, logger)` que envíe PUT a `/api/users/{userId}` con el body `UpdateUserRequest`, registre en el logger y retorne el `APIResponse`
- [ ] 3.6 Implementar el método estático `deleteUser(request, userId, logger)` que envíe DELETE a `/api/users/{userId}`, registre en el logger y retorne el `APIResponse`

## Tarea 4: Crear Feature File de Pruebas API
- [ ] 4.1 Crear el archivo `src/test/features/API/reqres-users.feature` con la directiva `# language: es`, tag `@layer:Backend`, historia de usuario y sección de Antecedentes con el paso `Dado que la API de ReqRes está disponible`
- [ ] 4.2 Agregar el escenario E2E `@TEST_TC-301 @smoke @e2e` "Flujo CRUD completo de usuario" con pasos secuenciales: POST crear usuario → verificar 201 y datos → GET obtener usuario → verificar 200 y estructura → PUT actualizar usuario → verificar 200 y datos → DELETE eliminar usuario → verificar 204
- [ ] 4.3 Agregar el escenario individual `@TEST_TC-302` "Crear un usuario exitosamente" con pasos: POST crear usuario → verificar 201, estructura Joi y datos
- [ ] 4.4 Agregar el escenario individual `@TEST_TC-303` "Listar usuarios de la página 2" con pasos: GET listar usuarios página 2 → verificar 200, estructura Joi y que la lista contenga usuarios
- [ ] 4.5 Agregar el escenario individual `@TEST_TC-304` "Obtener un usuario individual por ID" con pasos: GET obtener usuario ID 2 → verificar 200, estructura Joi e ID correcto
- [ ] 4.6 Agregar el escenario individual `@TEST_TC-305` "Eliminar un usuario exitosamente" con pasos: DELETE eliminar usuario ID 2 → verificar 204 y cuerpo vacío

## Tarea 5: Crear Step Definitions para API
- [ ] 5.1 Crear el archivo `src/test/steps/api/reqresUsersSteps.ts` con imports de `@cucumber/cucumber` (Before, After, Given, When, Then, setDefaultTimeout), `@playwright/test` (expect, request, APIRequestContext, APIResponse), Logger, createLogger, ReqResUsersTask, modelos y esquemas. Configurar `setDefaultTimeout(30000)` y declarar variables de estado: `apiContext`, `logger`, `lastResponse`, `lastResponseBody`, `createdUserId`
- [ ] 5.2 Implementar el hook `Before({ tags: '@layer:Backend' })` que cree el `APIRequestContext` con baseURL `https://reqres.in` y header `Content-Type: application/json`, y el hook `After({ tags: '@layer:Backend' })` que cierre el `APIRequestContext` con `dispose()`
- [ ] 5.3 Implementar el paso Given `que la API de ReqRes está disponible` que registre en el logger que la API está lista
- [ ] 5.4 Implementar los pasos When para cada operación HTTP: POST crear usuario (con parámetros name y job), GET listar usuarios (con parámetro page), GET obtener usuario (con parámetro userId), PUT actualizar usuario (con parámetros userId, name y job), DELETE eliminar usuario (con parámetro userId). Cada paso debe llamar al método correspondiente de ReqResUsersTask y almacenar la respuesta en `lastResponse` y `lastResponseBody`
- [ ] 5.5 Implementar los pasos Then para validaciones: verificar código de estado HTTP, validar estructura con esquemas Joi (creación, lista, usuario individual, actualización), verificar contenido de datos (name, job, id), verificar cuerpo vacío para DELETE, y almacenar ID del usuario creado

## Tarea 6: Verificación e Integración
- [ ] 6.1 Verificar que el proyecto compila sin errores de TypeScript ejecutando `npx tsc --noEmit`
- [ ] 6.2 Verificar que los imports y dependencias entre archivos son correctos (Steps → Tasks → Models/Schemas → Playwright/Joi)
- [ ] 6.3 Ejecutar un dry-run de Cucumber para verificar que los steps están correctamente vinculados al feature file: `npx cucumber-js --dry-run --tags "@layer:Backend"`
