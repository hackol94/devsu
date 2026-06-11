AUTOMATIZACION API CON KARATE

PRE-REQUISITOS
- Node.js >= 18
- Java JDK >= 11 (se usa con JBang)
- JBang (se instala automaticamente la primera vez, o manualmente con:
    PowerShell: iex "& { $(iwr -useb https://ps.jbang.dev) } app setup"
  Luego agregar %USERPROFILE%\.jbang\bin al PATH)

INSTALACION
cd API_KARATE_Version
npm install

EJECUCION

Todas las pruebas API:
  npm test

Solo DemoBlaze:
  npm run test:demoblaze

Solo PetStore Mascotas:
  npm run test:petstore-pets

Solo PetStore Usuarios:
  npm run test:petstore-users

NOTA WINDOWS: Si jbang no esta en el PATH del sistema, el script test.js
lo busca automaticamente en %USERPROFILE%\.jbang\bin

REPORTES
Se generan automaticamente en target/karate-reports/ despues de cada ejecucion.
Abrir karate-summary.html en el navegador para ver el reporte.

ESTRUCTURA
karate/
├── karate-config.js           (configuracion global: URLs base, timeouts)
├── demoblaze/
│   ├── signup.feature         (registro nuevo y duplicado)
│   └── login.feature          (login correcto e incorrecto)
├── petstore-pets/
│   └── pets-crud.feature      (crear, consultar, actualizar, buscar por status)
└── petstore-users/
    └── users-lifecycle.feature (crear, consultar, actualizar, verificar, eliminar)

BASADO EN
Los escenarios replican exactamente la misma logica de los tests de Playwright
ubicados en src/test/features/API/ y src/test/steps/api/ del proyecto principal.
