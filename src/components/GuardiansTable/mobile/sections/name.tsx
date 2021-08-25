import React, { FC } from 'react';

import { IMobileSection } from '../../interfaces';
import { ICommitteeMemberData } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import GuardianShieldIcon from '../../components/guardian-shield-icon';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useCommonStyles } from './styles';
import { getCommitteeMemberData } from '../../util';
import Arrow from '../../components/arrow';
interface IProps extends IMobileSection {
  committeeMembers: ICommitteeMemberData[];
  onClick: () => void;
}

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
    paddingRight: '30px',
  },
});

const NameSection: FC<IProps> = ({ guardian, committeeMembers, guardiansTableTranslations, onClick }) => {
  const { Name, IsCertified, EthAddress } = guardian;
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <div className={`${commonClasses.row} ${classes.root}`} onClick={onClick}>
      <Arrow extraStyle={{ transform: 'rotate(135deg)' }} />
      <div className={commonClasses.rowName}>
        <Typography>{`${guardiansTableTranslations('columnHeader_name')}: `}</Typography>
        <GuardianShieldIcon
          IsCertified={IsCertified}
          committeeMembershipData={getCommitteeMemberData(EthAddress, committeeMembers)}
          customStyle={{ width: '30px', marginLeft: '10px' }}
        />
      </div>
      <Typography className={commonClasses.rowContent}>{Name}</Typography>
    </div>
  );
};

export default NameSection;
