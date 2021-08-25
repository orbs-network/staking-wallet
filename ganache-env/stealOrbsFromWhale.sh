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

echo 'moving funds to test account (0xd1948b0252242b60dab2e3566ad2971b87868644):'
curl -X POST --data '{
    "id": 1337,
    "jsonrpc": "2.0",
    "method": "eth_sendTransaction",
    "params": [{
        "data": "a9059cbb000000000000000000000000d1948b0252242b60dab2e3566ad2971b8786864400000000000000000000000000000000000000000000d3c21bcecceda1000000",
        "from": "0xf448e36e6e6eaf67403e682f6e4cb87b9783c2aa",
        "gas": "0x76c000",
        "gasPrice": "0x1",
        "to": "0xff56Cc6b1E6dEd347aA0B7676C85AB0B3D08B0FA"
    }]
}' "$URL"


sleep 2

echo
echo 'checking new balance of test account (0xd1948b0252242b60dab2e3566ad2971b87868644):'
# check the new balance

balanceWei=$(curl -s "$URL" -X POST   -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_call","params": [{"to": "0xff56cc6b1e6ded347aa0b7676c85ab0b3d08b0fa", "data": "0x70a08231000000000000000000000000d1948B0252242B60DAb2E3566AD2971B87868644", "from": "0xdc562980d0157e1b3fce33755f72f10fc2fb4a63"}, "latest"],"id":1}' | grep -o "0x[0-9a-fA-F]*")

[[ "$balanceWei" =~ "d3c21bcecceda1000000" ]] && echo "Funds successfully transferred 1000000 ORBS"
