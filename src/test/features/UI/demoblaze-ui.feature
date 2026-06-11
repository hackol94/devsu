@layer:Frontend @demoblaze-ui
Feature: DemoBlaze UI - Flujo de compra sin login

  Prueba E2E del flujo completo de compra en https://www.demoblaze.com/.
  Se agregan 2 productos al carrito, se visualiza el carrito,
  se completa el formulario de pago y se finaliza la compra.

  Scenario: Compra exitosa de 2 productos como usuario no autenticado
    Given que navego a la pagina principal de DemoBlaze
    Then debo ver el catalogo de productos disponibles
    When agrego el primer producto al carrito de DemoBlaze
    And agrego el segundo producto al carrito de DemoBlaze
    And navego al carrito de DemoBlaze
    Then el carrito debe mostrar 2 productos
    When inicio el proceso de pago con datos validos de DemoBlaze
    And confirmo la orden en DemoBlaze
    Then debo ver el mensaje de confirmacion de compra de DemoBlaze
