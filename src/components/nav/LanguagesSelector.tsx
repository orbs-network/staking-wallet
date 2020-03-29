/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import React from 'react';
import { ChangeLangLink } from '../../multi-lang/ChangeLangLink';
import { ReactComponent as UsCountryIconSvg } from '../../../assets/countryIcons/us.svg';
import { ReactComponent as JpCountryIconSvg } from '../../../assets/countryIcons/jp.svg';
import { ReactComponent as KrCountryIconSvg } from '../../../assets/countryIcons/kr.svg';
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

const StyledUsCountryIconSvg = styled(UsCountryIconSvg)(({ theme }) => ({
  height: '1.25em',
  [theme.breakpoints.down('md')]: {
    height: '1.5em',
  },
}));

const StyledJpCountryIconSvg = styled(JpCountryIconSvg)(({ theme }) => ({
  height: '1.25em',
  [theme.breakpoints.down('md')]: {
    height: '1.5em',
  },
}));

const StyledKrCountryIconSvg = styled(KrCountryIconSvg)(({ theme }) => ({
  height: '1.25em',
  [theme.breakpoints.down('md')]: {
    height: '1.5em',
  },
}));

export const LanguagesSelector = React.memo((props) => {
  return (
    <Grid container alignItems={'center'} justify={'flex-end'} spacing={2}>
      <Grid item>
        <ButtonChangeLangLink lang='en'>
          <StyledUsCountryIconSvg />
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='jp'>
          <StyledJpCountryIconSvg />
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='kr'>
          <StyledKrCountryIconSvg />
        </ButtonChangeLangLink>
      </Grid>
    </Grid>
  );
});
