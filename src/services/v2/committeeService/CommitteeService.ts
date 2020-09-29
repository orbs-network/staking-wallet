import { ICommitteeService } from './ICommitteeService';
import { Committee } from '../../../contracts/Committee';
import CommitteeContractJson from '@orbs-network/orbs-ethereum-contracts-v2/build/contracts/Committee.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

// TODO : ORL : Add address
const MAIN_NET_COMMITTEE_CONTRACT_ADDRESS = '0xbfb2bac25daaabf79e5c94a8036b28c553ee75f5';

export class CommitteeService implements ICommitteeService {
  private committeeContract: Committee;

  constructor(private web3: Web3, delegationsContractAddress: string = MAIN_NET_COMMITTEE_CONTRACT_ADDRESS) {
    this.committeeContract = (new this.web3.eth.Contract(
      CommitteeContractJson.abi as AbiItem[],
      delegationsContractAddress,
    ) as any) as Committee;
  }
}
