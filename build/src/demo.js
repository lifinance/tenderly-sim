"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const http_1 = require("./http");
const tenderly_1 = require("./tenderly");
const logger_1 = require("./logger");
const main = async () => {
    const quote = await (0, http_1.http)()
        .get('https://li.quest/v1/quote?fromChain=POL&fromAmount=1000000&fromToken=USDC&fromAddress=0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0&toChain=POL&toToken=DAI&integrator=postman&slippage=0.03')
        .then((q) => q.data);
    const config = {
        accessKey: '---',
        user: 'LiFi',
        project: 'simulate',
    };
    (0, logger_1.logger)().info(quote);
    const sim = await (0, tenderly_1.simulate)(config)(quote, {
        senderTokenBalanceAndApproval: true,
        senderNativeBalance: false,
    });
    return sim;
};
exports.main = main;
(0, exports.main)()
    .then((res) => (0, logger_1.logger)().info(res))
    .catch((err) => (0, logger_1.logger)().error(err));
//# sourceMappingURL=demo.js.map