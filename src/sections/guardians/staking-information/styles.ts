import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
  image: {
    width: '20px',
    marginRight: 10,
  },
  tooltipContentBox: {
    marginBottom: 10,
    '&:last-of-type': {
      marginBottom: 0,
    },
  },
});

export default useStyles;
