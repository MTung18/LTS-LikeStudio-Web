/* eslint-disable no-useless-escape */
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from '../../helper/hqSuite/appSettingsHelper';
import { downloadOrPreviewFile } from "@/helper/hqSuite/fileHelper";

const baseUrlReportDocumentTemplate = '/ReportTemplate/DocumentTemplate';

export default class ReportTemplateApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1`;
        super(interceptors, baseUrl);
    }

    public async getDocumentTemplate(filename: string, isDownload: boolean): Promise<void> {
        try {
            const axiosConfig: object = {
                'responseType': 'blob',
                'headers': {
                    'Accept': 'application/octet-stream'
                }
            };
            const documentTemplateUrl = `${baseUrlReportDocumentTemplate}?documentName=${filename}`
            const data: any = await this.axiosInstance.get(encodeURI(documentTemplateUrl), axiosConfig);
            await downloadOrPreviewFile(data, filename, isDownload);
        } catch (error: any) {
            console.error('"An unexpected error occurred attempting to retrieve the document content.",', error);
            throw error;
        }
    }

    public async getStateRelatedDocuments(stateName: string): Promise<string[] | undefined> {
        try {
            const documentNamesUrl = `/ReportTemplate/DocumentNames?stateName=${stateName}`;
            const res = await this.axiosInstance.get(encodeURI(documentNamesUrl));
            if (res.data && res.status === 200) {
                return res.data
            }
        } catch (error) {
            console.error('An unexpected error occurred attempting to retrieve the document names.', error);
            throw error;
        }
    }
}

export const reportTemplateApi = new ReportTemplateApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor
]);