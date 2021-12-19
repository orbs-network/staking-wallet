import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  item: {
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: 14,
    width: 22,
    height: 22,
    objectFit: 'contain',
  },
  name: {
    textTransform: 'none',
  },
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: 20,
  },
});

export default useStyles;
