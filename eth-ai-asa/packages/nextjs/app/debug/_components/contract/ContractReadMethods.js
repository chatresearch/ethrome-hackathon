"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractReadMethods = void 0;
const contract_1 = require("~~/app/debug/_components/contract");
const ContractReadMethods = ({ deployedContractData }) => {
    if (!deployedContractData) {
        return null;
    }
    const functionsToDisplay = (deployedContractData.abi || []).filter(part => part.type === "function")
        .filter(fn => {
        const isQueryableWithParams = (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length > 0;
        return isQueryableWithParams;
    })
        .map(fn => {
        return {
            fn,
            inheritedFrom: deployedContractData?.inheritedFunctions?.[fn.name],
        };
    })
        .sort((a, b) => (b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1));
    if (!functionsToDisplay.length) {
        return <>No read methods</>;
    }
    return (<>
      {functionsToDisplay.map(({ fn, inheritedFrom }) => (<contract_1.ReadOnlyFunctionForm abi={deployedContractData.abi} contractAddress={deployedContractData.address} abiFunction={fn} key={fn.name} inheritedFrom={inheritedFrom}/>))}
    </>);
};
exports.ContractReadMethods = ContractReadMethods;
