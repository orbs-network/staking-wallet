// DEV_NOTE : This file is manually made and represents the properties of the status json
// TODO : ORL : Read it from a shared library.

export interface IManagementStatusResponse {
  Status: string;
  Timestamp: string;
  Error?: string;
  Payload: {
    Guardians: IGuardianData[];
    Participation30Days: { [ethAddress: string]: number };
    // Current refs
    CurrentRefBlock: number;
    CurrentRefTime: number;

    // DEV_NOTE : O.L : We can add the fields that we need to process
    [key: string]: any;
  };
}

export interface IManagementStatus {
  chain: number;
  result: IManagementStatusResponse;
}

export interface ICommitteeEffectiveStakeByChain {
  chains: { [key: number]: number };
  total: number;
}

export interface IGuardianData {
  EthAddress: string;
  OrbsAddress: string;
  Ip: string;
  EffectiveStake: number;
  SelfStake: number;
  DelegatedStake: number;
  ElectionsStatus: {
    LastUpdateTime: number;
    ReadyToSync: boolean;
    ReadyForCommittee: boolean;
    TimeToStale: number;
  };
  Name: string;
  Website: string;
  Contact: string;
  Metadata: object;
  RegistrationTime: number;

  // DEV_NOTE : O.L : I have not seen this field in the response, I took it from Noam's code
  IdentityType?: number;
}
