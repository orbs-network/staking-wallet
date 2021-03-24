#!/bin/bash
set -e
echo Refreshing local management-service status snapshot...
echo

# download a new version of status.json
rm -rf ./_status
curl -s http://0xcore.orbs.com/services/management-service/status -o status
mkdir ./_status
mv status ./_status/.

# pause until ganache is available
./wait-for-ganache.sh $1

# give ORBS to the user test account
./stealOrbsFromWhale.sh $1
