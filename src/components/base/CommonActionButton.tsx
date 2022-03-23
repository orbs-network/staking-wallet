import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';

export const CommonActionButton = styled(({ variant, color, ...rest }: ButtonProps) => (
  <Button  variant={variant ?? 'contained'} {...rest} />
))<ButtonProps>(({ theme }) => {
  return {
    fontWeight: 'bold',
    height: '4em',
    border: '1px solid transparent',
    transitionDuration: '0.3s all',
    background: theme.chain.current.actionButtonBackground,
    color: theme.chain.current.textColor,
    '&:hover': {
      border: '1px solid white',
      background: 'transparent',
      color: 'white',
    },
  };
});
