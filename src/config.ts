import { IOrbsPosContractsAddresses } from 'orbs-pos-data';

/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

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

// Webpack will remove this section on production build //
if (process.env.NODE_ENV !== 'production') {
  config.ETHEREUM_PROVIDER_WS = 'ws://localhost:8545';

  const OrbsGuardiansContractJSON = require('../ganache-env/build/contracts/OrbsGuardians.json');
  const OrbsTokenContractJSON = require('../ganache-env/build/contracts/OrbsToken.json');
  const StakingContractJSON = require('../ganache-env/build/contracts/StakingContract.json');
  const VotingContractJSON = require('../ganache-env/build/contracts/OrbsVoting.json');

  config.contractsAddressesOverride.stakingContract = StakingContractJSON.networks['5777'].address;
  config.contractsAddressesOverride.erc20Contract = OrbsTokenContractJSON.networks['5777'].address;
  config.contractsAddressesOverride.guardiansContract = OrbsGuardiansContractJSON.networks['5777'].address;
  config.contractsAddressesOverride.votingContract = VotingContractJSON.networks['5777'].address;

  config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.
}

export default config;
