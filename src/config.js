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
const OVERRIDE_STAKING_CONTRACT_ADDRESS = IS_DEV ? '0x1CC4211D2314B4b78994f2C61228C35C8fCD09Ad' : undefined;
const OVERRIDE_ERC20_CONTRACT_ADDRESS = IS_DEV ? '0x2409BD6889CBB81Bca105d20C6701ab5b822f42D' : undefined;
const OVERRIDE_GUARDIANS_CONTRACT_ADDRESS = IS_DEV ? '0x7D4089cF9448a6E59792b8a1af86f31A54ED69ee' : undefined;
const ETHEREUM_PROVIDER_WS = IS_DEV ? 'ws://localhost:7545' : 'wss://mainnet.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287';

module.exports = {
  contractsAddressesOverride: {
    stakingContract: OVERRIDE_STAKING_CONTRACT_ADDRESS,
    erc20Contract: OVERRIDE_ERC20_CONTRACT_ADDRESS,
    guardiansContract: OVERRIDE_GUARDIANS_CONTRACT_ADDRESS,
  },
  ETHEREUM_PROVIDER_WS,
};
