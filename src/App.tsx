import { Container } from '@material-ui/core';
import { observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './components/nav/Header';
import { MainAppPage } from './pages/MainAppPage';

const ContentContainer = styled(Container)(({ theme }) => {
  return {
    [theme.breakpoints.down('sm')]: {},
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
  };
});

export const App = observer(() => {
  return (
    <>
      <Header />
      <ContentContainer>
        <Switch>
          <Route exact path='/' component={MainAppPage} />
        </Switch>
      </ContentContainer>
    </>
  );
});
