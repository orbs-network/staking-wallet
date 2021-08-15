import React, { CSSProperties } from 'react';
import ErrorComponents from './error-components/index';
import useErrorStyles from './styles';

interface IProps {
  style?: CSSProperties;
  children: JSX.Element;
  isError?: boolean;
  errorText: string;
  ErrorComponent?: any;
}

const ErrorFallback = ({ children, isError, errorText, ErrorComponent = ErrorComponents.Base }: IProps) => {
  const classes = useErrorStyles();

  return isError ? (
    <div className={classes.errorWrapper}>
      <ErrorComponent errorText={errorText} />
    </div>
  ) : (
    children
  );
};

export default ErrorFallback;
