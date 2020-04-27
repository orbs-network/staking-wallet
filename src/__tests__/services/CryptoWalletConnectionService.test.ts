/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { CryptoWalletConnectionService } from '../../services/cryptoWalletConnectionService/CryptoWalletConnectionService';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';

describe('Crypto Wallet Connection Service', () => {
  it(`Should mark isMetamaskInstalled as false when we don't provide a Provider`, async () => {
    const cryptoWalletConnectionService = new CryptoWalletConnectionService(undefined);
    expect(cryptoWalletConnectionService.isMetamaskInstalled).toBe(false);
  });

  it(`Should mark isMetamaskInstalled as true when we provice a Provider`, async () => {
    const ethereumProvider = new EthereumProviderMock();
    const cryptoWalletConnectionService = new CryptoWalletConnectionService(ethereumProvider);
    expect(cryptoWalletConnectionService.isMetamaskInstalled).toBe(true);
  });

  it(`Should return false when calling requestConnectionPermission and the user rejected`, async () => {
    const ethereumProvider = new EthereumProviderMock();
    const cryptoWalletConnectionService = new CryptoWalletConnectionService(ethereumProvider);
    ethereumProvider.rejectNextEnable();
    const result = await cryptoWalletConnectionService.requestConnectionPermission();
    expect(result).toBe(false);
    expect(cryptoWalletConnectionService.didUserApproveWalletInThePast).toBe(false);
  });

  it(`Should return true when calling requestConnectionPermission and the user approved`, async () => {
    const ethereumProvider = new EthereumProviderMock();
    const cryptoWalletConnectionService = new CryptoWalletConnectionService(ethereumProvider);
    const result = await cryptoWalletConnectionService.requestConnectionPermission();
    expect(result).toBe(true);
    expect(cryptoWalletConnectionService.didUserApproveWalletInThePast).toBe(true);
  });

  it(`Should return the main address after successful connect`, async () => {
    const ethereumProvider = new EthereumProviderMock();
    const cryptoWalletConnectionService = new CryptoWalletConnectionService(ethereumProvider);
    await cryptoWalletConnectionService.requestConnectionPermission();
    ethereumProvider.setSelectedAddress('BLABLA');
    const result = await cryptoWalletConnectionService.readMainAddress();
    expect(result).toBe('BLABLA');
  });

  describe('getIsMainNetwork', () => {
    it(`Should return false when metamask is not installed`, async () => {
      const cryptoWalletConnectionService = new CryptoWalletConnectionService(undefined);
      const result = await cryptoWalletConnectionService.getIsMainNetwork();
      expect(result).toBe(false);
    });

    it(`Should return false when metamask is not installed`, async () => {
      const ethereumProvider = new EthereumProviderMock();
      const cryptoWalletConnectionService = new CryptoWalletConnectionService(ethereumProvider);
      const result = await cryptoWalletConnectionService.getIsMainNetwork();
      expect(result).toBe(true);
    });

    it(`Should return false when networkVersion is not set to 1`, async () => {
      const ethereumProvider = new EthereumProviderMock();
      ethereumProvider.networkVersion = '3';
      const cryptoWalletConnectionService = new CryptoWalletConnectionService(ethereumProvider);
      const result = await cryptoWalletConnectionService.getIsMainNetwork();
      expect(result).toBe(false);
    });
  });
});
