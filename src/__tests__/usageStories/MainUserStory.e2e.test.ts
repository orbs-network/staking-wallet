/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, wait, waitForElement, waitForElementToBeRemoved, within } from '@testing-library/react';
import {
  GuardiansServiceMock,
  ITxCreatingServiceMock,
  OrbsPOSDataServiceMock,
  OrbsTokenServiceMock,
  StakingServiceMock,
} from 'orbs-pos-data/dist/testkit';
import { IGuardianInfo } from 'orbs-pos-data';
import { DeepPartial } from 'utility-types';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { App } from '../../App';
import { CryptoWalletConnectionService } from '../../services/cryptoWalletConnectionService/CryptoWalletConnectionService';
import { ICryptoWalletConnectionService } from '../../services/cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { IStores } from '../../store/stores';
import { getStores } from '../../store/storesInitialization';
import { BalanceCardDriver } from '../appDrivers/BalanceCardDriver';
import { ApprovableStepDriver } from '../appDrivers/wizardSteps/ApprovableStepDriver';
import { GuardianSelectionStepDriver } from '../appDrivers/wizardSteps/GuardianSelectionStepDriver';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';
import { OrbsAllowanceStepDriver } from '../appDrivers/wizardSteps/OrbsAllowanceStepDriver';
import { OrbsStakingStepDriver } from '../appDrivers/wizardSteps/OrbsStakingStepDriver';
import { OrbsUnstakingStepDriver } from '../appDrivers/wizardSteps/OrbsUnStakingStepDriver';
import { OrbsWithdrawingStepDriver } from '../appDrivers/wizardSteps/OrbsWithdrawingStepDriver';
import { OrbsRestakingStepDriver } from '../appDrivers/wizardSteps/OrbsRestakingStepDriver';
import { weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';

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
  return new Promise(resolve => promievent.once('transactionHash', resolve));
}

/**
 * Tests the 'tx confirmation' and 'tx success' (congratulations) sub-steps of an 'ApprovableWizardStep'
 */
async function testApprovableWizardStepAfterTxWasInitiated(
  approvableStepDriver: ApprovableStepDriver,
  txServiceMock: ITxCreatingServiceMock,
  approveOrbsTxPromievent: PromiEvent<TransactionReceipt>,
  clickOnFinishStep: boolean,
) {
  // DEV_NOTE : This is a bit brittle, as it depends on the mechanism of the tx approval mocking.
  const approveOrbsTxHash = await waitForPromieventTxHash(approveOrbsTxPromievent);

  // Wait for the tx conformation sub-step to appear
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
  let cryptoWalletConnectionService: ICryptoWalletConnectionService;

  const userAccountAddress = '0x0afdafad';
  const finishSubStepTestId = 'wizard_sub_step_finish';

  // Refresh test driver and other mocks
  beforeEach(() => {
    appTestDriver = new ComponentTestDriver(App);

    ethereumProviderMock = new EthereumProviderMock();

    orbsPOSDataServiceMock = new OrbsPOSDataServiceMock();
    stakingServiceMock = new StakingServiceMock(true);
    orbsTokenServiceMock = new OrbsTokenServiceMock();
    guardiansServiceMock = new GuardiansServiceMock();

    // TODO : O.L : FUTURE : See if this is still relevant after moving to 'staking only' system.
    // Set an amount for participating tokens
    orbsPOSDataServiceMock.withTotalParticipatingTokens(BigInt(500_000_000));

    // Any test case expects a connected wallet
    ethereumProviderMock.setSelectedAddress(userAccountAddress);

    cryptoWalletConnectionService = new CryptoWalletConnectionService(ethereumProviderMock);
  });

  it('Complete story (Clean State -> Purchase -> Stake -> Unstake )', async () => {
    const guardianAAddress = '0xaaaaaaa';
    const guardianAInfo: IGuardianInfo = {
      hasEligibleVote: true,
      name: 'Guardian A',
      stakePercent: 23,
      voted: true,
      website: 'http:guardianA.com',
    };

    const guardianBAddress = '0xbbbbbbb';
    const guardianBInfo: IGuardianInfo = {
      hasEligibleVote: true,
      name: 'Guardian B',
      stakePercent: 15,
      voted: true,
      website: 'http:guardianB.com',
    };

    const guardianCAddress = '0xccccccc';
    const guardianCInfo: IGuardianInfo = {
      hasEligibleVote: true,
      name: 'Guardian C',
      stakePercent: 40,
      voted: false,
      website: 'http:guardianC.com',
    };

    guardiansServiceMock.withGuardian(guardianAAddress, guardianAInfo);
    guardiansServiceMock.withGuardian(guardianBAddress, guardianBInfo);
    guardiansServiceMock.withGuardian(guardianCAddress, guardianCInfo);

    // DEV_NOTE : We are building all of the stores, as we are testing the main usage of the app.
    storesForTests = getStores(
      orbsPOSDataServiceMock,
      stakingServiceMock,
      orbsTokenServiceMock,
      cryptoWalletConnectionService,
      guardiansServiceMock,
    );

    const renderResults = appTestDriver.withStores(storesForTests).render();
    const { queryByTestId, getByText, getByTestId } = renderResults;

    function userBoughtOrbs(amount: number): void {
      orbsPOSDataServiceMock.fireORBSBalanceChange(weiOrbsFromFullOrbs(amount));
    }

    function forElement(elementTestId: string): { toAppear(): Promise<void>; toDisappear(): Promise<void> } {
      return {
        async toAppear(): Promise<void> {
          await waitForElement(() => queryByTestId(elementTestId));
        },
        async toDisappear(): Promise<void> {
          await waitForElementToBeRemoved(() => queryByTestId(elementTestId));
        },
      };
    }

    const orbsAllowanceStepDriver = new OrbsAllowanceStepDriver(renderResults);
    const orbsStakingStepDriver = new OrbsStakingStepDriver(renderResults);
    const guardianSelectionStepDriver = new GuardianSelectionStepDriver(renderResults);

    const liquidOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_liquid_orbs');
    const stakedOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_staked_orbs');
    const coolDownOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_cool_down_orbs');

    // DEV_NOTE : The appearance of the address signals that the 'OrbsAccountStore' has been initialised.
    //  If we would not wait for it to initialize, we will get into test race conditions with all kind of listeners and such.
    await wait(() => getByText(userAccountAddress));

    // ***** Initial *****
    // DEV : Initial
    expect(liquidOrbsBalanceCard.balanceText).toBe('0');
    expect(stakedOrbsBalanceCard.balanceText).toBe('0');
    expect(coolDownOrbsBalanceCard.balanceText).toBe('0');

    const orbsBought = 10_000;
    const orbsForStaking = orbsBought - 1000; // 9,000
    const orbsForUnStaking = orbsForStaking - 2500; // 6,500

    // ***** Chapter 1 - First time staking *****

    userBoughtOrbs(orbsBought);

    expect(liquidOrbsBalanceCard.balanceText).toBe('10,000');

    liquidOrbsBalanceCard.clickOnActionButton();

    await forElement('wizard_staking').toAppear();

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
    await waitForElement(() => orbsAllowanceStepDriver.txCreatingSubStepComponent);
    // // TODO : O.L : Change text to comma separated after finishing the main test story.
    expect(orbsAllowanceStepDriver.orbsForAllowanceInput).toHaveValue(orbsBought);

    orbsAllowanceStepDriver.setAmountForAllowanceAndStaking(orbsForStaking);

    // Clicking on 'allow' should move the user to the 'tx confirmation' view
    orbsAllowanceStepDriver.clickOnAllow();

    // Test the rest of the 'allowance' approvable step
    await testApprovableWizardStepAfterTxWasInitiated(
      orbsAllowanceStepDriver,
      orbsTokenServiceMock,
      approveOrbsTxPromievent,
      true,
    );

    // Second step - Stake your orbs
    await waitForElement(() => orbsStakingStepDriver.txCreatingSubStepComponent);

    // Clicking on 'stake' should move the user to the 'tx confirmation' view
    orbsStakingStepDriver.clickOnStake();

    // Test the rest of the 'staking' approvable step
    await testApprovableWizardStepAfterTxWasInitiated(
      orbsStakingStepDriver,
      stakingServiceMock,
      stakeOrbsTxPromievent,
      true,
    );

    // TODO : O.L : Important : Think of a way to fix this.
    // IMPORTANT : TEST_HACK : Currently, our stakingServiceMock does not trigger transferring of orbs
    //                          and so, the test state will not get updated with the new balance. This
    //                          line will fix it,
    orbsPOSDataServiceMock.fireORBSBalanceChange(weiOrbsFromFullOrbs(orbsBought - orbsForStaking));

    // Third step - Select guardian
    await waitForElement(() => guardianSelectionStepDriver.txCreatingSubStepComponent);

    guardianSelectionStepDriver.selectGuardian(guardianAAddress);

    // Test the rest of the 'Guardian selection' approvable step
    await testApprovableWizardStepAfterTxWasInitiated(
      guardianSelectionStepDriver,
      guardiansServiceMock,
      guardianSelectionTxPromievent,
      true,
    );

    // Close staking wizard after success
    await forElement(finishSubStepTestId).toAppear();
    const finishSubStep = getByTestId(finishSubStepTestId);

    const wizardFinishButton = within(finishSubStep).getByText('Finish');
    fireEvent.click(wizardFinishButton);

    // TODO  : O.L : It seems that the 'click' closes the modal before the 'wait for element to disappear' has any chance to find it.
    // await forElement(finishSubStepTestId).toDisappear();
    expect(queryByTestId(finishSubStepTestId)).not.toBeInTheDocument();

    // Ensure app is displaying the right balances after staking
    expect(liquidOrbsBalanceCard.balanceText).toBe('1,000');
    expect(stakedOrbsBalanceCard.balanceText).toBe('9,000');
    expect(coolDownOrbsBalanceCard.balanceText).toBe('0');

    // ***** Chapter 2 - Ask to Un-Stake some orbs *****
    const orbsUnStakingStepDriver = new OrbsUnstakingStepDriver(renderResults);

    let unfreezeOrbsTxPromievent: PromiEvent<TransactionReceipt>;
    stakingServiceMock.txsMocker.registerToNextTxCreation('unstake', promievent => {
      unfreezeOrbsTxPromievent = promievent;
    });

    stakedOrbsBalanceCard.clickOnActionButton();

    // TODO : O.L : use real test id
    await forElement('wizard_unstaking').toAppear();

    // Default value should be the maximum value of staked orbs
    // // TODO : O.L : Change text to comma separated after finishing the main test story.
    expect(orbsUnStakingStepDriver.orbsForUnstakingInput).toHaveValue(orbsForStaking);

    orbsUnStakingStepDriver.setAmountForStaking(orbsForUnStaking);

    // Clicking on 'un stake' should move the user to the 'tx confirmation' view
    orbsUnStakingStepDriver.clickOnUnStake();

    // Test the rest of the 'Unstaking' approvable step
    await testApprovableWizardStepAfterTxWasInitiated(
      orbsUnStakingStepDriver,
      stakingServiceMock,
      unfreezeOrbsTxPromievent,
      true,
    );

    await forElement(finishSubStepTestId).toAppear();
    const unstackingWizardFinishSubStep = getByTestId(finishSubStepTestId);

    const unfreezingWizardFinishButton = within(unstackingWizardFinishSubStep).getByText('Finish');
    fireEvent.click(unfreezingWizardFinishButton);

    // TODO  : O.L : It seems that the 'click' closes the modal before the 'wait for element to disappear' has any chance to find it.
    // await forElement('wizard_unstaking').toDisappear();

    // Ensure app is displaying the right balances after unstaking
    expect(liquidOrbsBalanceCard.balanceText).toBe('1,000');
    expect(stakedOrbsBalanceCard.balanceText).toBe('2,500');
    expect(coolDownOrbsBalanceCard.balanceText).toBe('6,500');
  });

  it('Withdrawing (Start with orbs in cooldown (cooldown period ended)  -> withdraw orbs)', async () => {
    const UnstakedOrbs = 6_000;
    const StakedOrbs = 10_000;
    const OrbsInCooldown = 7_000;

    orbsPOSDataServiceMock.withORBSBalance(userAccountAddress, weiOrbsFromFullOrbs(UnstakedOrbs));
    stakingServiceMock.withStakeBalance(userAccountAddress, weiOrbsFromFullOrbs(StakedOrbs));
    stakingServiceMock.withUnstakeStatus(userAccountAddress, {
      cooldownAmount: weiOrbsFromFullOrbs(OrbsInCooldown),
      cooldownEndTime: 0, // We want a timestamp in the past
    });

    // DEV_NOTE : We are building all of the stores, as we are testing the main usage of the app.
    storesForTests = getStores(
      orbsPOSDataServiceMock,
      stakingServiceMock,
      orbsTokenServiceMock,
      cryptoWalletConnectionService,
      guardiansServiceMock,
    );

    const renderResults = appTestDriver.withStores(storesForTests).render();
    const { queryByTestId, getByText, getByTestId } = renderResults;

    const liquidOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_liquid_orbs');
    const stakedOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_staked_orbs');
    const coolDownOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_cool_down_orbs');

    // DEV_NOTE : The appearance of the address signals that the 'OrbsAccountStore' has been initialised.
    //  If we would not wait for it to initialize, we will get into test race conditions with all kind of listeners and such.
    await wait(() => getByText(userAccountAddress));

    const orbsWithdrawingStepDriver = new OrbsWithdrawingStepDriver(renderResults);
    let withdrawOrbsTxPromievent: PromiEvent<TransactionReceipt>;

    stakingServiceMock.txsMocker.registerToNextTxCreation('withdraw', promievent => {
      withdrawOrbsTxPromievent = promievent;
    });

    expect(liquidOrbsBalanceCard.balanceText).toBe('6,000');
    expect(stakedOrbsBalanceCard.balanceText).toBe('10,000');
    expect(coolDownOrbsBalanceCard.balanceText).toBe('7,000');

    coolDownOrbsBalanceCard.clickOnActionButton();

    // Wait for the wizard step to apear and click on 'Withdraw'
    await waitForElement(() => orbsWithdrawingStepDriver.txCreatingSubStepComponent);
    orbsWithdrawingStepDriver.clickOnWithdraw();

    // DEV_NOTE : O.L : We have to mimick the 'transfer' event because the mock will not create it
    // TODO : O.L : Change this to the new API (use the 'transfer' function)
    orbsPOSDataServiceMock.fireORBSBalanceChange(weiOrbsFromFullOrbs(UnstakedOrbs + OrbsInCooldown));

    // Test the rest of the 'Unstaking' approvable step
    await testApprovableWizardStepAfterTxWasInitiated(
      orbsWithdrawingStepDriver,
      stakingServiceMock,
      withdrawOrbsTxPromievent,
      true,
    );

    // TODO : O.L : Move all of the 'finish sub step' logic to a function or a driver. as it appears for all tests.
    await waitForElement(() => queryByTestId(finishSubStepTestId));
    const unstackingWizardFinishSubStep = getByTestId(finishSubStepTestId);

    const unfreezingWizardFinishButton = within(unstackingWizardFinishSubStep).getByText('Finish');
    fireEvent.click(unfreezingWizardFinishButton);

    // TODO  : O.L : It seems that the 'click' closes the modal before the 'wait for element to disappear' has any chance to find it.
    // await forElement('wizard_withdrawing').toDisappear();

    // Ensure app is displaying the right balances after unstaking
    expect(liquidOrbsBalanceCard.balanceText).toBe('13,000');
    expect(stakedOrbsBalanceCard.balanceText).toBe('10,000');
    expect(coolDownOrbsBalanceCard.balanceText).toBe('0');
  });

  it('Restaking (Start with orbs in cooldown (cooldown period not ended) -> restake)', async () => {
    const UnstakedOrbs = 5_000;
    const StakedOrbs = 20_000;
    const OrbsInCooldown = 4_000;

    orbsPOSDataServiceMock.withORBSBalance(userAccountAddress, weiOrbsFromFullOrbs(UnstakedOrbs));
    stakingServiceMock.withStakeBalance(userAccountAddress, weiOrbsFromFullOrbs(StakedOrbs));
    stakingServiceMock.withUnstakeStatus(userAccountAddress, {
      cooldownAmount: weiOrbsFromFullOrbs(OrbsInCooldown),
      cooldownEndTime: Number.MAX_SAFE_INTEGER, // We want a timestamp in the future
    });

    // DEV_NOTE : We are building all of the stores, as we are testing the main usage of the app.
    storesForTests = getStores(
      orbsPOSDataServiceMock,
      stakingServiceMock,
      orbsTokenServiceMock,
      cryptoWalletConnectionService,
      guardiansServiceMock,
    );

    const renderResults = appTestDriver.withStores(storesForTests).render();
    const { queryByTestId, getByText, getByTestId } = renderResults;

    const liquidOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_liquid_orbs');
    const stakedOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_staked_orbs');
    const coolDownOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_cool_down_orbs');

    // DEV_NOTE : The appearance of the address signals that the 'OrbsAccountStore' has been initialised.
    //  If we would not wait for it to initialize, we will get into test race conditions with all kind of listeners and such.
    await wait(() => getByText(userAccountAddress));

    const orbsRestakingStepDriver = new OrbsRestakingStepDriver(renderResults);
    let restakingOrbsTxPromievent: PromiEvent<TransactionReceipt>;

    stakingServiceMock.txsMocker.registerToNextTxCreation('restake', promievent => {
      restakingOrbsTxPromievent = promievent;
    });

    expect(liquidOrbsBalanceCard.balanceText).toBe('5,000');
    expect(stakedOrbsBalanceCard.balanceText).toBe('20,000');
    expect(coolDownOrbsBalanceCard.balanceText).toBe('4,000');

    coolDownOrbsBalanceCard.clickOnActionButton();

    // Wait for the wizard step to apear and click on 'Withdraw'
    await waitForElement(() => orbsRestakingStepDriver.txCreatingSubStepComponent);
    orbsRestakingStepDriver.clickOnWRestake();

    // Test the rest of the 'Unstaking' approvable step
    await testApprovableWizardStepAfterTxWasInitiated(
      orbsRestakingStepDriver,
      stakingServiceMock,
      restakingOrbsTxPromievent,
      true,
    );

    // TODO : O.L : Move all of the 'finish sub step' logic to a function or a driver. as it appears for all tests.
    await waitForElement(() => queryByTestId(finishSubStepTestId));
    const unstackingWizardFinishSubStep = getByTestId(finishSubStepTestId);

    const unfreezingWizardFinishButton = within(unstackingWizardFinishSubStep).getByText('Finish');
    fireEvent.click(unfreezingWizardFinishButton);

    // TODO  : O.L : It seems that the 'click' closes the modal before the 'wait for element to disappear' has any chance to find it.
    // await forElement('wizard_withdrawing').toDisappear();

    // Ensure app is displaying the right balances after unstaking
    expect(liquidOrbsBalanceCard.balanceText).toBe('5,000');
    expect(stakedOrbsBalanceCard.balanceText).toBe('24,000');
    expect(coolDownOrbsBalanceCard.balanceText).toBe('0');
  });
});
