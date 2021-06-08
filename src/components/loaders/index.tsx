import React, { CSSProperties } from 'react';
import { makeStyles } from '@material-ui/core/styles';

export const useLoaderStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
  },
  base: {
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
  },
  overlay: {
    background: 'rgba(255,255,255, 0.5)',
  },
  absolute: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px',
  },
  children: {
    opacity: 0,
  },
}));

interface IProps {
  style?: CSSProperties;
  children: JSX.Element;
  isLoading?: boolean;
  hideContent?: boolean;
  customLoader?: JSX.Element;
}
interface ILoader {
  style?: CSSProperties;
  classes: any;
}

const Loader = ({ classes, style }: ILoader) => {
  return (
    <div className={`${classes.base} ${classes.absolute}`} style={style}>
      <section className={`${classes.absolute} ${classes.overlay}`}></section>
    </div>
  );
};

const BaseLoader = ({ style, children, isLoading, hideContent, customLoader }: IProps) => {
  const classes = useLoaderStyles();

  return (
    <div className={classes.wrapper}>
      {hideContent && isLoading ? null : <div className={isLoading ? classes.children : ''}>{children}</div>}
      {isLoading && (customLoader ? customLoader : <Loader style={style} classes={classes} />)}
    </div>
  );
};

export default BaseLoader;
