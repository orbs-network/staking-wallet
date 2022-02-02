import React from 'react';
import { Typography } from '@material-ui/core';
import { InTextLink } from '../../../shared/texts/InTextLink';
import { ReactComponent as CopyIcon } from '../../../../../assets/table-copy.svg';
import { HtmlTooltip } from '../../../base/HtmlTooltip';

interface IProps {
  address: string;
  copyAddress: (val: string) => void;
  blockExplorer: string;
}

const Address = ({ address, copyAddress, blockExplorer }: IProps) => {
  return (
    <HtmlTooltip title={<Typography>{address}</Typography>} arrow placement={'right'} interactive>
      <Typography style={{ fontFamily: 'monospace', display: 'flex' }}>
        <InTextLink
          href={`${blockExplorer}/address/${address}`}
          text={address}
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '8vw',
            color: 'white',
            fontSize: '14px',
          }}
        />
        <CopyIcon style={{ zoom: 1.3, cursor: 'pointer' }} onClick={() => copyAddress(address)} />
      </Typography>
    </HtmlTooltip>
  );
};

export default Address;
