import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

export default (isConnected?: boolean) => {
  const history = useHistory();

  const [connected, setConnected] = useState<boolean>(false);
  useEffect(() => {
    if (!isConnected && connected) {
      return window.location.reload();
    }
    setConnected(isConnected);
  }, [connected, history, isConnected]);
};
