pipeline {
    // 1. Run the entire pipeline inside a robust Debian-based Node container
    agent {
        docker{
            image 'mcr.microsoft.com/playwright:v1.61.1-noble'
            args '-u root'
        }
    }

    stages {
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install & Build') {
            steps {
                // Clean install of your npm dependencies
                sh 'npm ci'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                // '--with-deps' is critical in Docker so Linux OS libraries are installed
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh 'npx playwright test --grep @executeTest'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }
    }
}
