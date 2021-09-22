## Launch dev backend environments

### locally contained dev environment
This involves dockerized Ganache, and a Orbs node management-service. 
Both are docker-composed locally.
- Totally contained - other than installation can run offline
- Full control over the setup state
- Assumes dev mnemonic 

```bash
npm install
npm run up-dev
```
### forked dev environment
Run a dockerized Ganache instance forking ethereum
- Reflects mainnet production identical to production env at the time of execute (option to pin a specific block if deterministic results are required)
- Requires network access to a mainnet node, preferably an archive node
- Assumes mainnet contract production   
- Downloads a static orbs node json file - does not respond to changes
- Fork does not handle getPastEvents properly so expect that not to work
 
```bash
npm install
export ETHEREUM_FORK_URL=[url to infura or other mainnet node]
npm run up-mainnet-fork
```

### Ropsten backend 
Runs a dockerized instance of Orbs management service against Ropsten contracts

### Deploying ropsten contracts:
```bash
npm install
export ETHEREUM_URL=[url to infura or other ropsten node]
export WEB3_DRIVER_VERBOSE=true
npm run deploy-driver
```
