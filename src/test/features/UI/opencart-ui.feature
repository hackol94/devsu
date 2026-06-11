@layer:Frontend @opencart-ui
Feature: OpenCart UI - Compra como invitado

  Prueba E2E del flujo completo de compra como invitado (Guest Checkout)
  en http://opencart.abstracta.us/. Se agregan 2 productos al carrito,
  se completa el checkout con datos de invitado y se finaliza la compra.

  Scenario: Compra exitosa de 2 productos como invitado en OpenCart
    Given que navego a la pagina principal de OpenCart
    Then debo ver productos disponibles en OpenCart
    When agrego 2 productos al carrito de OpenCart
    Then el indicador del carrito debe reflejar 2 productos en OpenCart
    When navego al carrito de OpenCart
    Then debo ver los 2 productos en el carrito de OpenCart
    When inicio el checkout de OpenCart
    And selecciono Guest Checkout en OpenCart
    And completo el formulario de datos personales del invitado en OpenCart
    And selecciono el metodo de envio disponible en OpenCart
    And selecciono el metodo de pago disponible en OpenCart
    When confirmo la orden en OpenCart
    Then debo ver el mensaje "Your order has been placed!" en OpenCart
