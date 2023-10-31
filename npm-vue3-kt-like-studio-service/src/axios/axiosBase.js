import { MESSAGE } from "@/data/message";
import { ApiError } from "@/models/error/ApiError";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useAlerts } from '@/composables/useAlerts';
import { HttpStatusCode } from "axios";
const { notifyError } = useAlerts();

class AxiosBase {

    constructor(interceptors, baseUrl, type = '') {
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

    checkForAPIErrors(response) {
        const isBadRequest = !response.status.toString().startsWith('2');
        if (isBadRequest) {
            throw new ApiError(response.status, response);
        }
    }

    async PerformFetch(url) {
        const response = await this.axiosInstance.get(url);
        this.checkForAPIErrors(response);
        return response.data;
    }

    async PerformDelete(url, returnBoolean = true) {
        let response;
        try {
            response = await this.axiosInstance.delete(url);
        } catch (error) {
            response = error.response;
        }
        return this.handleResponse(response, returnBoolean);
    }

    async PerformPost(url, data, returnBoolean = true) {
        let response;
        try {
            response = await this.axiosInstance.post(url, data);
        } catch (error) {
            response = error.response;
            if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
                notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
            }
        }
        return this.handleResponse(response, returnBoolean);
    }

    async PerformPut(url, data, returnBoolean = true) {
        let response;
        try {
            response = await this.axiosInstance.put(url, data);
        } catch (error) {
            response = error.response;
            if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
                notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
            }
        }
        return this.handleResponse(response, returnBoolean);
    }

    async PerformPatch(url, data, returnBoolean = true) {
        let response;
        try {
            response = await this.axiosInstance.patch(url, data);
        } catch (error) {
            response = error.response;
            if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
                notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
            }
        }
        return this.handleResponse(response, returnBoolean);
    }

    handleResponse(response, returnBoolean = true) {
        this.checkForAPIErrors(response);
        if (returnBoolean) {
            // Response data contains status code
            return response.status.toString().startsWith('2');
        }
        return response.data;
    }

    errormessage(action, type = null) {
        const typeValue = type || this.type;
        return MESSAGE.COMMON.ERROR_LOG.replace(`<<action>>`, action).replace(`<<type>>`, typeValue);
    }
}

module.exports = {
    AxiosBase,
    axiosInstance,
    axiosConfig
};