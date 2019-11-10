import Button from '@material-ui/core/Button';
import React from 'react';
import { Link } from 'react-router-dom';

interface IProps {
  to: string;
  color: string;
}
export const LinkButton: React.FunctionComponent<IProps> = ({ to, children }) => {
  const renderLink: any = React.useMemo(
    () => React.forwardRef((linkProps, ref) => <Link to={to} {...linkProps} innerRef={ref} />),
    [to],
  );

  return <Button component={renderLink}>{children}</Button>;
};
