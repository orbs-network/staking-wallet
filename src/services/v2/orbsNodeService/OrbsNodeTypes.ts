import { Model } from './model';

export interface IReadAndProcessResults {
  model: Model;
  committeeMembers: ICommitteeMemberData[];
}

export interface ICommitteeMemberData {
  EthAddress: string;
  Weight: number;
  Name: string;
  EnterTime: number;
}
