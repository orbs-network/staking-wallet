import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';

export const WizardContent = styled(props => (
  <Grid
    container
    direction={'column'}
    alignItems={'center'}
    justify={'space-between'}
    item
    xs={11}
    sm={11}
    md={10}
    lg={9}
    xl={8}
    {...props}
  />
))({});
