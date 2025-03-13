pipeline {
    agent {
        docker{
            image 'papitodev/playwriht-nj-v1.49.1-noble'
            args '--network qatw-primeira-edicao_skynet'
        }
    }

    stages {
        stage('Node.js Deps') {
            steps {
                sh 'yarn install'
            }
        }
        stage('E2E Tests') {
            steps {
                sh 'yarn playwright test'
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
    }
}
