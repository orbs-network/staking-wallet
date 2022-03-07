import React from 'react';
import { GuardianQualifications } from '../../components/GuardianQualifications';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { getCommitteeMemberData } from '../../util';

interface IProps {
  guardian: Guardian;
  address: string;
  committeeMembers: ICommitteeMemberData[];
  qualificationImages: any;
}

function Qualifications({ guardian, committeeMembers, address, qualificationImages }: IProps) {
  return (
    <GuardianQualifications
    qualificationImages = {qualificationImages}
      guardian={guardian}
      committeeMembershipData={getCommitteeMemberData(address, committeeMembers)}
    />
  );
}

export default Qualifications;
