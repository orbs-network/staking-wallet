import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  container: {
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
    fontSize: 18,
    fontWeight: 600,
  },
});

export default useStyles;
