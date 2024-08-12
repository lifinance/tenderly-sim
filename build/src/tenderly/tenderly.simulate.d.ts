import { LiFiStep } from '@lifi/types';
import { TenderlyConfig } from './tenderly.config';
export declare const getStateOverwrites: (tenderlyConfig: TenderlyConfig) => (overwrites: {
    senderTokenBalanceAndApproval: boolean;
    senderNativeBalance: boolean;
} | undefined, params: {
    chainId: number;
    tokenAddress: string;
    amount: string;
    ownerAddress: string;
    spenderAddress: string;
}) => Promise<Record<string, string>>;
export declare const simulate: (tenderlyConfig: TenderlyConfig) => (quote: LiFiStep, overwrites?: {
    senderTokenBalanceAndApproval: boolean;
    senderNativeBalance: boolean;
}) => Promise<{
    result: string;
    error: string;
    link: undefined;
    simulation: undefined;
} | {
    result: string;
    error: string | undefined;
    simulation: import("./tenderly.types").TenderlySimulation;
    link: string;
} | {
    result: string;
    error: string;
    link?: undefined;
    simulation?: undefined;
}>;
//# sourceMappingURL=tenderly.simulate.d.ts.map