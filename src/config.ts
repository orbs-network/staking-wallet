import { IOrbsPosContractsAddresses } from 'orbs-pos-data';
import { getNumberSeparators } from './utils/numberUtils';

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

export const IS_DEV = process.env.IS_DEV; // TODO - fix NODE_ENV is always development
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
  numberSeparator: { decimal: string; thousand: string };
}

const config: IConfig = {
  urlBase: process.env.PUBLIC_BASE_PATH,
  contractsAddressesOverride: SHOULD_OVERRIDE_ADDRESS ? {} : null,
  ETHEREUM_PROVIDER_WS: 'wss://mainnet.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287',
  earliestBlockForDelegationOverride: null,
  gaTrackerId: process.env.GA_TRACKER_ID || '',
  analyticsActive: process.env.GA_TRACKER_ID !== undefined,
  rewardsRefreshRateInSeconds: 10,
  numberSeparator: getNumberSeparators(),
};

// Webpack will remove this section on production build //
if (IS_DEV) {
  if (ethereumNetwork === 'local' || ethereumNetwork === 'mainnet-fork') {
    config.ETHEREUM_PROVIDER_WS = 'ws://localhost:7545';
  }

  if (ethereumNetwork === 'local') {
    const LOCAL_ERC20 = '0x96A9b808F1C506a7684FC3AFFBE86681286C92aE';
    const LOCAL_DELEGATIONS = '0x74aD147017eAa8C1d5977A48b21F4d712EE617a0';
    const LOCAL_STAKING = '0xE6f4C12A49B557b2Ad46e03E729662ac5425fbeD';
    const LOCAL_STAKING_REWARDS = '0xa05cb494562F0e395D3EfADdF9496a18b3a67db9';
    const LOCAL_GUARDIANS = '0xd4e61B2029422349aCCf6DC26246DbA8FFDd8abD';
    const LOCAL_COMMITTEE = '0xAb6311Cb1bf0823D2d04f871351F2aCf39EBe282';
    const LOCAL_REGISTRY = '0x5cd0D270C30EDa5ADa6b45a5289AFF1D425759b3';

    config.contractsAddressesOverride.erc20Contract = LOCAL_ERC20;
    config.contractsAddressesOverride.delegationsContract = LOCAL_DELEGATIONS;
    config.contractsAddressesOverride.stakingContract = LOCAL_STAKING;
    config.contractsAddressesOverride.stakingRewardsContract = LOCAL_STAKING_REWARDS;
    config.contractsAddressesOverride.guardiansContract = LOCAL_GUARDIANS;
    config.contractsAddressesOverride.committeeContract = LOCAL_COMMITTEE;

    config.earliestBlockForDelegationOverride = 0; // Local env starts from 0.
  }
}

// TODO : ORL : Adjusts these addresses for v2.
if (ethereumNetwork === 'ropsten') {
  config.ETHEREUM_PROVIDER_WS = 'wss://ropsten.infura.io/ws/v3/3fe9b03bd8374639809addf2164f7287';

  const ROPSTEN_ERC20 = '0x0e2CE2e9C8A23F02162d2226352452CCbD9dfFcE';
  const ROPSTEN_DELEGATIONS = '0x4c743ED737359c3e502ed77E85392e037Af19F69';
  const ROPSTEN_STAKING = '0xb4395d2d2a70DC791F5f65303ffF38c6C0dfa27e';
  const ROPSTEN_STAKING_REWARDS = '0xA8E5EFD0e2cC5dCB38f8a2AE566E14C66dB4C36f';
  const ROPSTEN_GUARDIANS = '0x16F93f7929E4a294b7916544f10Ee94EB094B2eC';
  const ROPSTEN_COMMITTEE = '0xdbcf7666504f7975cA08FbCeef3e949c5dFE8906';
  const ROPSTEN_REGISTRY = '0x5D7779231a6344edE6178623f31007cF2D16DFd7';
  const ROPSTEN_STAKING_REWARDS_WALLET = '0xc47E0BeCbC3D9BF91d6C8586b7147338CEAf015B';

  config.contractsAddressesOverride.stakingContract = ROPSTEN_STAKING;
  config.contractsAddressesOverride.erc20Contract = ROPSTEN_ERC20;
  config.contractsAddressesOverride.guardiansContract = ROPSTEN_GUARDIANS;
  config.contractsAddressesOverride.stakingRewardsContract = ROPSTEN_STAKING_REWARDS;
  config.contractsAddressesOverride.delegationsContract = ROPSTEN_DELEGATIONS;
  config.contractsAddressesOverride.committeeContract = ROPSTEN_COMMITTEE;

  config.earliestBlockForDelegationOverride = 9644509; // Local env starts from 0.
}

export default config;
