import { getNumberSeparators } from './utils/numberUtils';
import ethImg from '../assets/logos/eth.png';
import polygonImg from '../assets/logos/polygon.png';
import { CHAINS } from './constants';

/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

export const IS_DEV = process.env.IS_DEV;

////////////// CONFIG VARIABLES ///////////////

interface IContaractAdresses {
  stakingContract: string;
  erc20Contract: string;
  guardiansContract: string;
  orbsRewardsDistributionContract: string;
  stakingRewardsContract: string;
  delegationsContract: string;
  committeeContract: string;
}

export interface INetwork {
  addresses?: IContaractAdresses;
  managementServiceStatusPageUrl?: string;
  earliestBlockForDelegationOverride?: number;
  name: string;
  logo?: string;
  requiredConfirmations?: number;
  nativeCurrency?: { name: string; symbol: string; decimals: number };
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
}

const networks: { [key: string]: INetwork } = {
  [CHAINS.ethereum]: {
    name: 'Ethereum',
    managementServiceStatusPageUrl: 'https://0xcore-management-direct.global.ssl.fastly.net/status',
    logo: ethImg,
    requiredConfirmations: 7,
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [CHAINS.ropsten]: {
    name: 'Ropsten',
    earliestBlockForDelegationOverride: 9644509,
    managementServiceStatusPageUrl: 'https://tetra-staging-management.global.ssl.fastly.net/status',
    requiredConfirmations: 7,
    logo: ethImg,
    addresses: {
      erc20Contract: '0x0e2CE2e9C8A23F02162d2226352452CCbD9dfFcE',
      delegationsContract: '0x4c743ED737359c3e502ed77E85392e037Af19F69',
      stakingContract: '0xb4395d2d2a70DC791F5f65303ffF38c6C0dfa27e',
      stakingRewardsContract: '0xA8E5EFD0e2cC5dCB38f8a2AE566E14C66dB4C36f',
      guardiansContract: '0x16F93f7929E4a294b7916544f10Ee94EB094B2eC',
      committeeContract: '0xdbcf7666504f7975cA08FbCeef3e949c5dFE8906',
      orbsRewardsDistributionContract: '',
    },
  },
  [CHAINS.polygon]: {
    logo: polygonImg,
    earliestBlockForDelegationOverride: 0,
    managementServiceStatusPageUrl: 'https://0xcore-matic-reader-direct.global.ssl.fastly.net/status',
    requiredConfirmations: 20,
    name: 'Polygon',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://www.polygonscan.com'],
    addresses: {
      erc20Contract: '0x614389EaAE0A6821DC49062D56BDA3d9d45Fa2ff',
      delegationsContract: '0x19611B0Bda728Bf02821B2fcC81a5fd1d2D8ae45',
      stakingContract: '0xBdBee0688f2119e1C61dd2Edd9d475c2009b9768',
      stakingRewardsContract: '0x4450bd4e1489cf7629CBFEd837e879Fb71bc4dF0',
      guardiansContract: '0x9C9ff40EC1C90bB4F72FF123c204ADC55782946d',
      committeeContract: '0xc7e9CfeCfE49d0f6794Da92ACcF513ece3759a4B',
      orbsRewardsDistributionContract: '',
    },
  },
  local: {
    name: 'local',
    earliestBlockForDelegationOverride: 0,
    managementServiceStatusPageUrl: 'http://localhost:7666/status',
    addresses: {
      erc20Contract: '0x96A9b808F1C506a7684FC3AFFBE86681286C92aE',
      delegationsContract: '0x74aD147017eAa8C1d5977A48b21F4d712EE617a0',
      stakingContract: '0xE6f4C12A49B557b2Ad46e03E729662ac5425fbeD',
      stakingRewardsContract: '0xa05cb494562F0e395D3EfADdF9496a18b3a67db9',
      guardiansContract: '0xd4e61B2029422349aCCf6DC26246DbA8FFDd8abD',
      committeeContract: '0xAb6311Cb1bf0823D2d04f871351F2aCf39EBe282',
      orbsRewardsDistributionContract: '',
    },
  },
  [CHAINS.kovanTest]: {
    name: 'Kovan Test',
  },
  [CHAINS.rinkebyTest]: {
    name: 'Rinkeby Test Network',
  },
  [CHAINS.goerliTest]: {
    name: 'Goerli Test Network',
  },
};

interface IConfig {
  urlBase: string;
  earliestBlockForDelegationOverride: number;
  gaTrackerId: string;
  analyticsActive: boolean;
  rewardsRefreshRateInSeconds: number;
  numberSeparator: { decimal: string; thousand: string };
  networks: { [key: string]: INetwork };
}

const config: IConfig = {
  urlBase: process.env.PUBLIC_BASE_PATH,
  earliestBlockForDelegationOverride: null,
  gaTrackerId: process.env.GA_TRACKER_ID || '',
  analyticsActive: process.env.GA_TRACKER_ID !== undefined,
  rewardsRefreshRateInSeconds: 10,
  numberSeparator: getNumberSeparators(),
  networks,
};

export default config;
