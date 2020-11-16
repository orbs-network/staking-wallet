export interface IAppTranslations {
  fontFamily: string;
  sectionTitles: ISectionTitlesTranslations;
  connectWalletSection: IConnectWalletSectionTranslations;
  walletInfoSection: IWalletInfoSectionTranslations;
  balancesSection: IBalancesSectionTranslations;
  rewardsSection: IRewardsSectionTranslations;
  guardiansSection: IGuardiansSectionTranslations;
  guardiansTable: IGuardiansTableTranslations;
  wizardsCommons: IWizardsCommonsTranslations;
  approvableWizardStep: IApprovableWizardStepTranslations;
  stakingWizard: IStakingWizardTranslations;
  guardianChangingWizard: IGuardianChangingWizardTranslation;
  guardianSelectingWizard: IGuardianSelectingWizardTranslation;
  restakingWizard: IRestakingWizardTranslation;
  unstakingWizard: IUnstakingWizardTranslation;
  withdrawingWizard: IWithdrawingWizardTranslation;
  rewardsClaimingWizard: IRewardsClaimingWizardTranslation;
  alerts: IAlertsTranslations;
  commons: ICommonsTranslations;
}

export interface ICommonsTranslations {
  loading: string;
  loadingFailed: string;
  // As in "5 Days -left- for something"
  timeLeft: string;

  termsOfUse: string;
  privacyPolicy: string;
  xOrbs: string;
}

export interface ISectionTitlesTranslations {
  connectWallet: string;
  walletInfo: string;
  balance: string;
  rewards: string;
  allGuardians: string;
  allGuardians_sideTitleTotalStake: string;
  allGuardians_sideTitleCommitteeStake: string;
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
  agreeToTheToUAndPrivacyPolicy: string;
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
  action_skip: string;

  // Message for TX errors
  txCreationError_userCanceled_message: string;
  txCreationError_userCanceled_subMessage: string;
  txCreationError_generalError_message: string;
  txCreationError_generalError_subMessage: string;
}

export interface IGuardiansTableTranslations {
  // Actions
  action_keep: string;
  action_select: string;

  // Column Headers
  columnHeader_name: string;
  columnHeader_address: string;
  columnHeader_website: string;
  columnHeader_rewardsPercentageToDelegators: string;
  columnHeader_effectiveStake: string;
  columnHeader_participation: string;
  columnHeader_capacity: string;
  columnHeader_votedInLastElection: string;
  columnHeader_selection: string;

  // Messages for Guardian qualifications
  message_inCommittee: string;
  message_notInCommittee: string;
  message_pleaseNote: string;
  message_onlyCommitteeMembersAreEntitledToRewards: string;
  message_sinceDate: string;
  message_certified: string;
  message_notCertified: string;
  message_registeredSinceDate: string;

  // General Texts
  xOrbs: string;

  // Messages for other columns
  message_guardianGivesXPercentageToDelegators: string;
  message_selfStake: string;
  message_delegatedStake: string;
  message_selfStakePercentage: string;
  message_participationExplanation: string;

  // Unused
  columnHeader_stakingPercentageInLastElections: string;
  didVote_yes: string;
  didVote_no: string;
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
  moveToStep_approve: string;
  backToStep_changeGuardian: string;
  backToStep_changeAmount: string;
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
  stakingSubStep_action_stake: string;

  // Guardian selection sub step
  guardianSelectionSubStep_message_selectGuardian: string;
  guardianSelectionSubStep_message_youAreAGuardian: string;
  guardianSelectionSubStep_subMessage_pressSelectAndApprove: string;
  guardianSelectionSubStep_subMessage_mustUnregisterBeforeDelegation: string;
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

export interface IGuardianSelectingWizardTranslation {
  stepLabel_selectGuardian: string;
  afterSuccessStateExplanation: string;
  finishedAction_selectedGuardian: string;

  // Guardian selection sub step
  guardianSelectionSubStep_message_selectGuardian: string;
  guardianSelectionSubStep_subMessage_pressChangeAndApprove: string;
  guardianSelectionSubStep_stepTitle: string;
  guardianSelectionSubStep_action_select: string;
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

export interface IRewardsClaimingWizardTranslation {
  stepLabel_claim: string;

  finishedAction_claim: string;
  afterSuccessStateExplanation: string;

  // // Claiming sub step
  rewardsClaimingSubStep_message_pressClaimWithExplanation: string;
  rewardsClaimingSubStep_subMessage_claimingHasCost: string;
  rewardsClaimingSubStep_stepTitle: string;
  rewardsClaimingSubStep_text_rewardsBalanceIs: string;
  rewardsClaimingSubStep_action_claim: string;
  // rewardsClaimingSubStep_stepExplanation: string;
}

export interface IBalancesSectionTranslations {
  title_unstakedOrbsInYourWallet: string;
  title_stakedOrbsInSmartContract: string;
  title_stakedOrbsAndRewardsBalance: string;
  title_tokensReadyForWithdrawal: string;
  title_noTokensInCooldown: string;
  title_tokensInCooldown: string;
  action_stakeYourTokens: string;
  action_unstakeYourTokens: string;
  action_restakeYourTokens: string;
  action_withdrawYourTokens: string;
  tooltipTitle_stakedOrbs: string;
  tooltipTitle_pendingRewards: string;
}

export interface IRewardsSectionTranslations {
  title_totalRewardsAwarded: string;
  title_rewardsRate: string;
  title_rewardsBalance: string;
  title_quantity_orbsPerWeek: string;
  title_quantity_orbs: string;
  action_claim: string;

  // Unused
  text_visitThe: string;
  text__totalDistributedRewards: string;
  text__totalAccumulatedRewards: string;
  text__forDetailedRewardsPleaseVisitThe: string;
  text__NextElectionRoundWillTakePlaceAtEthereumBlock: string;
  linkText_rewardsPage: string;
}

export interface IGuardiansSectionTranslations {
  myGuardianDisplay_error_noSelectedGuardianOrSelfDelegatingWhileNotGuardian: string;
  myGuardianDisplay_warning_delegatedToAnUnregisteredGuardian: string;
  myGuardianDisplay_warning_onlyCommitteeDelegationEntitlesRewards: string;
  myGuardianDisplay_info_onlyDelegationToCommitteeMembersEntitlesRewards: string;
  myGuardianDisplay_action_youAre: string;
  myGuardianDisplay_action_selectAGuardian: string;
  myGuardianDisplay_text_selectedGuardianIs: string;
  myGuardianDisplay_text_selectedGuardianAddressIs: string;
  myGuardianDisplay_text_unregistered: string;
}

export interface IAlertsTranslations {
  cannotUnstakeWhenThereAreOrbsReadyToWithdraw: string;
  walletAddressWasCopied: string;
  guardianAlreadySelected: string;
  undergoingMaintenance: string;
}
