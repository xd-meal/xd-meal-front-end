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
        // first stage installs node dependencies and Cypress binary
        stage('build') {
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                sh 'yarn install'
            }
        }
        stage('Test') {
            steps {
                sh 'yarn lint:travis'
                sh 'yarn test:unit'
                sh 'export CYPRESS_CACHE_FOLDER=./node_modules/cypress/cache/Cypress'
                sh ' yarn test:e2e:travis'
                sh 'codecov ./test/unit/coverage/clover.xml'
            }
        }
    }
}


