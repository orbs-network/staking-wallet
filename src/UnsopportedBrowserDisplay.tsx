import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { ReactComponent as TetraLogoAndIconSvg } from '../assets/logos/tetra_logo_with_icon.svg';

const CenteredDiv = styled('div')({
  margin: 0,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -75%)',
  textAlign: 'center',
});

export const UnsopportedBrowserDisplay = () => {
  return (
    <CenteredDiv>
      <TetraLogoAndIconSvg/>
      <br />
      <br />
      <Typography style={{ color: '#03FCF5' }}>
        Hey, it's great to see you here :)
        <br />
        <br/>
        It seems that you are using an unsupported browser...
        <br />
        <br/>
        Try browsing from a <b>non-mobile</b> browser with the metamask extension installed
      </Typography>
    </CenteredDiv>
  );
};
