import { IOrbsPosContractsAddresses } from 'orbs-pos-data';

/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

type TSupportedNets = 'local' | 'ropsten' | 'mainnet' | 'mainnet-fork';
// @ts-ignore
const ethereumNetwork: TSupportedNets = process.env.ETHEREUM_NETWORK;

export const IS_DEV = process.env.NODE_ENV !== 'production';
const SHOULD_OVERRIDE_ADDRESS = ethereumNetwork === 'local' || ethereumNetwork === 'ropsten';

////////////// CONFIG VARIABLES ///////////////
interface IConfig {
  urlBase: string;
  contractsAddressesOverride: Partial<{
    stakingContract: string;
    erc20Contract: string;
    guardiansContract: string;
    orbsRewardsDistributionContract: string;
    stakingRewardsContract: string;
    delegationsContract: string;
    committeeContract: string;
  }>;
  ETHEREUM_PROVIDER_WS: string;
  earliestBlockForDelegationOverride: number;
  gaTrackerId: string;
  analyticsActive: boolean;
  rewardsRefreshRateInSeconds: number;
}

const config: IConfig = {
  urlBase: process.env.PUBLIC_BASE_PATH,
  contractsAddressesOverride: SHOULD_OVERRIDE_ADDRESS ? {} : null,
  ETHEREUM_PROVIDER_WS: 'wss://mainnet.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287',
  earliestBlockForDelegationOverride: null,
  gaTrackerId: 'UA-163134097-1',
  analyticsActive: !IS_DEV,
  rewardsRefreshRateInSeconds: 10,
};

// Webpack will remove this section on production build //
if (process.env.NODE_ENV !== 'production') {
  if (ethereumNetwork === 'local' || ethereumNetwork === 'mainnet-fork') {
    config.ETHEREUM_PROVIDER_WS = 'ws://localhost:7545';
  }

  if (ethereumNetwork === 'local') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const addresses = require('./local/addresses.json');

    config.contractsAddressesOverride.stakingContract = addresses.staking;
    config.contractsAddressesOverride.erc20Contract = addresses.erc20;
    config.contractsAddressesOverride.guardiansContract = addresses.guardians;
    config.contractsAddressesOverride.stakingRewardsContract = addresses.stakingRewards;
    config.contractsAddressesOverride.delegationsContract = addresses.delegations;
    config.contractsAddressesOverride.committeeContract = addresses.commitee;

    config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.
  }
}

// TODO : ORL : Adjusts these addresses for v2.
if (ethereumNetwork === 'ropsten') {
  config.ETHEREUM_PROVIDER_WS = 'wss://ropsten.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287';

  const ROPSTEN_ERC20 = '0xaFcb0E4560dCD904dF059AF37D5E832A086b59a9';
  const ROPSTEN_DELEGATIONS = '0x46A8d3F3757F5534E403E616c228812b43a43aAe';
  const ROPSTEN_STAKING = '0xD950DaB449dD0e6FE85783F16A3Bc8755D414D1E';
  const ROPSTEN_STAKING_REWARDS = '0xFb96EA0b31035737F50EC373A50C0ac1f67e7443';
  const ROPSTEN_GUARDIANS = '0x5f62dBeBa742f1aeb6FCd56a71987cbB3c82abb6';
  const ROPSTEN_COMMITTEE = '0x81e6D2512adA5e36897F182F54C135F8f2832E29';

  config.contractsAddressesOverride.stakingContract = ROPSTEN_STAKING;
  config.contractsAddressesOverride.erc20Contract = ROPSTEN_ERC20;
  config.contractsAddressesOverride.guardiansContract = ROPSTEN_GUARDIANS;
  config.contractsAddressesOverride.stakingRewardsContract = ROPSTEN_STAKING_REWARDS;
  config.contractsAddressesOverride.delegationsContract = ROPSTEN_DELEGATIONS;
  config.contractsAddressesOverride.committeeContract = ROPSTEN_COMMITTEE;

  config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.
}

export default config;
