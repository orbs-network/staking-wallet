import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import useStyles from './styles';
import config from '../../../config';
import NetworkItem from './NetworkItem';
import { useHistory } from 'react-router';
import InfoIcon from '@material-ui/icons/Info';
import { removeQueryParam } from '../../utils/url';
import { NETWORK_QUERY_PARAM } from '../../constants';
import { getSupportedChains } from '../../utils';
import web3Service from '../../services/web3Service';
import { HtmlTooltip } from '../base/HtmlTooltip';
import { useCommonsTranslations } from '../../translations/translationsHooks';
import styled from 'styled-components';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { InfoToolTipIcon } from '../tooltips/InfoTooltipIcon';
import useWeb3 from '../../hooks/useWeb3';
import { useCryptoWalletIntegrationStore } from '../../store/storeHooks';
import { observer } from 'mobx-react';
interface IProps {
  chainId: string;
}

const StyledButton = styled(Button)({
  border: '0.5px solid #FFFFFF',
  borderRadius: 0,
  background: 'transparent',
});

const ChainIndicator = observer(({ chainId }: IProps) => {
  const history = useHistory();
  const supportedNetworks = getSupportedChains();
  const commonsTranslations = useCommonsTranslations();
  const { isConnectedToWallet } = useCryptoWalletIntegrationStore();

  const { forceChainChange } = useWeb3();
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
    window.location.replace(`${window.location.pathname}?${NETWORK_QUERY_PARAM}=${id}`)
  };



  return (
    <div className={classes.root}>
      <>
        <StyledButton
          className={classes.selector}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
        >
          <NetworkItem img={selectedNetwork.logo} name={selectedNetwork.name} />
          <InfoToolTipIcon tooltipTitle={commonsTranslations('networkSelectHoverText')} />
          <ArrowDropDownIcon className={classes.selectorArrow} />
        </StyledButton>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          className={classes.container}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper style={{ width: '100%' }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    className={classes.list}
                    autoFocusItem={open}
                    id='menu-list-grow'
                    onKeyDown={handleListKeyDown}
                  >
                    {supportedNetworks
                      .filter((n) => n !== Number(chainId))
                      .map((id, index) => {
                        const network = config.networks[id];
                        if (!network) {
                          return null;
                        }
                        return (
                          <MenuItem onClick={(e) => onNetworkSelect(e, id)} key={index} className={classes.listItem}>
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
      </>
    </div>
  );
});

export default ChainIndicator;
