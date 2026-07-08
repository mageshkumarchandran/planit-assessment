import { Locator, Page, expect } from "@playwright/test";
import testData from "../test-data/testData.json";
import { generateContactData } from "../test-data/testDataGenerator";
import { Utils } from "../utility/utils";
import { errorDescription } from "../interfaces/interface";

type record = ReturnType<typeof generateContactData>;

let firstName: string;

export class ContactPage {
  readonly page: Page;
  readonly menuContact: Locator;
  readonly textForeName: Locator;
  readonly textEmail: Locator;
  readonly textMessage: Locator;
  readonly errorForeName: Locator;
  readonly errorEmail: Locator;
  readonly errorMessage: Locator;
  readonly buttonSubmit: Locator;
  readonly alertSuccess: Locator;
  readonly alertFeedback: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuContact = page.getByRole("link", { name: "Contact" });
    this.textForeName = page.locator("#forename");
    this.textEmail = page.locator("#email");
    this.textMessage = page.locator("#message");
    this.errorForeName = page.locator("#forename-err");
    this.errorEmail = page.locator("#email-err");
    this.errorMessage = page.locator("#message-err");
    this.buttonSubmit = page.getByRole("link", { name: "Submit" });
    this.alertSuccess = page.locator(".alert-success");
    this.alertFeedback = page.locator("h1", { hasText: "Sending Feedback" });
    this.errorAlert = page.locator(".alert");
  }

  /**
   * Validate the error description on mandatory fields
   * @param errorsDes
   */
  async validateErrorDescription(errorsDes: errorDescription[]) {
    const mismatch: string[] = [];
    for (const error of errorsDes) {
      const actualError:string|undefined = (await error.element.textContent())?.trim();
      const expectedError:string = testData.errorDescriptions[error.errorKey];

      if (actualError != expectedError)
        mismatch.push(
          "Actual:" + actualError + " " + "Expected:" + expectedError,
        );
    }
    return mismatch;
  }
  /**
   * Submit contact details
   * @param testData - fetch the test data
   */
  async submitContactDetails(testData: record) {
    firstName = testData.firstName;
    await this.textForeName.fill(firstName);
    await this.textEmail.fill(testData.email);
    await this.textMessage.fill(testData.message);
    await this.buttonSubmit.click();
    await Utils.waitForElementToHidden(this.alertFeedback);
  }
  /**
   * Validate successful submission message
   * @param expected - expected message on successful submission
   */
  async validateSubmission(expected: string) {
    const expectedValue:string = "Thanks" + " " + firstName + ", " + expected;
    const actualValue:string|undefined = (await this.alertSuccess.textContent())?.trim();

    return actualValue === expectedValue;
  }
}
