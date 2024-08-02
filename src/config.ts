import Dec from 'decimal.js';
import { Config, Network, Networks } from './type';

Dec.set({
  rounding: Dec.ROUND_DOWN,
  toExpPos: 9e15,
  toExpNeg: -9e15,
  precision: 100,
});

/**
 *
 * @type {Networks}
 */
export const NETWORKS: Networks = {
  bscTestnet: {
    chainId: 97,
    chainName: 'Binance Smart Chain Testnet',
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
    iconUrls: [],
    rpcUrls: [],
    nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
  },
  bscTestnet2: {
    chainId: 98,
    chainName: 'Binance Smart Chain Testnet',
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
    iconUrls: [],
    rpcUrls: [],
    nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
  },
  bscMainnet: {
    chainId: 56,
    chainName: 'Binance Smart Chain Mainnet',
    blockExplorerUrls: ['https://bscscan.com/'],
    iconUrls: [],
    rpcUrls: [],
    nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
  },
  arbSepolia:{
    chainId:421614,
    chainName: 'Arbitrum Sepolia',
    blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
    iconUrls: [],
    rpcUrls: [],
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
  },
  arbMainnet:{
    chainId:42161,
    chainName: 'Arbitrum Mainnet',
    blockExplorerUrls: ['https://arbitrum-mainnet.infura.io/v3/9ef82335298241f28950f71f0ab0e573'],
    iconUrls: [],
    rpcUrls: [],
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
  }
};

/**
 *
 */
export const CONFIG: Config = {
  chainId: NETWORKS.arbMainnet.chainId,
  testingMode: false,
};

/**
 *
 * @param chainId
 */
export const getNetworkData = (chainId: number): Network => {
  const networkData: Network | undefined = Object.values(NETWORKS).find((network) => network.chainId === +chainId);

  if (!networkData) throw new Error(`Cannot find network data for chainId: ${chainId}`);

  return networkData;
};

/**
 *
 * @param config
 */
export const configure = (config: Config) => {
  if (!config || typeof config !== 'object') throw new Error('Object expected');

  const newKeys: Array<string> = Object.keys(config);

  newKeys.forEach((key) => {
    CONFIG[key as keyof Config] = config[key as keyof Config];
  });
};

export const MAX_UINT256: string = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"