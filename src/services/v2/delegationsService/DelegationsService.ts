import { IDelegationsService } from './IDelegationsService';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import DelegationsContractJson from '@orbs-network/orbs-ethereum-contracts-v2/build/contracts/Delegations.json';
import { Delegations } from '../../../contracts/Delegations';
import { PromiEvent, TransactionReceipt } from 'web3-core';

// TODO : ORL : Add address
const MAIN_NET_DELEGATIONS_CONTRACT_ADDRESS = '0xBb5B5E9333e155cad6fe299B18dED3F4107EF294';

export class DelegationsService implements IDelegationsService {
  private delegationsContract: Delegations;

  constructor(private web3: Web3, delegationsContractAddress: string = MAIN_NET_DELEGATIONS_CONTRACT_ADDRESS) {
    this.delegationsContract = (new this.web3.eth.Contract(
      DelegationsContractJson.abi as AbiItem[],
      delegationsContractAddress,
    ) as any) as Delegations;
  }

  setFromAccount(defaultAccountAddress: string): void {
    this.delegationsContract.options.from = defaultAccountAddress;
  }

  readDelegation(fromAddress: string): Promise<string> {
    return this.delegationsContract.methods.getDelegation(fromAddress).call();
  }

  delegate(delegationTargetAddress: string): PromiEvent<TransactionReceipt> {
    return this.delegationsContract.methods.delegate(delegationTargetAddress).send();
  }
}
