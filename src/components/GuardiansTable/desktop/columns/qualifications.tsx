import React from 'react';
import { GuardianQualifications } from '../../components/GuardianQualifications';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { getCommitteeMemberData } from '../../util';

const getQualificationCoulmn = (committeeMembers: ICommitteeMemberData[]) => {
  return {
    title: '',
    field: '',
    render: (guardian: Guardian) => (
      <GuardianQualifications
        guardian={guardian}
        committeeMembershipData={getCommitteeMemberData(guardian.EthAddress, committeeMembers)}
      />
    ),
    width: 'fit-content',
  };
};
export default getQualificationCoulmn;
