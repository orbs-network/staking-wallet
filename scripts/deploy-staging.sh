#!/usr/bin/env bash

aws s3 cp --acl=public-read --profile=testnet --recursive ./dist s3://orbs-staking-staging/