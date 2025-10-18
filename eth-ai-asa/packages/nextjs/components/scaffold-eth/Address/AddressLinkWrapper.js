"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressLinkWrapper = void 0;
const link_1 = __importDefault(require("next/link"));
const chains_1 = require("viem/chains");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const AddressLinkWrapper = ({ children, disableAddressLink, blockExplorerAddressLink, }) => {
    const { targetNetwork } = (0, scaffold_eth_1.useTargetNetwork)();
    return disableAddressLink ? (<>{children}</>) : (<link_1.default href={blockExplorerAddressLink} target={targetNetwork.id === chains_1.hardhat.id ? undefined : "_blank"} rel={targetNetwork.id === chains_1.hardhat.id ? undefined : "noopener noreferrer"}>
      {children}
    </link_1.default>);
};
exports.AddressLinkWrapper = AddressLinkWrapper;
