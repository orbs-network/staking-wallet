/* eslint-disable @typescript-eslint/camelcase */
import { IAppTranslations } from './translationsTypes';

export const ENGLISH_TEXTS: IAppTranslations = {
  fontFamily: 'Montserrat',
  sectionTitles: {
    allGuardians: 'All Guardians',
    allGuardians_sideTitle: 'Participating stake: {{totalParticipatingTokens}}',
    balance: 'Balance',
    rewards: 'Rewards',
    connectWallet: 'Connect your wallet',
    walletInfo: 'Wallet info',
  },
  connectWalletSection: {
    connectYourAccount: 'Connect your account',
    installMetaMask: 'Install MetaMask',
    pleaseApproveAccountConnection: 'Please approve the account connection',
    refreshPageAfterInstallingMetaMask: 'Please refresh this page after installing MetaMask',
    initialGreeting: 'To begin, we need to connect your wallet',
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
    title_tokensInCooldown: 'Tokens in cooldown',
    action_stakeYourTokens: 'Stake your tokens',
    action_unstakeYourTokens: 'Unstake your tokens',
    action_restakeYourTokens: 'Restake your tokens',
    action_withdrawYourTokens: 'Withdraw your tokens',
  },
  rewardsSection: {
    text_visitThe: 'Visit the',
    linkText_rewardsPage: 'rewards page',
  },
  guardiansTable: {
    action_keep: 'Keep',
    action_select: 'Select',
    didVote_yes: 'Yes',
    didVote_no: 'No',
    columnHeader_name: 'Name',
    columnHeader_address: 'Address',
    columnHeader_website: 'Website',
    columnHeader_stakingPercentageInLastElections: 'Staking % in last elections',
    columnHeader_votedInLastElection: 'Voted in previous election',
    columnHeader_selection: 'Selection',
  },
  wizardsCommons: {
    message_userCanceledTransactions: 'You have canceled the transaction.',
    subMessage_tryAgainAndApprove: 'In order to continue, please try again and approve the transaction.',
    message_errorOccurred: 'An error occurred while trying to send transaction to the staking wallet.',
    subMessage_pleaseTryAgain: 'please try again',
    subMessage_pleaseApproveTransactionWithExplanation:
      'Please approve the transaction, we will move to the next stage as soon as the transaction is confirmed.',
    stepLabel_finish: 'Finish',
    action_finish: 'Finish',
    moveToStep_finish: 'Finish',
    stepDoneExclamation: 'Awesome!',

    // Modal managing
    action_close: 'Close',

    // Message for TX errors
    txCreationError_userCanceled_message: 'You have canceled the transaction.',
    txCreationError_userCanceled_subMessage: 'In order to continue, please try again and approve the transaction.',
    txCreationError_generalError_message: 'An error occurred while trying to send transaction to the staking wallet.',
    txCreationError_generalError_subMessage: 'Please try again',
  },
  approvableWizardStep: {
    weRecommendWaitingToReceiveEnoughConfirmations:
      'We recommend waiting until enough confirmations have been received.',
    thisMightTakeAFewMoments: 'This might take a few moments...',
    gotXConfirmationsOutOfRecommendedY: 'Got {{count}} of {{recommended}} recommended confirmations.',
    txConfirmed: 'Transaction Confirmed',
    txPending: 'Transaction Pending',
    youHaveDoneActionSuccessfully: `You have successfully {{finishedActionName}}`,
    congratulations: 'Congratulations',
    action_proceed: 'Proceed',
  },
  stakingWizard: {
    stepLabel_approve: 'Approve usage of ORBS',
    stepLabel_stake: 'Stake your tokens',
    stepLabel_selectGuardian: 'Select a Guardian',
    finishedAction_approved: 'allowed the staking contract to use your tokens',
    finishedAction_staked: 'staked your tokens',
    moveToStep_stake: 'Stake your ORBS',
    finishedAction_selectedGuardian: 'selected a Guardian',
    moveToStep_selectGuardian: 'Select a Guardian',
    afterSuccessStateExplanation: 'Your ORBS are now staked and are assigned to a Guardian',

    // Allowance approval selection sub step
    allowanceSubStep_message_selectAmountOfOrbs: 'Select the amount of ORBS you would like to stake:',
    allowanceSubStep_action_approve: 'Approve',
    allowanceSubStep_label_allowance: 'Allowance',
    allowanceSubStep_stepTitle: 'Approve usage of your ORBS',
    allowanceSubStep_stepExplanation:
      'This step will approve the Staking contract to transfer your ORBS tokens into the contract in order to be staked (up to the approved amount).',

    // Staking sub step
    stakingSubStep_stepTitle: 'In this step you will stake {{orbsForStaking}} ORBS',
    stakingSubStep_stepExplanation:
      'This step will transfer your ORBS tokens to the staking contract and stake them. Staking makes the Orbs Network more secure and incentivizes the Delegators, Guardians and Validators to participate.',

    // Guardian selection sub step
    guardianSelectionSubStep_message_selectGuardian: 'Select a Guardian',
    guardianSelectionSubStep_subMessage_pressSelectAndApprove: 'Press "Select" and accept the transaction',
    guardianSelectionSubStep_stepTitle: 'Select your Guardian',
    guardianSelectionSubStep_stepExplanation:
      'This step selects which Guardian you would like to delegate to, adding your staked ORBS tokens to their influence.',
  },
  guardianChangingWizard: {
    stepLabel_changeGuardian: 'Change selected Guardian',
    afterSuccessStateExplanation: 'You have selected a new Guardian',
    finishedAction_selectedGuardian: 'Guardian selected',

    // Guardian change sub step
    guardianSelectionSubStep_message_changeGuardian: 'Change selected Guardian to {{newGuardianAddress}}',
    guardianSelectionSubStep_subMessage_pressChangeAndApprove: 'Press "Change" and accept the transaction',
    guardianSelectionSubStep_stepTitle: 'Change selected Guardian',
    guardianSelectionSubStep_action_change: 'Change',
  },
  restakingWizard: {
    stepLabel_restake: 'Restake ORBS',
    finishedAction_restaked: 'restaked your tokens',
    afterSuccessStateExplanation: 'Your ORBSstaked once again!',

    restakingSubStep_subMessage_pressRestakeAndApprove: 'Press "Restake" and accept the transaction',
    restakingSubStep_stepTitle: 'Restaking {{orbsForRestaking}} ORBS',
    restakingSubStep_stepExplanation:
      'This will stop the process of cooldown and will return all of the ORBS tokens back to the staked state.',
    restakingSubStep_action_restake: 'Restake',
  },
  unstakingWizard: {
    stepLabel_unstake: 'Unstake',
    finishedAction_unstaked: 'unstaked your tokens',
    afterSuccessStateExplanation: 'Your unstaked ORBS will be available after the unfreezing period.',

    // Unstaking sub step
    unstakingSubStep_message_selectAmountOfOrbs: 'Select amount of ORBS to unstake',
    unstakingSubStep_subMessage_pressUnstakeAndApprove: 'Press "Unstake" and accept the transaction',
    unstakingSubStep_stepTitle: 'Unstaking your tokens',
    unstakingSubStep_stepExplanation:
      'This will take your ORBS tokens out of their staked state and will start a cooldown period of 30 days, after which you will be able to withdraw the tokens to your wallet. During those 30 days you may choose to re-stake your tokens.',
    unstakingSubStep_action_unstake: 'Unstake',
    unstakingSubStep_inputLabel: 'Unstaking',
    unstakingSubStep_warning_thereAreOrbsInCooldownHeader: 'Warning : There are currently tokens in cooldown.',
    unstakingSubStep_warning_thereAreOrbsInCooldownBody:
      'Unstaking more tokens now will reset the cooldown timer to 30 days for the whole sum.',
  },
  withdrawingWizard: {
    stepLabel_withdraw: 'Withdraw ORBS',
    finishedAction_withdrew: 'Withdrew your cooled down tokens',
    afterSuccessStateExplanation: 'Your unstaked ORBS will be available after the cooldown period',

    // Withdrawing sub step
    withdrawingSubStep_subMessage_pressWithdrawAndApprove: 'Press "Withdraw" and accept the transaction',
    withdrawingSubStep_stepTitle: 'Withdrawing {{orbsForWithdrawal}} ORBS',
    withdrawingSubStep_stepExplanation:
      'This will transfer all of the ORBS tokens that completed cooldown to your address.',
    withdrawingSubStep_action_withdraw: 'Withdraw',
  },
  alerts: {
    cannotUnstakeWhenThereAreOrbsReadyToWithdraw: 'Cannot unstake when there are ORBS to be withdrawn',
    walletAddressWasCopied: 'Copied address!',
    guardianAlreadySelected: 'Guardian already selected!',
  },
  commons: {
    loading: 'Loading...',
    loadingFailed: 'Loading failed',
    timeLeft: '{{timePhrase}} left',
  },
};
