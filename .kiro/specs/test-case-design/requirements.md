# Documento de Requisitos — Diseño de Casos de Prueba para Clientes (Terceros)

## Introducción

Este documento define los requisitos para la creación de documentación de diseño de casos de prueba, casos de prueba en lenguaje Gherkin y reportes de bugs para la funcionalidad de **Clientes (Terceros)** de la aplicación Siigo (https://qastaging.siigo.com). La funcionalidad permite crear clientes accediendo mediante el botón superior "+Crear" → opción "Clientes". El objetivo es aplicar técnicas de diseño de pruebas reconocidas por ISTQB y generar artefactos de QA de alta calidad.

## Glosario

- **Sistema_Documentación**: Conjunto de archivos Markdown generados en el directorio `docs/` que contienen la documentación de técnicas de diseño de pruebas.
- **Generador_Gherkin**: Componente responsable de producir archivos `.feature` con escenarios escritos en lenguaje Gherkin (español) para los niveles unitario, integración y E2E.
- **Generador_Bug_Report**: Componente responsable de producir el reporte de bug en formato Markdown siguiendo una plantilla estándar de reporte de defectos.
- **Formulario_Clientes**: Formulario de la aplicación Siigo accesible desde "+Crear" → "Clientes" que permite registrar un nuevo cliente (tercero) con campos como tipo de identificación, número de identificación, nombre, dirección, teléfono, correo electrónico, entre otros.
- **Partición_de_Equivalencias**: Técnica de diseño de pruebas que divide los datos de entrada en particiones (clases) donde se espera que todos los valores de una partición sean tratados de la misma manera por el sistema.
- **Análisis_de_Valores_Límite**: Técnica de diseño de pruebas que se enfoca en los valores en los bordes de las particiones de equivalencia.
- **Tabla_de_Decisión**: Técnica de diseño de pruebas que representa combinaciones de condiciones y sus acciones resultantes en formato tabular.
- **Diagrama_de_Transición_de_Estados**: Técnica de diseño de pruebas que modela el comportamiento del sistema como una máquina de estados finitos con estados, transiciones y eventos.
- **Nivel_Unitario**: Nivel de prueba que verifica componentes individuales de forma aislada (por ejemplo, funciones de validación de campos del formulario).
- **Nivel_Integración**: Nivel de prueba que verifica la interacción entre componentes (por ejemplo, formulario con servicios API).
- **Nivel_E2E**: Nivel de prueba end-to-end que verifica flujos completos del usuario desde el login hasta la creación del cliente.

## Requisitos

### Requisito 1: Documentación de Partición de Equivalencias

**User Story:** Como QA Engineer, quiero documentar la aplicación de la técnica de Partición de Equivalencias al formulario de Clientes, para identificar clases válidas e inválidas de datos de entrada y reducir el número de casos de prueba necesarios.

#### Criterios de Aceptación

1. THE Sistema_Documentación SHALL generar un archivo `docs/01-particion-equivalencias.md` que contenga la documentación de la técnica de Partición de Equivalencias aplicada al Formulario_Clientes.
2. WHEN se documenta la Partición_de_Equivalencias, THE Sistema_Documentación SHALL identificar al menos 3 campos del Formulario_Clientes y definir para cada campo las clases de equivalencia válidas e inválidas.
3. WHEN se documenta la Partición_de_Equivalencias, THE Sistema_Documentación SHALL presentar las clases de equivalencia en formato tabular con columnas: Campo, Clase Válida, Clase Inválida y Ejemplo.
4. WHEN se documenta la Partición_de_Equivalencias, THE Sistema_Documentación SHALL incluir una descripción introductoria de la técnica antes de la tabla de clases.
5. WHEN se documenta la Partición_de_Equivalencias, THE Sistema_Documentación SHALL incluir al menos un caso de prueba derivado de las clases de equivalencia identificadas.

### Requisito 2: Documentación de Análisis de Valores Límite

**User Story:** Como QA Engineer, quiero documentar la aplicación de la técnica de Análisis de Valores Límite al formulario de Clientes, para identificar defectos en los bordes de las particiones de equivalencia.

#### Criterios de Aceptación

1. THE Sistema_Documentación SHALL generar un archivo `docs/02-valores-limite.md` que contenga la documentación de la técnica de Análisis de Valores Límite aplicada al Formulario_Clientes.
2. WHEN se documenta el Análisis_de_Valores_Límite, THE Sistema_Documentación SHALL identificar al menos 3 campos del Formulario_Clientes que tengan restricciones de longitud o rango numérico y definir los valores límite para cada campo.
3. WHEN se documenta el Análisis_de_Valores_Límite, THE Sistema_Documentación SHALL presentar los valores límite en formato tabular con columnas: Campo, Límite Inferior, Valor Justo Debajo, Valor en el Límite, Valor Justo Encima y Límite Superior.
4. WHEN se documenta el Análisis_de_Valores_Límite, THE Sistema_Documentación SHALL incluir una descripción introductoria de la técnica antes de la tabla de valores.
5. WHEN se documenta el Análisis_de_Valores_Límite, THE Sistema_Documentación SHALL incluir al menos un caso de prueba derivado de los valores límite identificados.

### Requisito 3: Documentación de Tablas de Decisión

**User Story:** Como QA Engineer, quiero documentar la aplicación de la técnica de Tablas de Decisión al formulario de Clientes, para cubrir combinaciones de condiciones de negocio y sus resultados esperados.

#### Criterios de Aceptación

1. THE Sistema_Documentación SHALL generar un archivo `docs/03-tablas-decision.md` que contenga la documentación de la técnica de Tablas de Decisión aplicada al Formulario_Clientes.
2. WHEN se documenta la Tabla_de_Decisión, THE Sistema_Documentación SHALL definir al menos 3 condiciones de negocio relevantes para la creación de un cliente y sus combinaciones.
3. WHEN se documenta la Tabla_de_Decisión, THE Sistema_Documentación SHALL presentar la tabla de decisión en formato tabular con filas de condiciones, filas de acciones/resultados y columnas de reglas.
4. WHEN se documenta la Tabla_de_Decisión, THE Sistema_Documentación SHALL incluir una descripción introductoria de la técnica antes de la tabla.
5. WHEN se documenta la Tabla_de_Decisión, THE Sistema_Documentación SHALL incluir al menos un caso de prueba derivado de las reglas de la tabla de decisión.

### Requisito 4: Documentación de Diagrama de Transición de Estados

**User Story:** Como QA Engineer, quiero documentar la aplicación de la técnica de Diagrama de Transición de Estados al flujo de creación de Clientes, para modelar los estados del formulario y las transiciones entre ellos.

#### Criterios de Aceptación

1. THE Sistema_Documentación SHALL generar un archivo `docs/04-transicion-estados.md` que contenga la documentación de la técnica de Diagrama de Transición de Estados aplicada al flujo de creación de clientes.
2. WHEN se documenta el Diagrama_de_Transición_de_Estados, THE Sistema_Documentación SHALL identificar al menos 4 estados del flujo de creación de clientes (por ejemplo: Formulario Vacío, Formulario en Edición, Validación, Cliente Creado, Error).
3. WHEN se documenta el Diagrama_de_Transición_de_Estados, THE Sistema_Documentación SHALL definir las transiciones entre estados incluyendo el evento que dispara cada transición.
4. WHEN se documenta el Diagrama_de_Transición_de_Estados, THE Sistema_Documentación SHALL presentar la tabla de transición de estados con columnas: Estado Actual, Evento, Estado Siguiente.
5. WHEN se documenta el Diagrama_de_Transición_de_Estados, THE Sistema_Documentación SHALL incluir una representación textual o diagrama del flujo de estados.
6. WHEN se documenta el Diagrama_de_Transición_de_Estados, THE Sistema_Documentación SHALL incluir al menos un caso de prueba derivado de las transiciones de estado identificadas.

### Requisito 5: Casos de Prueba Gherkin — Nivel Unitario

**User Story:** Como QA Engineer, quiero generar al menos 2 casos de prueba en lenguaje Gherkin a nivel unitario, para verificar la lógica de validación individual de los campos del formulario de Clientes.

#### Criterios de Aceptación

1. THE Generador_Gherkin SHALL generar un archivo `docs/05-gherkin-unitario.md` que contenga al menos 2 escenarios Gherkin a Nivel_Unitario para la funcionalidad de Clientes.
2. WHEN se generan los escenarios de Nivel_Unitario, THE Generador_Gherkin SHALL escribir cada escenario en español utilizando la directiva `# language: es`.
3. WHEN se generan los escenarios de Nivel_Unitario, THE Generador_Gherkin SHALL enfocar cada escenario en la validación de un componente individual aislado (por ejemplo, validación de formato de correo electrónico, validación de longitud de número de identificación).
4. WHEN se generan los escenarios de Nivel_Unitario, THE Generador_Gherkin SHALL utilizar las palabras clave Gherkin en español: Característica, Escenario, Dado, Cuando, Entonces, Y.

### Requisito 6: Casos de Prueba Gherkin — Nivel Integración

**User Story:** Como QA Engineer, quiero generar al menos 2 casos de prueba en lenguaje Gherkin a nivel de integración, para verificar la interacción entre el formulario de Clientes y los servicios backend.

#### Criterios de Aceptación

1. THE Generador_Gherkin SHALL generar un archivo `docs/06-gherkin-integracion.md` que contenga al menos 2 escenarios Gherkin a Nivel_Integración para la funcionalidad de Clientes.
2. WHEN se generan los escenarios de Nivel_Integración, THE Generador_Gherkin SHALL escribir cada escenario en español utilizando la directiva `# language: es`.
3. WHEN se generan los escenarios de Nivel_Integración, THE Generador_Gherkin SHALL enfocar cada escenario en la interacción entre componentes (por ejemplo, envío del formulario al API, respuesta del servicio de validación de identificación).
4. WHEN se generan los escenarios de Nivel_Integración, THE Generador_Gherkin SHALL utilizar las palabras clave Gherkin en español: Característica, Escenario, Dado, Cuando, Entonces, Y.

### Requisito 7: Casos de Prueba Gherkin — Nivel E2E

**User Story:** Como QA Engineer, quiero generar al menos 2 casos de prueba en lenguaje Gherkin a nivel E2E, para verificar el flujo completo de creación de clientes desde el login hasta la confirmación.

#### Criterios de Aceptación

1. THE Generador_Gherkin SHALL generar un archivo feature en `src/test/features/UI/clientes.feature` que contenga al menos 2 escenarios Gherkin a Nivel_E2E para la funcionalidad de Clientes.
2. WHEN se generan los escenarios de Nivel_E2E, THE Generador_Gherkin SHALL escribir cada escenario en español utilizando la directiva `# language: es`.
3. WHEN se generan los escenarios de Nivel_E2E, THE Generador_Gherkin SHALL cubrir el flujo completo del usuario incluyendo: login en la aplicación, navegación al formulario de Clientes mediante "+Crear" → "Clientes", diligenciamiento del formulario y verificación del resultado.
4. WHEN se generan los escenarios de Nivel_E2E, THE Generador_Gherkin SHALL utilizar las palabras clave Gherkin en español: Característica, Escenario, Dado, Cuando, Entonces, Y.
5. WHEN se generan los escenarios de Nivel_E2E, THE Generador_Gherkin SHALL incluir los tags `@layer:Frontend` y un identificador de test (por ejemplo `@TEST_TC-201`) siguiendo la convención del proyecto existente.
6. THE Generador_Gherkin SHALL generar adicionalmente una copia de documentación de los escenarios E2E en `docs/07-gherkin-e2e.md`.

### Requisito 8: Reporte de Bug

**User Story:** Como QA Engineer, quiero generar un reporte de bug para un defecto encontrado en la funcionalidad de Clientes, para documentar el problema de forma clara y facilitar su resolución por el equipo de desarrollo.

#### Criterios de Aceptación

1. THE Generador_Bug_Report SHALL generar un archivo `docs/08-bug-report.md` que contenga un reporte de bug para un defecto simulado en la funcionalidad de Clientes.
2. WHEN se genera el reporte de bug, THE Generador_Bug_Report SHALL incluir los siguientes campos: Título, ID del Bug, Severidad, Prioridad, Entorno, Precondiciones, Pasos para Reproducir, Resultado Esperado, Resultado Actual y Evidencia.
3. WHEN se genera el reporte de bug, THE Generador_Bug_Report SHALL redactar los pasos para reproducir de forma secuencial, clara y reproducible.
4. WHEN se genera el reporte de bug, THE Generador_Bug_Report SHALL clasificar la severidad utilizando una escala estándar (Crítica, Alta, Media, Baja).
5. WHEN se genera el reporte de bug, THE Generador_Bug_Report SHALL incluir información del entorno de prueba: URL de la aplicación, navegador utilizado y sistema operativo.

### Requisito 9: Documento Índice de Documentación

**User Story:** Como QA Engineer, quiero tener un documento índice que consolide y enlace toda la documentación generada, para facilitar la navegación y revisión del trabajo realizado.

#### Criterios de Aceptación

1. THE Sistema_Documentación SHALL generar un archivo `docs/README.md` que sirva como índice de toda la documentación de diseño de casos de prueba.
2. WHEN se genera el índice, THE Sistema_Documentación SHALL incluir enlaces a cada uno de los documentos generados: Partición de Equivalencias, Valores Límite, Tablas de Decisión, Transición de Estados, Gherkin Unitario, Gherkin Integración, Gherkin E2E y Bug Report.
3. WHEN se genera el índice, THE Sistema_Documentación SHALL incluir una breve descripción del propósito de cada documento enlazado.
