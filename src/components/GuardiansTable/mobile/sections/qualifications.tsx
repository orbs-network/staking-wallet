import React, { FC } from 'react';

import { getCommitteeMemberData } from '../../util';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import GuardianShieldIcon from '../../components/guardian-shield-icon';

interface IProps {
  guardian: Guardian;
  committeeMembers: ICommitteeMemberData[];
  size?: number;
  qualificationImages?: any;
}

const Qualification: FC<IProps> = ({ guardian, committeeMembers, qualificationImages }) => {
  const committeeMembershipData = guardian && getCommitteeMemberData(guardian.EthAddress, committeeMembers);
  return committeeMembershipData ? (
    <GuardianShieldIcon
      IsCertified={guardian.IsCertified}
      committeeMembershipData={committeeMembershipData}
      customStyle={{ width: '30px', marginRight: '10px' }}
      qualificationImages={qualificationImages}
    />
  ) : null;
};
export default Qualification;
