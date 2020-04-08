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
    npm run deploy
    ```  

Your own tetra version will now be deployed on the URL (your-github-user).github.io/(your-repo-name)

Note : After your first deploy you will need to set your repo to be used as a project site on GitHub pages
1. Open your repo page on GitHub.
2. Go to 'Settings' -> options
3. Go to the 'GitHub Pages' section.
4. Activate GitHub pages and select you master branch as its source for deployment.
