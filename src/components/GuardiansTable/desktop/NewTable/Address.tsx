import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { InTextLink } from '../../../shared/texts/InTextLink';
import { ReactComponent as CopyIcon } from '../../../../../assets/copy.svg';

interface IProps {
  address: string;
  copyAddress: (val: string) => void;
}

const Address = ({ address, copyAddress }: IProps) => {
  return (
    <Tooltip title={<Typography>{address}</Typography>} arrow placement={'right'} interactive>
      <Typography style={{ fontFamily: 'monospace', textAlign: 'center', display: 'flex' }}>
        <InTextLink
          href={`https://etherscan.io/address/${address}`}
          text={address}
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '9vw' }}
        />
        <CopyIcon
          style={{ width: '20px', height: '20px', cursor: 'pointer', marginLeft: '8px' }}
          onClick={() => copyAddress(address)}
        />
      </Typography>
    </Tooltip>
  );
};

export default Address;
