/* eslint-disable prettier/prettier */
// import { log, TestkitDriver } from 'rewards-v2/dist/e2e/driver';

// import { log, TestkitDriver } from "rewards-v2/dist/e2e/driver";

import { toWei } from 'web3-utils';
import { Driver as OrbsV2Driver } from '@orbs-network/orbs-ethereum-contracts-v2';
import { writeFileSync } from 'fs';

const co = require('@orbs-network/orbs-ethereum-contracts-v2');
const BN = require('bn.js');

const deployDriverScripts = async () => {
  try {
    console.log('deploying Orbs PoS V2 contracts');
    const driver = await OrbsV2Driver.new();
    console.log('After deploying Orbs PoS V2 contracts');

    const orbsV2Account = driver.accounts[0];
    console.log(`Assigning ORBS to ${orbsV2Account}`);
    await driver.erc20.assign(orbsV2Account, new BN('1000000000000000000000000000'));
    console.log(`Balance of ${orbsV2Account} `, await driver.erc20.balanceOf(orbsV2Account));

    const addresses = {
      staking: driver.staking.address,
      erc20: driver.erc20.address,
      guardians: driver.guardiansRegistration.address,
      stakingRewards: driver.stakingRewards.address,
      delegations: driver.delegations.address,
      committee: driver.committee.address,
    };

    console.log('Saving addresses to file');
    writeFileSync('./_out/addresses.json', JSON.stringify(addresses, null, 2));
    writeFileSync('../src/local/addresses.json', JSON.stringify(addresses, null, 2));
  } catch (e) {
    console.log('error');
    console.error(e);
  }
};

deployDriverScripts()
  .then(() => {
    console.log('script done');
  })
  .catch((e) => console.log('Script error'))
  .finally(() => {
    console.log('Finally');
    process.exit();
  });

export {};
