@API @petstore-pets
Feature: PetStore API - CRUD de Mascotas

  La API de PetStore permite gestionar mascotas (endpoint pet).
  Estos escenarios validan el ciclo completo: crear, consultar por ID,
  actualizar estado a "sold" y buscar por estado.

  Scenario: Crear una nueva mascota en PetStore
    Given que genero un ID unico para la mascota de PetStore
    When envio una peticion POST pet con name "Firulais" y status "available"
    Then la respuesta de creacion de mascota debe tener status 200
    And el body debe reflejar el name "Firulais" y status "available"

  Scenario: Consultar mascota por ID en PetStore
    Given que existe una mascota previamente creada con ID dinamico en PetStore
    When envio una peticion GET pet con el ID de la mascota creada
    Then la respuesta de consulta de mascota debe tener status 200
    And el body debe contener el name y status originales de la mascota

  Scenario: Actualizar mascota existente en PetStore
    Given que existe una mascota previamente creada con ID dinamico en PetStore
    When envio una peticion PUT pet con el mismo ID y status "sold"
    Then la respuesta de actualizacion de mascota debe tener status 200
    And el body debe reflejar el status actualizado "sold"

  Scenario: Buscar mascotas por estado sold en PetStore
    Given que existe al menos una mascota con status "sold" en PetStore
    When envio una peticion GET pet findByStatus con status "sold"
    Then la respuesta de busqueda por estado debe tener status 200
    And el body debe ser un array que contenga al menos una mascota con status "sold"
