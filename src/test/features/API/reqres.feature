# language: es
@API @smoke
Característica: Verificación de Endpoints en ReqRes
  Como desarrollador de pruebas
  Quiero verificar el correcto funcionamiento del API de ReqRes
  Para asegurar la integridad de los servicios REST (GET, POST, PUT, DELETE)

  @API @smoke @GET
  Escenario: GET - Listar usuarios exitosamente
    Cuando el usuario solicita la lista de usuarios de la página 2
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe contener una lista de usuarios
    Y cada usuario debe tener los campos "id", "email", "first_name" y "last_name"

  @API @POST
  Escenario: POST - Crear un nuevo usuario
    Cuando el usuario envía una petición POST para crear un usuario con nombre "morpheus" y trabajo "leader"
    Entonces el código de respuesta debe ser 201
    Y la respuesta debe contener el nombre "morpheus" y un ID asignado
    Y la respuesta debe contener un campo "createdAt" con fecha válida

  @API @PUT
  Escenario: PUT - Actualizar un usuario existente
    Cuando el usuario envía una petición PUT para actualizar el usuario 2 con nombre "morpheus" y trabajo "zion resident"
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe contener el trabajo "zion resident"
    Y la respuesta debe contener un campo "updatedAt" con fecha válida

  @API @DELETE
  Escenario: DELETE - Eliminar un usuario
    Cuando el usuario envía una petición DELETE para el usuario 2
    Entonces el código de respuesta debe ser 204

  @API @GET
  Escenario: GET - Obtener un usuario específico por ID
    Cuando el usuario solicita los datos del usuario con ID 2
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe contener el email "janet.weaver@reqres.in"

  @API @GET @negative
  Escenario: GET - Consultar un usuario inexistente
    Cuando el usuario solicita los datos del usuario con ID 999
    Entonces el código de respuesta debe ser 404

  @API @POST @auth
  Escenario: POST - Login exitoso con credenciales válidas
    Cuando el usuario envía una petición de login con email "eve.holt@reqres.in" y password "cityslicka"
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe contener un token de autenticación

  @API @POST @auth @negative
  Escenario: POST - Login fallido sin password
    Cuando el usuario envía una petición de login con email "peter@klaven" sin password
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe contener el error "Missing password"
