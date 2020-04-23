// DEV_NOTE : These types should come from a separate package (orbs-pos-data ?)
// TODO : FUTURE : O.L : Move thes types (and service) to a different package.

export interface IDistributionEventGist {
  distributionEvent: string; // The name of the event
  amount: number; // The amount, in whole ORBS
  transactionHash: string;
}

export type TRewardsDistributionHistory = IDistributionEventGist[];

export interface IAccumulatedRewards {
  delegatorReward: number; // Rewards for role as a delegator - Whole ORBS
  guardianReward: number; // Rewards for role as a guardian - Whole ORBS
  validatorReward: number; // Rewards for role as a validator - Whole ORBS
}
