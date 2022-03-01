import React, { useMemo } from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { HtmlTooltip } from '../base/HtmlTooltip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';

interface IProps {
  tooltipTitle: string | Array<string | string[]>;
}

const useStyles = makeStyles({
  text: {
    fontSize: '14px',
    lineHeight: '20px',
  },
});

export const InfoToolTipIcon = React.memo<IProps>((props) => {
  const { tooltipTitle } = props;
  const classes = useStyles();
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
              <Typography
                className={classes.text}
                style={isHeader ? { fontWeight: 'bold' } : {}}
                key={`text_${groupedText}`}
              >
                {groupedText}
              </Typography>,
            );
          }
        } else {
          titleTexts.push(
            <Typography className={classes.text} key={`text_${titleSection}`}>
              {titleSection}
            </Typography>,
          );
        }
        titleTexts.push(<br key={`br_${titleSection}`} />);
      }

      titleTexts.pop();

      return titleTexts;
    } else {
      return <Typography className={classes.text}>{tooltipTitle}</Typography>;
    }
  }, [classes.text, tooltipTitle]);

  return (
    <HtmlTooltip enterTouchDelay={0} leaveTouchDelay={4000} title={title} arrow interactive>
      <InfoIcon style={{ width: 14 }} />
    </HtmlTooltip>
  );
});
