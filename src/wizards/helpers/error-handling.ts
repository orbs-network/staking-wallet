import errorMonitoring from '../../services/error-monitoring/index';

export const hanleStakingAllowanceError = (error: Error) => {
  const { errorMessages, captureException, sections } = errorMonitoring;
  const customMsg = errorMessages.stepError(sections.stakingAllowance, error.message);
  captureException(error, sections.stakingAllowance, customMsg);
};

export const hanleStakingError = (error: Error) => {
  const { errorMessages, captureException, sections } = errorMonitoring;
  const customMsg = errorMessages.stepError(sections.staking, error.message);
  captureException(error, sections.staking, customMsg);
};

export const hanleUnstakingError = (error: Error) => {
  const { errorMessages, captureException, sections } = errorMonitoring;
  const customMsg = errorMessages.stepError(sections.unstaking, error.message);
  captureException(error, sections.unstaking, customMsg);
};

export const handleGuardianSelectionError = (error: Error) => {
  const { errorMessages, captureException, sections } = errorMonitoring;
  const customMsg = errorMessages.stepError(sections.guardianSelection, error.message);
  captureException(error, sections.guardianSelection, customMsg);
};

export const handleGuardianChangeError = (error: Error) => {
  const { errorMessages, captureException, sections } = errorMonitoring;
  const customMsg = errorMessages.stepError(sections.guardianChange, error.message);
  captureException(error, sections.guardianChange, customMsg);
};

export const handleRestakingError = (error: Error) => {
  const { errorMessages, captureException, sections } = errorMonitoring;
  const customMsg = errorMessages.stepError(sections.guardianChange, error.message);
  captureException(error, sections.guardianChange, customMsg);
};

export const handleRewardClaimingError = (error: Error) => {
  const { errorMessages, captureException, sections } = errorMonitoring;
  const customMsg = errorMessages.stepError(sections.rewardsClaiming, error.message);
  captureException(error, sections.rewardsClaiming, customMsg);
};

export const handleWithdrawingError = (error: Error) => {
  const { errorMessages, captureException, sections } = errorMonitoring;
  const customMsg = errorMessages.stepError(sections.withdrawing, error.message);
  captureException(error, sections.withdrawing, customMsg);
};
