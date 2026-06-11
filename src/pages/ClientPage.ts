import { Page, Locator } from '@playwright/test';

export class ClientPage {
  private readonly page: Page;

  public readonly Elements = {
    // Top Bar
    BTN_CREATE: "header-molecule >> button:has-text('Crear')",
    OPT_CLIENTS: "header-molecule >> a[data-value='Clientes']",

    // Type of Third Party
    RADIO_CLIENT: "//label[contains(., 'Clientes')]/input",
    RADIO_PROVIER: "//label[contains(., 'Proveedores')]/input",
    RADIO_OTHER: "//label[contains(., 'Otros')]/input",

    // Basic Data
    SEL_TYPE: "app-third-party-basic-data >> siigo-dropdownlist-web:has-text('Tipo') >> .mdc-select__anchor",
    SEL_ID_TYPE: "app-third-party-basic-data >> siigo-dropdownlist-web:has-text('Tipo de identificación') >> .mdc-select__anchor",
    TXT_ID: "app-third-party-basic-data >> siigo-identification-input-web >> input.input-identification",
    TXT_DV: "app-third-party-basic-data >> siigo-identification-input-web >> input#input-check-digit",
    TXT_BRANCH: "app-third-party-basic-data >> siigo-textfield-web:has-text('Código de la sucursal') >> input",
    TXT_FIRST_NAME: "app-third-party-basic-data >> siigo-textfield-web:has-text('Nombres') >> input",
    TXT_LAST_NAME: "app-third-party-basic-data >> siigo-textfield-web:has-text('Apellidos') >> input",
    TXT_CITY: "app-third-party-basic-data >> siigo-autocomplete-web:has-text('Ciudad')",
    TXT_ADDRESS: "app-third-party-basic-data >> siigo-textfield-web:has-text('Dirección') >> input",
    
    // Contact Data
    TXT_CONTACT_FIRST_NAME: "app-third-party-billing >> siigo-textfield-web:has-text('Nombres') >> input",
    TXT_CONTACT_LAST_NAME: "app-third-party-billing >> siigo-textfield-web:has-text('Apellidos') >> input",
    TXT_EMAIL: "app-third-party-billing >> siigo-textfield-web:has-text('Correo electrónico') >> input",

    // Actions
    BTN_SAVE: "button.button.green.filled:has-text('Guardar')",
    BTN_CANCEL: "button.button.white:has-text('Cancelar')",

    // Confirmation
    LBL_SUCCESS_TOAST: "//div[contains(@class, 'MuiSnackbar-root')]//*[contains(text(), 'Tercero guardado exitosamente')]",
    LBL_PROFILE_TITLE: "//h2[contains(text(), 'Perfil del tercero')]"
  } as const;

  constructor(page: Page) {
    this.page = page;
  }

  get createButton(): Locator { return this.page.locator(this.Elements.BTN_CREATE); }
  get clientsOption(): Locator { return this.page.locator(this.Elements.OPT_CLIENTS); }
  get identificationInput(): Locator { return this.page.locator(this.Elements.TXT_ID); }
  get firstNameInput(): Locator { return this.page.locator(this.Elements.TXT_FIRST_NAME); }
  get lastNameInput(): Locator { return this.page.locator(this.Elements.TXT_LAST_NAME); }
  get cityInput(): Locator { return this.page.locator(this.Elements.TXT_CITY); }
  get addressInput(): Locator { return this.page.locator(this.Elements.TXT_ADDRESS); }
  get emailInput(): Locator { return this.page.locator(this.Elements.TXT_EMAIL); }
  get saveButton(): Locator { return this.page.locator(this.Elements.BTN_SAVE); }
  get successToast(): Locator { return this.page.locator(this.Elements.LBL_SUCCESS_TOAST); }
  get profileTitle(): Locator { return this.page.locator(this.Elements.LBL_PROFILE_TITLE); }

  async navigateToCreateClient(): Promise<void> {
    // Ensure the create button is clickable
    await this.createButton.waitFor({ state: 'visible', timeout: 45000 });
    await this.createButton.click({ force: true });
    
    // Wait for the 'Clientes' option to appear in the menu
    await this.clientsOption.waitFor({ state: 'visible', timeout: 45000 });
    await this.clientsOption.click({ force: true });
    
    // Ensure the new page is loaded
    await this.page.waitForLoadState('domcontentloaded');
    await this.identificationInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async fillForm(data: { id: string, firstName: string, lastName: string, city: string, address: string, email: string }): Promise<void> {
    await this.identificationInput.click();
    await this.identificationInput.fill(data.id);
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(1000); // Wait for Dv calculation
    
    await this.firstNameInput.fill(data.firstName);
    await this.page.keyboard.press('Tab');
    
    await this.lastNameInput.fill(data.lastName);
    await this.page.keyboard.press('Tab');
    
    await this.selectCity(data.city);
    
    await this.addressInput.fill(data.address);
    await this.emailInput.fill(data.email);
    
    await this.saveButton.waitFor({ state: 'visible' });
    await this.saveButton.click();
  }

  async selectCity(city: string): Promise<void> {
    const cityAutocomplete = this.page.locator(this.Elements.TXT_CITY);
    await cityAutocomplete.click();
    await this.page.keyboard.type(city, { delay: 100 });
    await this.page.waitForTimeout(2000); // Wait for results
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }
}
