export interface IAppTranslations {
  fontFamily: string;
  sectionTitles: ISectionTitlesTranslations;
  connectWalletSection: IConnectWalletSectionTranslations;
  walletInfoSection: IWalletInfoSectionTranslations;
  balancesSection: IBalancesSectionTranslations;
  wizardsCommons: IWizardsCommonsTranslations;
  approvableWizardStep: IApprovableWizardStepTranslations;
  stakingWizard: IStakingWizardTranslations;
  alerts: IAlertsTranslations;
  commons: ICommonsTranslations;
}

export interface ICommonsTranslations {
  loading: string;
}

export interface ISectionTitlesTranslations {
  connectWallet: string;
  walletInfo: string;
  balance: string;
  rewards: string;
  allGuardians: string;
  allGuardians_sideTitle: string;
}

export interface IWalletInfoSectionTranslations {
  address: string;
  copy: string;
  qr: string;
}

export interface IConnectWalletSectionTranslations {
  connectYourAccount: string;
  installMetamask: string;
  pleaseApproveAccountConnection: string;
  refreshPageAfterInstallingMetamask: string;
}

export interface IWizardsCommonsTranslations {
  message_userCanceledTransactions: string;
  subMessage_tryAgainAndApprove: string;
  message_errorOccurred: string;
  subMessage_pleaseTryAgain: string;
  subMessage_pleaseApproveTransactionWithExplanation: string;
  stepLabel_finish: string;
  action_finish: string;
  stepDoneExclamation: string;
}

export interface IApprovableWizardStepTranslations {
  weRecommendWaitingToReceiveEnoughConfirmations: string;
  thisMightTakeAFewMoments: string;
  gotXConfirmationsOutOfRecommendedY: string;
  gotXConfirmationsOutOfRecommendedY_plural: string;
  txPending: string;
  txConfirmed: string;
  youHaveDoneActionSuccessfully: string;
  congratulations: string;
}

export interface IStakingWizardTranslations {
  stepLabel_approve: string;
  stepLabel_stake: string;
  stepLabel_selectGuardian: string;
  finishedAction_approved: string;
  finishedAction_staked: string;
  finishedAction_selectedGuardian: string;
  afterSuccessStateExplanation: string;
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
  walletAddressWasCopied: string;
  guardianAlreadySelected: string;
}
