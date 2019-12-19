/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { wait, waitForElement, waitForElementToBeRemoved } from '@testing-library/react';
import { App } from '../../App';
import { EthereumTxService } from '../../services/ethereumTxService/EthereumTxService';
import { IEthereumTxService } from '../../services/ethereumTxService/IEthereumTxService';
import { CryptoWalletIntegrationStore } from '../../store/CryptoWalletIntegrationStore';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';
import { IEthereumProvider } from '../../services/ethereumTxService/IEthereumProvider';
import { DeepPartial } from 'utility-types';
import { IStores } from '../../store/stores';

interface IYannoDriver {
  userBoughtOrbs(number): void;

  clickOnStakeOrbsButton(): void;
  clickOnApproveStaking(): void;

  setOrbsForStake(to: number): void;

  clickOnSelectAGuardian(): void;

  chooseAGuardianByTableIndex(guardianIndex: number): string;

  closeStakingDialog(): void;

  getSelectedGuardianAddress(): string;

  clickOnUnlockTokens(): void;

  closeUnlockingDialog(): void;

  clickOnApproveUnlocking(): void;

  setOrbsForUnlocking(orbsToUnlock: number): void;

  forElement(
    elementTestId: string,
  ): {
    toAppear(): Promise<void>;
    toDisappear(): Promise<void>;
  };
}

interface IStakingTestKit {
  approveOrbsStakingRequest: () => string;
  confirmOrbsStakingRequest: (txId: string) => void;

  approveGuardianSelectingRequest: () => string;
  confirmGuardianSelectingRequest: (txId: string) => void;

  approveOrbsUnlockingRequest: () => string;
  confirmOrbsUnlockingRequest: (txId: string) => void;
}

const driver: IYannoDriver = null;
const testKit: IStakingTestKit = null;

describe('Main User Story', async () => {
  it('Complete story', async () => {
    const liquidOrbsText = null;
    const stakedOrbsText = null;
    const coolDownOrbsText = null;

    // ------ Staking -------

    // Staking dialog pop up
    const stakingDialogPopUp = null;

    // Staking step
    const stakingStep = null;
    const stakingStepOrbsToStake = null;
    const stakingStepTxPendingIndicator = null;
    const stakingStepTxPendingLink = null;

    // Orbs staking transaction pending step
    const orbsStakingTxPendingStep = null;

    // Orbs staking success step
    const orbsStakingSuccessStep = null;

    // Guardian selection step
    const guardiansSelectionStep = null;
    const guardiansTable = null;

    // Guardian selection transaction pending step
    const guardianSelectionTxPendingStep = null;

    // Orbs staking success step
    const guardianSelectionSuccessStep = null;

    // ------ Unlocking -------
    // Staking dialog pop up
    const unlockingDialogPopUp = null;

    // Orbs Unlocking step
    const orbsUnlockingStep = null;
    const orbsUnlockingStepOrbsToUnlock = null;
    const orbsUnlockingTxPendingIndicator = null;
    const orbsUnlockingTxPendingLink = null;

    // Orbs unlocking transaction pending step
    const orbsUnlockingTxPendingStep = null;

    // Orbs staking success step
    const orbsUnlockingSuccessStep = null;

    // DEV : Initial
    expect(liquidOrbsText).toHaveTextContent('0');
    expect(stakedOrbsText).toHaveTextContent('0');
    expect(coolDownOrbsText).toHaveTextContent('0');

    driver.userBoughtOrbs(10_000);

    expect(liquidOrbsText).toHaveTextContent('10,000');

    driver.clickOnStakeOrbsButton();

    await driver.forElement(stakingDialogPopUp).toAppear();
    await driver.forElement(stakingStep).toAppear();

    // Expect max amount
    expect(stakingStepOrbsToStake).toHaveTextContent('10,000');

    driver.setOrbsForStake(7_000);
    driver.clickOnApproveStaking();

    const orbsStakingTxId = testKit.approveOrbsStakingRequest();

    await driver.forElement(orbsStakingTxPendingStep).toAppear();
    expect(stakingStepTxPendingIndicator).toBeDefined();

    // @ts-ignore (TODO : find a matcher for a link)
    expect(stakingStepTxPendingLink).toHaveLinkValueOf(`etherscan:blabliblabla/${orbsStakingTxId}`);

    testKit.confirmOrbsStakingRequest(orbsStakingTxId);

    await driver.forElement(orbsStakingSuccessStep).toAppear();

    driver.clickOnSelectAGuardian();

    await driver.forElement(guardiansSelectionStep).toAppear();
    expect(guardiansTable).toBeDefined();

    const selectedGuardianAddress = driver.chooseAGuardianByTableIndex(5);
    const guardianSelectionTxId = testKit.approveGuardianSelectingRequest();

    await driver.forElement(guardianSelectionTxPendingStep).toAppear();

    testKit.confirmGuardianSelectingRequest(guardianSelectionTxId);

    await driver.forElement(guardianSelectionSuccessStep).toAppear();

    driver.closeStakingDialog();
    await driver.forElement(guardianSelectionSuccessStep).toDisappear();

    expect(liquidOrbsText).toHaveTextContent('3,000');
    expect(stakedOrbsText).toHaveTextContent('7,000');
    expect(coolDownOrbsText).toHaveTextContent('0');

    expect(driver.getSelectedGuardianAddress()).toBe(selectedGuardianAddress);

    // NOTE : END OF STAKING AND GUARDIAN SELECTION
    // NOTE : STARTING OF UNFREEZING OF ORBS
    driver.clickOnUnlockTokens();

    await driver.forElement(unlockingDialogPopUp).toAppear();
    expect(orbsUnlockingStep).toBeDefined();

    // Should offer the maximum amount
    expect(orbsUnlockingStepOrbsToUnlock).toHaveTextContent('7,000');

    driver.setOrbsForUnlocking(2500);

    driver.clickOnApproveUnlocking();

    const orbsUnlockingTxId = testKit.approveOrbsUnlockingRequest();

    await driver.forElement(orbsUnlockingTxPendingStep).toAppear();
    expect(orbsUnlockingTxPendingIndicator).toBeDefined();
    // @ts-ignore (TODO : find a matcher for a link)
    expect(orbsUnlockingTxPendingLink).toHaveLinkValueOf(`etherscan:blabliblabla/${orbsUnlockingTxId}`);

    testKit.confirmOrbsUnlockingRequest(orbsUnlockingTxId);

    await driver.forElement(orbsUnlockingSuccessStep).toAppear();

    driver.closeUnlockingDialog();
    await driver.forElement(unlockingDialogPopUp).toDisappear();

    expect(liquidOrbsText).toHaveTextContent('3,000');
    expect(stakedOrbsText).toHaveTextContent('3,500');
    expect(coolDownOrbsText).toHaveTextContent('2,500');
  });
});
