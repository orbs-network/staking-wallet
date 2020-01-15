/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { wait, waitForElement, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import {
  OrbsPOSDataServiceMock,
  StakingServiceMock,
  OrbsTokenServiceMock,
  ITxCreatingServiceMock,
  GuardiansServiceMock,
} from 'orbs-pos-data/dist/testkit';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { DeepPartial } from 'utility-types';
import { App } from '../../App';
import { EthereumTxService } from '../../services/ethereumTxService/EthereumTxService';
import { IEthereumTxService } from '../../services/ethereumTxService/IEthereumTxService';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';
import { IStores } from '../../store/stores';
import { getStores } from '../../store/storesInitialization';
import { OrbsAllowanceStepDriver } from '../appDrivers/OrbsAllowanceStepDriver';
import { OrbsStakingStepDriver } from '../appDrivers/OrbsStakingStepDriver';
import { ApprovableStepDriver } from '../appDrivers/ApprovableStepDriver';
import { GuardianSelectionStepDriver } from '../appDrivers/GuardianSelectionStepDriver';
import { BalanceBoxDriver } from '../appDrivers/BalanceBoxDriver';

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

function sendTxConfirmations(
  txServiceMock: ITxCreatingServiceMock,
  promievent: PromiEvent<TransactionReceipt>,
  from: number,
  to: number,
) {
  for (let confirmation = from; confirmation <= to; confirmation++) {
    txServiceMock.txsMocker.sendTxConfirmation(promievent, confirmation);
  }
}

async function waitForPromieventTxHash(promievent: PromiEvent<TransactionReceipt>): Promise<string> {
  return new Promise(resolve => {
    promievent.once('transactionHash', hash => {
      console.log('HASH', hash);
      resolve(hash);
    });
  });
}

/**
 * Tests the 'tx confirmation' and 'tx success' (congratulations) sub-steps of an 'ApprovableWizardStep'
 */
async function testApprovableWizardStepAfterWasInitiated(
  approvableStepDriver: ApprovableStepDriver,
  txServiceMock: ITxCreatingServiceMock,
  approveOrbsTxPromievent: PromiEvent<TransactionReceipt>,
  clickOnFinishStep: boolean,
) {
  // DEV_NOTE : This is a bit brittle, as it depends on the mechanism of the tx approval mocking.
  const approveOrbsTxHash = await waitForPromieventTxHash(approveOrbsTxPromievent);

  // Wait for the tx conformation sub-step to apear
  await waitForElement(() => approvableStepDriver.txConformationSubStepComponent);

  // Should have a proper link to ether scan
  expect(approvableStepDriver.txConfirmationLinkHref).toBe(`https://etherscan.com/tx/${approveOrbsTxHash}`);

  // The 'proceed' button should appear only after 6 confirmations
  expect(approvableStepDriver.queryProceedButton).not.toBeInTheDocument();
  sendTxConfirmations(txServiceMock, approveOrbsTxPromievent, 1, 6);
  await waitForElement(() => approvableStepDriver.queryProceedButton);

  // Clicking on 'Proceed' should move the user to the 'congratulations' view
  approvableStepDriver.clickOnProceedAfterTxVerified();
  await waitForElement(() => approvableStepDriver.congratulationsSubStepComponent);

  // Should finish the whole step ?
  if (clickOnFinishStep) {
    approvableStepDriver.clickOnFinishApprovableStep();
  }
}

describe('Main User Story', () => {
  let appTestDriver: ComponentTestDriver;
  let storesForTests: DeepPartial<IStores> = {};
  let ethereumProviderMock: EthereumProviderMock;
  let orbsPOSDataServiceMock: OrbsPOSDataServiceMock;
  let stakingServiceMock: StakingServiceMock;
  let orbsTokenServiceMock: OrbsTokenServiceMock;
  let guardiansServiceMock: GuardiansServiceMock;

  const testAddress = '0x0afdafad';

  // Refresh test driver and other mocks
  beforeEach(() => {
    appTestDriver = new ComponentTestDriver(App);

    ethereumProviderMock = new EthereumProviderMock();

    orbsPOSDataServiceMock = new OrbsPOSDataServiceMock();
    stakingServiceMock = new StakingServiceMock(true);
    orbsTokenServiceMock = new OrbsTokenServiceMock();
    guardiansServiceMock = new GuardiansServiceMock();

    // Any test case expects a connected wallet
    ethereumProviderMock.setSelectedAddress(testAddress);
  });

  it('Complete story', async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);

    // DEV_NOTE : We are building all of the stores, as we are testing the main usage of the app.
    storesForTests = getStores(
      orbsPOSDataServiceMock,
      stakingServiceMock,
      orbsTokenServiceMock,
      ethereumTxService,
      guardiansServiceMock,
    );

    const renderResults = appTestDriver.withStores(storesForTests).render();
    const { queryByTestId, getByText } = renderResults;

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

    const orbsAllowanceStepDriver = new OrbsAllowanceStepDriver(renderResults);
    const orbsStakingStepDriver = new OrbsStakingStepDriver(renderResults);
    const guardianSelectionStepDriver = new GuardianSelectionStepDriver(renderResults);

    const liquidOrbsBalanceBox = new BalanceBoxDriver(renderResults, 'balance_card_liquid_orbs');
    const stakedOrbsBalanceBox = new BalanceBoxDriver(renderResults, 'balance_card_staked_orbs');
    const coolDownOrbsBalanceBox = new BalanceBoxDriver(renderResults, 'balance_card_cool_down_orbs');

    // DEV_NOTE : The appearance of the address signals that the 'OrbsAccountStore' has been initialised.
    //  If we would not wait for it to initialize, we will get into test race conditions with all kind of listeners and such.
    await wait(() => getByText(testAddress));

    // **************************
    // Initial
    // **************************
    // DEV : Initial
    expect(liquidOrbsBalanceBox.balanceText).toBe('0');
    expect(stakedOrbsBalanceBox.balanceText).toBe('0');
    expect(coolDownOrbsBalanceBox.balanceText).toBe('0');

    const orbsBought = 10_000;
    const orbsForAllowance = orbsBought - 1000; // 9,000
    const orbsFotStaking = orbsForAllowance - 1000; // 8,000

    // **************************
    // Chapter 1 - First time staking
    // **************************

    driver.userBoughtOrbs(orbsBought);

    expect(liquidOrbsBalanceBox.balanceText).toBe('10,000');

    liquidOrbsBalanceBox.clickOnActionButton();

    // Wait for the staking wizard to open with the first step
    await driver.forElement('wizard_staking').toAppear();

    let approveOrbsTxPromievent: PromiEvent<TransactionReceipt>;
    let stakeOrbsTxPromievent: PromiEvent<TransactionReceipt>;
    let guardianSelectionTxPromievent: PromiEvent<TransactionReceipt>;

    orbsTokenServiceMock.txsMocker.registerToNextTxCreation('approve', promievent => {
      approveOrbsTxPromievent = promievent;
    });

    stakingServiceMock.txsMocker.registerToNextTxCreation('stake', promievent => {
      stakeOrbsTxPromievent = promievent;
    });

    guardiansServiceMock.txsMocker.registerToNextTxCreation('selectGuardian', promievent => {
      guardianSelectionTxPromievent = promievent;
    });

    // First step - Allow staking contract to use orbs

    // Default value should be the maximum value of liquid orbs
    // // TODO : O.L : Change text to comma separated after finishing the main test story.
    expect(orbsAllowanceStepDriver.orbsForAllowanceInput).toHaveValue(orbsBought);

    orbsAllowanceStepDriver.setAmountForAllowance(orbsForAllowance);

    // Clicking on 'allow' should move the user to the 'tx confirmation' view
    orbsAllowanceStepDriver.clickOnAllow();

    // Test the rest of the 'allowance' approvable step
    await testApprovableWizardStepAfterWasInitiated(
      orbsAllowanceStepDriver,
      orbsTokenServiceMock,
      approveOrbsTxPromievent,
      true,
    );

    // Second step - Stake your orbs
    // Default value should be the maximum value of liquid orbs
    // // TODO : O.L : Change text to comma separated after finishing the main test story.
    expect(orbsStakingStepDriver.orbsForStakingInput).toHaveValue(orbsForAllowance);

    orbsStakingStepDriver.setAmountForStaking(orbsFotStaking);

    // Clicking on 'stake' should move the user to the 'tx confirmation' view
    orbsStakingStepDriver.clickOnStake();

    // Test the rest of the 'staking' approvable step
    await testApprovableWizardStepAfterWasInitiated(
      orbsStakingStepDriver,
      stakingServiceMock,
      stakeOrbsTxPromievent,
      true,
    );

    // Third step - Select guardian
    guardianSelectionStepDriver.selectGuardian('Guardian_address');

    // Test the rest of the 'Guardian selection' approvable step
    await testApprovableWizardStepAfterWasInitiated(
      guardianSelectionStepDriver,
      guardiansServiceMock,
      guardianSelectionTxPromievent,
      true,
    );

    // Close staking wizard after success
    await driver.forElement('wizard_last_page').toAppear();

    const wizardFinishButton = getByText('Close wizard');
    fireEvent.click(wizardFinishButton);

    await driver.forElement('wizard_last_page').toDisappear();

    // Ensure app is displaying the right balances after staking
    expect(liquidOrbsBalanceBox.balanceText).toBe('1,000');
    expect(stakedOrbsBalanceBox.balanceText).toBe('9,000');
    expect(coolDownOrbsBalanceBox.balanceText).toBe('0');

    // **************************
    // Chapter 2 - Ask to unfreeze some orbs
    // **************************
  });
});
