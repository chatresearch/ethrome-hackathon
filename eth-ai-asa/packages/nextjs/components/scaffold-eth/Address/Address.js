"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const AddressCopyIcon_1 = require("./AddressCopyIcon");
const AddressLinkWrapper_1 = require("./AddressLinkWrapper");
const viem_1 = require("viem");
const ens_1 = require("viem/ens");
const wagmi_1 = require("wagmi");
const scaffold_eth_1 = require("~~/components/scaffold-eth");
const useTargetNetwork_1 = require("~~/hooks/scaffold-eth/useTargetNetwork");
const scaffold_eth_2 = require("~~/utils/scaffold-eth");
const textSizeMap = {
    "3xs": "text-[10px]",
    "2xs": "text-[11px]",
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
};
const blockieSizeMap = {
    "3xs": 4,
    "2xs": 5,
    xs: 6,
    sm: 7,
    base: 8,
    lg: 9,
    xl: 10,
    "2xl": 12,
    "3xl": 15,
    "4xl": 17,
    "5xl": 19,
    "6xl": 21,
    "7xl": 23,
};
const copyIconSizeMap = {
    "3xs": "h-2.5 w-2.5",
    "2xs": "h-3 w-3",
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    base: "h-[18px] w-[18px]",
    lg: "h-5 w-5",
    xl: "h-[22px] w-[22px]",
    "2xl": "h-6 w-6",
    "3xl": "h-[26px] w-[26px]",
    "4xl": "h-7 w-7",
};
const getNextSize = (sizeMap, currentSize, step = 1) => {
    const sizes = Object.keys(sizeMap);
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = Math.min(currentIndex + step, sizes.length - 1);
    return sizes[nextIndex];
};
const getPrevSize = (sizeMap, currentSize, step = 1) => {
    const sizes = Object.keys(sizeMap);
    const currentIndex = sizes.indexOf(currentSize);
    const prevIndex = Math.max(currentIndex - step, 0);
    return sizes[prevIndex];
};
const Address = ({ address, disableAddressLink, format, size = "base", onlyEnsOrAddress = false, }) => {
    const checkSumAddress = address ? (0, viem_1.getAddress)(address) : undefined;
    const { targetNetwork } = (0, useTargetNetwork_1.useTargetNetwork)();
    const { data: ens, isLoading: isEnsNameLoading } = (0, wagmi_1.useEnsName)({
        address: checkSumAddress,
        chainId: 1,
        query: {
            enabled: (0, viem_1.isAddress)(checkSumAddress ?? ""),
        },
    });
    const { data: ensAvatar } = (0, wagmi_1.useEnsAvatar)({
        name: ens ? (0, ens_1.normalize)(ens) : undefined,
        chainId: 1,
        query: {
            enabled: Boolean(ens),
            gcTime: 30000,
        },
    });
    const shortAddress = checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4);
    const displayAddress = format === "long" ? checkSumAddress : shortAddress;
    const displayEnsOrAddress = ens || displayAddress;
    const showSkeleton = !checkSumAddress || (!onlyEnsOrAddress && (ens || isEnsNameLoading));
    const addressSize = showSkeleton && !onlyEnsOrAddress ? getPrevSize(textSizeMap, size, 2) : size;
    const ensSize = getNextSize(textSizeMap, addressSize);
    const blockieSize = showSkeleton && !onlyEnsOrAddress ? getNextSize(blockieSizeMap, addressSize, 4) : addressSize;
    if (!checkSumAddress) {
        return (<div className="flex items-center">
        <div className="shrink-0 skeleton rounded-full" style={{
                width: (blockieSizeMap[blockieSize] * 24) / blockieSizeMap["base"],
                height: (blockieSizeMap[blockieSize] * 24) / blockieSizeMap["base"],
            }}></div>
        <div className="flex flex-col space-y-1">
          {!onlyEnsOrAddress && (<div className={`ml-1.5 skeleton rounded-lg font-bold ${textSizeMap[ensSize]}`}>
              <span className="invisible">0x1234...56789</span>
            </div>)}
          <div className={`ml-1.5 skeleton rounded-lg ${textSizeMap[addressSize]}`}>
            <span className="invisible">0x1234...56789</span>
          </div>
        </div>
      </div>);
    }
    if (!(0, viem_1.isAddress)(checkSumAddress)) {
        return <span className="text-error">Wrong address</span>;
    }
    const blockExplorerAddressLink = (0, scaffold_eth_2.getBlockExplorerAddressLink)(targetNetwork, checkSumAddress);
    return (<div className="flex items-center shrink-0">
      <div className="shrink-0">
        <scaffold_eth_1.BlockieAvatar address={checkSumAddress} ensImage={ensAvatar} size={(blockieSizeMap[blockieSize] * 24) / blockieSizeMap["base"]}/>
      </div>
      <div className="flex flex-col">
        {showSkeleton &&
            (isEnsNameLoading ? (<div className={`ml-1.5 skeleton rounded-lg font-bold ${textSizeMap[ensSize]}`}>
              <span className="invisible">{shortAddress}</span>
            </div>) : (<span className={`ml-1.5 ${textSizeMap[ensSize]} font-bold`}>
              <AddressLinkWrapper_1.AddressLinkWrapper disableAddressLink={disableAddressLink} blockExplorerAddressLink={blockExplorerAddressLink}>
                {ens}
              </AddressLinkWrapper_1.AddressLinkWrapper>
            </span>))}
        <div className="flex">
          <span className={`ml-1.5 ${textSizeMap[addressSize]} font-normal`}>
            <AddressLinkWrapper_1.AddressLinkWrapper disableAddressLink={disableAddressLink} blockExplorerAddressLink={blockExplorerAddressLink}>
              {onlyEnsOrAddress ? displayEnsOrAddress : displayAddress}
            </AddressLinkWrapper_1.AddressLinkWrapper>
          </span>
          <AddressCopyIcon_1.AddressCopyIcon className={`ml-1 ${copyIconSizeMap[addressSize]} cursor-pointer`} address={checkSumAddress}/>
        </div>
      </div>
    </div>);
};
exports.Address = Address;
