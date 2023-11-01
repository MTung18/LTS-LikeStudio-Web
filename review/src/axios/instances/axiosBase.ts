import { MESSAGE } from "@/data/message";
import { WHQApiError } from "@/models/error/WHQApiError";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useAlerts } from '@/composables/useAlerts';
import { HttpStatusCode } from "axios";
const { notifyError } = useAlerts();

export default class AxiosBase {

    protected axiosInstance: AxiosInstance;
    protected axiosConfig: AxiosRequestConfig;
    protected type: string;
    constructor(interceptors: Array<any>, baseUrl: string, type = '') {

        this.type = type;
        this.axiosConfig = {
            baseURL: baseUrl,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        };

        this.axiosInstance = axios.create(this.axiosConfig);

        if (interceptors) {
            for (const interceptor of interceptors) {
                interceptor(this.axiosInstance);
            }
        }
    }

    protected checkForAPIErrors(response: AxiosResponse): void {
        const isBadRequest = !response.status.toString().startsWith('2');
        if (isBadRequest) {
            throw new WHQApiError(response.status, response);
        }
    }

    protected async PerformFetch<T>(url: string): Promise<T> {
        const response = await this.axiosInstance.get<T>(url);
        this.checkForAPIErrors(response);
        return response.data as T;
    }

    protected async PerformDelete<T>(url: string, returnBoolean = true): Promise<T | boolean> {
        let response: any;
        try {
            response = await this.axiosInstance.delete<T>(url);
        } catch (error) {
            response = error.response;
        }
        return this.handleResponse<T>(response, returnBoolean);
    }

    protected async PerformPost<T>(url: string, data: any, returnBoolean = true): Promise<T | boolean> {
        let response: any;
        try {
            response = await this.axiosInstance.post(url, data);
        } catch (error) {
            response = error.response;
            if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
                notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
            }
        }
        return this.handleResponse<T>(response, returnBoolean);
    }

    protected async PerformPut<T>(url: string, data: any, returnBoolean: boolean = true): Promise<T | boolean> {
        let response: any;
        try {
            response = await this.axiosInstance.put(url, data);
        } catch (error) {
            response = error.response;
            if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
                notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
            }
        }
        return this.handleResponse<T>(response, returnBoolean);
    }

    protected async PerformPatch<T>(url: string, data: any, returnBoolean: boolean = true): Promise<T | boolean> {
        let response: any;
        try {
            response = await this.axiosInstance.patch(url, data);
        } catch (error) {
            response = error.response;
            if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
                notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
            }
        }
        return this.handleResponse<T>(response, returnBoolean);
    }

    protected handleResponse<T>(response: any, returnBoolean: boolean = true): T | boolean {
        this.checkForAPIErrors(response);
        if (returnBoolean) {
            // Response data contain status code
            return response.status.toString().startsWith('2');
        }
        return response.data as T;
    }

    protected errormessage(action: string, type: string = null) {
        const typeValue = type ?? this.type;
        return MESSAGE.COMMON.ERROR_LOG.replace(`<<action>>`, action).replace(`<<type>>`, typeValue);
    }
}

