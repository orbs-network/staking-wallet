import Button, { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import { Link } from 'react-router-dom';

interface IProps {
  to: string;
  color: string;
}
export const LinkButton: React.FunctionComponent<IProps & ButtonProps> = ({ to, children, ...rest }) => {
  const renderLink: any = React.useMemo(
    () => React.forwardRef<HTMLAnchorElement>((linkProps, ref) => <Link to={to} {...linkProps} innerRef={ref} />),
    [to],
  );

  return (
    <Button component={renderLink} {...rest}>
      {children}
    </Button>
  );
};
