import { EthAddress, int256, uint256 } from "./utils";

export type ApproxParams = {
    guessMin: uint256,
    guessMax: uint256,
    guessOffchain: uint256, // pass 0 in to skip this variable
    maxIteration: uint256, // every iteration, the diff between guessMin and guessMax will be divided by 2
    eps: uint256, // the max eps between the returned result & the correct result, base 1e18. Normally this number will be set
    // to 1e15 (1e18/1000 = 0.1%)
}

export type MarketData = {
    name: string,
    symbol: string,
    doCacheIndex: boolean,
    expiry: number,
    scalarRoot: uint256,
    initialRateAnchor: uint256,
    SY: EthAddress,
    PT: EthAddress,
    YT: EthAddress,
};

// Define the type for the entire data vault
// export type DataMarket = {
//     [key: string]: MarketData;
// };

export type MarketState = {
    totalPt: int256, 
    totalSy: int256, 
    totalLp: int256, 
    treasury: EthAddress,
    scalarRoot: int256, 
    expiry: uint256,
    lnFeeRateRoot: uint256, 
    reserveFeePercent: uint256,
    lastLnImpliedRate: uint256, 
};

export type DataMarket = {
    impliedAPY: uint256,
    ptToAsset: uint256,
    ytToAsset: uint256,
}

export type MarketInfo = {
    name: string,
    asset: EthAddress,
    SY: EthAddress,
    PT: EthAddress,
    YT: EthAddress,
    totalPt: int256, 
    totalSy: int256, 
    totalLp: int256, 
    expiry: Date,
    daysLeft: uint256,
    ptFixedYield: uint256,
};

export type TokenAmount = {
    token: EthAddress,
    amount: uint256,
}

export type UserInfo = {
    syBalance: uint256,
    ptBalance: uint256,
    ytBalance: uint256,
    lpBalance: uint256,
}

export type Config = {
    chainId: number,
    testingMode: boolean,
    [key: string]: any,
};

export type Ratio = {
    Ratio0div1: string,
    Ratio1div0: string
};

export type Network = {
    chainId: number;
    chainName: string;
    blockExplorerUrls: Array<string>;
    iconUrls: Array<string>;
    rpcUrls: Array<string>;
    nativeCurrency: { name: string; decimals: number; symbol: string };
};

export type Networks = {
    arbSepolia: Network,
    bscTestnet2: Network,
    bscTestnet: Network,
    bscMainnet: Network,
    arbMainnet: Network
};


