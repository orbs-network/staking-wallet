import { Typography } from '@material-ui/core';
import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

interface IProps {
  text: string;
  to: string;
}

export const DrawerLinkItem: React.FunctionComponent<IProps> = ({ text, to, ...rest }) => {
  const location = useLocation();
  return (
    <Typography {...rest}>
      <Link to={to}>{text}</Link>
    </Typography>
  );
};
