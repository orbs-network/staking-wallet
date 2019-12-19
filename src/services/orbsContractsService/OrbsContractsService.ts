import { IOrbsContractsService, ISendOrbsTransactionResult } from './IOrbsContractsService';

const defaultSendTransactionResult: ISendOrbsTransactionResult = {
  txId: '',
  transactionWasImproved: false,
};

export class OrbsContractsService implements IOrbsContractsService{
  constructor() {}

  async redeemTokens(): Promise<ISendOrbsTransactionResult> {
    return defaultSendTransactionResult;
  }

  async selectGuardian(guardianAddress: string): Promise<ISendOrbsTransactionResult> {
    return defaultSendTransactionResult;
  }

  async stakeOrbs(amount: number): Promise<ISendOrbsTransactionResult> {
    return defaultSendTransactionResult;
  }

  async unlockTokens(amount: number): Promise<ISendOrbsTransactionResult> {
    return defaultSendTransactionResult;
  }
}
