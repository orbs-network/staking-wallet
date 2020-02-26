/* eslint-disable @typescript-eslint/camelcase */
import { IAppTranslations } from './translationsTypes';

export const ENGLISH_TEXTS: IAppTranslations = {
  fontFamily: 'Montserrat',
  sectionTitles: {
    allGuardians: 'All guardians',
    balance: 'Balance',
    rewards: 'Rewards',
    walletInfo: 'Wallet Info',
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
  alerts: {
    cannotUnstakeWhenThereAreOrbsReadyToWithdraw: 'Cannot unstake when there are ORBS to be withdrawn',
  },
};
