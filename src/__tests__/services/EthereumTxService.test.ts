/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { EthereumTxService } from '../../services/ethereumTxService/EthereumTxService';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';

describe('Ethereum Tx Service', () => {
  it(`Should mark isMetamaskInstalled as false when we don't provide a Provider`, async () => {
    const ethereumTxServer = new EthereumTxService(undefined);
    expect(ethereumTxServer.isMetamaskInstalled).toBe(false);
  });

  it(`Should mark isMetamaskInstalled as true when we provice a Provider`, async () => {
    const ethereumProvider = new EthereumProviderMock();
    const ethereumTxServer = new EthereumTxService(ethereumProvider);
    expect(ethereumTxServer.isMetamaskInstalled).toBe(true);
  });

  it(`Should return false when calling requestConnectionPermission and the user rejected`, async () => {
    const ethereumProvider = new EthereumProviderMock();
    const ethereumTxServer = new EthereumTxService(ethereumProvider);
    ethereumProvider.rejectNextEnable();
    const result = await ethereumTxServer.requestConnectionPermission();
    expect(result).toBe(false);
    expect(ethereumTxServer.didUserApproveWalletInThePast).toBe(false);
  });

  it(`Should return true when calling requestConnectionPermission and the user approved`, async () => {
    const ethereumProvider = new EthereumProviderMock();
    const ethereumTxServer = new EthereumTxService(ethereumProvider);
    const result = await ethereumTxServer.requestConnectionPermission();
    expect(result).toBe(true);
    expect(ethereumTxServer.didUserApproveWalletInThePast).toBe(true);
  });

  describe('getIsMainNetwork', () => {
    it(`Should return false when metamask is not installed`, async () => {
      const ethereumTxServer = new EthereumTxService(undefined);
      const result = await ethereumTxServer.getIsMainNetwork();
      expect(result).toBe(false);
    });

    it(`Should return false when metamask is not installed`, async () => {
      const ethereumProvider = new EthereumProviderMock();
      const ethereumTxServer = new EthereumTxService(ethereumProvider);
      const result = await ethereumTxServer.getIsMainNetwork();
      expect(result).toBe(true);
    });

    it(`Should return false when networkVersion is not set to 1`, async () => {
      const ethereumProvider = new EthereumProviderMock();
      ethereumProvider.networkVersion = '3';
      const ethereumTxServer = new EthereumTxService(ethereumProvider);
      const result = await ethereumTxServer.getIsMainNetwork();
      expect(result).toBe(false);
    });
  });
});
