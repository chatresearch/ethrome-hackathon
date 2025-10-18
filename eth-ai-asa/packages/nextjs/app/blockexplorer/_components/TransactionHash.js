"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHash = void 0;
const link_1 = __importDefault(require("next/link"));
const outline_1 = require("@heroicons/react/24/outline");
const useCopyToClipboard_1 = require("~~/hooks/scaffold-eth/useCopyToClipboard");
const TransactionHash = ({ hash }) => {
    const { copyToClipboard: copyAddressToClipboard, isCopiedToClipboard: isAddressCopiedToClipboard } = (0, useCopyToClipboard_1.useCopyToClipboard)();
    return (<div className="flex items-center">
      <link_1.default href={`/blockexplorer/transaction/${hash}`}>
        {hash?.substring(0, 6)}...{hash?.substring(hash.length - 4)}
      </link_1.default>
      {isAddressCopiedToClipboard ? (<outline_1.CheckCircleIcon className="ml-1.5 text-xl font-normal text-base-content h-5 w-5 cursor-pointer" aria-hidden="true"/>) : (<outline_1.DocumentDuplicateIcon className="ml-1.5 text-xl font-normal h-5 w-5 cursor-pointer" aria-hidden="true" onClick={() => copyAddressToClipboard(hash)}/>)}
    </div>);
};
exports.TransactionHash = TransactionHash;
