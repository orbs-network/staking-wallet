import { IGroupedGuardian } from '../../../components/GuardiansTable/interfaces';
import { SystemState } from './systemState';

export interface IReadAndProcessResults {
  systemState: SystemState;
  committeeMembers: ICommitteeMemberData[];
  allChainGroupedGuardians: IGroupedGuardian[];
}

export interface ICommitteeMemberData {
  EthAddress: string;
  Weight: number;
  Name: string;
  EnterTime: number;
}


export interface IProcessedSystemState {
  state: SystemState;
  chain: number;
  selected: boolean;
}