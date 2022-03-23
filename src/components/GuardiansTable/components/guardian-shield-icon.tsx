import React, { FC } from 'react';
import { CssBaselineProps, SvgIcon } from '@material-ui/core';


import { ICommitteeMemberData } from '../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

interface IProps {
  IsCertified: boolean;
  committeeMembershipData: ICommitteeMemberData;
  customStyle?: CSSProperties;
  qualificationImages: any;
}

const GuardianShieldIcon: FC<IProps> = (props) => {
  const { IsCertified, committeeMembershipData, customStyle = {}, qualificationImages } = props;

  const getIcon = () => {
    let shieldIcon = qualificationImages.nonCommitttee;

    // Is in committee ?
    if (committeeMembershipData) {
      shieldIcon = IsCertified ?    qualificationImages.certifiedCommittee  : qualificationImages.committee;
    } else {
      // Certified ?
      shieldIcon = IsCertified ? qualificationImages.certifiedNotCommittee : qualificationImages.nonCommitttee;
    }
    return shieldIcon;
  };

  return (
    <SvgIcon
      component={getIcon()}
      viewBox='0 0 40.371 47.178'
      style={{ height: '100%', width: '100%', zoom: 0.1, ...customStyle }}
    />
  );
};

export default GuardianShieldIcon;
