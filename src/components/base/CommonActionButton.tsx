import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';

export const CommonActionButton = styled(({ variant, color, ...rest }: ButtonProps) => (
  <Button color={color ?? 'secondary'} variant={variant ?? 'contained'} {...rest} />
))<ButtonProps>(({ theme }) => {
  return {
    fontWeight: 'bold',
    height: '4em',
    // boxShadow: '0.15em 0.2em #469daf',
    border: '1px solid transparent',
    transitionDuration: '0.3s all',

    '&:hover': {
      border: '1px solid white',
      background: 'transparent',
      color: 'white',
    },
  };
});
