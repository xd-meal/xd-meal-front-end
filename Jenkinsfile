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
                sh 'echo $YARN_CACHE_FOLDER'
                sh 'yarn install'
                sh 'npx cypress install'
            }
        }
        stage('Test') {
            steps {
                sh 'yarn lint:travis'
                sh 'yarn test:unit'
                sh 'yarn test:e2e:travis'
            }
        }
        stage('Build') {
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                sh 'yarn build'
            }
        }
        stage('Upload') {
            steps {
                sh 'npx codecov ./test/unit/coverage/clover.xml -t $codecov_front'
                sh 'tar -zcvf build.tar.gz cordova-app/www'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'build.tar.gz', onlyIfSuccessful: true
            junit 'test/e2e/result.xml'
        }
    }
}


