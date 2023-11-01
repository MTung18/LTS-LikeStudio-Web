
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { DocumentMetadata } from "@/models/documents/documentMetadata";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ActionType } from "@/enums/ActionType";
import DocumentCategory from "@/models/documents/documentCategory";

export const baseUrlDocumentMetaData = "documentMetadata";
export default class WhqDocumentsApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
        super(interceptors, baseUrl, 'DocumentMetadata');
    }

    public async addDocument(documentMetaData: DocumentMetadata): Promise<boolean> {
        try {
            return await this.PerformPost<boolean>(`${baseUrlDocumentMetaData}`, documentMetaData);
        } catch (error) {
            console.error(this.errormessage(ActionType.Create), error);
        }
        return false;
    }

    public async fetchDocumentList(employeeId: number = null): Promise<DocumentMetadata[]> {
        let documents: DocumentMetadata[] = [];
        try {
            const url = `${baseUrlDocumentMetaData}?IsDeleted=false${employeeId ? `&employeeId=${employeeId}` : ''}`;
            documents = await this.PerformFetch<DocumentMetadata[]>(url);
        } catch (error) {
            console.error(this.errormessage(ActionType.Fetch), error);
        }
        return documents;
    }

    public async fetchDocumentCategoryList(): Promise<DocumentCategory[]> {
        let categories: DocumentCategory[] = [];
        try {
            categories = await this.PerformFetch<DocumentCategory[]>(`${baseUrlDocumentMetaData}/categories`);
        } catch (error) {
            console.error(this.errormessage(ActionType.Fetch), error);
        }
        return categories;
    }

    public async deleteDocument(documentMetadataId: number): Promise<boolean> {
        try {
            return await this.PerformDelete<boolean>(`${baseUrlDocumentMetaData}/${documentMetadataId}`);
        } catch (error) {
            console.error(this.errormessage(ActionType.Delete), error);
        }
        return false;
    }
}

export const WhqDocumentApi = new WhqDocumentsApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);