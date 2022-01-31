import { INetworkContractAddresses } from './../types/index';
import { IOrbsPOSDataService, OrbsClientService, orbsPOSDataServiceFactory, IOrbsClientService } from 'orbs-pos-data';
import Web3 from 'web3';
import { AxiosInstance } from 'axios';
import config from '../config';
import { BuildOrbsClient } from './OrbsClientFactory';
import { AnalyticsService } from './analytics/analyticsService';
import { IAnalyticsService } from './analytics/IAnalyticsService';
import { HttpService } from './http/HttpService';
import { IHttpService } from './http/IHttpService';
import { IOrbsNodeService } from './v2/orbsNodeService/IOrbsNodeService';
import { OrbsNodeService } from './v2/orbsNodeService/OrbsNodeService';
import ContractRegistry from '../services/contarcs/contract-registry';

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
  IElectionsService,
  ElectionsService,
} from '@orbs-network/contracts-js';
import { getPropertyFromNetworks } from './util';
import { CONTARCTS_NAMES } from '../constants';

export interface IServices {
  httpService: IHttpService;
  orbsPOSDataService: IOrbsPOSDataService;
  stakingService: IStakingService;
  orbsTokenService: IOrbsTokenService;
  analyticsService: IAnalyticsService;
  stakingRewardsService: IStakingRewardsService;
  guardiansService: IGuardiansService;
  orbsNodeService: IOrbsNodeService;
  delegationsService: IDelegationsService;
  committeeService: ICommitteeService;
  electionsService: IElectionsService;
  cryptoWalletConnectionService: ICryptoWalletConnectionService;
}

export async function buildServices(
  ethereumProvider: IEthereumProvider,
  axios: AxiosInstance,
  selectedChain: number,
): Promise<IServices> {
  const web3: Web3 = new Web3(ethereumProvider as any);
  const orbsClient = BuildOrbsClient();
  const orbsClientService: IOrbsClientService = new OrbsClientService(orbsClient);
  const httpService: IHttpService = new HttpService(axios);
  const analyticsService = new AnalyticsService(config.gaTrackerId, config.analyticsActive);

  const managementServiceStatusPageUrls = getPropertyFromNetworks();

  const { contractsRegistry, erc20Contract } = config.networks[selectedChain];

  const contractRegistryService = new ContractRegistry(web3, contractsRegistry);

  const addresses: INetworkContractAddresses = await contractRegistryService.getContracts(CONTARCTS_NAMES);
  addresses.erc20Contract = erc20Contract;
  return {
    httpService,
    orbsPOSDataService: orbsPOSDataServiceFactory(web3, orbsClient as any, addresses),
    stakingService: new StakingService(web3, addresses?.staking),
    orbsTokenService: new OrbsTokenService(web3, addresses?.erc20Contract),
    stakingRewardsService: new StakingRewardsService(web3, addresses?.stakingRewards),
    guardiansService: new GuardiansService(web3, addresses?.guardiansRegistration),
    analyticsService: analyticsService,
    orbsNodeService: new OrbsNodeService(managementServiceStatusPageUrls, selectedChain),
    delegationsService: new DelegationsService(web3, addresses?.delegations),
    committeeService: new CommitteeService(web3, addresses?.committee),
    electionsService: new ElectionsService(web3, addresses?.elections),
    cryptoWalletConnectionService: new CryptoWalletConnectionService(ethereumProvider),
  };
}
