@API @demoblaze-api
Feature: DemoBlaze API - Registro y Login de usuarios

  La API de DemoBlaze proporciona endpoints de registro (/signup) e inicio de sesion (/login).
  Estos escenarios validan los casos principales: usuario nuevo, usuario duplicado,
  credenciales correctas e incorrectas.

  Scenario: Registro exitoso de un nuevo usuario
    Given que tengo un username unico generado dinamicamente para DemoBlaze
    When envio una peticion POST signup con el username y password en DemoBlaze
    Then la respuesta de DemoBlaze debe tener status 200

  Scenario: Registro de usuario ya existente
    Given que uso el username de DemoBlaze ya registrado previamente
    When envio una peticion POST signup con el username ya existente en DemoBlaze
    Then el body de la respuesta de DemoBlaze debe contener un indicador de error por duplicado

  Scenario: Login con credenciales correctas
    Given que tengo un usuario previamente registrado en DemoBlaze
    When envio una peticion POST login con credenciales validas en DemoBlaze
    Then la respuesta de login de DemoBlaze debe tener status 200
    And el body de login debe contener un token de autenticacion

  Scenario: Login con credenciales incorrectas
    Given que tengo un username valido en DemoBlaze
    When envio una peticion POST login con password incorrecto en DemoBlaze
    Then el body de la respuesta de login de DemoBlaze debe contener un mensaje de error de autenticacion
