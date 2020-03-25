/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import React from 'react';
import { ChangeLangLink } from '../../multi-lang/ChangeLangLink';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

const ButtonChangeLangLink = styled(ChangeLangLink)(({ theme }) => ({
  '&:hover': {
    opacity: 0.8,
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

const CountrySvgImg = styled('img')(({ theme }) => ({
  height: '1em',
  [theme.breakpoints.down('md')]: {
    height: '1.5em',
  },
}));

export const LanguagesSelector = React.memo((props) => {
  return (
    <Grid container alignItems={'center'} spacing={2}>
      <Grid item>
        <ButtonChangeLangLink lang='en'>
          <CountrySvgImg src='/assets/countryIcons/us.svg' />
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='jp'>
          <CountrySvgImg src='/assets/countryIcons/jp.svg' />
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='kr'>
          <CountrySvgImg src='/assets/countryIcons/kr.svg' />
        </ButtonChangeLangLink>
      </Grid>
    </Grid>
  );
});
