#!/bin/bash -e

git config --global user.email "itamar@orbs.com"
git config --global user.name "Itamar Arjuan"

npm install
npm run deploy-staging