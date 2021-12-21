import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as GlobeIcon } from '../../../../../assets/globe.svg';
import { getWebsiteAddress } from '../../util';

interface IProps {
  website: string;
  address: string;
}

const Website = ({ website, address }: IProps) => {
  return (
    <Tooltip arrow title={<Typography>{website}</Typography>}>
      <a
        data-testid={`guardian-${address}-website`}
        href={getWebsiteAddress(website)}
        target='_blank'
        rel='noopener noreferrer'
      >
        <SvgIcon component={GlobeIcon} />
      </a>
    </Tooltip>
  );
};

export default Website;
