import { Contract, providers } from "ethers";
import {
  EthAddress,
  uint256,
  MAX_UINT256,
} from "./utils";
import syAbi from "./abis/IStandardizedYieldToken.json";
import actionsAbi from "./abis/IAllAction.json";
import BigNumber from "bignumber.js";
import { ApproxParams, MarketInfo } from "./type";


export class Router {
  provider: providers.JsonRpcProvider;

  constructor(url: string) {
    this.provider = new providers.JsonRpcProvider(url);
  }

  /**********************************************************ADD LIQUIDITY*****************************************************/
  async previewAddLiquidityDualTokenPt(
    tokenIn: EthAddress, 
    state: MarketInfo,
    netTokenDesired?: uint256, 
    netPtDesired?: uint256,
  ) {
      const SY = new Contract(state.SY, syAbi, this.provider);
      const netSyInterm = netTokenDesired ? (await SY.previewDeposit(tokenIn, netTokenDesired)) : MAX_UINT256;
                  
      let res = await this.previewAddLiquidityDualSyPt(state, netSyInterm.toString(), netPtDesired);       
      const netTokenIn = netTokenDesired ? netTokenDesired : (await SY.previewRedeem(tokenIn, res.syUsed)).toString();
      return {
        lpToReserve: res.lpToReserve,
        lpToAccount: res.lpToAccount,
        tokenUsed: netTokenIn,
        ptUsed: res.ptUsed,
      };
  }

  async previewAddLiquidityDualSyPt(
    state: MarketInfo,
    netSyDesired?: uint256,
    netPtDesired?: uint256
  ) {
    netSyDesired = netSyDesired ?? MAX_UINT256;
    netPtDesired = netPtDesired ?? MAX_UINT256;
    const totalLp = BigNumber(state.totalLp.toString());
    const totalPt = BigNumber(state.totalPt.toString());
    const totalSy = BigNumber(state.totalSy.toString());
    let lpToReserve: uint256 = "0";
    let lpToAccount: uint256;
    let syUsed: uint256;
    let ptUsed: uint256;

    let netLpByPt = BigNumber(netPtDesired).multipliedBy(totalLp).dividedBy(totalPt);
    let netLpBySy = BigNumber(netSyDesired).multipliedBy(totalLp).dividedBy(totalSy);

    if (netLpByPt.lt(netLpBySy)) {
      lpToAccount = netLpByPt.toFixed(0);
      ptUsed = netPtDesired;
      syUsed = totalSy
        .multipliedBy(BigNumber(lpToAccount))
        .dividedBy(totalLp)
        .toFixed(0);
    } else {
      lpToAccount = netLpBySy.toFixed(0);
      syUsed = netSyDesired;
      ptUsed = totalPt
        .multipliedBy(BigNumber(lpToAccount))
        .dividedBy(totalLp)
        .toFixed(0);
    }

    return {
      lpToReserve,
      lpToAccount,
      syUsed,
      ptUsed,
    };
  }

  /**********************************************************REMOVE LIQUIDITY*****************************************************/
  async previewRemoveLiquidityDualTokenPt(
    syAddr: EthAddress,
    tokenIn: EthAddress,
    netLpRemove: uint256,
    state: MarketInfo,
  ) {
    let res = await this.previewRemoveLiquidityDualSyPt(
      netLpRemove,
      state
    );
    const SY = new Contract(syAddr, syAbi, this.provider);
    res.netSyToAccount = (await SY.previewRedeem(tokenIn, res.netSyToAccount)).toString();
    return res;
  }

  async previewRemoveLiquidityDualSyPt(
    netLpRemove: uint256,
    state: MarketInfo,
  ) {
    const totalLp = BigNumber(state.totalLp.toString());
    const totalPt = BigNumber(state.totalPt.toString());
    const totalSy = BigNumber(state.totalSy.toString());
    const netSyToAccount = BigNumber(netLpRemove).multipliedBy(totalSy).dividedBy(totalLp).toFixed(0);
    const netPtToAccount = BigNumber(netLpRemove).multipliedBy(totalPt).dividedBy(totalLp).toFixed(0);
    return {
        netSyToAccount,
        netPtToAccount
    };
  }

  /**********************************************************MINT*****************************************************/
  async previewMintSyFromToken(
    syAddr: EthAddress,
    tokenIn: EthAddress,
    netTokenin: uint256
  ): Promise<uint256> {
    const SY = new Contract(syAddr, syAbi, this.provider);
    const res = await SY.previewDeposit(tokenIn, netTokenin);
    return res;
  }

  async previewMintPyFromSy(
    syAddr: EthAddress,
    netSyIn: uint256
  ): Promise<uint256> {
    const SY = new Contract(syAddr, syAbi, this.provider);
    const rate = await SY.exchangeRate();
    const res = BigNumber(rate.toString()).multipliedBy(BigNumber(netSyIn)).dividedBy(BigNumber(1e18));
    return res.toFixed(0);
  }

  async previewMintPyFromToken(
    syAddr: EthAddress,
    tokenIn: EthAddress,
    netTokenIn: uint256
  ): Promise<uint256> {
    const SY = new Contract(syAddr, syAbi, this.provider);
    const numSyPromise = SY.previewDeposit(tokenIn, netTokenIn);
    const ratePromise = SY.exchangeRate();
    const [numSy, rate] = await Promise.all([numSyPromise, ratePromise])
    const res = BigNumber(numSy.toString()).multipliedBy(BigNumber(rate.toString())).dividedBy(BigNumber(1e18));
    return res.toFixed(0);
  }

  /**********************************************************REDEEM*****************************************************/
  async previewRedeemSyToToken(
    syAddr: EthAddress,
    tokenIn: EthAddress,
    netSyin: uint256
  ) {
    const SY = new Contract(syAddr, syAbi, this.provider);
    const res = await SY.previewRedeem(tokenIn, netSyin);
    return res.toString();
  }

  async previewRedeemPyToSy(
    syAddr: EthAddress,
    netPyIn: uint256
  ): Promise<uint256> {
    const SY = new Contract(syAddr, syAbi, this.provider);
    const rate = await SY.exchangeRate();
    const res = BigNumber(netPyIn).multipliedBy(BigNumber(1e18)).dividedBy(BigNumber(rate.toString()));
    return res.toFixed(0);
  }

  async previewRedeemPyToToken(
    syAddr: EthAddress,
    tokenIn: EthAddress,
    netPyIn: uint256
  ) {
    const SY = new Contract(syAddr, syAbi, this.provider);
    const rate = await SY.exchangeRate();
    const numSy = BigNumber(netPyIn).multipliedBy(BigNumber(1e18)).dividedBy(BigNumber(rate.toString()));
    const res = await SY.previewRedeem(tokenIn, numSy.toFixed(0));
    return res.toString();
  }

  /*******************************************************SWAP*****************************************************/
  async previewSwapTokenToPt(
    marketAddr: EthAddress,
    routerAddr: EthAddress,
    state: MarketInfo,
    tokenIn: EthAddress,
    netTokenIn: uint256,
    guessPtOut: ApproxParams
  ) {
    const contract = new Contract(routerAddr, actionsAbi, this.provider);
    const numSy = await this.previewMintSyFromToken(state.SY, tokenIn, netTokenIn);
    const res = await contract.previewSwapSyForPt(
      marketAddr,
      state.YT,
      numSy,
      guessPtOut
    );
    return {
      netPtOut: res[0].toString(),
      netSyFee: res[1].toString(),
    };
  }

  async previewSwapSyToPt(
    marketAddr: EthAddress,
    routerAddr: EthAddress,
    state: MarketInfo,
    netSyIn: uint256,
    guessPtOut: ApproxParams
  ) {
    const contract = new Contract(routerAddr, actionsAbi, this.provider);
    const res = await contract.previewSwapSyForPt(
      marketAddr,
      state.YT,
      netSyIn,
      guessPtOut
    );
    return {
      netPtOut: res[0].toString(),
      netSyFee: res[1].toString(),
    };
  }

  async previewSwapPtToToken(
    marketAddr: EthAddress,
    routerAddr: EthAddress,
    state: MarketInfo,
    tokenIn: EthAddress,
    netPtIn: uint256
  ) {
    const contract = new Contract(routerAddr, actionsAbi, this.provider);
    let res = await contract.previewSwapPtForSy(
      marketAddr,
      state.YT,
      netPtIn
    );
    const netTokenOut = await this.previewRedeemSyToToken(state.SY, tokenIn, res[0]);
    return {
      netTokenOut: netTokenOut,
      netSyFee: res[1].toString(),
    };
  }

  async previewSwapPtToSy(
    marketAddr: EthAddress,
    routerAddr: EthAddress,
    state: MarketInfo,
    netPtIn: uint256
  ) {
    const contract = new Contract(routerAddr, actionsAbi, this.provider);
    const res = await contract.previewSwapPtForSy(
      marketAddr,
      state.YT,
      netPtIn
    );
    return {
      netSyOut: res[0].toString(),
      netSyFee: res[1].toString(),
    };
  }

  async previewSwapTokenToYt(
    marketAddr: EthAddress,
    routerAddr: EthAddress,
    state: MarketInfo,
    tokenIn: EthAddress,
    netTokenIn: uint256,
    guessYtOut: ApproxParams
  ) {
    const contract = new Contract(routerAddr, actionsAbi, this.provider);
    const numSy = await this.previewMintSyFromToken(state.SY, tokenIn, netTokenIn);
    const res = await contract.previewSwapSyForYt(
      marketAddr,
      state.YT,
      numSy,
      guessYtOut
    );
    return {
      netYtOut: res[0].toString(),
      netSyFee: res[1].toString(),
    };
  }

  async previewSwapSyToYt(
    marketAddr: EthAddress,
    routerAddr: EthAddress,
    state: MarketInfo,
    netSyIn: uint256,
    guessYtOut: ApproxParams
  ) {
    const contract = new Contract(routerAddr, actionsAbi, this.provider);
    const res = await contract.previewSwapSyForYt(
      marketAddr,
      state.YT,
      netSyIn,
      guessYtOut
    );
    return {
      netYtOut: res[0].toString(),
      netSyFee: res[1].toString(),
    };
  }

  async previewSwapYtToToken(
    marketAddr: EthAddress,
    routerAddr: EthAddress,
    state: MarketInfo,
    tokenIn: EthAddress,
    netYtIn: uint256
  ) {
    const contract = new Contract(routerAddr, actionsAbi, this.provider);
    let res = await contract.previewSwapYtForSy(
      marketAddr,
      state.YT,
      netYtIn
    );
    const netTokenOut = await this.previewRedeemSyToToken(state.SY, tokenIn, res[0]);
    return {
      netTokenOut: netTokenOut,
      netSyFee: res[1].toString(),
    };
  }

  async previewSwapYtToSy(
    marketAddr: EthAddress,
    routerAddr: EthAddress,
    state: MarketInfo,
    netYtIn: uint256
  ) {
    const contract = new Contract(routerAddr, actionsAbi, this.provider);
    const res = await contract.previewSwapYtForSy(
      marketAddr,
      state.YT,
      netYtIn
    );
    return {
      netSyOut: res[0].toString(),
      netSyFee: res[1].toString(),
    };
  }
}
