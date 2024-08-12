import { ChainId } from '@lifi/types';
import { TenderlyConfig } from './tenderly.config';
import { TenderlyContract } from './tenderly.types.contract';
import { TenderlyTransactionResponse } from './tenderly.types';
export declare const getTokenContract: (tenderlyConfig: TenderlyConfig) => (chainId: ChainId, tokenAddress: string) => Promise<TenderlyContract | undefined>;
export declare const getPublicTokenContract: (chainId: ChainId, tokenAddress: string) => Promise<TenderlyContract | undefined>;
export declare const encodeContractStates: (tenderlyConfig: TenderlyConfig) => (chainId: ChainId, tokenAddress: string, tokenImplementationAddress: string, mappings: Record<string, string>) => Promise<{
    [x: string]: {
        storage: any;
    };
}>;
export declare const simulateTransaction: (tenderlyConfig: TenderlyConfig) => (data: any) => Promise<{
    link: string;
    simulation: import("./tenderly.types").TenderlySimulation;
    transaction: import("./tenderly.types").TenderlyTransaction;
}>;
export declare const getTransactionDetails: (tenderlyConfig: TenderlyConfig) => (txHash: string, chainId: ChainId) => Promise<TenderlyTransactionResponse>;
//# sourceMappingURL=tenderly.api.d.ts.map