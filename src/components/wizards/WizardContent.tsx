import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';

export const WizardContent = styled((props) => (
  <Grid container direction={'column'} alignItems={'center'} justify={'space-between'} spacing={2} {...props} />
))(() => ({
  // Makes the content wrapping box appear in the center (regardless of used width)
  alignSelf: 'center',
}));
