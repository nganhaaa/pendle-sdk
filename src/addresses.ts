import { CONFIG, NETWORKS } from "./config";
import { toChecksumAddress } from "web3-utils";
import { EthAddress, zero_address } from "./utils";

export const listAddr = {
  [NETWORKS.arbSepolia.chainId]: {
    URL: "https://public.stackup.sh/api/v1/node/arbitrum-sepolia",
    PUBLIC_KEY: "0x595622cBd0Fc4727DF476a1172AdA30A9dDf8F43",
    WETH_ADDRESS: "0x6f933fB4cDD600056C6ec3cbcD20BcA519Fa261d",
    USDC_ADDRESS: "0x8d294256d858beAb208AdB60309AE04aEf99E93f",
    ARB_ADDRESS: "0xE6c7d5136Af78721Cf17d7B36e517e15f2608275",
    USDT_ADDRESS: zero_address,
    TREASURY_ADDRESS: "0x411ff9D19CBFf77a2a86b5B5d1957B43E31675ec",
    PENDLE_YIELD_CONTRACT_FACTORY_V2:"0x811afA15E8FE4C6a64c032aCF422E2871f18BA75",
    PENDLE_MARKET_FACTORY_V3: "0x0488a33536fA3A098C87c15509508288aAB0cfA9",
    ROUTER_ADDRESS: "0xF23ff397F5055d5656705A9B5C5B72154fE7E006",
    MULTI_CALL_ADDRESS: "0x69ad17ad18F54b4DFD2540b07D63a8d1F1492676",
  },
  [NETWORKS.arbMainnet.chainId]: {
    URL: "https://nd-410-727-823.p2pify.com/f34df17e953972ecd51eb26b3fc5583f",
    PUBLIC_KEY: "0x805d0d2ae6D777Be7C126bf75330F0E471D9D584",
    WETH_ADDRESS: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    USDC_ADDRESS: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    USDCE_ADDRESS: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    ARB_ADDRESS: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    WBTC_ADDRESS: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    USDT_ADDRESS: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    ROUTER_ADDRESS: "0x888888888889758F76e7103c6CbF23ABbF58F946",
    MULTI_CALL_ADDRESS: "0x12da044ff09d1B9C60B8847DC669E11CbBF5f8e5",
  },
};

/**
 *
 * @param name
 * @param chainId
 */
export const getAddr = (
  name: string,
  chainId: number = CONFIG.chainId
): EthAddress => {
  const _chainId: number =
    typeof chainId === "undefined" ? CONFIG.chainId : chainId;

  const actions = listAddr[_chainId];

  // skip this check if we're in testing mode
  if (!CONFIG.testingMode) {
    if (!actions)
      throw new Error(`Cannot find address for chainId: ${_chainId}.`);
    if (!actions[name as keyof typeof actions])
      throw new Error(
        `Cannot find address for name: ${name} (chainId: ${_chainId}).`
      );
  }

  return actions[name as keyof typeof actions]!;
};

export const convertHexStringToAddress = (
  hexString: EthAddress
): EthAddress => {
  String(hexString).toLowerCase();
  const strippedHex = hexString.replace(/^0x/, "");

  return toChecksumAddress(`0x${strippedHex}`);
};
