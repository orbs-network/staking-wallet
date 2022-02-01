import React, { useMemo } from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { HtmlTooltip } from '../base/HtmlTooltip';
import { useMeasure } from 'react-use';
import { Typography } from '@material-ui/core';

interface IProps {
  tooltipTitle: string | Array<string | string[]>;
}

export const InfoToolTipIcon = React.memo<IProps>((props) => {
  const { tooltipTitle } = props;

  const title = useMemo(() => {
    if (Array.isArray(tooltipTitle)) {
      const titleTexts = [];
      for (const titleSection of tooltipTitle) {
        // DEV_NOTE : O.L : This is a quick hack to save dev time for the table columns info
        if (Array.isArray(titleSection)) {
          for (let i = 0; i < titleSection.length; i++) {
            const groupedText = titleSection[i];
            const isHeader = i % 2 === 0;
            titleTexts.push(
              <Typography style={isHeader ? { fontWeight: 'bold' } : {}} key={`text_${groupedText}`}>
                {groupedText}
              </Typography>,
            );
          }
        } else {
          titleTexts.push(<Typography key={`text_${titleSection}`}>{titleSection}</Typography>);
        }
        titleTexts.push(<br key={`br_${titleSection}`} />);
      }

      titleTexts.pop();

      return titleTexts;
    } else {
      return <Typography>{tooltipTitle}</Typography>;
    }
  }, [tooltipTitle]);

  return (
    <HtmlTooltip enterTouchDelay={0} leaveTouchDelay={4000} title={title} arrow interactive>
      <InfoIcon />
    </HtmlTooltip>
  );
});
