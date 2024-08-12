"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulate = exports.getStateOverwrites = void 0;
const types_1 = require("@lifi/types");
const common_1 = require("@tenderlysim/common");
const logger_1 = require("@tenderlysim/logger");
const tenderly_api_1 = require("./tenderly.api");
const tenderly_config_1 = require("./tenderly.config");
const tenderly_overwrites_1 = require("./tenderly.overwrites");
// TODO: improve code quality
/* eslint-disable complexity, max-lines-per-function */
const validateTransactionRequest = (transactionRequest) => {
    if (transactionRequest === undefined)
        throw (0, common_1.LifiError)({
            message: `No transaction request passed`,
            code: types_1.ErrorCode.MalformedSchema,
        });
    if (transactionRequest.from === undefined)
        throw (0, common_1.LifiError)({
            message: `transactionRequest is missing from`,
            code: types_1.ErrorCode.MalformedSchema,
        });
    if (transactionRequest.to === undefined)
        throw (0, common_1.LifiError)({
            message: `transactionRequest is missing to`,
            code: types_1.ErrorCode.MalformedSchema,
        });
    if (transactionRequest.chainId === undefined)
        throw (0, common_1.LifiError)({
            message: `transactionRequest is missing chainId`,
            code: types_1.ErrorCode.MalformedSchema,
        });
    if (transactionRequest.data === undefined)
        throw (0, common_1.LifiError)({
            message: `transactionRequest is missing data`,
            code: types_1.ErrorCode.MalformedSchema,
        });
    if (transactionRequest.gasPrice === undefined)
        throw (0, common_1.LifiError)({
            message: `transactionRequest is missing gasPrice`,
            code: types_1.ErrorCode.MalformedSchema,
        });
    if (transactionRequest.gasLimit === undefined)
        throw (0, common_1.LifiError)({
            message: `transactionRequest is missing gasLimit`,
            code: types_1.ErrorCode.MalformedSchema,
        });
    if (transactionRequest.value === undefined)
        throw (0, common_1.LifiError)({
            message: `transactionRequest is missing value`,
            code: types_1.ErrorCode.MalformedSchema,
        });
    return {
        from: transactionRequest.from,
        to: transactionRequest.to,
        chainId: transactionRequest.chainId,
        data: transactionRequest.data,
        gasPrice: transactionRequest.gasPrice,
        gasLimit: transactionRequest.gasLimit,
        value: transactionRequest.value,
    };
};
const getStateOverwrites = (tenderlyConfig) => async (overwrites = {
    senderTokenBalanceAndApproval: true,
    senderNativeBalance: true,
}, params) => {
    let stateOverwrites = {};
    if (overwrites.senderTokenBalanceAndApproval) {
        const tokenOverwrite = await (0, tenderly_overwrites_1.getTokenOverwrite)(tenderlyConfig)(params);
        stateOverwrites = {
            ...stateOverwrites,
            ...tokenOverwrite,
        };
    }
    if (overwrites.senderNativeBalance) {
        stateOverwrites = {
            ...stateOverwrites,
            // enough gas + value on sender
            [params.ownerAddress]: {
                balance: '10000000000000000000000000',
            },
        };
    }
    return stateOverwrites;
};
exports.getStateOverwrites = getStateOverwrites;
const simulate = (tenderlyConfig) => async (quote, overwrites = {
    senderTokenBalanceAndApproval: true,
    senderNativeBalance: true,
}) => {
    // tenderly supported
    if (!tenderly_config_1.TENDERLY_CHAINS.includes(quote.action.fromChainId)) {
        return {
            result: 'IMPOSSIBLE',
            error: 'TENDERLY_UNSUPPORTED_CHAIN',
            link: undefined,
            simulation: undefined,
        };
    }
    // token supported
    if (tenderly_config_1.knownFailingTokens[quote.action.fromChainId]?.includes(quote.action.fromToken.address.toLowerCase())) {
        return {
            result: 'IMPOSSIBLE',
            error: 'TENDERLY_UNSUPPORTED_TOKEN',
            link: undefined,
            simulation: undefined,
        };
    }
    const transactionRequest = validateTransactionRequest(quote.transactionRequest);
    let stateOverwrites;
    try {
        stateOverwrites = await (0, exports.getStateOverwrites)(tenderlyConfig)(overwrites, {
            chainId: quote.action.fromChainId,
            tokenAddress: quote.action.fromToken.address,
            amount: quote.action.fromAmount,
            ownerAddress: transactionRequest.from,
            spenderAddress: transactionRequest.to,
        });
    }
    catch (e) {
        (0, logger_1.logger)().error(e);
        return {
            result: 'IMPOSSIBLE',
            error: 'MAPPING_MISSING',
            link: undefined,
            simulation: undefined,
        };
    }
    // Overwrite for optimism bridge gas simulation issues:
    // Simulation of calls that make use of the native optimism bridge fail because the code tries to burn gas.
    // Hop uses the optimism bridge internally for transfers between ETH and OPT.
    if ((quote.tool === 'optimism' || quote.tool === 'hop') &&
        quote.action.fromChainId === types_1.ChainId.ETH &&
        quote.action.toChainId === types_1.ChainId.OPT) {
        // Default gas limit used by tenderly
        transactionRequest.gasLimit = '8000000';
    }
    // Overwrite for transactions on specific L2s
    // So we can test the transactions even if the gasLimits the API returns are too low
    if (quote.action.fromChainId === types_1.ChainId.ARB) {
        transactionRequest.gasLimit = '20000000';
    }
    if (quote.action.fromChainId === types_1.ChainId.MNT) {
        transactionRequest.gasLimit = ''; // do not pass a limit
    }
    const data = {
        /* Simulation Configuration */
        save: true, // if true simulation is saved and shows up in the dashboard
        save_if_fails: true, // if true, reverting simulations show up in the dashboard
        simulation_type: 'full', // full or quick (full is default)
        network_id: transactionRequest.chainId.toString(),
        /* Standard EVM Transaction object */
        from: transactionRequest.from,
        input: transactionRequest.data,
        to: transactionRequest.to,
        gas: transactionRequest.gasLimit === ''
            ? undefined
            : Number(BigInt(transactionRequest.gasLimit)),
        gas_price: BigInt(transactionRequest.gasPrice).toString(),
        value: BigInt(transactionRequest.value).toString(),
        /* Advanced */
        state_objects: stateOverwrites,
    };
    try {
        const result = await (0, tenderly_api_1.simulateTransaction)(tenderlyConfig)(data);
        return {
            result: result.simulation.status ? 'WORKED' : 'FAILED',
            error: result.simulation.status
                ? undefined
                : result.transaction.error_message,
            simulation: result.simulation,
            link: result.link,
        };
    }
    catch (e) {
        if (e instanceof Error) {
            return {
                result: 'FAILED',
                error: e.message,
            };
        }
        else {
            return {
                result: 'FAILED',
                error: 'REQUEST_FAILED',
            };
        }
    }
};
exports.simulate = simulate;
//# sourceMappingURL=tenderly.simulate.js.map