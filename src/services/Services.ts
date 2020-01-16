import {
  IOrbsPOSDataService,
  IStakingService,
  StakingService,
  IOrbsTokenService,
  OrbsTokenService,
  IGuardiansService,
} from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';
import { ICryptoWalletConnectionService } from './cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { CryptoWalletConnectionService } from './cryptoWalletConnectionService/CryptoWalletConnectionService';
import { IEthereumProvider } from './cryptoWalletConnectionService/IEthereumProvider';
import Web3 from 'web3';
import config from '../config';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
  cryptoWalletConnectionService: ICryptoWalletConnectionService;
  stakingService: IStakingService;
  orbsTokenService: IOrbsTokenService;
  guardiansService: IGuardiansService;
}

export function buildServices(ethereumProvider: IEthereumProvider): IServices {
  let web3: Web3;

  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  }

  return {
    cryptoWalletConnectionService: new CryptoWalletConnectionService(ethereumProvider),
    orbsPOSDataService: buildOrbsPOSDataService(),
    stakingService: new StakingService(web3, config.contractsAddressesOverride.stakingContract),
    orbsTokenService: new OrbsTokenService(web3, config.contractsAddressesOverride.erc20Contract),
    guardiansService: undefined, // TODO : O.L : Change this to real service initialization
  };
}
