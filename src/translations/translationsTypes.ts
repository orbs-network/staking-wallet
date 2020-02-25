export interface IAppTranslations {
  fontFamily: string;
  sectionTitles: ISectionTitlesTranslations;
  walletInfoSection: IWalletInfoSectionTranslations;
}

export interface ISectionTitlesTranslations {
  walletInfo: string;
  balance: string;
  rewards: string;
  allGuardians: string;
}

export interface IWalletInfoSectionTranslations {
  address: string;
  copy: string;
  qr: string;
}

export interface IBalanceSectionTranslations {
  title_unstakedOrbsInYourWallet: 'Unstaked ORBS in your wallet';
  title_stakedOrbsInSmartContract: 'Staked ORBS in smart contract';
  title_tokensReadyForWithdrawal: 'Tokens ready for withdrawal';
  action_stakeYOurTokens: 'Stake your tokens';
}
