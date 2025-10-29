import { useState, useEffect } from 'react';


const PING_TARGET_URL = '';
const TIMEOUT = 1500; 

const useNetworkDetection = () => {
  const [isInternalNetwork, setIsInternalNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;


    const timeoutId = setTimeout(() => {
      controller.abort();
    }, TIMEOUT);

    fetch(PING_TARGET_URL, { signal })
      .then(response => {

        clearTimeout(timeoutId);
        setIsInternalNetwork(true);
      })
      .catch(error => {

        clearTimeout(timeoutId);
        setIsInternalNetwork(false);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Função de limpeza
    return () => clearTimeout(timeoutId);
  }, []);

  return { isInternalNetwork, isLoading };
};

export default useNetworkDetection;