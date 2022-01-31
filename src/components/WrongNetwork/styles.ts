import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
  containerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    flexDirection: 'column',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnsContainer: {
    marginTop: 30,
    display: 'flex',
  },
  networkBtn: {
    marginRight: 20,
    '&:last-child': {
      marginRight: 0,
    },
  },
  title: {
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 500,
    textAlign: 'center',
  },
  icon: {
    fontSize: 60,
  },
  text: {
    marginTop: 10,
    fontSize: 15,
    textAlign: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    background: 'black',
    opacity: '0.9',
  },
});

export { useStyles };
