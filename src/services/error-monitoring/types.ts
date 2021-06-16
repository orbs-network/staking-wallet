export interface IErrorMessages {
  apiError: (url: string, message: string, retries: number) => string;
  stepError: (step: string, message: string) => string;
}

export interface IErrorBoundaryProps {
  children: JSX.Element;
}

export interface ISections {
  api: string;
  orbsNodeStore: string;
  guardiansStore: string;
  accountStore: string;
  combinedEventsAndSubscriptions: string;
  approvableWizardStep: string;
  guardianChange: string;
  restaking: string;
  rewardsClaiming: string;
  guardianSelection: string;
  stakingAllowance: string;
  staking: string;
  unstaking: string;
  withdrawing: string;
}
