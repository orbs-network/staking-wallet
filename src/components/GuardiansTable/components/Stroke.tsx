import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'relative',
  },
  path: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate(0, -50%)',
    height: '1px',
    background: '#454545',
    width:'100%'
  },
  figure: {
    height: '7px',
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translate(0, -50%)',
    borderRadius: '100px',
    margin: 0,
    padding: 0
  },
});

interface Props {
  percent: number;
  color: string;
  style?: CSSProperties;
}

function Stroke({ percent, color, style = {} }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root} style={style}>
      <section className={classes.path} />
      <figure style={{ width: `${percent}%`, background: color }} className={classes.figure} />
    </div>
  );
}

export default Stroke;
