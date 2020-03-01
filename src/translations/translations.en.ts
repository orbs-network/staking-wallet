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
    afterSuccessStateExplanation: 'Your Orbs are now staked and are assigned to a guardian',
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
