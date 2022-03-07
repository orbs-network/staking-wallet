import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useCommonStyles } from './styles';

import config from '../../../../../config';

interface IProps {
  chain: number;
  translation: any;
}

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
    paddingRight: '30px',
  },
  logo: {
    width: '30px',
    height: 'auto',
    marginRight: '20px',
  },
});

const Network = ({ translation, chain }: IProps) => {
  const network = config.networks[chain];
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <div className={`${commonClasses.row} ${classes.root}`}>
      <div className={commonClasses.rowName}>
        <Typography>{`${translation('columnHeader_network')}: `}</Typography>
      </div>
      <div className={commonClasses.rowContent}>
        <img src={network.smallLogo} alt='icon' className={classes.logo} />
       
      </div>
    </div>
  );
};

export default Network;
