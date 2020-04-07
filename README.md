# Orbs Staking Wallet (Tetra)
Web client that enables users to take part in the ORBS pos staking process.
All contract interactions are done with the [orbs-pos-data](https://github.com/orbs-network/orbs-ethereum-contracts-v1) library.

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
  This will start a [Ganache](https://www.trufflesuite.com/ganache) local network that will keep running until stopped (You might want to use a separate terminal for this).
   
* Compile and deploy the contracts to your local Ganache
    ```
    cd ./ganach-env
    npm run compile-and-deploy
   ```
    Wait for the contracts to be deployed and proceed to the next step.

* Start local dev server (from the root folder of the project)

  ```
  npm run dev
  ```    

* Open the localhost address in your browser (localhost:8080)

* In your browser, set MetaMask network to 'localhost 8545' 

* Start using Tetra :)

## Deploy 
* Run in terminal in root project directory:

  ```
  npm run deploy
  ``` 
