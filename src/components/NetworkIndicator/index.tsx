import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import useStyles from './styles';
import config from '../../config';
import NetworkItem from './NetworkItem';
import { useHistory } from 'react-router';
import { removeQueryParam } from '../../utils/url';
import { NETWORK_QUERY_PARAM } from '../../constants';
import { getSupportedChains } from '../../utils';
import web3Service from '../../services/web3Service';
import { HtmlTooltip } from '../base/HtmlTooltip';
import { useCommonsTranslations } from '../../translations/translationsHooks';

interface IProps {
  chainId: string;
}

const ChainIndicator = ({ chainId }: IProps) => {
  const history = useHistory();
  const supportedNetworks = getSupportedChains();
  const commonsTranslations = useCommonsTranslations();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const selectedNetwork = config.networks[chainId];
  if (!selectedNetwork) {
    return null;
  }

  const onNetworkSelect = (e: any, id: number) => {
    handleClose(e);
    const network = config.networks[id];
    if (!network) {
      return;
    }
    const onSuccessfullyChainChanged = () => {
      removeQueryParam(NETWORK_QUERY_PARAM, history, location.search);
    };

    const { name: chainName, nativeCurrency, rpcUrls, blockExplorerUrls } = network;
    web3Service.triggerNetworkChange(
      id,
      { chainName, nativeCurrency, rpcUrls, blockExplorerUrls },
      onSuccessfullyChainChanged,
    );
  };

  return (
    <div className={classes.root}>
      <div>
        <HtmlTooltip title={<p className={classes.tooltipText}>{commonsTranslations('networkSelectHoverText')}</p>}>
          <Button
            className={classes.selector}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
            onClick={handleToggle}
          >
            <NetworkItem img={selectedNetwork.logo} name={selectedNetwork.name} />
          </Button>
        </HtmlTooltip>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id='menu-list-grow' onKeyDown={handleListKeyDown}>
                    {supportedNetworks
                      .filter((n) => n !== Number(chainId))
                      .map((id, index) => {
                        const network = config.networks[id];
                        if (!network) {
                          return null;
                        }
                        return (
                          <MenuItem onClick={(e) => onNetworkSelect(e, id)} key={index}>
                            <NetworkItem img={network.logo} name={network.name} />
                          </MenuItem>
                        );
                      })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

export default ChainIndicator;
