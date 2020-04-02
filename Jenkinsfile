pipeline {
    agent {
        docker {
            image 'cypress/base:10'
        }
    }
    environment {
        CI = 'true'
        CYPRESS_CACHE_FOLDER = '/var/jenkins_home/.cache/Cypress'
    }
    stages {
        stage ('Before Build') {
            steps {
                sh 'echo $CYPRESS_CACHE_FOLDER'
                sh 'printenv'
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
                sh 'npx codecov ./test/unit/coverage/clover.xml -t $codecov_front'
            }
        }
    }
    post {
        always {
            junit './test/unit/coverage/clover.xml'
        }
    }
}


