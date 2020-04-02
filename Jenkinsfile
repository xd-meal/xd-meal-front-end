pipeline {
    agent {
        docker {
            image 'cypress/base:10'
        }
    }
    environment {
        CI = 'true'
    }
    stages {
        stage ('Before Build') {
            steps {
                sh 'npx cypress install'
            }
        }
        // first stage installs node dependencies and Cypress binary
        stage('Build') {
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                sh 'yarn install'
            }
        }
        stage('Test') {
            steps {
                sh 'yarn lint:travis'
                sh 'yarn test:unit'
                sh 'yarn test:e2e:travis'
            }
        }
        stage('Upload') {
            steps {
                sh 'npx codecov ./test/unit/coverage/clover.xml'
            }
        }
    }
    post {
        always {
            junit './test/unit/coverage/clover.xml'
        }
    }
}


