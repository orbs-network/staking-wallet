import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';

export const MaxButton = styled(({ variant, color, disabled, ...rest }: ButtonProps) => (
  <Button
    color={color ?? 'secondary'}
    variant={variant ?? 'contained'}
    {...rest}
    style={{ opacity: disabled ? 0 : 1 }}
  />
))<ButtonProps>(({ theme }) => {
  return {
    fontWeight: 'bold',
    height: '4em',
    maxHeight: 30,
    marginLeft: 'auto',
    fontSize: 10,
    padding: 5,
    transitionDuration: '0.5s',
  };
});
