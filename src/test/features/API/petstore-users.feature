@API @petstore-users
Feature: PetStore API - Ciclo de vida de Usuario

  La API de PetStore permite gestionar usuarios (endpoint user).
  Este escenario valida el ciclo completo: crear, consultar, actualizar,
  verificar la actualizacion y eliminar un usuario.

  Scenario: Ciclo de vida completo de un usuario en PetStore
    Given que genero un username unico para el usuario de PetStore
    When envio una peticion POST user con firstName "John" y email dinamico
    Then la respuesta de creacion de usuario debe tener status 200

    When envio una peticion GET user por username para verificar creacion
    Then la respuesta de consulta de usuario debe tener status 200
    And el body debe contener el username y firstName "John" originales

    When envio una peticion PUT user con firstName "Jane" y nuevo email
    Then la respuesta de actualizacion de usuario debe tener status 200

    When envio una peticion GET user por username para verificar actualizacion
    Then la respuesta de consulta actualizada debe tener status 200
    And el body debe reflejar el firstName "Jane" actualizado

    When envio una peticion DELETE user por username
    Then la respuesta de eliminacion de usuario debe tener status 200
