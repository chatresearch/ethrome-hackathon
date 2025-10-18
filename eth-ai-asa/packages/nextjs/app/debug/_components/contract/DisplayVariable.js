"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayVariable = void 0;
const react_1 = require("react");
const InheritanceTooltip_1 = require("./InheritanceTooltip");
const utilsDisplay_1 = require("./utilsDisplay");
const wagmi_1 = require("wagmi");
const outline_1 = require("@heroicons/react/24/outline");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const useTargetNetwork_1 = require("~~/hooks/scaffold-eth/useTargetNetwork");
const scaffold_eth_2 = require("~~/utils/scaffold-eth");
const DisplayVariable = ({ contractAddress, abiFunction, refreshDisplayVariables, abi, inheritedFrom, }) => {
    const { targetNetwork } = (0, useTargetNetwork_1.useTargetNetwork)();
    const { data: result, isFetching, refetch, error, } = (0, wagmi_1.useReadContract)({
        address: contractAddress,
        functionName: abiFunction.name,
        abi: abi,
        chainId: targetNetwork.id,
        query: {
            retry: false,
        },
    });
    const { showAnimation } = (0, scaffold_eth_1.useAnimationConfig)(result);
    (0, react_1.useEffect)(() => {
        refetch();
    }, [refetch, refreshDisplayVariables]);
    (0, react_1.useEffect)(() => {
        if (error) {
            const parsedError = (0, scaffold_eth_2.getParsedError)(error);
            scaffold_eth_2.notification.error(parsedError);
        }
    }, [error]);
    return (<div className="space-y-1 pb-2">
      <div className="flex items-center">
        <h3 className="font-medium text-lg mb-0 break-all">{abiFunction.name}</h3>
        <button className="btn btn-ghost btn-xs" onClick={async () => await refetch()}>
          {isFetching ? (<span className="loading loading-spinner loading-xs"></span>) : (<outline_1.ArrowPathIcon className="h-3 w-3 cursor-pointer" aria-hidden="true"/>)}
        </button>
        <InheritanceTooltip_1.InheritanceTooltip inheritedFrom={inheritedFrom}/>
      </div>
      <div className="text-base-content/80 flex flex-col items-start">
        <div>
          <div className={`break-all block transition bg-transparent ${showAnimation ? "bg-warning rounded-xs animate-pulse-fast" : ""}`}>
            {(0, utilsDisplay_1.displayTxResult)(result)}
          </div>
        </div>
      </div>
    </div>);
};
exports.DisplayVariable = DisplayVariable;
