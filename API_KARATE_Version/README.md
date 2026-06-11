# 🥋 API Karate Version

Automatización de pruebas API utilizando [Karate Framework](https://karatelabs.github.io/karate/) con Node.js y JBang.

Los escenarios replican la misma lógica de los tests de Playwright ubicados en `src/test/features/API/` y `src/test/steps/api/` del proyecto principal.

---

## 📋 Pre-requisitos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js     | >= 18         |
| Java JDK    | >= 11         |
| JBang       | Se instala automáticamente en la primera ejecución |

### Instalación manual de JBang (opcional)

Si la instalación automática falla, puedes instalarlo manualmente:

```powershell
# PowerShell (Windows)
iex "& { $(iwr -useb https://ps.jbang.dev) } app setup"
```

Luego agregar `%USERPROFILE%\.jbang\bin` al PATH del sistema.

---

## 🚀 Instalación

```bash
cd API_KARATE_Version
npm install
```

---

## ▶️ Ejecución

### Todas las pruebas API

```bash
npm test
```

### Por módulo

```bash
# Solo DemoBlaze (signup + login)
npm run test:demoblaze

# Solo PetStore - Mascotas (CRUD)
npm run test:petstore-pets

# Solo PetStore - Usuarios (ciclo de vida)
npm run test:petstore-users
```

> **Nota Windows:** Si `jbang` no está en el PATH del sistema, el script `test.js` lo busca automáticamente en `%USERPROFILE%\.jbang\bin`.

---

## 📊 Reportes

Los reportes HTML se generan automáticamente en `target/karate-reports/` después de cada ejecución.

Abrir en el navegador:

```
target/karate-reports/karate-summary.html
```

---

## 🗂️ Estructura del proyecto

```
API_KARATE_Version/
├── karate/
│   ├── karate-config.js              # Configuración global (URLs base, timeouts)
│   ├── demoblaze/
│   │   ├── signup.feature            # Registro nuevo y duplicado
│   │   └── login.feature             # Login correcto e incorrecto
│   ├── petstore-pets/
│   │   └── pets-crud.feature         # Crear, consultar, actualizar, buscar por status
│   └── petstore-users/
│       └── users-lifecycle.feature   # Crear, consultar, actualizar, verificar, eliminar
├── test.js                            # Script de ejecución (JBang + Karate)
├── package.json                       # Dependencias y scripts npm
└── README.md
```

---

## 🧪 Escenarios cubiertos

### DemoBlaze API (`https://api.demoblaze.com`)

| Escenario | Endpoint | Validación |
|-----------|----------|------------|
| Registro exitoso | `POST /signup` | Status 200, sin errorMessage |
| Registro duplicado | `POST /signup` | errorMessage contiene "This user already exist" |
| Login correcto | `POST /login` | Status 200, body contiene "Auth_token:" |
| Login incorrecto | `POST /login` | errorMessage contiene "Wrong password" |

### PetStore API - Mascotas (`https://petstore.swagger.io/v2`)

| Escenario | Endpoint | Validación |
|-----------|----------|------------|
| Crear mascota | `POST /pet` | Status 200, id/name/status correctos |
| Consultar por ID | `GET /pet/{id}` | Status 200, datos originales |
| Actualizar a sold | `PUT /pet` | Status 200, status = "sold" |
| Buscar por status | `GET /pet/findByStatus?status=sold` | Array con mascotas sold |

### PetStore API - Usuarios (`https://petstore.swagger.io/v2`)

| Escenario | Endpoints | Validación |
|-----------|-----------|------------|
| Ciclo completo | `POST → GET → PUT → GET → DELETE /user` | CRUD completo verificado |

---

## ⚙️ Configuración

La configuración global se encuentra en `karate/karate-config.js`:

```javascript
function fn() {
  var config = {
    demoBlazeUrl: 'https://api.demoblaze.com',
    petStoreUrl: 'https://petstore.swagger.io/v2'
  };
  karate.configure('connectTimeout', 30000);
  karate.configure('readTimeout', 30000);
  return config;
}
```

Las variables `demoBlazeUrl` y `petStoreUrl` están disponibles en todos los features.

---

## 🔧 Troubleshooting

| Problema | Solución |
|----------|----------|
| `jbang` no encontrado | Instalar manualmente o verificar que `%USERPROFILE%\.jbang\bin` esté en PATH |
| Error de conexión WSL/bash | Normal en Windows puro, el script usa JBang directamente |
| Timeout en peticiones | Aumentar valores en `karate-config.js` |
| `NumberFormatException` en petId | Asegurar que petId usa `Math.round()` para IDs enteros |
