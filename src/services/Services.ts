import { IOrbsPOSDataService, OrbsClientService, orbsPOSDataServiceFactory, IOrbsClientService } from 'orbs-pos-data';
import Web3 from 'web3';
import { AxiosInstance } from 'axios';
import config, { INetwork } from '../config';
import { BuildOrbsClient } from './OrbsClientFactory';
import { AnalyticsService } from './analytics/analyticsService';
import { IAnalyticsService } from './analytics/IAnalyticsService';
import { HttpService } from './http/HttpService';
import { IHttpService } from './http/IHttpService';
import { IOrbsNodeService } from './v2/orbsNodeService/IOrbsNodeService';
import { OrbsNodeService } from './v2/orbsNodeService/OrbsNodeService';
import {
  CommitteeService,
  CryptoWalletConnectionService,
  DelegationsService,
  ICommitteeService,
  ICryptoWalletConnectionService,
  IDelegationsService,
  IEthereumProvider,
  IOrbsTokenService,
  IStakingService,
  OrbsTokenService,
  StakingService,
  IStakingRewardsService,
  StakingRewardsService,
  IGuardiansService,
  GuardiansService,
} from '@orbs-network/contracts-js';
import { getPropertyFromNetworks, getSupportedChains } from '../utils/web3';

export interface IServices {
  httpService: IHttpService;
  orbsPOSDataService: IOrbsPOSDataService;
  cryptoWalletConnectionService: ICryptoWalletConnectionService;
  stakingService: IStakingService;
  orbsTokenService: IOrbsTokenService;
  analyticsService: IAnalyticsService;
  stakingRewardsService: IStakingRewardsService;
  guardiansService: IGuardiansService;
  orbsNodeService: IOrbsNodeService;
  delegationsService: IDelegationsService;
  committeeService: ICommitteeService;
}

export function buildServices(
  ethereumProvider: IEthereumProvider,
  axios: AxiosInstance,
  selectedChain: number,
): IServices {
  const networkConfig = config.networks[selectedChain];
  const { addresses } = networkConfig;

  const web3: Web3 = new Web3(ethereumProvider as any);
  const orbsClient = BuildOrbsClient();
  const orbsClientService: IOrbsClientService = new OrbsClientService(orbsClient);
  const httpService: IHttpService = new HttpService(axios);
  const analyticsService = new AnalyticsService(config.gaTrackerId, config.analyticsActive);

  const getPropertyFromNetworks = () => {
    const arr: { chain: number; managementServiceStatusPageUrl: string }[] = [];
    try {
      const supportedChains = getSupportedChains();
      for (const chain of supportedChains) {
        const network = config.networks[chain];
        if (network) {
          const { managementServiceStatusPageUrl } = network;
          arr.push({ chain, managementServiceStatusPageUrl });
        }
      }
      return arr;
    } catch (error) {
      return [];
    }
  };
  const managementServiceStatusPageUrls = getPropertyFromNetworks();

  return {
    httpService,
    cryptoWalletConnectionService: new CryptoWalletConnectionService(ethereumProvider),
    orbsPOSDataService: orbsPOSDataServiceFactory(web3, orbsClient as any, addresses),
    stakingService: new StakingService(web3, addresses?.stakingContract),
    orbsTokenService: new OrbsTokenService(web3, addresses?.erc20Contract),
    stakingRewardsService: new StakingRewardsService(web3, addresses?.stakingRewardsContract),
    guardiansService: new GuardiansService(web3, addresses?.guardiansContract),
    analyticsService: analyticsService,
    orbsNodeService: new OrbsNodeService(managementServiceStatusPageUrls, selectedChain),
    delegationsService: new DelegationsService(web3, addresses?.delegationsContract),
    committeeService: new CommitteeService(web3, addresses?.committeeContract),
  };
}
