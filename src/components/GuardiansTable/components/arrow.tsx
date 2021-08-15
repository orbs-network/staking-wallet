import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
const useStyles = makeStyles({
  arrow: {
    width: '12px',
    height: '12px',
    borderLeft: '2px solid white',
    borderBottom: '2px solid white',
    opacity: '0.8',
    position: 'absolute',
    transform: 'rotate(-45deg)',
    right: '8px',
  },
});

interface IProps {
  extraStyle?: CSSProperties;
}
const Arrow = ({ extraStyle = {} }: IProps) => {
  const classes = useStyles();
  return <div style={extraStyle} className={classes.arrow}></div>;
};

export default Arrow;
