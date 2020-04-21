import {
  GuardiansService,
  IGuardiansService,
  IOrbsPOSDataService,
  IOrbsTokenService,
  IStakingService,
  OrbsClientService,
  orbsPOSDataServiceFactory,
  OrbsTokenService,
  StakingService,
  IOrbsClientService,
} from 'orbs-pos-data';
import Web3 from 'web3';
import config from '../config';
import { CryptoWalletConnectionService } from './cryptoWalletConnectionService/CryptoWalletConnectionService';
import { ICryptoWalletConnectionService } from './cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { IEthereumProvider } from './cryptoWalletConnectionService/IEthereumProvider';
import { BuildOrbsClient } from './OrbsClientFactory';
import { AnalyticsService } from './analytics/analyticsService';
import { IAnalyticsService } from './analytics/IAnalyticsService';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
  cryptoWalletConnectionService: ICryptoWalletConnectionService;
  stakingService: IStakingService;
  orbsTokenService: IOrbsTokenService;
  guardiansService: IGuardiansService;
  analyticsService: IAnalyticsService;
}

export function buildServices(ethereumProvider: IEthereumProvider): IServices {
  let web3: Web3;

  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  } else {
    web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
  }
  const orbsClient = BuildOrbsClient();
  const orbsClientService: IOrbsClientService = new OrbsClientService(orbsClient);

  return {
    cryptoWalletConnectionService: new CryptoWalletConnectionService(ethereumProvider),
    orbsPOSDataService: orbsPOSDataServiceFactory(web3, orbsClient as any, config?.contractsAddressesOverride),
    stakingService: new StakingService(web3, config?.contractsAddressesOverride?.stakingContract),
    orbsTokenService: new OrbsTokenService(web3, config?.contractsAddressesOverride?.erc20Contract),
    guardiansService: new GuardiansService(
      web3,
      orbsClientService,
      config?.contractsAddressesOverride,
      config?.earliestBlockForDelegationOverride
        ? {
            earliestBlockForDelegation: config.earliestBlockForDelegationOverride,
          }
        : undefined,
    ),
    analyticsService: new AnalyticsService(config.gaTrackerId, config.analyticsActive),
  };
}
