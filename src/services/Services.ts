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
  networkConfig: INetwork,
): IServices {
  let web3: Web3;
  const { addresses, managementServiceStatusPageUrl, ETHEREUM_PROVIDER_WS } = networkConfig;

  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  } else {
    web3 = new Web3(new Web3.providers.WebsocketProvider(ETHEREUM_PROVIDER_WS));
  }
  const orbsClient = BuildOrbsClient();
  const orbsClientService: IOrbsClientService = new OrbsClientService(orbsClient);
  const httpService: IHttpService = new HttpService(axios);
  const analyticsService = new AnalyticsService(config.gaTrackerId, config.analyticsActive);
  return {
    httpService,
    cryptoWalletConnectionService: new CryptoWalletConnectionService(ethereumProvider),
    orbsPOSDataService: orbsPOSDataServiceFactory(web3, orbsClient as any, addresses),
    stakingService: new StakingService(web3, addresses?.stakingContract),
    orbsTokenService: new OrbsTokenService(web3, addresses?.erc20Contract),
    stakingRewardsService: new StakingRewardsService(web3, addresses?.stakingRewardsContract),
    guardiansService: new GuardiansService(web3, addresses?.guardiansContract),
    analyticsService: analyticsService,
    orbsNodeService: new OrbsNodeService(managementServiceStatusPageUrl),
    delegationsService: new DelegationsService(web3, addresses?.delegationsContract),
    committeeService: new CommitteeService(web3, addresses?.committeeContract),
  };
}
