export interface IAppTranslations {
  fontFamily: string;
  sectionTitles: ISectionTitlesTranslations;
  walletInfoSection: IWalletInfoSectionTranslations;
  balancesSection: IBalancesSectionTranslations;
  alerts: IAlertsTranslations;
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

export interface IBalancesSectionTranslations {
  title_unstakedOrbsInYourWallet: string;
  title_stakedOrbsInSmartContract: string;
  title_tokensReadyForWithdrawal: string;
  title_noTokensInCooldown: string;
  action_stakeYourTokens: string;
  action_unstakeYourTokens: string;
  action_restakeYourTokens: string;
  action_withdrawYourTokens: string;
}

export interface IAlertsTranslations {
  cannotUnstakeWhenThereAreOrbsReadyToWithdraw: string;
}
