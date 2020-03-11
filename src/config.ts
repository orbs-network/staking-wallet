import { IOrbsPosContractsAddresses } from 'orbs-pos-data';

/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

type TSupportedNets = 'local' | 'ropsten' | 'mainnet';
// @ts-ignore
const ethereumNetwork: TSupportedNets = process.env.ETHEREUM_NETWORK;

////////////// CONFIG VARIABLES ///////////////
interface IConfig {
  contractsAddressesOverride: Partial<IOrbsPosContractsAddresses & { stakingContract: string }>;
  ETHEREUM_PROVIDER_WS: string;
  earliestBlockForDelegationOverride: number;
}
const config: IConfig = {
  contractsAddressesOverride: {},
  ETHEREUM_PROVIDER_WS: 'wss://mainnet.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287',
  earliestBlockForDelegationOverride: null,
};

console.log('ethereumNetwork', ethereumNetwork);

// Distinguish local network and ropsten
if (ethereumNetwork === 'local') {
  const OrbsGuardiansContractJSON = require('../ganache-env/build/contracts/OrbsGuardians.json');
  const OrbsTokenContractJSON = require('../ganache-env/build/contracts/OrbsToken.json');
  const StakingContractJSON = require('../ganache-env/build/contracts/StakingContract.json');
  const VotingContractJSON = require('../ganache-env/build/contracts/OrbsVoting.json');

  config.ETHEREUM_PROVIDER_WS = 'ws://localhost:8545';

  config.contractsAddressesOverride.stakingContract = StakingContractJSON.networks['5777'].address;
  config.contractsAddressesOverride.erc20Contract = OrbsTokenContractJSON.networks['5777'].address;
  config.contractsAddressesOverride.guardiansContract = OrbsGuardiansContractJSON.networks['5777'].address;
  config.contractsAddressesOverride.votingContract = VotingContractJSON.networks['5777'].address;

  config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.
} else if (ethereumNetwork === 'ropsten') {
  config.contractsAddressesOverride.stakingContract = '0x88287444f10709f9531D11e08DCd692deccd1d63';
  config.contractsAddressesOverride.erc20Contract = '0xeD0Aa9A4F9e5ae9092994f4B86F6AAa89944939b';
  config.contractsAddressesOverride.guardiansContract = '0x636315bcD912B1DbFe38E6b75f5B6AEE4Cd63B30';
  config.contractsAddressesOverride.votingContract = '0xF90a738CA659Fe99E357cB7F47Aaa5cB9b5724a2';

  config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.
}

export default config;
