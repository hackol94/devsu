# language: es
@layer:Frontend
Característica: Creación de Clientes en Siigo
  Como un usuario administrativo
  Quiero registrar nuevos clientes en la plataforma
  Para gestionar la base de datos de terceros

  Antecedentes:
    Dado que el usuario inicia sesión en Siigo con sus credenciales

  @TEST_TC-200 @smoke
  Escenario: Creación exitosa de un cliente persona
    Dado que el usuario navega al formulario de creación de clientes
    Cuando registra un nuevo cliente con los siguientes datos:
      | identificacion | nombre | apellido | ciudad | direccion | email |
      | 1020304061    | Juan   | Perez    | Bogota | Calle 123 | juan@yopmail.com |
    Entonces el sistema debe mostrar el mensaje de éxito "Tercero guardado exitosamente"
    Y el usuario debe ser redirigido a la vista de perfil del tercero
