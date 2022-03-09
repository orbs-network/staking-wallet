import React, { forwardRef, ReactNode } from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
type Variants = 'success' | 'warning' | 'error' | 'info';

interface Props {
  children: ReactNode;
  variant: Variants;
  onClose: () => void;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
    borderRadius: '6px'
  },
  content: (props: any) => ({
    paddingLeft:10,
    display: 'flex',
    alignItems: 'center',
    color: props.styles.color,
    '& a': {
      color: props.styles.color,
    }
  }),
});

const styles = {
  warning: {
    color: '#E5962D',
    background: '#FEF6EB',
    icon: ErrorIcon
  },
  success: {
    color: '#43CE08',
    background: '#EFFAEA',
    icon: CheckCircleIcon
  },
  error: {
    color: '#FE5D6A',
    background: '#FFEFF0',
   
    icon: CancelIcon
  },
  info: {
    color: '#94939A',
    background: '#F4F4F6',
    icon: ErrorIcon
  },
  default: {
    color: '#E5962D',
    background: '#FEF6EB',
    icon: CheckCircleIcon
  },
};

const getStyles = (variant: Variants) => {
  return styles[variant] || styles.default;
};

const SnackbarContent = forwardRef(({ children, variant, onClose }: Props, ref: any) => {
  const styles = getStyles(variant);
  const classes = useStyles({ styles });
  const Icon = styles.icon
  return (
    <div className={classes.root} style={{ background: styles.background }} ref={ref}>
      <Icon style={{ color: styles.color }} />
      <div  className={classes.content} >
      {children}
      </div>
      <IconButton key='close' aria-label='close' color='inherit' onClick={onClose} style={{ color: styles.color }}>
        <CloseIcon />
      </IconButton>
    </div>
  );
});

export default SnackbarContent;
