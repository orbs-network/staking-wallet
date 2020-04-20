export const MODAL_IDS = {
  staking: 'Staking',
  unstaking: 'Snstaking',
  restaking: 'Restaking',
  withdrawing: 'Withdrawing',
  guardianChange: 'GuardianChange',
};

type ValueOf<T> = T[keyof T];
export type TModalId = ValueOf<typeof MODAL_IDS>;
