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
