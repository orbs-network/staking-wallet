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

export const IS_DEV = process.env.NODE_ENV !== 'production';
const SHOULD_OVERRIDE_ADDRESS = IS_DEV || ethereumNetwork === 'ropsten';

////////////// CONFIG VARIABLES ///////////////
interface IConfig {
  urlBase: string;
  contractsAddressesOverride: Partial<{
    stakingContract: string;
    erc20Contract: string;
    guardiansContract: string;
    orbsRewardsDistributionContract: string;
    delegationsContract: string;
    committeeContract: string;
  }>;
  ETHEREUM_PROVIDER_WS: string;
  earliestBlockForDelegationOverride: number;
  gaTrackerId: string;
  analyticsActive: boolean;
}

const config: IConfig = {
  urlBase: process.env.PUBLIC_BASE_PATH,
  contractsAddressesOverride: SHOULD_OVERRIDE_ADDRESS ? {} : null,
  ETHEREUM_PROVIDER_WS: 'wss://mainnet.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287',
  earliestBlockForDelegationOverride: null,
  gaTrackerId: 'UA-163134097-1',
  analyticsActive: !IS_DEV,
};

// Webpack will remove this section on production build //
if (process.env.NODE_ENV !== 'production') {
  if (ethereumNetwork === 'local') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const addresses = require('./local/addresses.json');
    // const OrbsGuardiansContractJSON = require('../ganache-env/build/contracts/OrbsGuardians.json');
    // const OrbsTokenContractJSON = require('../ganache-env/build/contracts/OrbsToken.json');
    // const StakingContractJSON = require('../ganache-env/build/contracts/StakingContract.json');
    // const VotingContractJSON = require('../ganache-env/build/contracts/OrbsVoting.json');
    // const RewardsDistributionContractJSON = require('../ganache-env/build/contracts/OrbsRewardsDistribution.json');

    config.ETHEREUM_PROVIDER_WS = 'ws://localhost:8545';

    // config.contractsAddressesOverride.votingContract = VotingContractJSON.networks['5777'].address;
    config.contractsAddressesOverride.stakingContract = addresses.staking;
    config.contractsAddressesOverride.erc20Contract = addresses.erc20;
    config.contractsAddressesOverride.guardiansContract = addresses.guardians;
    config.contractsAddressesOverride.orbsRewardsDistributionContract = addresses.rewards;
    config.contractsAddressesOverride.delegationsContract = addresses.delegations;
    config.contractsAddressesOverride.committeeContract = addresses.commitee;

    config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.
  }
}

// TODO : ORL : Adjusts these addresses for v2.
if (ethereumNetwork === 'ropsten') {
  // config.contractsAddressesOverride.stakingContract = '0x88287444f10709f9531D11e08DCd692deccd1d63';
  // config.contractsAddressesOverride.erc20Contract = '0xeD0Aa9A4F9e5ae9092994f4B86F6AAa89944939b';
  // config.contractsAddressesOverride.guardiansContract = '0x636315bcD912B1DbFe38E6b75f5B6AEE4Cd63B30';
  // // config.contractsAddressesOverride.votingContract = '0xF90a738CA659Fe99E357cB7F47Aaa5cB9b5724a2';
  // // TODO : ORL : Add Ropsten address
  // config.contractsAddressesOverride.orbsRewardsDistributionContract = '';
  //
  // config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.

  const ROPSTEN_ERC20 = '0xD2Aad026e9a307Df950143B5ec841a2388378f8F';
  const ROPSTEN_DELEGATIONS = '0x44c46e661424Dd0db06570087Fe19ee364Eb3296';
  const ROPSTEN_STAKING = '0x0aB60194B38BcE3F2A05A46D49e8d759c1bd460d';
  const ROPSTEN_REWARDS = '0x8eC056cdcd5b41Dc581b6B7d4F555F5Dac056C7c';
  const ROPSTEN_GUARDIANS = '0x75D06583B9475a6871a7b281231Cd3cC477A390A';
  const ROPSTEN_COMMITTEE = '0x1027DA2dfAAc623297792078D4948d65198a56d0';

  config.contractsAddressesOverride.stakingContract = ROPSTEN_STAKING;
  config.contractsAddressesOverride.erc20Contract = ROPSTEN_ERC20;
  config.contractsAddressesOverride.guardiansContract = ROPSTEN_GUARDIANS;
  config.contractsAddressesOverride.orbsRewardsDistributionContract = ROPSTEN_REWARDS;
  config.contractsAddressesOverride.delegationsContract = ROPSTEN_DELEGATIONS;
  config.contractsAddressesOverride.committeeContract = ROPSTEN_COMMITTEE;

  config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.
}

export default config;
