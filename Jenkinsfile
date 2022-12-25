pipeline{
    agent any
    
    environment {
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }
        
    stages{
        stage('Build docker image'){
            steps{
                script{
                    sh 'sudo docker build -t navedamanat/frntend:${IMAGE_TAG} .'
                }
            }
        }
        stage('Push image to Docker Hub'){
            steps{
                script{
                    withCredentials([string(credentialsId: 'DOCKER_KEY_MWX', variable: 'DOCKER_KEY_MWX')]) {
                        sh 'echo login to docker hub'
                    }
                }
            }
        }
		stage('Trigger Artifact'){
            steps{
                build job: 'KubeMwFrntEndArtifact', parameters: [string(name: 'IMAGE_TAG', value: env.IMAGE_TAG)]
            }
        }
    }
}

