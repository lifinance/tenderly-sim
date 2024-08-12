import { TenderlyConfig } from './tenderly.config';
export declare const getTokenOverwrite: (tenderlyConfig: TenderlyConfig) => (params: {
    chainId: number;
    tokenAddress: string;
    amount: string;
    ownerAddress: string;
    spenderAddress: string;
}) => Promise<{
    [x: string]: {
        storage: any;
    };
}>;
//# sourceMappingURL=tenderly.overwrites.d.ts.map