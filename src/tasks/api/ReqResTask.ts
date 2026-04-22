import { APIResponse } from '@playwright/test';
import { PageFixture } from '../../hooks/pageFixture';

/**
 * ReqResTask - Tareas de interacción con la API pública de ReqRes (https://reqres.in)
 *
 * Todos los endpoints requieren el header x-api-key.
 * La key se lee de la variable de entorno REQRES_API_KEY.
 */
export class ReqResTask {
  private static readonly BASE_URL = 'https://reqres.in/api';

  /**
   * Helper para obtener el request context desde el fixture.
   */
  private static getRequestContext(fixture: PageFixture): any {
    return (fixture.page as any).request || fixture.page;
  }

  /**
   * Headers comunes para todas las peticiones a ReqRes.
   */
  private static getHeaders(): Record<string, string> {
    return {
      'x-api-key': process.env.REQRES_API_KEY || '',
      'Content-Type': 'application/json'
    };
  }

  // ─── GET ────────────────────────────────────────────────────────────

  static async getUsers(fixture: PageFixture, page: number = 1): Promise<APIResponse> {
    fixture.logger.info(`GET /users?page=${page}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.get(`${this.BASE_URL}/users?page=${page}`, {
      headers: this.getHeaders()
    });
  }

  static async getUserById(fixture: PageFixture, id: number): Promise<APIResponse> {
    fixture.logger.info(`GET /users/${id}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.get(`${this.BASE_URL}/users/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ─── POST ───────────────────────────────────────────────────────────

  static async createUser(fixture: PageFixture, userData: { name: string; job: string }): Promise<APIResponse> {
    fixture.logger.info(`POST /users — name: ${userData.name}, job: ${userData.job}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.post(`${this.BASE_URL}/users`, {
      headers: this.getHeaders(),
      data: userData
    });
  }

  static async login(fixture: PageFixture, email: string, password?: string): Promise<APIResponse> {
    fixture.logger.info(`POST /login — email: ${email}`);
    const ctx = this.getRequestContext(fixture);
    const body: Record<string, string> = { email };
    if (password) body.password = password;
    return await ctx.post(`${this.BASE_URL}/login`, {
      headers: this.getHeaders(),
      data: body
    });
  }

  // ─── PUT ────────────────────────────────────────────────────────────

  static async updateUser(fixture: PageFixture, id: number, userData: { name: string; job: string }): Promise<APIResponse> {
    fixture.logger.info(`PUT /users/${id} — name: ${userData.name}, job: ${userData.job}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.put(`${this.BASE_URL}/users/${id}`, {
      headers: this.getHeaders(),
      data: userData
    });
  }

  // ─── DELETE ─────────────────────────────────────────────────────────

  static async deleteUser(fixture: PageFixture, id: number): Promise<APIResponse> {
    fixture.logger.info(`DELETE /users/${id}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.delete(`${this.BASE_URL}/users/${id}`, {
      headers: this.getHeaders()
    });
  }
}
