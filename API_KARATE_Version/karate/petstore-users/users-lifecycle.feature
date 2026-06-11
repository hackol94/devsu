Feature: PetStore API - Ciclo de vida de Usuario

  Background:
    * url petStoreUrl
    * def timestamp = java.lang.System.currentTimeMillis()
    * def username = 'testuser_' + timestamp
    * def email = username + '@test.com'
    * def updatedEmail = 'jane_' + timestamp + '@test.com'
    * def userId = Math.round(timestamp % 999999)
    * configure headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }

  Scenario: Ciclo completo - crear, consultar, actualizar, verificar y eliminar
    # Crear usuario
    Given path '/user'
    And request { id: '#(userId)', username: '#(username)', firstName: 'John', lastName: 'Doe', email: '#(email)', password: 'Test1234!', phone: '3001234567', userStatus: 1 }
    When method POST
    Then status 200

    # Esperar propagacion
    * karate.pause(1000)

    # Consultar usuario creado
    Given path '/user', username
    When method GET
    Then status 200
    And match response.username == username
    And match response.firstName == 'John'
    And match response.email == email

    # Actualizar usuario
    Given path '/user', username
    And request { id: '#(userId)', username: '#(username)', firstName: 'Jane', lastName: 'Doe', email: '#(updatedEmail)', password: 'Test1234!', phone: '3001234567', userStatus: 1 }
    When method PUT
    Then status 200

    # Esperar propagacion
    * karate.pause(2000)

    # Verificar actualizacion
    Given path '/user', username
    When method GET
    Then status 200
    And match response.firstName == 'Jane'
    And match response.email == updatedEmail

    # Eliminar usuario
    Given path '/user', username
    When method DELETE
    Then status 200
