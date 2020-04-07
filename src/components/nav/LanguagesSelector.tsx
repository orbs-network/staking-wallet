/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import React, { CSSProperties } from 'react';
import { ChangeLangLink } from '../../multi-lang/ChangeLangLink';
import { ReactComponent as UsCountryIconSvg } from '../../../assets/countryIcons/us.svg';
import { ReactComponent as JpCountryIconSvg } from '../../../assets/countryIcons/jp.svg';
import { ReactComponent as KrCountryIconSvg } from '../../../assets/countryIcons/kr.svg';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { Theme } from '@material-ui/core';

const ButtonChangeLangLink = styled(ChangeLangLink)(({ theme }) => ({
  '&:hover': {
    opacity: 0.8,
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

function buildStyleForCountryIcon({ theme }: { theme: Theme }): CSSProperties {
  return {
    height: '1.25em',
  };
}

// @ts-ignore
const StyledUsCountryIconSvg = styled(UsCountryIconSvg)(buildStyleForCountryIcon);
// @ts-ignore
const StyledJpCountryIconSvg = styled(JpCountryIconSvg)(buildStyleForCountryIcon);
// @ts-ignore
const StyledKrCountryIconSvg = styled(KrCountryIconSvg)(buildStyleForCountryIcon);

export const LanguagesSelector = React.memo((props) => {
  return (
    <Grid container alignItems={'center'} justify={'flex-end'} spacing={1}>
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
        <ButtonChangeLangLink lang='ko'>
          <StyledKrCountryIconSvg />
        </ButtonChangeLangLink>
      </Grid>
    </Grid>
  );
});
