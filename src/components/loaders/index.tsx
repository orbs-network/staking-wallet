import React from 'react';
import { useLoaderStyles } from './styles';
import { IContainerProps } from './types';
import Loaders from './loader-components/index';

const BaseLoader = ({ style, children, isLoading, hideContent, LoaderComponent = Loaders.Base }: IContainerProps) => {
  const classes = useLoaderStyles();

  return isLoading ? (
    <div className={classes.wrapper}>
      {hideContent ? null : <div className={isLoading ? classes.children : ''}>{children}</div>}
      <LoaderComponent style={style} />
    </div>
  ) : (
    children
  );
};

export default BaseLoader;
