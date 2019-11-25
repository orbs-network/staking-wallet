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

  it(`Should mark isMetamaskInstalled as false when we don't provide a Provider`, async () => {
    const ethereumTxServer = new EthereumTxService(undefined);
    expect(ethereumTxServer.isMetamaskInstalled).toBe(false);
  });
});
