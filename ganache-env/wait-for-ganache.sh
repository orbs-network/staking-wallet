#!/bin/bash

# find URL
if [ -n "$1" ]
then
  URL=$1
elif [ -n "$ETHEREUM_URL" ]
then
  URL=$ETHEREUM_URL
else
  echo 'ETHEREUM_URL must be set or parameter passed - exiting...'
  exit 123
fi

# try to reach server
echo "waiting for server at $URL"
curl -s "$URL" > /dev/null

# until it responds
while [ $? != 0 ]; do
  echo 'waiting for server...'
  sleep 1
  curl -s "$URL" > /dev/null
done

echo "server responding..."
