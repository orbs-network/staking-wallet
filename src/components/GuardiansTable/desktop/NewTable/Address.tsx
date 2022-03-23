import React from 'react';
import { Typography } from '@material-ui/core';
import { InTextLink } from '../../../shared/texts/InTextLink';
import { HtmlTooltip } from '../../../base/HtmlTooltip';

interface IProps {
  address: string;
  copyAddress: (val: string) => void;
  blockExplorer: string;
  copyImage?: any;
}

const Address = ({ address, copyAddress, blockExplorer, copyImage: CopyIcon }: IProps) => {
  return (
    <HtmlTooltip title={<Typography style={{ fontSize: 14 }}>{address}</Typography>} arrow placement='bottom' interactive>
      <Typography style={{ display: 'flex' }}>
        <InTextLink
          href={`${blockExplorer}/address/${address}`}
          text={address}
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
            color: 'white',
            fontSize: '14px',
          }}
        />
        <CopyIcon style={{ zoom: 1.3, cursor: 'pointer', marginLeft: 5 }} onClick={() => copyAddress(address)} />
      </Typography>
    </HtmlTooltip>
  );
};

export default Address;
