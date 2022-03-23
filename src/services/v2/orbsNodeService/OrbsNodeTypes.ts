import { ICommitteeEffectiveStakeByChain } from './nodeResponseProcessing/RootNodeData';
import { Guardian, SystemState } from './systemState';

export interface IGroupedGuardiansByNetwork {
  chain: number;
  guardian: Guardian | null;
}
export interface IGuardiansDictionary {
  EthAddress: string;
  Name: string;
  Rewards?: any;
  EffectiveStake: number;
  Website: string;
  networks: IGroupedGuardiansByNetwork[];
  ParticipationPercentage: number;
  Capacity: number;
  IsCertified: boolean;
  RegistrationTime: number;
}

export interface IReadAndProcessResults {
  allNetworksGuardians: Guardian[];
  committeeGuardians: Guardian[];
  committeeMembers: ICommitteeMemberData[];
  groupedGuardiansByNetwork: { [key: string]: IGuardiansDictionary };
  committeEffectiveStakes: ICommitteeEffectiveStakeByChain;
  selectedChain: number;
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
}
