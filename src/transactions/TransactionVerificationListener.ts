import { TransactionReceipt, PromiEvent } from 'web3-core';

export class TransactionVerificationListener {
  constructor(private transactionPromivent: PromiEvent<TransactionReceipt>) {}

  public subscribeToTxConfirmation(listener: (confirmationNumber: number, receipt: TransactionReceipt) => void): void {
    const emitter = this.transactionPromivent.on('confirmation', listener);

    // TODO : ORL : Find out how to unsubscribe from these events
  }

  public clearAllSubscriptions() {
    // TODO : ORL : Check this with the live object
    // @ts-ignore
    this.transactionPromivent.removeAllListeners();
  }
}
