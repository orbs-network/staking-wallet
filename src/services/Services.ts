import {
  IOrbsPOSDataService,
  OrbsClientService,
  orbsPOSDataServiceFactory,
  IOrbsClientService,
  OrbsRewardsService,
  IOrbsRewardsService,
} from 'orbs-pos-data';
import Web3 from 'web3';
import { AxiosInstance } from 'axios';
import config from '../config';
import { CryptoWalletConnectionService } from './cryptoWalletConnectionService/CryptoWalletConnectionService';
import { ICryptoWalletConnectionService } from './cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { IEthereumProvider } from './cryptoWalletConnectionService/IEthereumProvider';
import { BuildOrbsClient } from './OrbsClientFactory';
import { AnalyticsService } from './analytics/analyticsService';
import { IAnalyticsService } from './analytics/IAnalyticsService';
import { HttpService } from './http/HttpService';
import { IHttpService } from './http/IHttpService';
import { IOrbsNodeService } from './v2/orbsNodeService/IOrbsNodeService';
import { OrbsNodeService } from './v2/orbsNodeService/OrbsNodeService';
import {
  CommitteeService,
  DelegationsService,
  ICommitteeService,
  IDelegationsService,
  IOrbsTokenService,
  IStakingService,
  OrbsTokenService,
  StakingService,
} from '@orbs-network/contracts-js';
import { IStakingRewardsService } from '@orbs-network/contracts-js/dist/ethereumContractsServices/stakingRewardsService/IStakingRewardsService';
import { StakingRewardsService } from '@orbs-network/contracts-js/dist/ethereumContractsServices/stakingRewardsService/StakingRewardsV2Service';

export interface IServices {
  httpService: IHttpService;
  orbsPOSDataService: IOrbsPOSDataService;
  cryptoWalletConnectionService: ICryptoWalletConnectionService;
  stakingService: IStakingService;
  orbsTokenService: IOrbsTokenService;
  analyticsService: IAnalyticsService;
  rewardsService: IOrbsRewardsService;
  stakingRewardsService: IStakingRewardsService;
  orbsNodeService: IOrbsNodeService;
  delegationsService: IDelegationsService;
  committeeService: ICommitteeService;
}

export function buildServices(ethereumProvider: IEthereumProvider, axios: AxiosInstance): IServices {
  let web3: Web3;

  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  } else {
    web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
  }
  const orbsClient = BuildOrbsClient();
  const orbsClientService: IOrbsClientService = new OrbsClientService(orbsClient);
  const httpService: IHttpService = new HttpService(axios);
  const analyticsService = new AnalyticsService(config.gaTrackerId, config.analyticsActive);

  return {
    httpService,
    cryptoWalletConnectionService: new CryptoWalletConnectionService(ethereumProvider),
    orbsPOSDataService: orbsPOSDataServiceFactory(web3, orbsClient as any, config?.contractsAddressesOverride),
    stakingService: new StakingService(web3, config?.contractsAddressesOverride?.stakingContract),
    orbsTokenService: new OrbsTokenService(web3, config?.contractsAddressesOverride?.erc20Contract),
    rewardsService: new OrbsRewardsService(
      web3,
      orbsClientService,
      config?.contractsAddressesOverride?.orbsRewardsDistributionContract,
    ),
    stakingRewardsService: new StakingRewardsService(web3, config?.contractsAddressesOverride?.stakingRewardsContract),
    analyticsService: analyticsService,
    orbsNodeService: new OrbsNodeService(),
    delegationsService: new DelegationsService(web3, config?.contractsAddressesOverride?.delegationsContract),
    committeeService: new CommitteeService(web3, config?.contractsAddressesOverride?.committeeContract),
  };
}
