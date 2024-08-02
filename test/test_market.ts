import { getAddr, Market } from "../src";
import { marketList, marketListTestnet } from "../src/utils";


async function main() {
    const chainId = 42161;
    const url = getAddr("URL", chainId);
    const router = getAddr("ROUTER_ADDRESS", chainId);
    const marketClass = new Market(url, chainId);
    const marketConfigList = marketList.map(addr => ({ marketAddr: addr }));
    // const marketConfigList = marketListTestnet.map(addr => ({ marketAddr: addr }));
  
    let res = await marketClass.getMarketInfo(marketConfigList);
    console.log(res);
}

main();