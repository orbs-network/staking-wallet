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
  // backgroundColor: 'rgba(47, 47, 47, 0.6)',
  padding: '2em',
  // border: '1px solid #03FCF5',
  boxShadow: `0px 0px 8px 4px #03FCF5`,
});

export const UnsopportedBrowserDisplay = () => {
  return (
    <CenteredDiv>
      <TetraLogoAndIconSvg/>
      <br />
      <br />
      <Typography style={{ color: '#03FCF5' }}>
        Hey! it's great to see you here :)
        <br />
        <br/>
        It seems that you are using an unsupported browser...
        <br />
        <br/>
        Try browsing from a <b>non-mobile</b> browser with the <a  style={{ color: 'inherit' }} href="https://metamask.io/" target={'_blank'} rel={'noopener noreferrer'}>Metamask</a> extension installed.
      </Typography>
    </CenteredDiv>
  );
};
