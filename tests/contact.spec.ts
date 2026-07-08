import { test, expect } from "@playwright/test";
import { ContactPage } from "../pages/ContactPage";
import testData from "../test-data/testData.json";
import { generateContactData } from "../test-data/testDataGenerator";
import { errorDescription } from "../interfaces/interface";

let contactPage: ContactPage;
test.beforeEach(async ({ page }) => {
  contactPage = new ContactPage(page);
  await page.goto("/");
});

const iteration = 5;

test("Validate errors on contact screen @errorValidation @executeTest", async ({}, testInfo) => {
  await contactPage.menuContact.click();
  await contactPage.buttonSubmit.click();

  //create object with element locators and error descriptions
  const errors: errorDescription[] = [
    { element: contactPage.errorForeName, errorKey: "forename" },
    { element: contactPage.errorEmail, errorKey: "email" },
    { element: contactPage.errorMessage, errorKey: "message" },
    { element: contactPage.errorAlert, errorKey: "alert" },
  ];

  const mismatch = await contactPage.validateErrorDescription(errors);

  await expect(
    mismatch,
    `Incorrect Error descriptions:${mismatch.join(",")}`,
  ).toHaveLength(0);

  testInfo.annotations.push({
    type: "info",
    description: "Error messages has been validated successfully.",
  });
});

for (let i = 1; i <= iteration; i++) {
  test(`Submit contact details ${i} @contactSubmit @executeTest`, async ({}, testInfo) => {
    //test data is unique for each iterations
    const data = generateContactData();

    await contactPage.menuContact.click();
    await contactPage.submitContactDetails(data);

    expect(
      await contactPage.validateSubmission(testData.feedback),
      "Incorrect feedback Description",
    ).toBe(true);

    testInfo.annotations.push({
      type: "info",
      description: `${i} st contact details submitted successfully`,
    });
  });
}
