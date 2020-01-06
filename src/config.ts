/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */


////////////// CONFIG VARIABLES ///////////////
const config = {
  contractsAddressesOverride: {
    stakingContract: undefined,
    erc20Contract: undefined,
    guardiansContract: undefined,
  },
  ETHEREUM_PROVIDER_WS: 'wss://mainnet.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287',
};

// Webpack will remove this section on production build //
if (process.env.NODE_ENV !== 'production') {
  config.ETHEREUM_PROVIDER_WS = 'ws://localhost:8545';

  const OrbsGuardiansContractJSON = require('../ganache-env/build/contracts/OrbsGuardians.json');
  const OrbsTokenContractJSON = require('../ganache-env/build/contracts/OrbsToken.json');
  const StakingContractJSON = require('../ganache-env/build/contracts/StakingContract.json');

  config.contractsAddressesOverride.stakingContract = StakingContractJSON.networks['9999'].address;
  config.contractsAddressesOverride.erc20Contract = OrbsTokenContractJSON.networks['9999'].address;
  config.contractsAddressesOverride.guardiansContract = OrbsGuardiansContractJSON.networks['9999'].address;
}

console.log(config);
export default config;
