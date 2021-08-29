import { createWeb3Instance } from './../utils/web3';
import { IOrbsPOSDataService, OrbsClientService, orbsPOSDataServiceFactory, IOrbsClientService } from 'orbs-pos-data';
import { AxiosInstance } from 'axios';
import config from '../config';
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

export function buildServices(ethereumProvider: IEthereumProvider, axios: AxiosInstance): IServices {
  const web3 = createWeb3Instance(ethereumProvider);
  console.log({ web3 });
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
    stakingRewardsService: new StakingRewardsService(web3, config?.contractsAddressesOverride?.stakingRewardsContract),
    guardiansService: new GuardiansService(web3, config?.contractsAddressesOverride?.guardiansContract),
    analyticsService: analyticsService,
    orbsNodeService: new OrbsNodeService(),
    delegationsService: new DelegationsService(web3, config?.contractsAddressesOverride?.delegationsContract),
    committeeService: new CommitteeService(web3, config?.contractsAddressesOverride?.committeeContract),
  };
}
