import { IDelegationsService } from './IDelegationsService';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import DelegationsContractJson from '@orbs-network/orbs-ethereum-contracts-v2/build/contracts/Delegations.json';
import { Delegations } from '../../../contracts/Delegations';

const MAIN_NET_DELEGATIONS_CONTRACT_ADDRESS = '';

export class DelegationsService implements IDelegationsService {
  private delegationsContract: Delegations;

  constructor(private web3: Web3, delegationsContractAddress: string = MAIN_NET_DELEGATIONS_CONTRACT_ADDRESS) {
    this.delegationsContract = (new this.web3.eth.Contract(
      DelegationsContractJson.abi as AbiItem[],
      delegationsContractAddress,
    ) as any) as Delegations;
  }

  readDelegation(fromAddress: string): Promise<string> {
    return this.delegationsContract.methods.getDelegation(fromAddress).call();
  }
}
