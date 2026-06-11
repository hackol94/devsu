Feature: DemoBlaze API - Registro de usuarios

  Background:
    * url demoBlazeUrl
    * def timestamp = java.lang.System.currentTimeMillis()

  Scenario: Registro exitoso de un nuevo usuario
    * def username = 'user_' + timestamp
    * def password = java.util.Base64.encoder.encodeToString(('Test1234!').getBytes())
    Given path '/signup'
    And request { username: '#(username)', password: '#(password)' }
    When method POST
    Then status 200
    And match responseType != 'json' || response.errorMessage == '#notpresent'

  Scenario: Registro de usuario ya existente
    * def username = 'existing_' + timestamp
    * def password = java.util.Base64.encoder.encodeToString(('Test1234!').getBytes())
    # Primer registro
    Given path '/signup'
    And request { username: '#(username)', password: '#(password)' }
    When method POST
    Then status 200
    # Segundo registro con el mismo username
    Given path '/signup'
    And request { username: '#(username)', password: '#(password)' }
    When method POST
    Then status 200
    And match response.errorMessage contains 'This user already exist'
