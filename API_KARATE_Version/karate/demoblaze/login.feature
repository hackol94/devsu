Feature: DemoBlaze API - Login de usuarios

  Background:
    * url demoBlazeUrl
    * def timestamp = java.lang.System.currentTimeMillis()
    * def password = java.util.Base64.encoder.encodeToString(('Test1234!').getBytes())
    * def wrongPassword = java.util.Base64.encoder.encodeToString(('password_incorrecto_xyz').getBytes())

  Scenario: Login con credenciales correctas
    # Primero registramos el usuario
    * def username = 'loginuser_' + timestamp
    Given path '/signup'
    And request { username: '#(username)', password: '#(password)' }
    When method POST
    Then status 200
    # Luego hacemos login
    Given path '/login'
    And request { username: '#(username)', password: '#(password)' }
    When method POST
    Then status 200
    And match responseType == 'string'
    And match response contains 'Auth_token:'

  Scenario: Login con credenciales incorrectas
    # Primero registramos el usuario
    * def username = 'badpwd_' + timestamp
    Given path '/signup'
    And request { username: '#(username)', password: '#(password)' }
    When method POST
    Then status 200
    # Login con password incorrecto
    Given path '/login'
    And request { username: '#(username)', password: '#(wrongPassword)' }
    When method POST
    Then status 200
    And match response.errorMessage contains 'Wrong password'
