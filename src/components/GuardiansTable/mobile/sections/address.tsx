import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { InTextLink } from '../../../shared/texts/InTextLink';
import { useCommonStyles } from './styles';
import { IMobileSection } from '../../interfaces';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({});

interface IProps {
  translation: any;
  EthAddress: string;
}

const Address = ({ EthAddress, translation }: IProps) => {
  const commonClasses = useCommonStyles();
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('columnHeader_address')}</Typography>
      </div>
      <Typography className={`${commonClasses.text} ${commonClasses.rowContent}`}>
        <InTextLink
          href={`https://etherscan.io/address/${EthAddress}`}
          text={EthAddress}
          className={`${commonClasses.textOverflow} ${commonClasses.text}`}
        />
      </Typography>
    </div>
  );
};
export default Address;
