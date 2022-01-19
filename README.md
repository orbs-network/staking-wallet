# Orbs Staking Wallet (Tetra)

Web client that enables users to take part in the ORBS pos staking process.
All contract interactions are done with the [orbs-pos-data](https://github.com/orbs-network/orbs-ethereum-contracts-v1) library.

## Test

- For unit tests, run in terminal in root project directory:

  ```
  npm run test
  ```

### Running - Local ethereum network - synthetic committee & stake

- Start local ethereum network (Ganache)

  ```
   cd ./ganach-env
   npm install
   npm run up-dev
  ```

- Start local dev server (from the root folder of the project)

  ```
  npm run dev
  ```

### Running - Local ethereum network with tunnel to test mobile wallet - synthetic committee & stake

- Start local ethereum network (Ganache)

  ```
   cd ./ganach-env
   npm install
   npm run up-dev
  ```

- Start local dev server (from the root folder of the project)

  ```
  npm run tunnel-status
  npm run tunnel-ganache
  npm run serve-dev-tunnel
  ```

  make sure that the mobile device and computer connected to the same wifi.
  copy "On Your Network" url and paste it inside the mobile wallet app browser

- [Setup Metamask wallet](#test-tetra)

### Running - Local Fork from ethereum mainnet - current real world committee snapshot

- Start local ethereum network (Ganache)

  ```
   cd ./ganach-env
   npm install
   export ETHEREUM_FORK_URL=[url to infura or other mainnet node]
   npm run up-mainnet-fork
  ```

- Start local dev server (from the root folder of the project)

  ```
  npm run dev-fork
  ```

### Running - Local Fork from ethereum mainnet with tunnel to test mobile wallet - current real world committee snapshot

- Start local ethereum network (Ganache)

  ```
   cd ./ganach-env
   npm install
   export ETHEREUM_FORK_URL=[url to infura or other mainnet node]
   npm run up-mainnet-fork
  ```

- Start local dev server (from the root folder of the project)
  ```
  npm run tunnel-status
  npm run tunnel-ganache
  npm run serve-dev-fork-tunnel
  ```
  make sure that the mobile device and computer connected to the same wifi.
  copy "On Your Network" url and paste it inside the mobile wallet app browser

* [Setup Metamask wallet](#test-tetra)

### Running - Local Orbs service against ropsten testnet - synthetic committee with more realistic delays and gas costs

- Start local ethereum network (Ganache)

  ```
   cd ./ganach-env
   npm install
   npm run up-ropsten
  ```

- Start local dev server (from the root folder of the project)

  ```
  npm run dev-rops
  ```

- [Setup Metamask wallet](#test-tetra)

## Test tetra

- Open the localhost address in your browser (localhost:8080)

- Setup Metamask:
  - Configure your Metamask browser plugin network to `localhost:7545`
  - Test scenarios require access to a predefined address which is preassigned with stake and rewards. To unlock this address in Metamask choose one of these two:
    - For a separate Metamask account, use mnemonic `vanish junk genuine web seminar cook absurd royal ability series taste method identify elevator liquid`
    - To test Tetra while using a different mnemonic, you can import just the Tetra test account using a private key: `0xf2ce3a9eddde6e5d996f6fe7c1882960b0e8ee8d799e0ef608276b8de4dc7f19`

**CAUTION : Be careful not to use this account on the mainnet !!!**

- Start using Tetra :)

## Deploy

- Run in terminal in root project directory:

  ```
  npm run deploy-production
  ```

## Deploy your own version to github pages

You can deploy your own version of Tetra to github pages very easily.

1. Open a new repo on github.
2. Change the value of the env variable 'DEPLOY_REPO' in the 'deploy' command on 'package.json' to match the name of your new repo.
3. Change the values on ".env"
   - ETHEREUM_NETWORK - ropsten/mainnet
   - PUBLIC_BASE_PATH - '/' + the name of your repo
   - PUBLIC_BASE_PATH_SECTIONS - 1 (for github pages)
4. Change 'segmentCount' on '404.html' to 1 (for github pages).
5. Run in terminal
   ```
   npm run deploy-production
   ```

Your own tetra version will now be deployed on the URL (your-github-user).github.io/(your-repo-name)

Note : After your first deploy you will need to set your repo to be used as a project site on GitHub pages

1. Open your repo page on GitHub.
2. Go to 'Settings' -> options
3. Go to the 'GitHub Pages' section.
4. Activate GitHub pages and select you master branch as its source for deployment.
