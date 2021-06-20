import { CSSProperties } from 'react';
export interface IBaseLoader {
  style?: CSSProperties;
}

export interface IContainerProps {
  style?: CSSProperties;
  children: JSX.Element;
  isLoading?: boolean;
  hideContent?: boolean;
  LoaderComponent?: any;
}
