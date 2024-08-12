export declare const main: () => Promise<{
    result: string;
    error: string;
    link: undefined;
    simulation: undefined;
} | {
    result: string;
    error: string | undefined;
    simulation: import("./tenderly/tenderly.types").TenderlySimulation;
    link: string;
} | {
    result: string;
    error: string;
    link?: undefined;
    simulation?: undefined;
}>;
//# sourceMappingURL=demo.d.ts.map