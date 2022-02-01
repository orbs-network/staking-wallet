const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getSupportedChains = () => {
  try {
    return JSON.parse(process.env.TARGET_NETWORKS) || [];
  } catch (error) {
    return [];
  }
};
const getSortedChains = (selectedChain: number) => {
  const chains = getSupportedChains();
  const index = chains.findIndex((c: number) => c === selectedChain);
  chains.splice(index, 1);
  chains.unshift(selectedChain);
  return chains;
};

export { sleep, getSupportedChains, getSortedChains };
