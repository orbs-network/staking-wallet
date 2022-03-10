import { getNumberSeparators } from '../src/utils/numberUtils';

import smallPolygonIcon from '../assets/logos/polygon-small.svg';
import smallEthereumIcon from '../assets/logos/ethereum-small.svg';
import navbarEthereumImg from '../assets/navbar/ethereum.png';
import navbarPolygonImg from '../assets/navbar/polygon.png';
import polygonImg from '../assets/navbar/polygon-menu-logo.svg';
import ethImg from '../assets/navbar/ethereum-menu-logo.svg';
import { uiConfig } from './ui-config';
import { CHAINS } from '../src/constants';
import { ReactElement } from 'react';

/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

export const IS_DEV = process.env.IS_DEV;


export interface INetwork {
  managementServiceStatusPageUrl?: string;
  earliestBlockForDelegationOverride?: number;
  name: string;
  logo?: string;
  smallLogo?: string;
  requiredConfirmations?: number;
  nativeCurrency?: { name: string; symbol: string; decimals: number };
  rpcUrls?: string[];
  blockExplorerUrl?: string;
  contractsRegistry: string;
  erc20Contract: string;
  navbarImage: string;
  ui: {
    guardians: {
      nonCommitttee: string;
      certifiedNotCommittee: string;
      committee: string;
      certifiedCommittee: string;
    };
    linkImage: string;
    copyImage: string;
    navbar: {
      chainLogo: any;
      ellipsis: string;
      logo: any;
    };
  };
}

const networks: { [key: string]: INetwork } = {
  [CHAINS.ethereum]: {
    name: 'Ethereum',
    managementServiceStatusPageUrl: process.env.NETWORK_1_STATUS_URL,
    logo: ethImg,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    smallLogo: smallEthereumIcon,
    requiredConfirmations: 3,
    contractsRegistry: process.env.NETWORK_1_REGISTRY,
    erc20Contract: process.env.NETWORK_1_ERC20,
    blockExplorerUrl: 'https://etherscan.io',
    navbarImage: navbarEthereumImg,
    rpcUrls: [`https://mainnet.infura.io/v3/${process.env.INFURA_ID}`],
    ui: uiConfig[CHAINS.ethereum],
  },
  [CHAINS.ropsten]: {
    name: 'Ropsten',
    earliestBlockForDelegationOverride: 9644509,
    managementServiceStatusPageUrl: process.env.NETWORK_3_STATUS_URL,
    requiredConfirmations: 3,
    logo: ethImg,
    smallLogo: smallEthereumIcon,
    contractsRegistry: process.env.NETWORK_3_REGISTRY,
    erc20Contract: process.env.NETWORK_3_ERC20,
    rpcUrls: [`https://ropsten.infura.io/v3/${process.env.INFURA_ID}`],
    blockExplorerUrl: 'https://ropsten.etherscan.io',
    navbarImage: navbarEthereumImg,
    ui: uiConfig[CHAINS.ethereum],
  },
  [CHAINS.polygon]: {
    logo: polygonImg,
    earliestBlockForDelegationOverride: 0,
    managementServiceStatusPageUrl: process.env.NETWORK_137_STATUS_URL,
    requiredConfirmations: 3,
    name: 'Polygon',
    smallLogo: smallPolygonIcon,
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: [
      'https://polygon-rpc.com/',
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com',
    ],
    blockExplorerUrl: 'https://www.polygonscan.com',
    contractsRegistry: process.env.NETWORK_137_REGISTRY,
    erc20Contract: process.env.NETWORK_137_ERC20,
    navbarImage: navbarPolygonImg,
    ui: uiConfig[CHAINS.polygon],
  },
  local: {
    name: 'local',
    earliestBlockForDelegationOverride: 0,
    managementServiceStatusPageUrl: 'http://localhost:7666/status',
    contractsRegistry: '0x96A9b808F1C506a7684FC3AFFBE86681286C92aE',
    erc20Contract: '0x96A9b808F1C506a7684FC3AFFBE86681286C92aE',
    navbarImage: navbarEthereumImg,
    logo: ethImg,
    ui: uiConfig[CHAINS.ethereum],
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
