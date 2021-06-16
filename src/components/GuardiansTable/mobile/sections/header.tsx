import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IMobileSection } from '../../interfaces';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import GuardianShieldIcon from '../../components/guardian-shield-icon';
import { Typography } from '@material-ui/core';
import { getCommitteeMemberData } from '../../util';
import { useCommonStyles } from './styles';
import Arrow from '../../components/arrow';
const useStyles = makeStyles({
  container: {
    borderBottom: '1px solid rgba(255,255,255, 0.6)',
    paddingBottom: '20px',
    paddingTop: '20px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    paddingRight: '30px',
  },
});

interface IProps extends IMobileSection {
  committeeMembers: ICommitteeMemberData[];
  onClick: () => void;
}

const GuardianMobileHeader: FC<IProps> = ({ guardian, committeeMembers, onClick }) => {
  const { IsCertified, Name, EthAddress } = guardian;
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <div className={classes.container} onClick={onClick}>
      <Arrow />
      <GuardianShieldIcon
        IsCertified={IsCertified}
        committeeMembershipData={getCommitteeMemberData(EthAddress, committeeMembers)}
        customStyle={{ width: '30px', marginRight: '20px' }}
      />
      <Typography className={commonClasses.name}>{Name}</Typography>
    </div>
  );
};

export default GuardianMobileHeader;
