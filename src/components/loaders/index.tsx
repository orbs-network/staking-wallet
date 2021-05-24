import React, { CSSProperties, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaselineProps } from '@material-ui/core';

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
  children: any;
  isLoading?: boolean;
  hideContent?: boolean;
}

const hiddenContent = (children, isLoading, classes, style) => {
  if (isLoading) {
    return (
      <div className={`${classes.base}`} style={style}>
        <section className={`${classes.absolute} ${classes.overlay}`}></section>
      </div>
    );
  }
  return children;
};

export const BaseLoader = ({ style, children, isLoading, hideContent }: IProps) => {
  const classes = useLoaderStyles();
  if (hideContent) {
    return hiddenContent(children, isLoading, classes, style);
  }

  return (
    <div className={classes.wrapper}>
      <div className={isLoading ? classes.children : ''}>{children}</div>
      {isLoading && (
        <div className={`${classes.base} ${classes.absolute}`} style={style}>
          <section className={`${classes.absolute} ${classes.overlay}`}></section>
        </div>
      )}
    </div>
  );
};
