import { Locator, Page, expect } from '@playwright/test';
import testData from '../test-data/testData.json';
import { generateContactData } from '../test-data/testDataGenerator'
import { Utils } from '../utility/utils';

type record = ReturnType<typeof generateContactData>;

let firstName: string;
export class ContactPage {

  readonly page: Page;
  readonly menuContact: Locator;
  readonly textForeName: Locator
  readonly textEmail: Locator
  readonly textMessage: Locator
  readonly errorForeName: Locator
  readonly errorEmail: Locator
  readonly errorMessage: Locator
  readonly buttonSubmit: Locator
  readonly alertSuccess: Locator;
  readonly alertFeedback: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuContact = page.getByRole('link', { name: 'Contact' });
    this.textForeName = page.locator('#forename');
    this.textEmail = page.locator('#email');
    this.textMessage = page.locator('#message');
    this.errorForeName = page.locator('#forename-err');
    this.errorEmail = page.locator('#email-err');
    this.errorMessage = page.locator('#message-err');
    this.buttonSubmit = page.getByRole('link', { name: 'Submit' });
    this.alertSuccess = page.locator('.alert-success');
    this.alertFeedback = page.locator('h1', { hasText: 'Sending Feedback' })

  }

  async validateErrorDescription(errorsDes: {
    element: Locator,
    errorKey: keyof typeof testData.errorDescriptions }[]) {

    for (const error of errorsDes) {
      const actualError = await error.element.textContent();
      const expectedError = testData.errorDescriptions[error.errorKey];

      await expect(actualError).toEqual(expectedError);

    }

  }

  async submitContactDetails(testData: record) {

    firstName = testData.firstName;
    await this.textForeName.fill(firstName)
    await this.textEmail.fill(testData.email)
    await this.textMessage.fill(testData.message)
    await this.buttonSubmit.click();
    await Utils.waitForElementToHidden(this.alertFeedback);

  }

  async validateSubmission(actual: string) {
    const actualValue = "Thanks" + ' ' + firstName + ', ' + actual;
    const expectedValue = (await this.alertSuccess.textContent())?.trim();

    await expect(actualValue).toContain(expectedValue);

  }


}