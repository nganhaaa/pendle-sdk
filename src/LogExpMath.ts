import BigNumber from "bignumber.js";
import { uint256 } from "./utils";

// 18 decimal constants
const x0 = "128000000000000000000"; // 2ˆ7
const a0 = "38877084059945950922200000000000000000000000000000000000"; // eˆ(x0) (no decimals)
const x1 = "64000000000000000000"; // 2ˆ6
const a1 = "6235149080811616882910000000"; // eˆ(x1) (no decimals)

// 20 decimal constants
const x2 = "3200000000000000000000"; // 2ˆ5
const a2 = "7896296018268069516100000000000000"; // eˆ(x2)
const x3 = "1600000000000000000000"; // 2ˆ4
const a3 = "888611052050787263676000000"; // eˆ(x3)
const x4 = "800000000000000000000"; // 2ˆ3
const a4 = "298095798704172827474000"; // eˆ(x4)
const x5 = "400000000000000000000"; // 2ˆ2
const a5 = "5459815003314423907810"; // eˆ(x5)
const x6 = "200000000000000000000"; // 2ˆ1
const a6 = "738905609893065022723"; // eˆ(x6)
const x7 = "100000000000000000000"; // 2ˆ0
const a7 = "271828182845904523536"; // eˆ(x7)
const x8 = "50000000000000000000"; // 2ˆ-1
const a8 = "164872127070012814685"; // eˆ(x8)
const x9 = "25000000000000000000"; // 2ˆ-2
const a9 = "128402541668774148407"; // eˆ(x9)
const x10 = "12500000000000000000"; // 2ˆ-3
const a10 = "113314845306682631683"; // eˆ(x10)
const x11 = "6250000000000000000"; // 2ˆ-4
const a11 = "106449445891785942956"; // eˆ(x11)

export function exp(_x: uint256): uint256 {
    let firstAN, x = BigNumber(_x);
    if(x.isGreaterThanOrEqualTo(BigNumber(x0))) {
        x = x.minus(BigNumber(x0));
        firstAN = BigNumber(a0);
    } else if(x.isGreaterThanOrEqualTo(BigNumber(x1))) {
        x = x.minus(BigNumber(x1));
        firstAN = BigNumber(a1);
    } else firstAN = BigNumber(1);

    x = x.multipliedBy(100);
    let product = BigNumber(1e20);

    if(x.isGreaterThanOrEqualTo(BigNumber(x2))) {
        x = x.minus(BigNumber(x2));
        product = product.multipliedBy(BigNumber(a2)).dividedBy(1e20);
        // product = BigNumber(product.toFixed(0));
    }

    if(x.isGreaterThanOrEqualTo(BigNumber(x3))) {
        x = x.minus(BigNumber(x3));
        product = product.multipliedBy(BigNumber(a3)).dividedBy(1e20);
        // product = BigNumber(product.toFixed(0));
    }

    if(x.isGreaterThanOrEqualTo(BigNumber(x4))) {
        x = x.minus(BigNumber(x4));
        product = product.multipliedBy(BigNumber(a4)).dividedBy(1e20);
        // product = BigNumber(product.toFixed(0));
    }

    if(x.isGreaterThanOrEqualTo(BigNumber(x5))) {
        x = x.minus(BigNumber(x5));
        product = product.multipliedBy(BigNumber(a5)).dividedBy(1e20);
        // product = BigNumber(product.toFixed(0));
    }

    if(x.isGreaterThanOrEqualTo(BigNumber(x6))) {
        x = x.minus(BigNumber(x6));
        product = product.multipliedBy(BigNumber(a6)).dividedBy(1e20);
        // product = BigNumber(product.toFixed(0));
    }

    if(x.isGreaterThanOrEqualTo(BigNumber(x7))) {
        x = x.minus(BigNumber(x7));
        product = product.multipliedBy(BigNumber(a7)).dividedBy(1e20);
        // product = BigNumber(product.toFixed(0));
    }

    if(x.isGreaterThanOrEqualTo(BigNumber(x8))) {
        x = x.minus(BigNumber(x8));
        product = product.multipliedBy(BigNumber(a8)).dividedBy(1e20);
        // product = BigNumber(product.toFixed(0));
    }

    if(x.isGreaterThanOrEqualTo(BigNumber(x9))) {
        x = x.minus(BigNumber(x9));
        product = product.multipliedBy(BigNumber(a9)).dividedBy(1e20);
        // product = BigNumber(product.toFixed(0));
    }

    let term = x, seriesSum = x.plus(1e20);
    for(let i = 2; i <= 12; ++i) {
        term = term.multipliedBy(x).dividedBy(1e20).dividedBy(i);
        // term = BigNumber(term.toFixed(0));
        seriesSum = seriesSum.plus(term);
    }

    let res = product.multipliedBy(seriesSum).dividedBy(1e20).multipliedBy(firstAN).dividedBy(100);
    return res.toString();
}