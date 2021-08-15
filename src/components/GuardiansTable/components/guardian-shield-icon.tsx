import React, { FC } from 'react';
import { CssBaselineProps, SvgIcon } from '@material-ui/core';

import { ReactComponent as NotCommitteeGuardianShield } from '../assets/guardian_no_committee.svg';
import { ReactComponent as CertifiedNotCommitteeGuardianShield } from '../assets/guardian_no_committee_certified.svg';
import { ReactComponent as CommitteeGuardianShield } from '../assets/guardian_committe.svg';
import { ReactComponent as CertifiedCommitteeGuardianShield } from '../assets/guardian_committee_certiied.svg';
import { ICommitteeMemberData } from '../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

interface IProps {
  IsCertified: boolean;
  committeeMembershipData: ICommitteeMemberData;
  customStyle?: CSSProperties;
}

const GuardianShieldIcon: FC<IProps> = (props) => {
  const { IsCertified, committeeMembershipData, customStyle = {} } = props;

  const getIcon = () => {
    let shieldIcon = NotCommitteeGuardianShield;

    // Is in committee ?
    if (committeeMembershipData) {
      shieldIcon = IsCertified ? CertifiedCommitteeGuardianShield : CommitteeGuardianShield;
    } else {
      // Certified ?
      shieldIcon = IsCertified ? CertifiedNotCommitteeGuardianShield : NotCommitteeGuardianShield;
    }
    return shieldIcon;
  };

  return (
    <SvgIcon
      component={getIcon()}
      viewBox='0 0 40.371 47.178'
      style={{ height: '100%', width: '100%', ...customStyle }}
    />
  );
};

export default GuardianShieldIcon;
