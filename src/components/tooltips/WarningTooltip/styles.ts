import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  container: {
    display: 'flex',
    background: '#FE3B30',
    alignItems: 'center',
    margin: 0,
    borderRadius: 5,
    paddingLeft: 10,
    height: 'auto',
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    background: 'transparent',
    marginLeft: 10,
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  text: {
    fontSize: 12,
    margin: 0,
    paddingLeft: 10,
    fontWeight: 500,
  },
});
