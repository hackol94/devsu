import { APIResponse } from '@playwright/test';
import { PageFixture } from '../../hooks/pageFixture';

export class DemoBlazeApiTask {
  private static readonly BASE_URL = 'https://api.demoblaze.com';

  private static getRequestContext(fixture: PageFixture): any {
    return (fixture.page as any).request || fixture.page;
  }

  private static encodeBase64(text: string): string {
    return Buffer.from(text).toString('base64');
  }

  static async signup(fixture: PageFixture, username: string, password: string): Promise<APIResponse> {
    fixture.logger.info(`POST /signup — username: ${username}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.post(`${this.BASE_URL}/signup`, {
      data: { username, password: this.encodeBase64(password) }
    });
  }

  static async login(fixture: PageFixture, username: string, password: string): Promise<APIResponse> {
    fixture.logger.info(`POST /login — username: ${username}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.post(`${this.BASE_URL}/login`, {
      data: { username, password: this.encodeBase64(password) }
    });
  }
}
