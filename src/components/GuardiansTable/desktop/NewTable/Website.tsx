import React from 'react';
import { Typography } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import { getWebsiteAddress } from '../../util';
import { HtmlTooltip } from '../../../base/HtmlTooltip';

interface IProps {
  website: string;
  address: string;
  linkImage?: any;
}

const Website = ({ website, address, linkImage: LinkImage }: IProps) => {
  return (
    <HtmlTooltip placement='bottom' arrow title={<Typography style={{ fontSize: 14 }}>{website}</Typography>}>
      <a
        data-testid={`guardian-${address}-website`}
        href={getWebsiteAddress(website)}
        target='_blank'
        rel='noopener noreferrer'
      >
        <SvgIcon style={{ zoom: 1.4 }} component={LinkImage} />
      </a>
    </HtmlTooltip>
  );
};

export default Website;
