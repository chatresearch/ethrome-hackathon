"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInitializeNativeCurrencyPrice = void 0;
const react_1 = require("react");
const useTargetNetwork_1 = require("./useTargetNetwork");
const usehooks_ts_1 = require("usehooks-ts");
const scaffold_config_1 = __importDefault(require("~~/scaffold.config"));
const store_1 = require("~~/services/store/store");
const scaffold_eth_1 = require("~~/utils/scaffold-eth");
const enablePolling = false;
/**
 * Get the price of Native Currency based on Native Token/DAI trading pair from Uniswap SDK
 */
const useInitializeNativeCurrencyPrice = () => {
    const setNativeCurrencyPrice = (0, store_1.useGlobalState)(state => state.setNativeCurrencyPrice);
    const setIsNativeCurrencyFetching = (0, store_1.useGlobalState)(state => state.setIsNativeCurrencyFetching);
    const { targetNetwork } = (0, useTargetNetwork_1.useTargetNetwork)();
    const fetchPrice = (0, react_1.useCallback)(async () => {
        setIsNativeCurrencyFetching(true);
        const price = await (0, scaffold_eth_1.fetchPriceFromUniswap)(targetNetwork);
        setNativeCurrencyPrice(price);
        setIsNativeCurrencyFetching(false);
    }, [setIsNativeCurrencyFetching, setNativeCurrencyPrice, targetNetwork]);
    // Get the price of ETH from Uniswap on mount
    (0, react_1.useEffect)(() => {
        fetchPrice();
    }, [fetchPrice]);
    // Get the price of ETH from Uniswap at a given interval
    (0, usehooks_ts_1.useInterval)(fetchPrice, enablePolling ? scaffold_config_1.default.pollingInterval : null);
};
exports.useInitializeNativeCurrencyPrice = useInitializeNativeCurrencyPrice;
