import { PageFixture } from '../../hooks/pageFixture';
import { ClientPage } from '../../pages/ClientPage';

export class CreateClientTask {
  /**
   * Task to navigate to the client creation form
   */
  static async navigateToForm(fixture: PageFixture): Promise<void> {
    fixture.logger.info('Navigating to Create Client form');
    const clientPage = new ClientPage(fixture.page);
    await clientPage.navigateToCreateClient();
  }

  /**
   * Task to fill and save a new client
   */
  static async withData(fixture: PageFixture, data: any): Promise<void> {
    fixture.logger.info(`Creating client: ${data.firstName} ${data.lastName}`);
    const clientPage = new ClientPage(fixture.page);
    await clientPage.fillForm(data);
    fixture.logger.info('Client creation form submitted');
  }

  /**
   * Question/Assertion: Verify successful creation
   */
  static async verifySuccess(fixture: PageFixture): Promise<boolean> {
    const clientPage = new ClientPage(fixture.page);
    try {
      await clientPage.successToast.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
