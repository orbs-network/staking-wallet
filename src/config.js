/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

const IS_DEV = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging';

////////////// CONFIG VARIABLES ///////////////

// Contracts
const OVERRIDE_STAKING_CONTRACT_ADDRESS = IS_DEV ? '0x57b5061D5Ce3618757b5A9363Ba0288eaeff0f92' : undefined;
const OVERRIDE_ERC20_CONTRACT_ADDRESS = IS_DEV ? '0xf89c914555717aA8cBEc1472233EDFDd659b57d4' : undefined;
const OVERRIDE_GUARDIANS_CONTRACT_ADDRESS = IS_DEV ? '0xe99e62f03eb4c10deBD532E3494ef103e632153A' : undefined;
const ETHEREUM_PROVIDER_WS = IS_DEV ? 'ws://localhost:8545' : 'wss://mainnet.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287';

module.exports = {
  contractsAddressesOverride: {
    stakingContract: OVERRIDE_STAKING_CONTRACT_ADDRESS,
    erc20Contract: OVERRIDE_ERC20_CONTRACT_ADDRESS,
    guardiansContract: OVERRIDE_GUARDIANS_CONTRACT_ADDRESS,
  },
  ETHEREUM_PROVIDER_WS,
};
