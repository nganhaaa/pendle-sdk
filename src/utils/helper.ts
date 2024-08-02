// import { toChecksumAddress } from 'ethereumjs-util';
import { EthAddress } from "./type";
import { BigNumber, Wallet } from "ethers";
import { toChecksumAddress } from "web3-utils";

export async function getGasPrice(exGasPrice: BigNumber) {
    let defaultGasPrice = BigNumber.from("0");
    let newGasPrice = defaultGasPrice;

    // if (exGasPrice.gt('0')) {
    //     defaultGasPrice = BigNumber.from(network.config.gasPrice);
    //     newGasPrice = defaultGasPrice.gt('0') ? defaultGasPrice : await hre.ethers.providers.getDefaultProvider().getGasPrice();
    // } else if (network.name === 'bscMainnet') {
    //     defaultGasPrice = BigNumber.from(network.config.gasPrice);
    //     newGasPrice = defaultGasPrice.gt('0') ? defaultGasPrice : await hre.ethers.providers.getDefaultProvider().getGasPrice();
    // }

    if (exGasPrice.gte(newGasPrice)) {
        newGasPrice = exGasPrice.add(3e9);
    }
    return newGasPrice;
};


export async function getOption(wallet: Wallet) {
    const gasPrice = await getGasPrice(BigNumber.from("0"));
    const nonce = await wallet.getTransactionCount();
    const options = { gasPrice: gasPrice, nonce: nonce };

    return options

}
export const convertHexStringToAddress = (hexString: EthAddress): EthAddress => {
    String(hexString).toLowerCase();
    const strippedHex = hexString.replace(/^0x/, '');

    return toChecksumAddress(`0x${strippedHex}`);
}

