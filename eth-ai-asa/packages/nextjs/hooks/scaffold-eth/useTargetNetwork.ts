import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */
export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const [mounted, setMounted] = useState(false);
  const { chain } = useAccount();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const newSelectedNetwork = scaffoldConfig.targetNetworks.find(targetNetwork => targetNetwork.id === chain?.id);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      setTargetNetwork({ ...newSelectedNetwork, ...NETWORKS_EXTRA_DATA[newSelectedNetwork.id] });
    }
  }, [chain?.id, setTargetNetwork, targetNetwork.id, mounted]);

  return useMemo(() => ({ targetNetwork }), [targetNetwork]);
}
