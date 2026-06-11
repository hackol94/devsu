import { APIResponse } from '@playwright/test';
import { PageFixture } from '../../hooks/pageFixture';

export interface PetPayload {
  id: number;
  name: string;
  status: 'available' | 'pending' | 'sold';
  photoUrls: string[];
  category?: { id: number; name: string };
  tags?: { id: number; name: string }[];
}

export class PetStorePetsTask {
  private static readonly BASE_URL = 'https://petstore.swagger.io/v2';

  private static getRequestContext(fixture: PageFixture): any {
    return (fixture.page as any).request || fixture.page;
  }

  static async createPet(fixture: PageFixture, pet: PetPayload): Promise<APIResponse> {
    fixture.logger.info(`POST /pet — id: ${pet.id}, name: ${pet.name}, status: ${pet.status}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.post(`${this.BASE_URL}/pet`, {
      headers: { 'Content-Type': 'application/json' },
      data: pet
    });
  }

  static async getPetById(fixture: PageFixture, id: number): Promise<APIResponse> {
    fixture.logger.info(`GET /pet/${id}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.get(`${this.BASE_URL}/pet/${id}`);
  }

  static async updatePet(fixture: PageFixture, pet: PetPayload): Promise<APIResponse> {
    fixture.logger.info(`PUT /pet — id: ${pet.id}, name: ${pet.name}, status: ${pet.status}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.put(`${this.BASE_URL}/pet`, {
      headers: { 'Content-Type': 'application/json' },
      data: pet
    });
  }

  static async findPetsByStatus(fixture: PageFixture, status: string): Promise<APIResponse> {
    fixture.logger.info(`GET /pet/findByStatus?status=${status}`);
    const ctx = this.getRequestContext(fixture);
    return await ctx.get(`${this.BASE_URL}/pet/findByStatus`, {
      params: { status }
    });
  }
}
