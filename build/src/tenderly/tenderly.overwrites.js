"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenOverwrite = void 0;
const types_1 = require("@lifi/types");
const ethers_1 = require("ethers");
const memoizee_1 = __importDefault(require("memoizee"));
const logger_1 = require("@tenderlysim/logger");
const common_1 = require("@tenderlysim/common");
const tenderly_api_1 = require("./tenderly.api");
const tenderly_config_1 = require("./tenderly.config");
const _getContractStates = (tenderlyConfig) => async (chainId, tokenAddress) => {
    let tokenContract = await (0, tenderly_api_1.getPublicTokenContract)(chainId, tokenAddress);
    // try project contract as fallback
    if (tokenContract?.data?.states === undefined) {
        tokenContract = await (0, tenderly_api_1.getTokenContract)(tenderlyConfig)(chainId, tokenAddress);
    }
    return tokenContract?.data?.states;
};
const getContractStates = (0, memoizee_1.default)(_getContractStates, {
    promise: true,
    maxAge: 60 * 60 * 1000, // 1h
});
const getApprovalMapping = (tokenImplementationAddress, tokenStates, params) => {
    const mask = tokenStates
        .map(({ type, name }) => {
        if (tenderly_config_1.knownAllowanceMappings[type]?.names.includes(name)) {
            return name + tenderly_config_1.knownAllowanceMappings[type].mask;
        }
    })
        .find((mask) => mask);
    if (mask === undefined) {
        (0, logger_1.logger)().warn({
            service: 'getApprovalMapping',
            data: tokenStates,
        }, `Unknown approval mapping for token ${tokenImplementationAddress}`);
        throw (0, common_1.LifiError)({
            message: `Unable to find matching mapping in knownAllowanceMappings.`,
            code: types_1.ErrorCode.NotProcessableError,
        });
    }
    const mapping = mask
        .replace('OWNER_ADDRESS', params.ownerAddress)
        .replace('SPENDER_ADDRESS', params.spenderAddress);
    return {
        [mapping]: params.amount,
    };
};
const getBalanceMapping = (tokenImplementationAddress, tokenStates, params) => {
    const mask = tokenStates
        .map(({ type, name }) => {
        if (tenderly_config_1.knownBalanceMappings[type]?.names.includes(name)) {
            return name + tenderly_config_1.knownBalanceMappings[type].mask;
        }
    })
        .find((mask) => mask);
    if (mask === undefined) {
        (0, logger_1.logger)().warn({
            service: 'getBalanaceMapping',
            data: tokenStates,
        }, `Unknown balance mapping for token ${tokenImplementationAddress}`);
        throw (0, common_1.LifiError)({
            message: `Unable to find matching mapping in knownBalanceMappings.`,
            code: types_1.ErrorCode.NotProcessableError,
        });
    }
    const mapping = mask.replace('OWNER_ADDRESS', params.ownerAddress);
    return {
        [mapping]: params.amount,
    };
};
const getTokenOverwrite = (tenderlyConfig) => async (params) => {
    if (params.tokenAddress === ethers_1.ethers.ZeroAddress) {
        return {};
    }
    // use proxy implementation if available
    let tokenImplementationAddress = params.tokenAddress.toLowerCase();
    if (tenderly_config_1.knownProxyTokens[params.chainId]?.[tokenImplementationAddress]) {
        tokenImplementationAddress =
            tenderly_config_1.knownProxyTokens[params.chainId][tokenImplementationAddress];
    }
    const contractStates = await getContractStates(tenderlyConfig)(params.chainId, tokenImplementationAddress);
    if (contractStates === undefined) {
        throw (0, common_1.LifiError)({
            message: `Unable to find contract states.`,
            code: types_1.ErrorCode.ThirdPartyError,
        });
    }
    const approvalMapping = getApprovalMapping(tokenImplementationAddress, contractStates, params);
    const balanceMapping = getBalanceMapping(tokenImplementationAddress, contractStates, params);
    const rawState = ({} = {
        ...approvalMapping,
        ...balanceMapping,
    });
    return (0, tenderly_api_1.encodeContractStates)(tenderlyConfig)(params.chainId, params.tokenAddress, tokenImplementationAddress, rawState);
};
exports.getTokenOverwrite = getTokenOverwrite;
//# sourceMappingURL=tenderly.overwrites.js.map