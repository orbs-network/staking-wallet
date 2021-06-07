import { Grid } from '@material-ui/core';
import styled from 'styled-components';

export const LoaderFigure = styled(Grid)(({ theme }) => ({
  // backgroundColor: 'rgba(33,33, 33, 0.55)',
  backgroundColor: 'rgba(255, 255, 255, 0.35)',
  height: '18px',
  width: '100%',
  borderRadius: '10px',
}));
