import { APIResponse } from '@playwright/test';
import { PageFixture } from '../../hooks/pageFixture';

export interface UserPayload {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  userStatus?: number;
}

export class PetStoreUsersTask {
  private static readonly BASE_URL = 'https://petstore.swagger.io/v2';

  private static getRequestContext(fixture: PageFixture): any {
    return (fixture.page as any).request || fixture.page;
  }

  static async createUser(fixture: PageFixture, user: UserPayload): Promise<APIResponse> {
    fixture.logger.info(`POST /user — username: ${user.username}, firstName: ${user.firstName}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.post(`${this.BASE_URL}/user`, {
      headers: { 'Content-Type': 'application/json' },
      data: user
    });
  }

  static async getUserByUsername(fixture: PageFixture, username: string): Promise<APIResponse> {
    fixture.logger.info(`GET /user/${username}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.get(`${this.BASE_URL}/user/${username}`);
  }

  static async updateUser(fixture: PageFixture, username: string, user: UserPayload): Promise<APIResponse> {
    fixture.logger.info(`PUT /user/${username} — firstName: ${user.firstName}, email: ${user.email}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.put(`${this.BASE_URL}/user/${username}`, {
      headers: { 'Content-Type': 'application/json' },
      data: user
    });
  }

  static async deleteUser(fixture: PageFixture, username: string): Promise<APIResponse> {
    fixture.logger.info(`DELETE /user/${username}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.delete(`${this.BASE_URL}/user/${username}`);
  }
}
