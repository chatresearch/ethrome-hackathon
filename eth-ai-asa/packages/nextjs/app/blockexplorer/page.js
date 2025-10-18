"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const _components_1 = require("./_components");
const chains_1 = require("viem/chains");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const useTargetNetwork_1 = require("~~/hooks/scaffold-eth/useTargetNetwork");
const scaffold_eth_2 = require("~~/utils/scaffold-eth");
const BlockExplorer = () => {
    const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } = (0, scaffold_eth_1.useFetchBlocks)();
    const { targetNetwork } = (0, useTargetNetwork_1.useTargetNetwork)();
    const [isLocalNetwork, setIsLocalNetwork] = (0, react_1.useState)(true);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (targetNetwork.id !== chains_1.hardhat.id) {
            setIsLocalNetwork(false);
        }
    }, [targetNetwork.id]);
    (0, react_1.useEffect)(() => {
        if (targetNetwork.id === chains_1.hardhat.id && error) {
            setHasError(true);
        }
    }, [targetNetwork.id, error]);
    (0, react_1.useEffect)(() => {
        if (!isLocalNetwork) {
            scaffold_eth_2.notification.error(<>
          <p className="font-bold mt-0 mb-1">
            <code className="italic bg-base-300 text-base font-bold"> targetNetwork </code> is not localhost
          </p>
          <p className="m-0">
            - You are on <code className="italic bg-base-300 text-base font-bold">{targetNetwork.name}</code> .This
            block explorer is only for <code className="italic bg-base-300 text-base font-bold">localhost</code>.
          </p>
          <p className="mt-1 break-normal">
            - You can use{" "}
            <a className="text-accent" href={targetNetwork.blockExplorers?.default.url}>
              {targetNetwork.blockExplorers?.default.name}
            </a>{" "}
            instead
          </p>
        </>);
        }
    }, [
        isLocalNetwork,
        targetNetwork.blockExplorers?.default.name,
        targetNetwork.blockExplorers?.default.url,
        targetNetwork.name,
    ]);
    (0, react_1.useEffect)(() => {
        if (hasError) {
            scaffold_eth_2.notification.error(<>
          <p className="font-bold mt-0 mb-1">Cannot connect to local provider</p>
          <p className="m-0">
            - Did you forget to run <code className="italic bg-base-300 text-base font-bold">yarn chain</code> ?
          </p>
          <p className="mt-1 break-normal">
            - Or you can change <code className="italic bg-base-300 text-base font-bold">targetNetwork</code> in{" "}
            <code className="italic bg-base-300 text-base font-bold">scaffold.config.ts</code>
          </p>
        </>);
        }
    }, [hasError]);
    return (<div className="container mx-auto my-10">
      <_components_1.SearchBar />
      <_components_1.TransactionsTable blocks={blocks} transactionReceipts={transactionReceipts}/>
      <_components_1.PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage}/>
    </div>);
};
exports.default = BlockExplorer;
