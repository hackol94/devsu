import { Page, Route } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import Joi from 'joi';

/**
 * Mock configuration structure loaded from mocks.json
 */
interface MockConfiguration {
  test: MockTest[];
}

/**
 * Individual mock test configuration
 */
interface MockTest {
  test_id: string;
  exclude?: string[];
  route: string;
  mockStatus: boolean;
  httpCodeResponse: number;
  bodyresposen: string;
}

/**
 * MockSystem - Sistema de interceptación de rutas para respuestas mockeadas
 * 
 * Este sistema permite interceptar llamadas de red usando Playwright y retornar
 * respuestas mockeadas desde archivos JSON, facilitando pruebas sin dependencias externas.
 * 
 * Requirements: 8.1-8.11, 88.1-88.6, 99.1-99.5
 */
export class MockSystem {
  private static mocksConfig: MockConfiguration | null = null;

  /**
   * Configura el sistema de mocks para una página de Playwright
   * 
   * Lee la configuración desde mocks.json, ordena los mocks por especificidad
   * y configura interceptación de rutas usando page.route()
   * 
   * @param page - Instancia de Page de Playwright
   * @param testId - ID del test actual o null
   * 
   * Requirements: 8.1, 8.2, 8.6, 8.7, 8.11
   */
  public static async setupMocks(page: Page, testId: string | null): Promise<void> {
    // Load mocks configuration
    if (!this.mocksConfig) {
      const mocksPath = path.join('src', 'resources', 'loadfiles', 'mocks.json');
      
      if (!fs.existsSync(mocksPath)) {
        console.warn(`Mocks configuration file not found: ${mocksPath}`);
        return;
      }
      
      const mocksContent = fs.readFileSync(mocksPath, 'utf-8');
      this.mocksConfig = JSON.parse(mocksContent);
    }

    // Sort mocks by route specificity (longer patterns first)
    // This ensures more specific routes are matched before generic ones
    const sortedMocks = this.mocksConfig!.test.sort((a, b) => b.route.length - a.route.length);

    // Setup route interception for each mock
    for (const mock of sortedMocks) {
      if (!mock.mockStatus) continue;

      // Check if test_id matches
      const shouldApplyMock = this.shouldApplyMock(mock, testId);
      if (!shouldApplyMock) continue;

      // Convert glob pattern to regex
      const routePattern = this.globToRegex(mock.route);

      await page.route(routePattern, async (route: Route) => {
        try {
          // Load response from file
          const responsePath = path.join('src', 'resources', 'loadfiles', 'response_mocks', mock.bodyresposen);
          
          if (!fs.existsSync(responsePath)) {
            console.error(`Mock response file not found: ${responsePath}`);
            await route.continue();
            return;
          }
          
          const responseContent = fs.readFileSync(responsePath, 'utf-8');
          const responseData = JSON.parse(responseContent);

          // Validate schema if updateSchema is enabled
          if (process.env.updateSchema === 'true') {
            await this.validateAndUpdateSchema(mock, responseData);
          }

          // Return mocked response
          await route.fulfill({
            status: mock.httpCodeResponse,
            contentType: 'application/json',
            body: JSON.stringify(responseData)
          });

          console.log(`Mock applied for route: ${mock.route} (test_id: ${mock.test_id})`);
        } catch (error) {
          console.error(`Error applying mock for route ${mock.route}:`, error);
          await route.continue();
        }
      });
    }
  }

  /**
   * Determina si un mock debe aplicarse basado en test_id y lista de exclusión
   * 
   * @param mock - Configuración del mock
   * @param testId - ID del test actual o null
   * @returns true si el mock debe aplicarse, false en caso contrario
   * 
   * Requirements: 8.3, 8.4, 8.5
   */
  private static shouldApplyMock(mock: MockTest, testId: string | null): boolean {
    // Check if test is in exclude list
    if (mock.exclude && testId && mock.exclude.includes(testId)) {
      return false;
    }

    // Check if test_id matches
    if (mock.test_id === '@default') {
      return true;
    }

    return mock.test_id === testId;
  }

  /**
   * Convierte un patrón glob a expresión regular
   * 
   * @param pattern - Patrón glob
   * @returns Expresión regular equivalente
   * 
   * Requirements: 8.10
   */
  private static globToRegex(pattern: string): RegExp {
    // Convert glob pattern to regex
    let regexPattern = pattern
      .replace(/\*\*\//g, '.*')  // **/ matches any path
      .replace(/\*\*/g, '.*')    // ** matches anything
      .replace(/\*/g, '[^/]*')   // * matches anything except /
      .replace(/\?/g, '.')       // ? matches single character
      .replace(/\./g, '\\.');    // Escape dots

    return new RegExp(regexPattern);
  }

  /**
   * Valida el schema de una respuesta y actualiza el archivo si es necesario
   * 
   * @param mock - Configuración del mock
   * @param responseData - Datos de respuesta a validar
   * 
   * Requirements: 8.8, 8.9, 99.1, 99.2, 99.3, 99.4
   */
  private static async validateAndUpdateSchema(mock: MockTest, responseData: any): Promise<void> {
    try {
      // Define schema based on response structure
      // Using Joi with unknown(true) to allow any structure
      const schema = Joi.object().unknown(true);

      // Validate response
      const { error } = schema.validate(responseData);

      if (error) {
        console.warn(`Schema validation failed for ${mock.bodyresposen}:`, error.message);

        // Validate httpCodeResponse before updating
        if (mock.httpCodeResponse < 100 || mock.httpCodeResponse > 599) {
          console.error(`Invalid httpCodeResponse: ${mock.httpCodeResponse}. Skipping update.`);
          return;
        }

        // Update mock file if validation fails
        const responsePath = path.join('src', 'resources', 'loadfiles', 'response_mocks', mock.bodyresposen);
        
        try {
          fs.writeFileSync(responsePath, JSON.stringify(responseData, null, 2));
          console.log(`Updated mock file: ${mock.bodyresposen}`);
        } catch (writeError) {
          console.error(`Error writing mock file ${mock.bodyresposen}:`, writeError);
        }
      }
    } catch (error) {
      console.error('Error validating schema:', error);
    }
  }
}
