import { Contract, providers } from "ethers";
import { EthAddress, uint256, multiCall } from "./utils";
import marketAbi from "./abis/IMarket.json";
import IERC20Abi from "./abis/IERC20.json";
import syAbi from "./abis/IStandardizedYieldToken.json";
import BigNumber from "bignumber.js";
import { DataMarket, MarketInfo, UserInfo } from "./type";
import { CONFIG } from "./config";
import { getAddr } from "./addresses";

export class Market {
  chainId: number;
  provider: providers.JsonRpcProvider;
  router: EthAddress;

  constructor(url: string, chainId?: number) {
    const _chainId: number =
      typeof chainId === "undefined" ? CONFIG.chainId : chainId;
    this.provider = new providers.JsonRpcProvider(url);
    this.chainId = _chainId;
    this.router = getAddr("ROUTER_ADDRESS", _chainId);
  }

  async getDaysLeft(expiry: uint256, currentTimestamp: uint256) {
    const timeDiff = new BigNumber(expiry.toString()).minus(
      BigNumber(currentTimestamp)
    );
    const daysLeft = new BigNumber(
      Math.floor(timeDiff.toNumber() / (60 * 60 * 24))
    );
    return daysLeft.toString();
  }

  async getImpliedAPY(lastLnImpliedRate: uint256, daysLeft: uint256) {
    let lnImpliedRate = new BigNumber(lastLnImpliedRate.toString()).dividedBy(
      new BigNumber("1e18")
    );
    let expValue = new BigNumber(Math.exp(lnImpliedRate.toNumber()));
    let impliedAPY = expValue
      .minus(1)
      .multipliedBy(new BigNumber("1e18"))
      .integerValue(BigNumber.ROUND_FLOOR);

    const logYPlus1 =  new BigNumber(Math.log10(expValue.toNumber()));

    const exponent = new BigNumber(daysLeft).times(logYPlus1).dividedBy(365);
    
    const PtToAsset = new BigNumber((new BigNumber("1")).dividedBy(Math.pow(10, exponent.toNumber()))).multipliedBy(new BigNumber("1e18"));

    const YtToAsset = new BigNumber("1e18").minus(PtToAsset);
    return {
      impliedAPY: impliedAPY.toString(),
      PtToAsset: PtToAsset.toString(),
      YtToAsset: YtToAsset.toString(),
    }
    ;
  }

  async getMarketInfo(marketConfigList: { marketAddr: EthAddress }[]) {
    const currentBlock = await this.provider.getBlock("latest");
    const currentTimestamp = currentBlock.timestamp.toString();
    const marketAddresses = marketConfigList.map((config) => config.marketAddr);

    const states = await
      multiCall(
        marketAbi,
        marketAddresses.map((address) => ({
          address: address,
          name: "readState",
          params: [this.router],
        })),
        this.provider,
        this.chainId
      );
      // console.log(states[1][0]);
    const resultsMap: { [key: string]: DataMarket } = {};

    for (let i = 0; i < marketAddresses.length; ++i) {
      const state = states[i][0];
    
      
      const daysLeft = await this.getDaysLeft(state.expiry.toString(), currentTimestamp);
      const res = await this.getImpliedAPY(state.lastLnImpliedRate, daysLeft);
      const impliedAPY = res.impliedAPY;
      resultsMap[marketAddresses[i]] = {
        impliedAPY: res.impliedAPY,
        ptToAsset: res.PtToAsset,
        ytToAsset: res.YtToAsset,
      };
    }

    return resultsMap;
  }

}