import React, { FC } from 'react';
import { GuardianQualifications } from '../../components/GuardianQualifications';

import { getCommitteeMemberData } from '../../util';
import { IMobileSection } from '../../interfaces';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';

interface IProps {
  guardian: Guardian;
  committeeMembers: ICommitteeMemberData[];
}

const Qualification: FC<IProps> = ({ guardian, committeeMembers }) => {
  return (
    <div>
      <GuardianQualifications
        guardian={guardian}
        committeeMembershipData={getCommitteeMemberData(guardian.EthAddress, committeeMembers)}
      />
    </div>
  );
};
export default Qualification;
