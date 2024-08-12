import { AxiosResponse } from 'axios';
export declare const http: () => {
    get: <T = any, R = AxiosResponse<T, any>, D = any>(url: string, config?: import("axios").AxiosRequestConfig<D> | undefined) => Promise<R>;
    post: <T_1 = any, R_1 = AxiosResponse<T_1, any>, D_1 = any>(url: string, data?: D_1 | undefined, config?: import("axios").AxiosRequestConfig<D_1> | undefined) => Promise<R_1>;
};
export type HttpResponse<T> = AxiosResponse<T>;
//# sourceMappingURL=http.d.ts.map