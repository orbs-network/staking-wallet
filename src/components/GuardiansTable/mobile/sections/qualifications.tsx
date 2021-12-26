import React, { FC } from 'react';

import { getCommitteeMemberData } from '../../util';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import GuardianShieldIcon from '../../components/guardian-shield-icon';

interface IProps {
  guardian: Guardian;
  committeeMembers: ICommitteeMemberData[];
  size?: number;
}

const Qualification: FC<IProps> = ({ guardian, committeeMembers }) => {
  const committeeMembershipData = guardian && getCommitteeMemberData(guardian.EthAddress, committeeMembers);
  return committeeMembershipData ? (
    <GuardianShieldIcon
      IsCertified={guardian.IsCertified}
      committeeMembershipData={committeeMembershipData}
      customStyle={{ width: '30px', marginRight: '10px' }}
    />
  ) : null;
};
export default Qualification;
