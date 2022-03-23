import { Grid, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { HtmlTooltip } from '../../../components/base/HtmlTooltip';
import useStyles from './styles';

interface IItemProps {
  title: string;
  value: string;
  tooltipContent?: ReactNode;
}

const InformationItem = ({ title, value, tooltipContent }: IItemProps) => {
  const classes = useStyles();
  const content = <Typography className={classes.text}>{`${title}: ${value}`}</Typography>;
  if (tooltipContent) {
    return (
      <HtmlTooltip title={tooltipContent} arrow placement='top'>
        <Grid item className={classes.flex}>
          {content}
        </Grid>
      </HtmlTooltip>
    );
  }
  return (
    <Grid item className={classes.flex}>
      {content}
    </Grid>
  );
};

export default InformationItem;
