import React, { useMemo } from 'react';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { HtmlTooltip } from '../base/HtmlTooltip';
import { useMeasure } from 'react-use';
import { Typography } from '@material-ui/core';

interface IProps {
  tooltipTitle: string | string[];
}

export const InfoToolTipIcon = React.memo<IProps>((props) => {
  const { tooltipTitle } = props;

  const title = useMemo(() => {
    if (Array.isArray(tooltipTitle)) {
      const titleTexts = [];
      for (const singleTitle of tooltipTitle) {
        titleTexts.push(<Typography key={`text_${singleTitle}`}>{singleTitle}</Typography>);
        titleTexts.push(<br key={`br_${singleTitle}`} />);
      }

      titleTexts.pop();

      return titleTexts;
    } else {
      return <Typography>{tooltipTitle}</Typography>;
    }
  }, [tooltipTitle]);

  return (
    <HtmlTooltip enterTouchDelay={0} leaveTouchDelay={4000} title={title} arrow interactive>
      <HelpOutlineIcon />
    </HtmlTooltip>
  );
});
