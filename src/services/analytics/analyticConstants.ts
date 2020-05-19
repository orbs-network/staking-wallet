export const MODAL_IDS = {
  staking: 'Staking',
  unstaking: 'Unstaking',
  restaking: 'Restaking',
  withdrawing: 'Withdrawing',
  guardianChange: 'GuardianChange',
  guardianSelection: 'GuardianSelection',
};

export const STAKING_ACTIONS = {
  staking: 'Staking',
  unstaking: 'Unstaking',
  restaking: 'Restaking',
  withdrawing: 'Withdrawing',
  guardianChange: 'GuardianChange',
};

export const USER_EVENT_ACTIONS = {
  loggedIn: 'Logged in',
};

export const EVENT_CATEGORIES = {
  tokenStakeRequest: 'Token Stake request',
  tokenStakeSuccess: 'Token Stake success',
  user: 'User',
};

type ValueOf<T> = T[keyof T];
export type TModalId = ValueOf<typeof MODAL_IDS>;
export type TStackingAction = ValueOf<typeof STAKING_ACTIONS>;
export type TEventCategories = ValueOf<typeof EVENT_CATEGORIES>;
