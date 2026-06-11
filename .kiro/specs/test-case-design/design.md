# Documento de Diseño — Diseño de Casos de Prueba para Clientes (Terceros)

## Resumen

Este documento describe el diseño técnico para generar la documentación de diseño de casos de prueba, escenarios Gherkin en tres niveles de prueba y un reporte de bug para la funcionalidad de Clientes (Terceros) de Siigo. Todos los artefactos se generan como archivos Markdown y/o archivos `.feature` dentro de la estructura existente del proyecto Playwright + Cucumber BDD.

## Arquitectura de Archivos

La solución genera los siguientes archivos:

```
proyecto/
├── docs/
│   ├── README.md                        ← Índice general
│   ├── 01-particion-equivalencias.md    ← Técnica: Partición de Equivalencias
│   ├── 02-valores-limite.md             ← Técnica: Valores Límite
│   ├── 03-tablas-decision.md            ← Técnica: Tablas de Decisión
│   ├── 04-transicion-estados.md         ← Técnica: Transición de Estados
│   ├── 05-gherkin-unitario.md           ← Gherkin nivel unitario
│   ├── 06-gherkin-integracion.md        ← Gherkin nivel integración
│   ├── 07-gherkin-e2e.md               ← Gherkin nivel E2E (documentación)
│   └── 08-bug-report.md                ← Reporte de bug
└── src/test/features/UI/
    └── clientes.feature                 ← Feature file E2E ejecutable
```

## Diseño Detallado

### Componente 1: Documentación de Partición de Equivalencias

**Archivo**: `docs/01-particion-equivalencias.md`

**Estructura del documento**:
1. Título y descripción de la técnica de Partición de Equivalencias según ISTQB
2. Contexto: aplicación al Formulario de Clientes de Siigo
3. Tabla de clases de equivalencia con los siguientes campos analizados:
   - **Tipo de Identificación**: Clase válida (NIT, Cédula de Ciudadanía, Cédula de Extranjería, Pasaporte), Clase inválida (campo vacío, valor no listado)
   - **Número de Identificación**: Clase válida (numérico de 6-15 dígitos), Clase inválida (vacío, caracteres alfabéticos, longitud fuera de rango)
   - **Nombre/Razón Social**: Clase válida (texto alfanumérico de 1-100 caracteres), Clase inválida (vacío, solo espacios, caracteres especiales no permitidos)
   - **Correo Electrónico**: Clase válida (formato usuario@dominio.ext), Clase inválida (sin @, sin dominio, vacío)
   - **Teléfono**: Clase válida (numérico de 7-10 dígitos), Clase inválida (letras, longitud incorrecta)
4. Casos de prueba derivados de las clases identificadas

**Formato de tabla**:
| Campo | Clase Válida | Clase Inválida | Ejemplo Válido | Ejemplo Inválido |
|-------|-------------|----------------|----------------|------------------|

### Componente 2: Documentación de Análisis de Valores Límite

**Archivo**: `docs/02-valores-limite.md`

**Estructura del documento**:
1. Título y descripción de la técnica de Análisis de Valores Límite según ISTQB
2. Contexto: aplicación a campos con restricciones numéricas o de longitud
3. Tabla de valores límite para los siguientes campos:
   - **Número de Identificación**: Longitud mínima 6, máxima 15 dígitos → valores: 5, 6, 15, 16
   - **Nombre/Razón Social**: Longitud mínima 1, máxima 100 caracteres → valores: 0, 1, 100, 101
   - **Teléfono**: Longitud mínima 7, máxima 10 dígitos → valores: 6, 7, 10, 11
   - **Dirección**: Longitud mínima 5, máxima 200 caracteres → valores: 4, 5, 200, 201
4. Casos de prueba derivados de los valores límite

**Formato de tabla**:
| Campo | Límite Inferior | Justo Debajo | En el Límite Inf. | En el Límite Sup. | Justo Encima | Límite Superior |
|-------|----------------|-------------|-------------------|-------------------|-------------|----------------|

### Componente 3: Documentación de Tablas de Decisión

**Archivo**: `docs/03-tablas-decision.md`

**Estructura del documento**:
1. Título y descripción de la técnica de Tablas de Decisión según ISTQB
2. Contexto: combinaciones de condiciones para la creación exitosa de un cliente
3. Condiciones de negocio identificadas:
   - **C1**: Tipo de identificación seleccionado (Sí/No)
   - **C2**: Número de identificación válido (Sí/No)
   - **C3**: Nombre o razón social ingresado (Sí/No)
   - **C4**: Al menos un dato de contacto proporcionado — correo o teléfono (Sí/No)
4. Acciones/Resultados:
   - **A1**: Cliente creado exitosamente
   - **A2**: Mensaje de error de validación mostrado
   - **A3**: Campo resaltado en rojo
5. Tabla de decisión con al menos 8 reglas cubriendo combinaciones relevantes
6. Casos de prueba derivados de las reglas

**Formato de tabla**:
|                          | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
|--------------------------|----|----|----|----|----|----|----|----|
| **Condiciones**          |    |    |    |    |    |    |    |    |
| C1: Tipo ID seleccionado | Sí | Sí | Sí | Sí | No | No | No | No |
| C2: Número ID válido     | Sí | Sí | No | No | -  | -  | -  | -  |
| ...                      |    |    |    |    |    |    |    |    |
| **Acciones**             |    |    |    |    |    |    |    |    |
| A1: Cliente creado       | Sí | No | No | No | No | No | No | No |
| ...                      |    |    |    |    |    |    |    |    |

### Componente 4: Documentación de Diagrama de Transición de Estados

**Archivo**: `docs/04-transicion-estados.md`

**Estructura del documento**:
1. Título y descripción de la técnica de Transición de Estados según ISTQB
2. Contexto: flujo de creación de clientes en Siigo
3. Estados identificados:
   - **S0 — Página de Login**: Estado inicial, el usuario aún no ha ingresado a la aplicación
   - **S1 — Dashboard**: El usuario ha iniciado sesión exitosamente
   - **S2 — Menú Crear**: El usuario ha hecho clic en "+Crear"
   - **S3 — Formulario Vacío**: El formulario de Clientes se ha abierto sin datos
   - **S4 — Formulario en Edición**: El usuario ha comenzado a ingresar datos
   - **S5 — Validación en Curso**: El sistema está validando los datos ingresados
   - **S6 — Cliente Creado**: El cliente se ha guardado exitosamente
   - **S7 — Error de Validación**: El sistema ha detectado datos inválidos
4. Diagrama textual del flujo de estados (formato ASCII o Mermaid)
5. Tabla de transición de estados
6. Casos de prueba derivados de las transiciones

**Formato de tabla de transiciones**:
| Estado Actual | Evento | Estado Siguiente |
|--------------|--------|-----------------|
| S0 — Login | Credenciales válidas ingresadas | S1 — Dashboard |
| S1 — Dashboard | Clic en "+Crear" | S2 — Menú Crear |
| ... | ... | ... |

### Componente 5: Escenarios Gherkin — Nivel Unitario

**Archivo**: `docs/05-gherkin-unitario.md`

**Diseño de escenarios** (al menos 2):

1. **Validación de formato de correo electrónico**: Verifica que la función de validación del campo de correo electrónico acepta formatos válidos y rechaza formatos inválidos de forma aislada.
2. **Validación de longitud de número de identificación**: Verifica que la función de validación del campo de número de identificación acepta longitudes dentro del rango permitido y rechaza longitudes fuera de rango.

**Convenciones**:
- Directiva `# language: es`
- Palabras clave: Característica, Escenario, Dado, Cuando, Entonces, Y
- Enfoque en lógica de validación pura sin dependencias externas

### Componente 6: Escenarios Gherkin — Nivel Integración

**Archivo**: `docs/06-gherkin-integracion.md`

**Diseño de escenarios** (al menos 2):

1. **Envío de formulario al API de creación de clientes**: Verifica que al enviar el formulario con datos válidos, el frontend invoca correctamente el endpoint del API y recibe una respuesta exitosa.
2. **Validación de duplicidad de identificación**: Verifica que al intentar crear un cliente con un número de identificación ya existente, el API retorna un error de duplicidad y el frontend muestra el mensaje correspondiente.

**Convenciones**:
- Directiva `# language: es`
- Palabras clave: Característica, Escenario, Dado, Cuando, Entonces, Y
- Enfoque en la interacción frontend-backend

### Componente 7: Escenarios Gherkin — Nivel E2E

**Archivo feature ejecutable**: `src/test/features/UI/clientes.feature`
**Archivo de documentación**: `docs/07-gherkin-e2e.md`

**Diseño de escenarios** (al menos 2):

1. **Creación exitosa de cliente (tercero)**: Flujo completo desde login → "+Crear" → "Clientes" → llenar formulario con datos válidos → guardar → verificar mensaje de éxito.
2. **Validación de campos obligatorios al crear cliente**: Flujo desde login → "+Crear" → "Clientes" → intentar guardar sin llenar campos obligatorios → verificar mensajes de error de validación.

**Convenciones**:
- Directiva `# language: es`
- Tags: `@layer:Frontend`, `@TEST_TC-201`, `@TEST_TC-202`
- Palabras clave: Característica, Escenario, Antecedentes, Dado, Cuando, Entonces, Y
- Uso de Antecedentes para el paso de login compartido entre escenarios
- Seguir la estructura del feature file existente (`google-search.feature`)

### Componente 8: Reporte de Bug

**Archivo**: `docs/08-bug-report.md`

**Bug simulado**: "El formulario de creación de clientes permite guardar un cliente sin número de identificación cuando se selecciona tipo de identificación NIT"

**Estructura del reporte**:
1. **Título**: Descriptivo y conciso
2. **ID del Bug**: BUG-001
3. **Severidad**: Alta (permite crear datos inconsistentes en el sistema)
4. **Prioridad**: Alta
5. **Entorno**:
   - URL: https://qastaging.siigo.com
   - Navegador: Google Chrome (última versión)
   - Sistema Operativo: Windows 10/11
6. **Precondiciones**: Usuario autenticado con credenciales válidas
7. **Pasos para Reproducir**: Secuencia numerada de 6-8 pasos claros
8. **Resultado Esperado**: El sistema muestra un mensaje de error indicando que el número de identificación es obligatorio
9. **Resultado Actual**: El sistema permite guardar el cliente sin número de identificación
10. **Evidencia**: Placeholder para capturas de pantalla

### Componente 9: Documento Índice

**Archivo**: `docs/README.md`

**Estructura**:
1. Título: "Documentación de Diseño de Casos de Prueba — Clientes (Terceros)"
2. Descripción general del propósito de la documentación
3. Tabla de contenidos con enlaces relativos a cada documento:
   - `01-particion-equivalencias.md` — Partición de Equivalencias
   - `02-valores-limite.md` — Análisis de Valores Límite
   - `03-tablas-decision.md` — Tablas de Decisión
   - `04-transicion-estados.md` — Diagrama de Transición de Estados
   - `05-gherkin-unitario.md` — Casos Gherkin: Nivel Unitario
   - `06-gherkin-integracion.md` — Casos Gherkin: Nivel Integración
   - `07-gherkin-e2e.md` — Casos Gherkin: Nivel E2E
   - `08-bug-report.md` — Reporte de Bug
4. Breve descripción del propósito de cada documento

## Propiedades de Correctitud

Las siguientes propiedades verifican que los artefactos generados cumplen con los requisitos:

### Propiedad 1: Existencia de todos los archivos de documentación
- **Requisitos cubiertos**: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 7.6, 8.1, 9.1
- **Verificación**: Confirmar que los 9 archivos en `docs/` y el archivo `src/test/features/UI/clientes.feature` existen en las rutas especificadas.

### Propiedad 2: Estructura tabular en documentos de técnicas
- **Requisitos cubiertos**: 1.3, 2.3, 3.3, 4.4
- **Verificación**: Cada documento de técnica de diseño (01 a 04) contiene al menos una tabla Markdown con las columnas requeridas por su respectivo requisito.

### Propiedad 3: Mínimo de campos/condiciones/estados analizados
- **Requisitos cubiertos**: 1.2, 2.2, 3.2, 4.2
- **Verificación**: El documento de Partición de Equivalencias analiza al menos 3 campos. El documento de Valores Límite analiza al menos 3 campos. El documento de Tablas de Decisión define al menos 3 condiciones. El documento de Transición de Estados identifica al menos 4 estados.

### Propiedad 4: Descripción introductoria en cada documento de técnica
- **Requisitos cubiertos**: 1.4, 2.4, 3.4
- **Verificación**: Cada documento de técnica (01 a 03) contiene texto introductorio que describe la técnica antes de la tabla principal.

### Propiedad 5: Casos de prueba derivados en cada documento de técnica
- **Requisitos cubiertos**: 1.5, 2.5, 3.5, 4.6
- **Verificación**: Cada documento de técnica (01 a 04) contiene al menos una sección de casos de prueba derivados.

### Propiedad 6: Escenarios Gherkin en español con cantidad mínima
- **Requisitos cubiertos**: 5.1, 5.2, 5.4, 6.1, 6.2, 6.4, 7.2, 7.4
- **Verificación**: Cada archivo Gherkin (unitario, integración, E2E) contiene la directiva `# language: es`, utiliza palabras clave en español (Característica, Escenario, Dado, Cuando, Entonces) y contiene al menos 2 escenarios.

### Propiedad 7: Feature file E2E sigue convenciones del proyecto
- **Requisitos cubiertos**: 7.1, 7.3, 7.5
- **Verificación**: El archivo `src/test/features/UI/clientes.feature` contiene los tags `@layer:Frontend` y al menos un tag `@TEST_TC-`, incluye pasos de login, navegación a Clientes y verificación de resultado.

### Propiedad 8: Reporte de bug con campos completos
- **Requisitos cubiertos**: 8.2, 8.3, 8.4, 8.5
- **Verificación**: El archivo `docs/08-bug-report.md` contiene las secciones: Título, ID del Bug, Severidad (con valor de escala estándar), Prioridad, Entorno (con URL, navegador y SO), Precondiciones, Pasos para Reproducir (numerados), Resultado Esperado y Resultado Actual.

### Propiedad 9: Índice con enlaces completos
- **Requisitos cubiertos**: 9.2, 9.3
- **Verificación**: El archivo `docs/README.md` contiene enlaces Markdown a los 8 documentos de la carpeta `docs/` y cada enlace tiene una descripción asociada.
