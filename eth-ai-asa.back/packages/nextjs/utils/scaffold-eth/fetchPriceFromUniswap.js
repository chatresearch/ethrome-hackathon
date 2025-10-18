"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPriceFromUniswap = void 0;
const networks_1 = require("./networks");
const sdk_core_1 = require("@uniswap/sdk-core");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const alchemyHttpUrl = (0, networks_1.getAlchemyHttpUrl)(chains_1.mainnet.id);
const rpcFallbacks = alchemyHttpUrl ? [(0, viem_1.http)(alchemyHttpUrl), (0, viem_1.http)()] : [(0, viem_1.http)()];
const publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.mainnet,
    transport: (0, viem_1.fallback)(rpcFallbacks),
});
const ABI = (0, viem_1.parseAbi)([
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
]);
const fetchPriceFromUniswap = async (targetNetwork) => {
    if (targetNetwork.nativeCurrency.symbol !== "ETH" &&
        targetNetwork.nativeCurrency.symbol !== "SEP" &&
        !targetNetwork.nativeCurrencyTokenAddress) {
        return 0;
    }
    try {
        const DAI = new sdk_core_1.Token(1, "0x6B175474E89094C44Da98b954EedeAC495271d0F", 18);
        const TOKEN = new sdk_core_1.Token(1, targetNetwork.nativeCurrencyTokenAddress || "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 18);
        const pairAddress = v2_sdk_1.Pair.getAddress(TOKEN, DAI);
        const wagmiConfig = {
            address: pairAddress,
            abi: ABI,
        };
        const reserves = await publicClient.readContract({
            ...wagmiConfig,
            functionName: "getReserves",
        });
        const token0Address = await publicClient.readContract({
            ...wagmiConfig,
            functionName: "token0",
        });
        const token1Address = await publicClient.readContract({
            ...wagmiConfig,
            functionName: "token1",
        });
        const token0 = [TOKEN, DAI].find(token => token.address === token0Address);
        const token1 = [TOKEN, DAI].find(token => token.address === token1Address);
        const pair = new v2_sdk_1.Pair(sdk_core_1.CurrencyAmount.fromRawAmount(token0, reserves[0].toString()), sdk_core_1.CurrencyAmount.fromRawAmount(token1, reserves[1].toString()));
        const route = new v2_sdk_1.Route([pair], TOKEN, DAI);
        const price = parseFloat(route.midPrice.toSignificant(6));
        return price;
    }
    catch (error) {
        console.error(`useNativeCurrencyPrice - Error fetching ${targetNetwork.nativeCurrency.symbol} price from Uniswap: `, error);
        return 0;
    }
};
exports.fetchPriceFromUniswap = fetchPriceFromUniswap;
