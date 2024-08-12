"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionDetails = exports.simulateTransaction = exports.encodeContractStates = exports.getPublicTokenContract = exports.getTokenContract = void 0;
const types_1 = require("@lifi/types");
const http_1 = require("@tenderlysim/http");
const logger_1 = require("logger");
const common_1 = require("@tenderlysim/common");
const tenderly_config_1 = require("./tenderly.config");
const getTokenContract = (tenderlyConfig) => async (chainId, tokenAddress) => {
    const url = `${(0, tenderly_config_1.projectBaseUrl)(tenderlyConfig)}/contract/${chainId}/${tokenAddress}`;
    try {
        const result = await (0, http_1.http)().get(url, {
            headers: (0, tenderly_config_1.TENDERLY_REQUEST_HEADERS)(tenderlyConfig.accessKey),
        });
        return result.data.contract;
    }
    catch (e) {
        (0, logger_1.logger)().warn(`[tenderly] getTokenContract failed ${e}`);
        return undefined;
    }
};
exports.getTokenContract = getTokenContract;
const getPublicTokenContract = async (chainId, tokenAddress) => {
    const url = `${tenderly_config_1.TENDERLY_BASE_URL}public-contracts/${chainId}/${tokenAddress}`;
    try {
        const result = await (0, http_1.http)().get(url);
        return result.data;
    }
    catch (e) {
        (0, logger_1.logger)().warn(`[tenderly] getPublicTokenContract failed ${e}`);
        return undefined;
    }
};
exports.getPublicTokenContract = getPublicTokenContract;
const encodeContractStates = (tenderlyConfig) => async (chainId, tokenAddress, tokenImplementationAddress, mappings) => {
    const url = `${(0, tenderly_config_1.projectBaseUrl)(tenderlyConfig)}/contracts/encode-states`;
    const request = {
        networkID: chainId.toString(),
        stateOverrides: {
            [tokenImplementationAddress]: {
                value: mappings,
            },
        },
    };
    const encodedState = await (0, http_1.http)().post(url, request, {
        headers: (0, tenderly_config_1.TENDERLY_REQUEST_HEADERS)(tenderlyConfig.accessKey),
    });
    return {
        [tokenAddress]: {
            storage: encodedState.data.stateOverrides[tokenImplementationAddress].value,
        },
    };
};
exports.encodeContractStates = encodeContractStates;
const simulateTransaction = (tenderlyConfig) => async (data) => {
    const url = `${(0, tenderly_config_1.projectBaseUrl)(tenderlyConfig)}/simulate`;
    const result = await (0, http_1.http)().post(url, data, {
        headers: (0, tenderly_config_1.TENDERLY_REQUEST_HEADERS)(tenderlyConfig.accessKey),
    });
    const link = `https://dashboard.tenderly.co/${tenderlyConfig.user}/${tenderlyConfig.project}/simulator/${result.data.simulation.id}`;
    return {
        ...result.data,
        link,
    };
};
exports.simulateTransaction = simulateTransaction;
const validateTransactionDetailsResponse = (response) => {
    if (response.status === 401) {
        const unauthorizedError = (0, common_1.LifiError)({
            message: 'Get transaction information call is Unauthorized',
            code: types_1.ErrorCode.UnauthorizedError,
        });
        return unauthorizedError;
    }
    if (response.status == 404) {
        return (0, common_1.LifiError)({
            message: 'The tx was not found by Tenderly',
            code: types_1.ErrorCode.NotFoundError,
        });
    }
    return response;
};
const getTransactionDetails = (tenderlyConfig) => async (txHash, chainId) => {
    if (!tenderly_config_1.TENDERLY_CHAINS.includes(chainId)) {
        throw (0, common_1.LifiError)({
            message: 'The requested tx chain is not supported by Tenderly',
            code: types_1.ErrorCode.NotProcessableError,
        });
    }
    try {
        const response = await (0, http_1.http)().get(`${tenderly_config_1.TENDERLY_BASE_URL}account/${tenderlyConfig.user}/project/${tenderlyConfig.project}/network/${chainId}/transaction/${txHash}`, { headers: (0, tenderly_config_1.TENDERLY_REQUEST_HEADERS)(tenderlyConfig.accessKey) });
        const validatedResponse = validateTransactionDetailsResponse(response);
        if (validatedResponse instanceof common_1.LifiError)
            throw validatedResponse;
        return response.data;
    }
    catch (error) {
        (0, logger_1.logger)().warn(`[tenderly] Get transaction information call failed: ${(0, common_1.getErrorMessage)(error)}`);
        throw (0, common_1.LifiError)({
            message: 'The getTransactionDetails call failed',
            code: types_1.ErrorCode.ThirdPartyError,
        });
    }
};
exports.getTransactionDetails = getTransactionDetails;
//# sourceMappingURL=tenderly.api.js.map