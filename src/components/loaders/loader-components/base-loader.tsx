import React from 'react';
import { IBaseLoader } from '../types';
import { useLoaderStyles } from '../styles';

const BaseLoader = ({ style }: IBaseLoader) => {
  const classes = useLoaderStyles();
  return (
    <div className={`${classes.base} ${classes.absolute}`} style={style}>
      <section className={`${classes.absolute} ${classes.overlay}`}></section>
    </div>
  );
};

export default BaseLoader;
