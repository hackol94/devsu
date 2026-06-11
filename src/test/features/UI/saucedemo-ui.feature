@layer:Frontend @saucedemo-ui
Feature: SauceDemo UI - Login y flujo de compra

  Prueba E2E del flujo completo de compra en https://www.saucedemo.com/.
  Se autentica con standard_user, se agregan 2 productos al carrito,
  se completa el checkout y se verifica el mensaje de confirmacion.

  Scenario: Compra exitosa de 2 productos como standard_user
    Given que navego a la pagina de login de SauceDemo
    When ingreso las credenciales de standard_user en SauceDemo
    Then debo ser redirigido a la pagina de inventario de SauceDemo
    When agrego 2 productos distintos al carrito de SauceDemo
    Then el contador del carrito de SauceDemo debe mostrar "2"
    When navego al carrito de SauceDemo
    Then debo ver los 2 productos seleccionados en el carrito de SauceDemo
    When inicio el checkout de SauceDemo con datos de envio validos
    Then debo ver la pantalla de revision del pedido de SauceDemo
    When confirmo la orden en SauceDemo
    Then debo ver el mensaje "Thank you for your order!" en SauceDemo
