# Orbs Staking Wallet (Tetra)
Web client that enables users to take part in the ORBS pos staking process.

## Build

* Run in terminal in root project directory:

  ```
  npm run build
  ```

## Test

* For unit tests, run in terminal in root project directory:

  ```
  npm run test
  ```

## Running - Local ethereum network

* Start local ethereum network (Ganache)
   ```
    cd ./ganach-env
    npm run start-ganache
   ```
   
* Compile and deploy the contracts to your local Ganache

* Start local dev server

  ```
  cd ./ganace-dev
  npm run compile-and-deploy
  ```    

* Open the localhost address in your browser (localhost:8080)

* In your browser, set MetaMask network to 'localhost 8545' 

## Deploy 
* Run in terminal in root project directory:

  ```
  npm run deploy
  ``` 
