import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { InTextLink } from '../../../shared/texts/InTextLink';
import { ReactComponent as CopyIcon } from '../../../../../../assets/copy.svg';

interface IProps {
  guardian: Guardian;
  copyAddress: (val: string) => void;
}

const Address = ({ guardian, copyAddress }: IProps) => {
  const { EthAddress } = guardian;
  return (
    <Tooltip title={<Typography>{EthAddress}</Typography>} arrow placement={'right'} interactive>
      <Typography style={{ fontFamily: 'monospace', textAlign: 'center', display: 'flex' }}>
        <InTextLink href={`https://etherscan.io/address/${EthAddress}`} text={`${EthAddress.substring(0, 10)}...`} />
        <CopyIcon
          style={{ width: '20px', height: '20px', cursor: 'pointer', marginLeft: '8px' }}
          onClick={() => copyAddress(EthAddress)}
        />
      </Typography>
    </Tooltip>
  );
};

export default Address;
