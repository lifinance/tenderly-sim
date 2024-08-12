export declare const TENDERLY_BASE_URL = "https://api.tenderly.co/api/v1/";
export declare const TENDERLY_REQUEST_HEADERS: (accessKey: string) => {
    'X-Access-Key': string;
};
export type TenderlyConfig = {
    accessKey: string;
    user: string;
    project: string;
};
export declare const projectBaseUrl: (tenderlyConfig: TenderlyConfig) => string;
export declare const TENDERLY_CHAINS: number[];
export declare const knownProxyTokens: Record<number, Record<Lowercase<string>, Lowercase<string>>>;
export declare const knownFailingTokens: Record<number, Lowercase<string>[]>;
export declare const knownAllowanceMappings: Record<string, {
    names: string[];
    mask: string;
}>;
export declare const knownBalanceMappings: Record<string, {
    names: string[];
    mask: string;
}>;
//# sourceMappingURL=tenderly.config.d.ts.map