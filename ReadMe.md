## Repository Details
    Clone Repo - https://github.com/mageshkumarchandran/planit-assessment.git
    branch - main

## Framework Explanation
 This framework is built using Playwright with TypeScript, following the Page object model design for better maintainability and scalability.

    *  pages/             - for page classes,
    *  interfaces/        - for type declaration
    *  tests/             - for test case specs,
    *  test-data/         - for test input values,
    *  utility/           - common functions
    *  playwright-report/ - execution reports path

    Test configuration : All configuration including set up browsers and URLs are defined in "playwright.config.ts" file

    Test Data creation - Used Faker library.


## Installation Dependencies:
Make sure you have Node.js (am using 24.9) installed, else install node.

    npm install (for node_modules)
    npm install -D @playwright/test
    npm install @faker-js/faker --save-dev
    npm install -D typescript ts-node (to install type script)

To format the code and fix linting error:
    npm install --save-dev @stylistic/eslint-plugin
    npm install --save-dev jiti
    npm install --save-dev prettier


## How to run the test
  Open the terminal,navigate to project path and run below command:

  *To run test:*

     BROWSER=chromium npx playwright test --grep @executeTest

     BROWSER - chromium , firefox ,webkit (chromium-default)

  I have added below tags in the tests ,it can be changed in file "playwright.config.ts" if required.

    @executeTest ,@contactSubmit,@addProduct,@errorValidation

  *To format the code*
      Run  -  npm run format

## Reports
    Html report will be generated under playwright-report folder after test completion

## Docker and Jenkins Integration

  I have configured Docker + Jenkins CI on localhost to run Playwright test.


  *Docker setup steps:*

      * Download docker desktop

      * run below command to create volume , image and container

         docker run -d --name <name> -u root -p 8080:8080 -p 50000:50000 \
         -v /var/run/docker.sock:/var/run/docker.sock \
         -v jenkins_home:/var/jenkins_home \
         jenkins/jenkins:lts

      * Run the below commend to pull jenkins and playwright image

          docker pull mcr.microsoft.com/playwright:v1.61.1-noble
          docker pull jenkins/jenkins:lts



      * Run below command to install docker CLI for jenkins

        docker exec -u 0 -it <container-name> bash
        apt-get update && apt-get install -y docker.io

  *Jenkins Job Configuration:*

      * Start the jenkins(copy the credentials to be used in jenkins)
      * Launch jenkins url - http://localhost:8080
      * install the Plugins - Git,Pipeline,NodeJS,HTML Publisher,docker
      * Create a Pipeline Project in Jenkins
      * Select "Pipeline script from SCM" as the definition.
      * SCM- git
      * Repository URL: https://github.com/mageshkumarchandran/planit-assessment.git
      * Branch: main
      * Script Path: Jenkinsfile
      * Add parameter:Name: BROWSER,Type: String(leave blank to use chromium by default)

  Test Reports:

    After execution, Playwright execution report will be published,You’ll find it on the left side panel of the Jenkins build page(Playwright HTML Report).


