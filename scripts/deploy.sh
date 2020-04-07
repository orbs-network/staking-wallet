#!/usr/bin/env bash

git clone git@github.com:$DEPLOY_USER/$DEPLOY_REPO.git
cd $DEPLOY_REPO/
git rm -rf *
cp -R ../dist/* ./
touch .nojekyll
git add .
git commit -m "deploy"
git push origin master
cd ..
rm -rf $DEPLOY_REPO
