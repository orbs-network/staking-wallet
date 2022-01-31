import { MobXProviderContext } from 'mobx-react';
import { useContext, useEffect, useState } from 'react';
import web3Service from '../../services/Web3Service';

const useNetwork = (): { chain: number | undefined; noProvider: boolean } => {
  const [chain, setChain] = useState<number | undefined>(undefined);
  const [noProvider, setNoProvider] = useState<boolean>(false);
  const context = useContext(MobXProviderContext);
  console.log(context)
  // useEffect(() => {
  //   const handleChain = async () => {
  //     if (chain) {
  //       setSelectedChain(chain);
  //       const networkAddresses = await getAddresses(chain);
  //       if (networkAddresses) {
  //         setAddresses(networkAddresses);
  //       }
  //       setIsLoading(false);
  //     }
  //     if (noProvider) {
  //       setIsLoading(false);
  //     }
  //   };
  //   handleChain();
  // }, [chain, forcedChain, noProvider]);

  useEffect(() => {
    const getChain = async () => {
      try {
        // const result = await web3Service.getChainId();
        // setChain(result);
      } catch (error) {}
    };
    getChain()
  }, []);
  return { chain, noProvider };
};

export default useNetwork;
