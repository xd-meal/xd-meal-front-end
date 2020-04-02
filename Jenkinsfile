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
        stage ('before_build') {
            steps {
                sh 'npx cypress install'
            }
        }
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
                sh ' yarn test:e2e:travis'
                sh 'codecov ./test/unit/coverage/clover.xml'
            }
        }
    }
}


