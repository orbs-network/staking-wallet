import React from 'react';
import { Typography } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as WebsiteIcon } from '../../../../../assets/website.svg';
import { getWebsiteAddress } from '../../util';
import { HtmlTooltip } from '../../../base/HtmlTooltip';

interface IProps {
  website: string;
  address: string;
}

const Website = ({ website, address }: IProps) => {
  return (
    <HtmlTooltip placement='bottom' arrow title={<Typography>{website}</Typography>}>
      <a
        data-testid={`guardian-${address}-website`}
        href={getWebsiteAddress(website)}
        target='_blank'
        rel='noopener noreferrer'
      >
        <SvgIcon style={{ zoom: 1.4 }} component={WebsiteIcon} />
      </a>
    </HtmlTooltip>
  );
};

export default Website;
