#!/bin/bash

set -e

./wait-for-ganache.sh $1

npm run deploy-driver
