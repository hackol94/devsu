import { PageFixture } from '../../hooks/pageFixture';
import { LoginPage } from '../../pages/LoginPage';
import { ClientPage } from '../../pages/ClientPage';

export class LoginTask {
  /**
   * Task to perform login in Siigo
   * @param fixture - PageFixture containing page and logger
   * @param user - Username/Email
   * @param pass - Password
   */
  static async inSiigo(fixture: PageFixture, user: string, pass: string): Promise<void> {
    fixture.logger.info(`Performing login for user: ${user}`);
    
    const loginPage = new LoginPage(fixture.page);
    const clientPage = new ClientPage(fixture.page);

    // Navigate to login page
    await fixture.page.goto('https://qastaging.siigo.com/#/login');
    
    // Perform login using POM methods
    await loginPage.fillUsername(user);
    await loginPage.fillPassword(pass);
    await loginPage.clickLogin();
    
    // Wait for the dashboard to load by checking for the create button in ClientPage
    await clientPage.createButton.waitFor({ state: 'visible', timeout: 60000 });
    
    fixture.logger.info('Login successful and dashboard loaded');
  }
}
