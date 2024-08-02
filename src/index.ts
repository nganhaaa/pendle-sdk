import { Router } from "./Router";
import { Market } from "./Market";
import { YieldToken } from "./YieldToken";
export { Router, Market, YieldToken };

/* Export types here */
import type {
    EthAddress,
    bytes32, bytes,
    uint256, uint160, uint128, uint80, uint64, uint24, uint16, uint8, int24,
} from "./utils";

import type {
    Config, Network, Networks,
    MarketData,
    DataMarket,
    MarketInfo,
    MarketState,
    UserInfo,
    Ratio,
} from "./type";

import {
    configure, getNetworkData, CONFIG, NETWORKS as networks,
} from './config';

import { listAddr as _listAddresses, getAddr } from './addresses';

export type {
    EthAddress,
    Config, Network, Networks,
    bytes32, bytes,
    uint256, uint160, uint128, uint80, uint64, uint24, uint16, uint8, int24,
    MarketData, 
    DataMarket,
    MarketState,
    MarketInfo,
    UserInfo,
    Ratio,
};

export {
    configure, 
    getNetworkData, CONFIG, networks,
    getAddr,
  };

export default {
    configure,
    getNetworkData,
    CONFIG,
    networks,
    getAddr,
};

