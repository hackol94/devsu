Feature: PetStore API - CRUD de Mascotas

  Background:
    * url petStoreUrl
    * def petId = Math.round(java.lang.System.currentTimeMillis() % 999999)
    * def petName = 'Firulais'
    * configure headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }

  Scenario: Crear una nueva mascota
    Given path '/pet'
    And request { id: '#(petId)', name: '#(petName)', status: 'available', photoUrls: ['https://example.com/firulais.jpg'] }
    When method POST
    Then status 200
    And match response.id == petId
    And match response.name == petName
    And match response.status == 'available'

  Scenario: Consultar mascota por ID
    # Primero creamos la mascota
    Given path '/pet'
    And request { id: '#(petId)', name: '#(petName)', status: 'available', photoUrls: ['https://example.com/firulais.jpg'] }
    When method POST
    Then status 200
    # Consultamos por ID
    Given path '/pet', petId
    When method GET
    Then status 200
    And match response.id == petId
    And match response.name == petName
    And match response.status == 'available'

  Scenario: Actualizar mascota a status sold
    # Primero creamos la mascota
    Given path '/pet'
    And request { id: '#(petId)', name: '#(petName)', status: 'available', photoUrls: ['https://example.com/firulais.jpg'] }
    When method POST
    Then status 200
    # Actualizamos a sold
    Given path '/pet'
    And request { id: '#(petId)', name: '#(petName)', status: 'sold', photoUrls: ['https://example.com/firulais.jpg'] }
    When method PUT
    Then status 200
    And match response.id == petId
    And match response.status == 'sold'

  Scenario: Buscar mascotas por status sold
    # Creamos y actualizamos una mascota a sold
    Given path '/pet'
    And request { id: '#(petId)', name: 'MascotaSold', status: 'available', photoUrls: ['https://example.com/mascota.jpg'] }
    When method POST
    Then status 200

    Given path '/pet'
    And request { id: '#(petId)', name: 'MascotaSold', status: 'sold', photoUrls: ['https://example.com/mascota.jpg'] }
    When method PUT
    Then status 200
    # Buscamos por status sold
    Given path '/pet/findByStatus'
    And param status = 'sold'
    When method GET
    Then status 200
    And match response == '#[_ > 0]'
    And match each response[*].status == 'sold'
