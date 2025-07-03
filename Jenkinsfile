pipeline {
    agent any
    environment {
        NODE_VERSION = '20.16.0'
    }
    
    stages {

        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright tests') {
            steps {
                bat 'npx playwright test --grep @aa'
            }
        }
    }
}