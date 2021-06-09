#!/bin/bash -e

aws ecr get-login-password --region us-east-2 | sudo docker login --username AWS --password-stdin 506367651493.dkr.ecr.us-east-2.amazonaws.com
sudo docker pull 506367651493.dkr.ecr.us-east-2.amazonaws.com/management-service-ropsten:latest
sudo docker-compose -f docker-compose-remote.yml down
sudo docker-compose -f docker-compose-remote.yml up -d