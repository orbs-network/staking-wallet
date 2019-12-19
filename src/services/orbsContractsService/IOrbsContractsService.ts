export type TTransactionSigningRejectionReason = 'UserCancel' | 'MetamaskError';

export interface ISendOrbsTransactionResult {
  transactionWasImproved: boolean;
  txId: string;
}

export interface IOrbsContractsService {
  stakeOrbs(amount: number): Promise<ISendOrbsTransactionResult>;
  unlockTokens(amount: number): Promise<ISendOrbsTransactionResult>;
  redeemTokens(): Promise<ISendOrbsTransactionResult>;
  selectGuardian(guardianAddress: string): Promise<ISendOrbsTransactionResult>;
}
