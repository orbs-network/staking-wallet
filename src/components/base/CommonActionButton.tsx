import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

export const CommonActionButton = styled((props: ButtonProps) => (
  <Box>
    <Button color={'secondary'} variant={'contained'} {...props} />
  </Box>
))(({ theme }) => {
  return {
    fontWeight: 'bold',
  };
});
