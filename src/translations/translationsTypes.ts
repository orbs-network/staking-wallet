export interface IAppTranslations {
  fontFamily: string;
  sectionTitles: ISectionTitlesTranslations;
  connectWalletSection: IConnectWalletSectionTranslations;
  walletInfoSection: IWalletInfoSectionTranslations;
  balancesSection: IBalancesSectionTranslations;
  wizardsCommons: IWizardsCommonsTranslations;
  approvableWizardStep: IApprovableWizardStepTranslations;
  stakingWizard: IStakingWizardTranslations;
  guardianChangingWizard: IGuardianChangingWizardTranslation;
  restakingWizard: IRestakingWizardTranslation;
  unstakingWizard: IUnstakingWizardTranslation;
  withdrawingWizard: IWithdrawingWizardTranslation;
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
  moveToStep_finish: string;
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
  moveToStep_stake: string;
  moveToStep_selectGuardian: string;
  afterSuccessStateExplanation: string;

  // Allowance approval selection sub step
  allowanceSubStep_message_selectAmountOfOrbs: string;
  allowanceSubStep_action_approve: string;
  allowanceSubStep_label_allowance: string;
  allowanceSubStep_stepTitle: string;
  allowanceSubStep_stepExplanation: string;

  // Staking sub step
  stakingSubStep_stepTitle: string;
  stakingSubStep_stepExplanation: string;

  // Guardian selection sub step
  guardianSelectionSubStep_message_selectGuardian: string;
  guardianSelectionSubStep_subMessage_pressSelectAndApprove: string;
  guardianSelectionSubStep_stepTitle: string;
  guardianSelectionSubStep_stepExplanation: string;
}

export interface IGuardianChangingWizardTranslation {
  stepLabel_changeGuardian: string;
  afterSuccessStateExplanation: string;
  finishedAction_selectedGuardian: string;

  // Guardian change sub step
  guardianSelectionSubStep_message_changeGuardian: string;
  guardianSelectionSubStep_subMessage_pressChangeAndApprove: string;
  guardianSelectionSubStep_stepTitle: string;
  guardianSelectionSubStep_action_change: string;
}

export interface IRestakingWizardTranslation {
  stepLabel_restake: string;
  finishedAction_restaked: string;
  afterSuccessStateExplanation: string;

  // Restaking sub step
  restakingSubStep_subMessage_pressRestakeAndApprove: string;
  restakingSubStep_stepTitle: string;
  restakingSubStep_stepExplanation: string;
  restakingSubStep_action_restake: string;
}

export interface IUnstakingWizardTranslation {

}

export interface IWithdrawingWizardTranslation {

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
