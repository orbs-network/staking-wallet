/* eslint-disable @typescript-eslint/camelcase */
import { IAppTranslations } from './translationsTypes';

export const ENGLISH_TEXTS: IAppTranslations = {
  fontFamily: 'Montserrat',
  sectionTitles: {
    allGuardians: 'All guardians',
    allGuardians_sideTitle: 'Participating stake: {{totalParticipatingTokens}}',
    balance: 'Balance',
    rewards: 'Rewards',
    connectWallet: 'Connect your wallet',
    walletInfo: 'Wallet Info',
  },
  connectWalletSection: {
    connectYourAccount: 'Connect your account',
    installMetamask: 'Install Metamask',
    pleaseApproveAccountConnection: 'Please approve the account connection',
    refreshPageAfterInstallingMetamask: 'Please refresh this page after installing Metamask',
  },
  walletInfoSection: {
    address: 'Address',
    copy: 'Copy',
    qr: 'QR',
  },
  balancesSection: {
    title_unstakedOrbsInYourWallet: 'Unstaked ORBS in your wallet',
    title_stakedOrbsInSmartContract: 'Staked ORBS in smart contract',
    title_tokensReadyForWithdrawal: 'Tokens ready for withdrawal',
    title_noTokensInCooldown: 'No tokens in cooldown',
    action_stakeYourTokens: 'Stake your tokens',
    action_unstakeYourTokens: 'Unstake your tokens',
    action_restakeYourTokens: 'Restake your tokens',
    action_withdrawYourTokens: 'Withdraw your tokens',
  },
  wizardsCommons: {
    message_userCanceledTransactions: 'You have canceled the transaction.',
    subMessage_tryAgainAndApprove: 'In order to continue, please try again and approve the transaction',
    message_errorOccurred: 'An error occurred while trying to send transaction to the staking wallet.',
    subMessage_pleaseTryAgain: 'please try again',
    subMessage_pleaseApproveTransactionWithExplanation:
      'Please approve the transaction, we will move to the next stage as soon as the transaction is confirmed',
    stepLabel_finish: 'Finish',
    action_finish: 'Finish',
    moveToStep_finish: 'Finish',
    stepDoneExclamation: 'Awesome !',
  },
  approvableWizardStep: {
    weRecommendWaitingToReceiveEnoughConfirmations:
      'We recommend waiting until enough confirmations have been received',
    thisMightTakeAFewMoments: 'This might take a few moments...',
    gotXConfirmationsOutOfRecommendedY: 'Got {{count}} conformation out of recommended {{recommended}}',
    gotXConfirmationsOutOfRecommendedY_plural: 'Got {{count}} conformations out of recommended {{recommended}}',
    txConfirmed: 'Transaction Confirmed',
    txPending: 'Transaction Pending',
    youHaveDoneActionSuccessfully: `You have successfully {{finishedActionName}}`,
    congratulations: 'Congratulations',
  },
  stakingWizard: {
    stepLabel_approve: 'Approve usage of Orbs',
    stepLabel_stake: 'Stake your tokens',
    stepLabel_selectGuardian: 'Select a guardian',
    finishedAction_approved: 'allowed the staking contract to use your tokens',
    finishedAction_staked: 'staked your tokens',
    finishedAction_selectedGuardian: 'selected a guardian',
    moveToStep_stake: 'Stake your ORBs',
    moveToStep_selectGuardian: 'Select a Guardian',
    afterSuccessStateExplanation: 'Your Orbs are now staked and are assigned to a guardian',

    // Allowance approval selection sub step
    allowanceSubStep_message_selectAmountOfOrbs: 'Select the amount of ORBS you would like to stake',
    allowanceSubStep_action_approve: 'Approve',
    allowanceSubStep_label_allowance: 'Allowance',
    allowanceSubStep_stepTitle: 'Approve the staking contract to use your Orbs',
    allowanceSubStep_stepExplanation:
      'This step will approve the Staking contract to transfer your ORBS tokens into the contract in order to be staked (up to the approved amount).',

    // Staking sub step
    stakingSubStep_stepTitle: 'In this step you will stake {{orbsForStaking}} ORBS',
    stakingSubStep_stepExplanation:
      'This step will transfer your ORBS tokens to the staking contract and stake them. Staking makes the Orbs network more secure and incentivizes the Delegators, Guardians and Validators to participate.',

    // Guardian selection sub step
    guardianSelectionSubStep_message_selectGuardian: 'Select a guardian',
    guardianSelectionSubStep_subMessage_pressSelectAndApprove: 'Press "Select" and accept the transaction',
    guardianSelectionSubStep_stepTitle: 'Select your guardian',
    guardianSelectionSubStep_stepExplanation:
      'This step selects which Guardian you would like to delegate to, adding your staked ORBS tokens to their influence.',
  },
  guardianChangingWizard: {
    stepLabel_changeGuardian: 'Change selected guardian',
    afterSuccessStateExplanation: 'You have selected a new guardian',
    finishedAction_selectedGuardian: 'selected a guardian',

    // Guardian change sub step
    guardianSelectionSubStep_message_changeGuardian: 'Change selected guardian to {{newGuardianAddress}}',
    guardianSelectionSubStep_subMessage_pressChangeAndApprove: 'Press "Change" and accept the transaction',
    guardianSelectionSubStep_stepTitle: 'Change selected guardian',
    guardianSelectionSubStep_action_change: 'Change',
  },
  restakingWizard: {

  },
  unstakingWizard: {

  },
  withdrawingWizard: {

  },
  alerts: {
    cannotUnstakeWhenThereAreOrbsReadyToWithdraw: 'Cannot unstake when there are ORBS to be withdrawn',
    walletAddressWasCopied: 'Copied address !',
    guardianAlreadySelected: 'Guardian already selected !',
  },
  commons: {
    loading: 'Loading ...',
  },
};
