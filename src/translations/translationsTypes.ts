export interface IAppTranslations {
  fontFamily: string;
  sectionTitles: ISectionTitlesTranslations;
  connectWalletSection: IConnectWalletSectionTranslations;
  walletInfoSection: IWalletInfoSectionTranslations;
  balancesSection: IBalancesSectionTranslations;
  rewardsSection: IRewardsSectionTranslations;
  guardiansTable: IGuardiansTableTranslations;
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
  loadingFailed: string;
  // As in "5 Days -left- for something"
  timeLeft: string;
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
  installMetaMask: string;
  pleaseApproveAccountConnection: string;
  refreshPageAfterInstallingMetaMask: string;
  initialGreeting: string;
}

export interface IWizardsCommonsTranslations {
  message_userCanceledTransactions: string;
  subMessage_tryAgainAndApprove: string;
  message_errorOccurred: string;
  subMessage_pleaseTryAgain: string;
  subMessage_pleaseApproveTransactionWithExplanation: string;
  subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab: string;
  stepLabel_finish: string;
  moveToStep_finish: string;
  action_finish: string;
  stepDoneExclamation: string;

  // Modal managing
  action_close: string;

  // Message for TX errors
  txCreationError_userCanceled_message: string;
  txCreationError_userCanceled_subMessage: string;
  txCreationError_generalError_message: string;
  txCreationError_generalError_subMessage: string;
}

export interface IGuardiansTableTranslations {
  action_keep: string;
  action_select: string;
  didVote_yes: string;
  didVote_no: string;
  columnHeader_name: string;
  columnHeader_address: string;
  columnHeader_website: string;
  columnHeader_stakingPercentageInLastElections: string;
  columnHeader_votedInLastElection: string;
  columnHeader_selection: string;
}

export interface IApprovableWizardStepTranslations {
  weRecommendWaitingToReceiveEnoughConfirmations: string;
  thisMightTakeAFewMoments: string;
  gotXConfirmationsOutOfRecommendedY: string;
  txPending: string;
  txConfirmed: string;
  youHaveDoneActionSuccessfully: string;
  congratulations: string;
  action_proceed: string;
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
  stepLabel_unstake: string;
  finishedAction_unstaked: string;
  afterSuccessStateExplanation: string;

  // Unstaking sub step
  unstakingSubStep_message_selectAmountOfOrbs: string;
  unstakingSubStep_subMessage_pressUnstakeAndApprove: string;
  unstakingSubStep_stepTitle: string;
  unstakingSubStep_stepExplanation: string;
  unstakingSubStep_action_unstake: string;
  unstakingSubStep_inputLabel: string;
  unstakingSubStep_warning_thereAreOrbsInCooldownHeader: string;
  unstakingSubStep_warning_thereAreOrbsInCooldownBody: string;
}

export interface IWithdrawingWizardTranslation {
  stepLabel_withdraw: string;
  finishedAction_withdrew: string;
  afterSuccessStateExplanation: string;

  // Withdrawing sub step
  withdrawingSubStep_subMessage_pressWithdrawAndApprove: string;
  withdrawingSubStep_stepTitle: string;
  withdrawingSubStep_stepExplanation: string;
  withdrawingSubStep_action_withdraw: string;
}

export interface IBalancesSectionTranslations {
  title_unstakedOrbsInYourWallet: string;
  title_stakedOrbsInSmartContract: string;
  title_tokensReadyForWithdrawal: string;
  title_noTokensInCooldown: string;
  title_tokensInCooldown: string;
  action_stakeYourTokens: string;
  action_unstakeYourTokens: string;
  action_restakeYourTokens: string;
  action_withdrawYourTokens: string;
}

export interface IRewardsSectionTranslations {
  text_visitThe: string;
  text__forDetailedRewardsPleaseVisitThe: string;
  linkText_rewardsPage: string;
}

export interface IAlertsTranslations {
  cannotUnstakeWhenThereAreOrbsReadyToWithdraw: string;
  walletAddressWasCopied: string;
  guardianAlreadySelected: string;
}
