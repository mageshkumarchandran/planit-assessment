## Repository Details

    Clone Repo - https://github.com/mageshkumarchandran/planit-assessment.git
    branch - main

## Framework Explanation

 This framework is implemented using the Page Object Model (POM) design pattern for better maintainability and scalability.

    *  pages/             - for page classes,
    *  tests/             - for test case specs,
    *  test-data/         - for test input values,
    *  utility/           - common functions
    *  playwright-report/ - execution reports path

    Test configuration : All configuration including set up browsers and URLs are defined in "playwright.config.ts" file

    Test Data creation - Used Faker library.


## Installation Dependencies:
Make sure you have Node.js (am using 20.16.0) installed, else install nvm then node.

    nvm install 20.16.0 (if node not installed)
    npm install (for node_modules)
    npm install -D @playwright/test@1.51.0
    npm install @faker-js/faker --save-dev
    npm install -D typescript ts-node (to install type script)


## How to run the test

  Open the terminal,navigate to project path and run below command:

  To run test:
  
     BROWSER=chromium npx playwright test --grep @executeTest

     BROWSER - chromium , firefox ,webkit (chromium-default)

  I have added below tags in the tests ,it can be changed if required.

    @executeTest ,@contactSubmit,@addProduct,@errorValidation

## Reports
    Html report will be generated under playwright-report folder after test completion

## Jenkins Integration
  I have configured Jenkins CI on localhost using version 2.462 to run Playwright test.

  Jenkinsfile path - projectRoot/Jenkinsfile.

  Make sure the following plugins are installed in Jenkins:

    Git,Git Client,Pipeline,NodeJS,HTML Publisher

  Jenkins Job Configuration:

    * Create a Pipeline Project in Jenkins
    * Select "Pipeline script from SCM" as the definition.
    * SCM- git
    * Repository URL: https://github.com/mageshkumarchandran/planit-assessment.git
    * Branch: main
    * Script Path: Jenkinsfile
    * Add parameter:Name: BROWSER,Type: String(leave blank to use chromium by default)

  Test Reports:

    After execution, Playwright execution report will be published,You’ll find it on the left side panel of the Jenkins build page.


