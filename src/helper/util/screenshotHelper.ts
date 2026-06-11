import { Page } from '@playwright/test';

export async function captureAndAttach(world: any, page: Page, stepName: string): Promise<void> {
  try {
    const screenshot = await page.screenshot({ fullPage: false, type: 'png' });
    await world.attach(screenshot, 'image/png');
  } catch (error) {
    console.error(`Error al capturar screenshot en paso "${stepName}":`, error);
  }
}
