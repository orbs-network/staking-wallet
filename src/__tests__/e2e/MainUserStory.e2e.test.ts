/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { wait, waitForElement, waitForElementToBeRemoved, fireEvent, act } from '@testing-library/react';
import { OrbsPOSDataServiceMock, StakingServiceMock, OrbsTokenServiceMock, ITxCreatingServiceMock } from 'orbs-pos-data/dist/testkit';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { DeepPartial } from 'utility-types';
import { App } from '../../App';
import { EthereumTxService } from '../../services/ethereumTxService/EthereumTxService';
import { IEthereumTxService } from '../../services/ethereumTxService/IEthereumTxService';
import { CryptoWalletIntegrationStore } from '../../store/CryptoWalletIntegrationStore';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';
import { IEthereumProvider } from '../../services/ethereumTxService/IEthereumProvider';
import { IStores } from '../../store/stores';
import { IServices } from '../../services/Services';
import { getStores } from '../../store/storesInitialization';
import { OrbsAllowanceStepDriver } from '../appDrivers/OrbsAllowanceStepDriver';

interface IYannoDriver {
  userBoughtOrbs(amount: number): void;

  clickOnStakeOrbsButton(): void;

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

interface IStakingWizardDriver {
  // Orbs staking
  clickOnApproveStaking(): void;

  // Tx Approval sub step
  clickOnProceedAfterTxVerified(): void;
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

function sendTxConfirmations(
  txServiceMock: ITxCreatingServiceMock,
  promievent: PromiEvent<TransactionReceipt>,
  from: number,
  to: number,
) {
  for (let confirmation = 1; confirmation <= 6; confirmation++) {
    txServiceMock.txsMocker.sendTxConfirmation(promievent, confirmation);
  }
}

describe('Main User Story', () => {
  let appTestDriver: ComponentTestDriver;
  let storesForTests: DeepPartial<IStores> = {};
  const servicesForTests: DeepPartial<IServices> = {};
  let ethereumProviderMock: EthereumProviderMock;
  let orbsPOSDataServiceMock: OrbsPOSDataServiceMock;
  let stakingServiceMock: StakingServiceMock;
  let orbsTokenServiceMock: OrbsTokenServiceMock;

  const testAddress = '0x0afdafad';

  // Refresh test driver and other mocks
  beforeEach(() => {
    appTestDriver = new ComponentTestDriver(App);

    ethereumProviderMock = new EthereumProviderMock();

    orbsPOSDataServiceMock = new OrbsPOSDataServiceMock();
    stakingServiceMock = new StakingServiceMock(true);
    orbsTokenServiceMock = new OrbsTokenServiceMock();

    // Any test case expects a connected wallet
    ethereumProviderMock.setSelectedAddress(testAddress);
  });

  it('Complete story', async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);

    // DEV_NOTE : We are building all of the stores, as we are testing the main usage of the app.
    storesForTests = getStores(orbsPOSDataServiceMock, stakingServiceMock, orbsTokenServiceMock, ethereumTxService);

    const renderResults = appTestDriver.withStores(storesForTests).render();
    const { queryByTestId, findByTestId, getByText, queryByText } = renderResults;

    // TODO : O.L : Move the driver to a proper place after finishing scaffolding the tests.
    const driver: Partial<IYannoDriver> = {
      userBoughtOrbs(amount: number): void {
        orbsPOSDataServiceMock.fireORBSBalanceChange(amount.toString());
      },

      clickOnStakeOrbsButton(): void {
        const stakeOrbsButton = getByText('STAKE YOUR TOKENS');
        fireEvent.click(stakeOrbsButton);
      },

      setOrbsForStake(to: number): void {
        const orbsForStakeInput = queryByTestId('orbs_amount_for_staking');

        fireEvent.change(orbsForStakeInput, { target: { value: to.toString() } });
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

    const stakingWizardDriver: IStakingWizardDriver = {
      clickOnApproveStaking(): void {
        const stakeOrbsButton = getByText('STAKE');
        fireEvent.click(stakeOrbsButton);
      },
      clickOnProceedAfterTxVerified() {
        const proceedButton = getByText('Proceed');
        fireEvent.click(proceedButton);
      },
    };

    const orbsAllowanceStepDriver = new OrbsAllowanceStepDriver(renderResults);

    const liquidOrbsText = queryByTestId('amount_liquid_orbs');
    const stakedOrbsText = queryByTestId('amount_staked_orbs');
    const coolDownOrbsText = queryByTestId('amount_cool_down_orbs');

    // // ------ Staking -------
    //
    // // Staking dialog pop up
    // const stakingDialogPopUp = null;
    //
    // // Staking step
    // const stakingStepTestId = '';
    // let stakingStepOrbsToStake = null;
    // let stakingStepTxPendingIndicator = null;
    // const stakingStepTxPendingLink = null;
    //
    // // Orbs staking transaction pending step
    // const orbsStakingTxPendingStep = null;
    //
    // // Orbs staking success step
    // const orbsStakingSuccessStep = null;
    //
    // // Guardian selection step
    // const guardiansSelectionStep = null;
    // const guardiansTable = null;
    //
    // // Guardian selection transaction pending step
    // const guardianSelectionTxPendingStep = null;
    //
    // // Orbs staking success step
    // const guardianSelectionSuccessStep = null;
    //
    // // ------ Unlocking -------
    // // Staking dialog pop up
    // const unlockingDialogPopUp = null;
    //
    // // Orbs Unlocking step
    // const orbsUnlockingStep = null;
    // const orbsUnlockingStepOrbsToUnlock = null;
    // const orbsUnlockingTxPendingIndicator = null;
    // const orbsUnlockingTxPendingLink = null;
    //
    // // Orbs unlocking transaction pending step
    // const orbsUnlockingTxPendingStep = null;
    //
    // // Orbs staking success step
    // const orbsUnlockingSuccessStep = null;

    // DEV_NOTE : The appearance of the address signals that the 'OrbsAccountStore' has been initialised.
    //  If we would not wait for it to initialize, we will get into test race conditions with all kind of listeners and such.
    await wait(() => getByText(testAddress));

    // **************************
    // Initial
    // **************************
    // DEV : Initial
    expect(liquidOrbsText).toHaveTextContent(/^0$/);
    expect(stakedOrbsText).toHaveTextContent(/^0$/);
    expect(coolDownOrbsText).toHaveTextContent(/^0$/);

    const orbsBought = 10_000;
    driver.userBoughtOrbs(orbsBought);

    expect(liquidOrbsText).toHaveTextContent('10,000');

    // **************************
    // Start staking
    // **************************
    driver.clickOnStakeOrbsButton();

    // Wait for the staking wizard to open with the first step
    await driver.forElement('wizard_staking').toAppear();

    // First step - Allow staking contract to use orbs

    // Default value should be the maximum value of liquid orbs
    // // TODO : O.L : Change text to comma separated after finishing the main test story.
    expect(orbsAllowanceStepDriver.orbsForAllowanceInput).toHaveValue(orbsBought);

    let approveOrbsTxPromievent: PromiEvent<TransactionReceipt>;
    orbsTokenServiceMock.txsMocker.registerToNextTxCreation(
      'approve',
      promievent => (approveOrbsTxPromievent = promievent),
    );

    const orbsForAllowance = orbsBought - 1000;
    orbsAllowanceStepDriver.setAmountForAllowance(orbsForAllowance);

    // Clicking on 'allow' should move the user to the 'tx confirmation' view
    orbsAllowanceStepDriver.clickOnAllow();
    await waitForElement(() => orbsAllowanceStepDriver.txConformationSubStepComponent);

    // The 'proceed' button should appear only after 6 confirmations
    expect(orbsAllowanceStepDriver.queryProceedButton).not.toBeInTheDocument();
    sendTxConfirmations(orbsTokenServiceMock, approveOrbsTxPromievent, 1, 6);
    await waitForElement(() => orbsAllowanceStepDriver.queryProceedButton);

    // Clicking on 'Proceed' should move the user to the 'congratulations' view
    orbsAllowanceStepDriver.clickOnProceedAfterTxVerified();
    await waitForElement(() => orbsAllowanceStepDriver.congratulationsSubStepComponent);

    orbsAllowanceStepDriver.clickOnFinishApprovableStep();

    // Second step - Stake your orbs

    // Third step - Select guardian

    // Close staking wizard after success

    // Ensure app is displaying the right value after staking

    // await driver.forElement('wizard_step_select_amount_for_stake').toAppear();
    //
    // // Expect max amount to be set by default
    // // TODO : O.L : Change text to comma separated after finishing the main test story.
    // stakingStepOrbsToStake = queryByTestId('orbs_amount_for_staking');
    // expect(stakingStepOrbsToStake).toHaveValue(10000);
    //
    // driver.setOrbsForStake(7_000);
    // expect(stakingStepOrbsToStake).toHaveValue(7000);
    // stakingWizardDriver.clickOnApproveStaking();
    //
    // // const orbsStakingTxId = testKit.approveOrbsStakingRequest();
    //
    // await driver.forElement(stakingStepTestId).toAppear();
    // stakingStepTxPendingIndicator = queryByTestId('transaction_pending_indicator');
    // expect(stakingStepTxPendingIndicator).toBeDefined();

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
