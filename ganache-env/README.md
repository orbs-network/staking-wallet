=== Dev env for this wallet

* Start by running `npm run start-ganache`, this will start Ganache on port 8545 with a specific account
* In metamask:
    * Point it to `localhost:8545`.
    * Import an account with this mnemonic: `bone spatial narrow improve drop rabbit song pride lamp strong run hand`
* Run `npm run compile-and-deploy` to compile and deploy all the required contracts.
* Back in metamask, add Orbs token
    * Custom Token
    * Token Contract Address: `0x24f45954D5B7E3be12B9E2072Eb4e0AcCa96906d`
    * Token Symbol: `ORBS`
    * Decimals of Precision: 18