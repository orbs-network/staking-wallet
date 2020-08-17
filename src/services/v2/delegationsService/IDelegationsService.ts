import { PromiEvent, TransactionReceipt } from 'web3-core';

export interface IDelegationsService {
  setFromAccount(defaultAccountAddress: string): void;
  readDelegation(forAddress: string): Promise<string>;
  delegate(delegationTargetAddress: string): PromiEvent<TransactionReceipt>;
}
