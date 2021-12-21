import React from 'react';
import { GuardianQualifications } from '../../components/GuardianQualifications';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { getCommitteeMemberData } from '../../util';

interface IProps {
  guardian: Guardian;
  address: string;
  committeeMembers: ICommitteeMemberData[];
}

function Qualifications({ guardian, committeeMembers, address }: IProps) {
  return (
    <GuardianQualifications
      guardian={guardian}
      committeeMembershipData={getCommitteeMemberData(address, committeeMembers)}
    />
  );
}

export default Qualifications;
