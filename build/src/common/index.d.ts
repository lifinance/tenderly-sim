export type LifiError = {
    message: string;
    code: number;
};
export declare const LifiError: ({ message, code, }: {
    message: string;
    code: number;
}) => LifiError;
export declare const getErrorMessage: (err: any) => string;
//# sourceMappingURL=index.d.ts.map