import { BigNumber } from "bignumber.js";

export const BASE18 = BigNumber("1000000000000000000");
export const MAX_UINT256: string =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";
export const MAX_UINT128: string = "340282366920938463463374607431768211455";
export const zero_address: string =
  "0x0000000000000000000000000000000000000000";
export const euler_number = 2.718281828459045;

// Mainnet
// address to get underlying apy
export const marketList = [
  "0xf9f9779d8ff604732eba9ad345e6a27ef5c2a9d6", //eEth
  "0x875f154f4ec93255beaea9367c3adf71cdcb4cc0" //aUSDC
];

export const poolAddress = [
  "",
  "0x794a61358D6845594F94dc1DB02A252b5b4814aD"
];

export const tokenList = [
  "0x35751007a407ca6feffe80b3cb397736d2cf4dbe",
  "0x724dc807b04555b71ed48a6896b6f41593b8c637"
]

// Testnet
export const marketListTestnet = [
  "0x50b389f0D7d424ECf4AeA81EEb2F75D16d2C8CA8",
  "0xdd76f8C09673A531158f1Dd5c35F2674f994c9C2",
]