import React from 'react';
import { GuardianQualifications } from '../../components/GuardianQualifications';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { getCommitteeMemberData } from '../../util';
import { IGroupedGuardian } from '../../interfaces';

const getQualificationCoulmn = (committeeMembers: ICommitteeMemberData[]) => {
  return {
    title: '',
    field: '',
    render: (rowData) => {
      return (
        <GuardianQualifications
          guardian={rowData.guardian}
          committeeMembershipData={getCommitteeMemberData(rowData.guardian.EthAddress, committeeMembers)}
        />
      );
    },
    width: 'fit-content',
  };
};
export default getQualificationCoulmn;
