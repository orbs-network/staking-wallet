import makeStyles from '@material-ui/core/styles/makeStyles';

export const useNetworkIndicatorStyles = makeStyles({
  devContainer: {
    padding: '10px 20px 10px 20px',
    color: 'white',
    background: '#388e3c',
    borderRadius: '4px',
    fontSize: '16px',
    zIndex: 9999,
    fontWeight: 600,
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translate(-50%)',
  },
  prodContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
  prodContainerContent: {
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
    opacity: '0.7',
  },
});
