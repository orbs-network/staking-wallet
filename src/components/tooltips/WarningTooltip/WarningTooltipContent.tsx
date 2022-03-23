import React from 'react';
import { useStyles } from './styles';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

interface IProps {
  text: string;
  onClose: () => void;
}

function WarningTooltipContent({ text, onClose }: IProps) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <InfoIcon style={{ margin: 0, fontSize: 16 }} />
      <p className={classes.text}>{text}</p>
      <button className={classes.button} onClick={onClose}>
        <CloseIcon style={{ fontSize: 16 }} />
      </button>
    </div>
  );
}

export default WarningTooltipContent;
