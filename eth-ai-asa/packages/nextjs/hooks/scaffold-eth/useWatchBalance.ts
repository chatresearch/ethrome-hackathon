import { useEffect, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useQueryClient } from "@tanstack/react-query";
import { UseBalanceParameters, useBalance, useBlockNumber } from "wagmi";

/**
 * Wrapper around wagmi's useBalance hook. Updates data on every block change.
 */
export const useWatchBalance = (useBalanceParameters: UseBalanceParameters) => {
  const [mounted, setMounted] = useState(false);
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });
  const { queryKey, ...restUseBalanceReturn } = useBalance(useBalanceParameters);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, mounted]);

  return restUseBalanceReturn;
};
