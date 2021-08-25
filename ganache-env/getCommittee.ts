/* eslint-disable prettier/prettier */
// import { log, TestkitDriver } from 'rewards-v2/dist/e2e/driver';

// import { log, TestkitDriver } from "rewards-v2/dist/e2e/driver";

import { toWei, fromWei } from 'web3-utils';
import { Driver as OrbsV2Driver } from '@orbs-network/orbs-ethereum-contracts-v2';
import { writeFileSync } from 'fs';
import { Participant } from '@orbs-network/orbs-ethereum-contracts-v2/release/test/driver';

const co = require('@orbs-network/orbs-ethereum-contracts-v2');
const BN = require('bn.js');

async function topUp(targetAddr: string, lowerThreshold: number, levelBalance: number, driver: OrbsV2Driver) : Promise<any> {
  const currentBalance = parseFloat(fromWei(await driver.web3.eth.getBalance(targetAddr)));
  console.log('address', targetAddr, 'has', currentBalance, 'ether.')
  if (currentBalance < lowerThreshold && currentBalance < levelBalance) {
    console.log('transfering to', targetAddr, 'amount', levelBalance);
    await driver.web3.eth.sendTransaction({from: driver.accounts[0], to: targetAddr, value: toWei(new BN(levelBalance - currentBalance))});
    console.log('new balance', fromWei(await driver.web3.eth.getBalance(targetAddr)));
  }
}

const getCommittee = async () => {
  try {

    const driver = await OrbsV2Driver.new({ contractRegistryForExistingContractsAddress: "0x5D7779231a6344edE6178623f31007cF2D16DFd7" });
    const orbsV2Account = driver.accounts[0];
      console.log('erc20', driver.erc20.address);

    console.log(await driver.committee.getCommittee());
  } catch (e) {
    console.log('error');
    console.error(e);
  }
};

getCommittee()
  .then(() => {
    console.log('script done');
  })
  .catch((e) => console.log('Script error'))
  .finally(() => {
    process.exit();
  });

export {};
