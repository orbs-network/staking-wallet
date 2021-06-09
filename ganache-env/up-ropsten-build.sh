#!/bin/bash -e

docker-compose -f docker-compose-ropsten.yml build management-service-ropsten

aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 506367651493.dkr.ecr.us-east-2.amazonaws.com
docker tag ganache-env_management-service-ropsten 506367651493.dkr.ecr.us-east-2.amazonaws.com/management-service-ropsten:latest
docker push 506367651493.dkr.ecr.us-east-2.amazonaws.com/management-service-ropsten:latest

ssh ubuntu@ec2-18-222-98-49.us-east-2.compute.amazonaws.com "bash deploy.sh"