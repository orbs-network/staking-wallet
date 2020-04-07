#!/usr/bin/env bash

git clone git@github.com:orbs-network/staking.git
cd staking/
git rm -rf *
cp -R ../dist/* ./
touch .nojekyll
git add .
git commit -m "deploy"
git push origin master
cd ..
rm -rf staking
