import React from 'react';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { HtmlTooltip } from '../base/HtmlTooltip';

interface IProps {
  tooltipTitle: string;
}

export const InfoToolTipIcon = React.memo<IProps>((props) => {
  const { tooltipTitle } = props;

  return (
    <HtmlTooltip enterTouchDelay={50} leaveTouchDelay={4000} title={tooltipTitle} arrow interactive>
      <HelpOutlineIcon />
    </HtmlTooltip>
  );
});
