# Requirements Document

## Introduction

Este documento define los requisitos para la automatización de pruebas Backend de la API pública ReqRes.in (`https://reqres.in`). La automatización cubre la verificación funcional de los endpoints REST principales (POST, GET, PUT, DELETE) para el recurso de usuarios, validando códigos de estado HTTP, estructura de respuesta y contenido de datos. La implementación utiliza el framework existente de Playwright + Cucumber BDD con TypeScript, usando `APIRequestContext` de Playwright para las peticiones HTTP y Joi para validación de esquemas.

## Glossary

- **Sistema_API_Test**: Framework de automatización Backend basado en Playwright `APIRequestContext` + Cucumber BDD que ejecuta pruebas funcionales contra la API de ReqRes.in.
- **ReqRes_API**: API REST pública disponible en `https://reqres.in/api` que expone endpoints CRUD para el recurso de usuarios.
- **API_Task**: Clase TypeScript con métodos estáticos que encapsula las peticiones HTTP hacia la ReqRes_API usando `APIRequestContext` de Playwright.
- **Step_Definitions_API**: Definiciones de pasos Cucumber que conectan los escenarios Gherkin Backend con las API_Tasks correspondientes.
- **Feature_File_API**: Archivo Gherkin en español que describe los escenarios de prueba Backend para la ReqRes_API.
- **Request_Model**: Interfaz TypeScript que define la estructura del cuerpo de las peticiones HTTP enviadas a la ReqRes_API.
- **Response_Model**: Interfaz TypeScript que define la estructura esperada de las respuestas HTTP recibidas de la ReqRes_API.
- **Schema_Validator**: Módulo que utiliza la librería Joi para validar que la estructura de las respuestas HTTP cumple con el esquema esperado.
- **APIRequestContext**: Interfaz de Playwright que permite realizar peticiones HTTP directas sin necesidad de un navegador.

## Requirements

### Requirement 1: Configuración del APIRequestContext

**User Story:** Como QA Engineer, quiero configurar un `APIRequestContext` de Playwright para la API de ReqRes.in, para que las pruebas Backend puedan ejecutar peticiones HTTP sin necesidad de un navegador.

#### Acceptance Criteria

1. WHEN un escenario con tag `@layer:Backend` se ejecuta, THE Sistema_API_Test SHALL crear una instancia de `APIRequestContext` con la URL base `https://reqres.in` antes de ejecutar los pasos del escenario.
2. THE Sistema_API_Test SHALL configurar el header `Content-Type: application/json` por defecto en todas las peticiones realizadas por el APIRequestContext.
3. WHEN el escenario finaliza, THE Sistema_API_Test SHALL cerrar la instancia de `APIRequestContext` para liberar recursos.
4. IF la creación del `APIRequestContext` falla, THEN THE Sistema_API_Test SHALL registrar el error en el logger y lanzar una excepción descriptiva.

### Requirement 2: Modelos de Datos para Request y Response

**User Story:** Como QA Engineer, quiero interfaces TypeScript que definan la estructura de las peticiones y respuestas de la ReqRes_API, para que los datos estén tipados y las validaciones sean confiables.

#### Acceptance Criteria

1. THE Request_Model SHALL definir una interfaz `CreateUserRequest` con los campos `name` (string) y `job` (string) para las peticiones POST de creación de usuario.
2. THE Request_Model SHALL definir una interfaz `UpdateUserRequest` con los campos `name` (string) y `job` (string) para las peticiones PUT de actualización de usuario.
3. THE Response_Model SHALL definir una interfaz `CreateUserResponse` con los campos `name` (string), `job` (string), `id` (string) y `createdAt` (string).
4. THE Response_Model SHALL definir una interfaz `UpdateUserResponse` con los campos `name` (string), `job` (string) y `updatedAt` (string).
5. THE Response_Model SHALL definir una interfaz `SingleUserResponse` con los campos `data` (objeto con `id`, `email`, `first_name`, `last_name`, `avatar`) y `support` (objeto con `url`, `text`).
6. THE Response_Model SHALL definir una interfaz `ListUsersResponse` con los campos `page`, `per_page`, `total`, `total_pages`, `data` (array de objetos usuario) y `support`.

### Requirement 3: API Task para Peticiones HTTP

**User Story:** Como QA Engineer, quiero una API_Task que encapsule todas las peticiones HTTP hacia la ReqRes_API, para que los Step Definitions puedan ejecutar operaciones CRUD con llamadas simples.

#### Acceptance Criteria

1. THE API_Task SHALL exponer un método estático para crear un usuario enviando una petición POST a `/api/users` con un cuerpo de tipo `CreateUserRequest` y retornando el `APIResponse` de Playwright.
2. THE API_Task SHALL exponer un método estático para obtener la lista de usuarios enviando una petición GET a `/api/users` con un parámetro de query `page` y retornando el `APIResponse`.
3. THE API_Task SHALL exponer un método estático para obtener un usuario individual enviando una petición GET a `/api/users/{id}` y retornando el `APIResponse`.
4. THE API_Task SHALL exponer un método estático para actualizar un usuario enviando una petición PUT a `/api/users/{id}` con un cuerpo de tipo `UpdateUserRequest` y retornando el `APIResponse`.
5. THE API_Task SHALL exponer un método estático para eliminar un usuario enviando una petición DELETE a `/api/users/{id}` y retornando el `APIResponse`.
6. THE API_Task SHALL registrar en el logger el método HTTP, la URL y el código de estado de cada petición ejecutada.

### Requirement 4: Validación de Esquemas con Joi

**User Story:** Como QA Engineer, quiero validar la estructura de las respuestas HTTP usando esquemas Joi, para que las pruebas verifiquen que la API retorna datos con la estructura correcta.

#### Acceptance Criteria

1. THE Schema_Validator SHALL definir un esquema Joi para `CreateUserResponse` que valide los campos `name` (string requerido), `job` (string requerido), `id` (string requerido) y `createdAt` (string en formato ISO requerido).
2. THE Schema_Validator SHALL definir un esquema Joi para `SingleUserResponse` que valide la estructura completa incluyendo el objeto `data` con campos `id` (number), `email` (string con formato email), `first_name` (string), `last_name` (string), `avatar` (string con formato URI) y el objeto `support`.
3. THE Schema_Validator SHALL definir un esquema Joi para `ListUsersResponse` que valide los campos de paginación (`page`, `per_page`, `total`, `total_pages` como numbers) y `data` como array de objetos usuario.
4. THE Schema_Validator SHALL definir un esquema Joi para `UpdateUserResponse` que valide los campos `name` (string requerido), `job` (string requerido) y `updatedAt` (string en formato ISO requerido).
5. WHEN una validación de esquema falla, THE Schema_Validator SHALL retornar un mensaje de error descriptivo indicando los campos que no cumplen con el esquema.

### Requirement 5: Feature File de Pruebas Backend API

**User Story:** Como QA Engineer, quiero un archivo Feature en español con escenarios BDD para las pruebas Backend de la ReqRes_API, para que las pruebas estén documentadas en formato ejecutable.

#### Acceptance Criteria

1. THE Feature_File_API SHALL estar escrito en español usando la directiva `# language: es`.
2. THE Feature_File_API SHALL incluir el tag `@layer:Backend` a nivel de Característica.
3. THE Feature_File_API SHALL incluir tags `@TEST_TC-xxx` únicos para cada escenario.
4. THE Feature_File_API SHALL incluir un escenario E2E que cubra el flujo CRUD completo: crear un usuario (POST), consultar el usuario creado (GET), actualizar el usuario (PUT) y eliminar el usuario (DELETE), verificando códigos de estado y datos en cada paso.
5. THE Feature_File_API SHALL incluir un escenario individual para la creación de un usuario (POST) que verifique el código de estado 201, la estructura de la respuesta y que los datos retornados coincidan con los enviados.
6. THE Feature_File_API SHALL incluir un escenario individual para la consulta de lista de usuarios (GET) que verifique el código de estado 200, la estructura de paginación y que el array de usuarios contenga elementos.
7. THE Feature_File_API SHALL incluir un escenario individual para la consulta de un usuario individual (GET) que verifique el código de estado 200, la estructura de la respuesta y los datos del usuario.
8. THE Feature_File_API SHALL incluir un escenario individual para la eliminación de un usuario (DELETE) que verifique el código de estado 204.
9. THE Feature_File_API SHALL ubicarse en la ruta `src/test/features/API/reqres-users.feature`.

### Requirement 6: Step Definitions para Pruebas Backend API

**User Story:** Como QA Engineer, quiero Step Definitions en español que conecten los escenarios Gherkin Backend con las API_Tasks, para que los escenarios BDD sean ejecutables.

#### Acceptance Criteria

1. THE Step_Definitions_API SHALL implementar pasos Given en español para la configuración del contexto de la API (APIRequestContext disponible).
2. THE Step_Definitions_API SHALL implementar pasos When en español para ejecutar peticiones POST, GET, PUT y DELETE usando las API_Tasks.
3. THE Step_Definitions_API SHALL implementar pasos Then en español para verificar códigos de estado HTTP, estructura de respuesta mediante esquemas Joi y contenido de datos específicos.
4. THE Step_Definitions_API SHALL almacenar las respuestas HTTP y datos relevantes (como el ID del usuario creado) en variables del contexto del escenario para reutilización entre pasos.
5. THE Step_Definitions_API SHALL utilizar `expect` de Playwright para las aserciones de códigos de estado y datos.
6. THE Step_Definitions_API SHALL configurar un timeout por defecto de 30 segundos usando `setDefaultTimeout`.
7. THE Step_Definitions_API SHALL seguir la misma estructura de código que `googleSearchSteps.ts` (imports, timeout, bloques Given/When/Then con logging).

### Requirement 7: Verificación de Respuestas HTTP

**User Story:** Como QA Engineer, quiero que las pruebas Backend verifiquen exhaustivamente las respuestas HTTP, para asegurar que la API funciona correctamente.

#### Acceptance Criteria

1. WHEN el Sistema_API_Test recibe una respuesta de creación de usuario (POST), THE Step_Definitions_API SHALL verificar que el código de estado es 201, que el cuerpo contiene los campos `name`, `job`, `id` y `createdAt`, y que los valores de `name` y `job` coinciden con los datos enviados.
2. WHEN el Sistema_API_Test recibe una respuesta de lista de usuarios (GET), THE Step_Definitions_API SHALL verificar que el código de estado es 200, que el cuerpo contiene los campos de paginación y que el array `data` contiene al menos un usuario con campos `id`, `email`, `first_name`, `last_name` y `avatar`.
3. WHEN el Sistema_API_Test recibe una respuesta de usuario individual (GET), THE Step_Definitions_API SHALL verificar que el código de estado es 200, que el objeto `data` contiene los campos `id`, `email`, `first_name`, `last_name` y `avatar`, y que el `id` corresponde al solicitado.
4. WHEN el Sistema_API_Test recibe una respuesta de actualización de usuario (PUT), THE Step_Definitions_API SHALL verificar que el código de estado es 200, que el cuerpo contiene los campos `name`, `job` y `updatedAt`, y que los valores de `name` y `job` coinciden con los datos enviados.
5. WHEN el Sistema_API_Test recibe una respuesta de eliminación de usuario (DELETE), THE Step_Definitions_API SHALL verificar que el código de estado es 204 y que el cuerpo de la respuesta está vacío.
