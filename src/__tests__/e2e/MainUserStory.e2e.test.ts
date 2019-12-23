/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { wait, waitForElement, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import { App } from '../../App';
import { EthereumTxService } from '../../services/ethereumTxService/EthereumTxService';
import { IEthereumTxService } from '../../services/ethereumTxService/IEthereumTxService';
import { CryptoWalletIntegrationStore } from '../../store/CryptoWalletIntegrationStore';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';
import { IEthereumProvider } from '../../services/ethereumTxService/IEthereumProvider';
import { DeepPartial } from 'utility-types';
import { IStores } from '../../store/stores';
import { OrbsPOSDataServiceMock } from 'orbs-pos-data/dist/testkit';
import { WalletPageWrapper } from '../../pages/WalletPageWrapper';
import { OrbsAccountStore } from '../../store/OrbsAccountStore';
import { IServices } from '../../services/Services';
import { getStores } from '../../store/storesInitialization';

interface IYannoDriver {
  userBoughtOrbs(amount: number): void;

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

const testKit: IStakingTestKit = null;

describe('Main User Story', () => {
  let appTestDriver: ComponentTestDriver;
  let storesForTests: DeepPartial<IStores> = {};
  const servicesForTests: DeepPartial<IServices> = {};
  let ethereumProviderMock: EthereumProviderMock;
  let orbsPOSDataServiceMock: OrbsPOSDataServiceMock;

  const testAddress = '0x0afdafad';

  // Refresh test driver and other mocks
  beforeEach(() => {
    appTestDriver = new ComponentTestDriver(App);

    ethereumProviderMock = new EthereumProviderMock();

    orbsPOSDataServiceMock = new OrbsPOSDataServiceMock();

    // Any test case expects a connected wallet
    ethereumProviderMock.setSelectedAddress(testAddress);
  });

  it('Complete story', async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);

    // DEV_NOTE : We are building all of the stores, as we are testing the main usage of the app.
    storesForTests = getStores(orbsPOSDataServiceMock, ethereumTxService);

    const { queryByTestId, findByTestId, getByText,  } = appTestDriver.withStores(storesForTests).render();

    // TODO : O.L : Move the driver to a proper place after finishing scaffolding the tests.
    const driver: Partial<IYannoDriver> = {
      userBoughtOrbs(amount: number): void {
        orbsPOSDataServiceMock.fireORBSBalanceChange(amount.toString());
      },

      clickOnStakeOrbsButton(): void {
        const stakeOrbsButton = getByText('STAKE YOUR TOKENS');
        stakeOrbsButton.click();
      },
      clickOnApproveStaking(): void {
        const stakeOrbsButton = getByText('STAKE');
        stakeOrbsButton.click();
      },

      setOrbsForStake(to: number): void {
        const orbsForStakeInput = queryByTestId('orbs_amount_for_staking');

        fireEvent.change(orbsForStakeInput, { target: { value: to.toString() }});
      },

      forElement(elementTestId: string): { toAppear(): Promise<void>; toDisappear(): Promise<void> } {
        return {
          async toAppear(): Promise<void> {
            await waitForElement(() => queryByTestId(elementTestId));
          },
          async toDisappear(): Promise<void> {
            await waitForElementToBeRemoved(() => queryByTestId(elementTestId));
          },
        };
      },
    };

    const liquidOrbsText = queryByTestId('amount_liquid_orbs');
    const stakedOrbsText = queryByTestId('amount_staked_orbs');
    const coolDownOrbsText = queryByTestId('amount_cool_down_orbs');

    // ------ Staking -------

    // Staking dialog pop up
    const stakingDialogPopUp = null;

    // Staking step
    const stakingStepTestId = 'wizard_step_wait_for_staking_confirmation';
    let stakingStepOrbsToStake = null;
    let stakingStepTxPendingIndicator = null;
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

    // DEV_NOTE : The appearance of the address signals that the 'OrbsAccountStore' has been initialised.
    //  If we would not wait for it to initialize, we will get into test race conditions with all kind of listeners and such.
    await wait(() => getByText(testAddress));

    // DEV : Initial
    expect(liquidOrbsText).toHaveTextContent(/^0$/);
    expect(stakedOrbsText).toHaveTextContent(/^0$/);
    expect(coolDownOrbsText).toHaveTextContent(/^0$/);

    driver.userBoughtOrbs(10_000);

    // DEV_NOTE : We have to wait until the UI syncs with the store
    await wait(() => expect(liquidOrbsText).toHaveTextContent('10,000'));
    expect(liquidOrbsText).toHaveTextContent('10,000');

    driver.clickOnStakeOrbsButton();

    // Wait for the staking wizard to open with the first step
    await driver.forElement('wizard_staking').toAppear();
    await driver.forElement('wizard_step_select_amount_for_stake').toAppear();

    // Expect max amount to be set by default
    // TODO : O.L : Change text to comma separated after finishing the main test story.
    stakingStepOrbsToStake = queryByTestId('orbs_amount_for_staking');
    expect(stakingStepOrbsToStake).toHaveValue(10000);

    driver.setOrbsForStake(7_000);
    expect(stakingStepOrbsToStake).toHaveValue(7000);
    driver.clickOnApproveStaking();

    // const orbsStakingTxId = testKit.approveOrbsStakingRequest();

    await driver.forElement(stakingStepTestId).toAppear();
    stakingStepTxPendingIndicator = queryByTestId('transaction_pending_indicator')
    expect(stakingStepTxPendingIndicator).toBeDefined();
    //
    // // @ts-ignore (TODO : find a matcher for a link)
    // expect(stakingStepTxPendingLink).toHaveLinkValueOf(`etherscan:blabliblabla/${orbsStakingTxId}`);
    //
    // testKit.confirmOrbsStakingRequest(orbsStakingTxId);
    //
    // await driver.forElement(orbsStakingSuccessStep).toAppear();
    //
    // driver.clickOnSelectAGuardian();
    //
    // await driver.forElement(guardiansSelectionStep).toAppear();
    // expect(guardiansTable).toBeDefined();
    //
    // const selectedGuardianAddress = driver.chooseAGuardianByTableIndex(5);
    // const guardianSelectionTxId = testKit.approveGuardianSelectingRequest();
    //
    // await driver.forElement(guardianSelectionTxPendingStep).toAppear();
    //
    // testKit.confirmGuardianSelectingRequest(guardianSelectionTxId);
    //
    // await driver.forElement(guardianSelectionSuccessStep).toAppear();
    //
    // driver.closeStakingDialog();
    // await driver.forElement(guardianSelectionSuccessStep).toDisappear();
    //
    // expect(liquidOrbsText).toHaveTextContent('3,000');
    // expect(stakedOrbsText).toHaveTextContent('7,000');
    // expect(coolDownOrbsText).toHaveTextContent('0');
    //
    // expect(driver.getSelectedGuardianAddress()).toBe(selectedGuardianAddress);
    //
    // // NOTE : END OF STAKING AND GUARDIAN SELECTION
    // // NOTE : STARTING OF UNFREEZING OF ORBS
    // driver.clickOnUnlockTokens();
    //
    // await driver.forElement(unlockingDialogPopUp).toAppear();
    // expect(orbsUnlockingStep).toBeDefined();
    //
    // // Should offer the maximum amount
    // expect(orbsUnlockingStepOrbsToUnlock).toHaveTextContent('7,000');
    //
    // driver.setOrbsForUnlocking(2500);
    //
    // driver.clickOnApproveUnlocking();
    //
    // const orbsUnlockingTxId = testKit.approveOrbsUnlockingRequest();
    //
    // await driver.forElement(orbsUnlockingTxPendingStep).toAppear();
    // expect(orbsUnlockingTxPendingIndicator).toBeDefined();
    // // @ts-ignore (TODO : find a matcher for a link)
    // expect(orbsUnlockingTxPendingLink).toHaveLinkValueOf(`etherscan:blabliblabla/${orbsUnlockingTxId}`);
    //
    // testKit.confirmOrbsUnlockingRequest(orbsUnlockingTxId);
    //
    // await driver.forElement(orbsUnlockingSuccessStep).toAppear();
    //
    // driver.closeUnlockingDialog();
    // await driver.forElement(unlockingDialogPopUp).toDisappear();
    //
    // expect(liquidOrbsText).toHaveTextContent('3,000');
    // expect(stakedOrbsText).toHaveTextContent('3,500');
    // expect(coolDownOrbsText).toHaveTextContent('2,500');
  });
});
