import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useCommonStyles } from './styles';
import Arrow from '../../components/arrow';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import GuardianShieldIcon from '../../components/guardian-shield-icon';
import { getCommitteeMemberData } from '../../util';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';

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

interface IProps {
  onClick: () => void;
  name: string;
  guardian: Guardian | null;
  committeeMembers: ICommitteeMemberData[];
  qualificationImages?: any;
}




const GuardianMobileHeader = ({ guardian, onClick, name, committeeMembers, qualificationImages }: IProps) => {

  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <div className={classes.container} onClick={onClick}>
      <Arrow />
      {guardian && (
        <GuardianShieldIcon
          IsCertified={guardian.IsCertified}
          committeeMembershipData={getCommitteeMemberData(guardian.EthAddress, committeeMembers)}
          customStyle={{zoom:1,width: 40, marginRight: '12px' }}
          qualificationImages = {qualificationImages}
        />
      )}
      <Typography className={commonClasses.name}>{name}</Typography>
    </div>
  );
};

export default GuardianMobileHeader;
