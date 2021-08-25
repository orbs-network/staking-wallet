import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

interface IProps {
  children: React.ReactNode;
  preLangBasename: string;
}

const AppRouter = ({ children, preLangBasename }: IProps) => {
  return <Router basename={preLangBasename}>{children}</Router>;
};

export default AppRouter;
