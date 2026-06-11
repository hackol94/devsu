# language: es
@layer:Frontend
Característica: Login en Siigo
  Como un usuario registrado
  Quiero iniciar sesión en la plataforma Siigo
  Para acceder al dashboard y gestionar mis operaciones

  @TEST_TC-300 @smoke @login
  Escenario: Login exitoso con credenciales válidas
    Dado que el usuario accede a la página de login de Siigo
    Cuando ingresa sus credenciales válidas
    Entonces debe visualizar el dashboard principal
    Y la URL debe contener el path del dashboard
