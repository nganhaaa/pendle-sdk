import { Contract, providers } from "ethers";
import { EthAddress, multiCall } from "./utils";
import yieldTokenAbi from "./abis/IYieldToken.json";
import syAbi from "./abis/IStandardizedYieldToken.json";
import BigNumber from "bignumber.js";
import { CONFIG } from "./config";

export class YieldToken {
  provider: providers.JsonRpcProvider;
  SY: EthAddress;
  chainId: number;

  constructor(
    provider: providers.JsonRpcProvider,
    syAddr: EthAddress,
    chainId?: number
  ) {
    this.provider = provider;
    this.SY = syAddr;
    const _chainId: number =
      typeof chainId === "undefined" ? CONFIG.chainId : chainId;
    this.chainId = _chainId;
  }

  async getUserRewardAndInterest(ytList: EthAddress[], userAddr: EthAddress) {
    let ytAddresses = new Array<EthAddress>();
    for (let i = 0; i < ytList.length; ++i) {
      ytAddresses.push(ytList[i]);
    }
// console.log(ytAddresses);

    let interests = await multiCall(
      yieldTokenAbi,
      ytAddresses.map((address: string, _: number) => ({
        address: address,
        name: "userInterest",
        params: [userAddr],
      })),
      this.provider,
      this.chainId
    );
// console.log(interests);

    let interestResults: { [key: string]: { index: string; accrued: string } } =
      {};
    for (let i = 0; i < ytAddresses.length; ++i) {
      interestResults[ytAddresses[i]] = {
        index: interests[i].index.toString(),
        accrued: interests[i].accrued.toString(),
      };
    }

    return interestResults;
  }

  async getCurrentIndex(ytAddr: EthAddress) {
    const contract = new Contract(ytAddr, yieldTokenAbi, this.provider);
    const syContract = new Contract(this.SY, syAbi, this.provider);
    let index = await contract.pyIndexStored();
    let rate = await syContract.exchangeRate();
    index = BigNumber.max(BigNumber(index), BigNumber(rate));
    return index;
  }
}
