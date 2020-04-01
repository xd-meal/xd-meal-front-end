pipeline {
    agent {
        docker {
            image 'cypress/base:10'
        }
    }
    stages {
        // first stage installs node dependencies and Cypress binary
        stage('build') {
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                sh 'yarn install'
                sh 'yarn lint:travis'
                sh 'yarn test:unit'
                sh 'yarn test:e2e:travis'
            }
        }
    }
}


