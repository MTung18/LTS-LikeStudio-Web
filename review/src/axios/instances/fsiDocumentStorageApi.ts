import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { HQSuiteExtensionItem } from "@/models/hqSuite/hqSuiteExtensionItem";
import { formatPath } from "@/helper/hqSuite/formatHelper";
import { HQSuiteRecordItem } from "@/models/hqSuite/HQSuiteRecordItem";
import { downloadOrPreviewFile } from "@/helper/hqSuite/fileHelper";
import { getLocalAppsettings } from '@/helper/hqSuite/appSettingsHelper';
import { encodeBase64 } from "@/functions/FormatterUtilityFunction";

export const baseUrlHqSuite: string = '/storage';

export default class hqSuitesApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.DocumentStorageApiRootUrl;
        super(interceptors, baseUrl);
    }

    public async getAllowedExtensions(): Promise<HQSuiteExtensionItem[]> {
        let allowedExtensions: HQSuiteExtensionItem[];
        try {
            const response = await this.axiosInstance.get<HQSuiteExtensionItem[]>(baseUrlHqSuite + '/files/extensions');
            if (
                response &&
                response.data &&
                response.data.length > 0 &&
                response.status === 200
            ) {
                allowedExtensions = response.data.map((extension) => new HQSuiteExtensionItem(extension));
            } else {
                throw new Error("Failed to parse allowed extension list");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the allowed extension list.",
                error
            );
        }
        return allowedExtensions;
    }

    async getRecordItems(folderPath: string, throwErrorIfAny: boolean = false): Promise<HQSuiteRecordItem[]> {
        let records: HQSuiteRecordItem[];
        try {
            const response = await this.axiosInstance.get<HQSuiteRecordItem[]>(baseUrlHqSuite + '/folders?folderPath=' + encodeBase64(folderPath));
            if (
                response &&
                response.status === 200
            ) {
                if (response.data && response.data.length > 0) {
                    records = response.data.map((record) => new HQSuiteRecordItem(record));
                } else {
                    records = [];
                }
            } else {
                throw new Error("Failed to parse record list");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the  record list.",
                error
            );
            if (throwErrorIfAny)
                throw error;
        }
        return records;
    }

    async createFolder(folderParams: any, throwErrorIfAny: boolean = false): Promise<HQSuiteRecordItem[]> {
        let records: HQSuiteRecordItem[];
        try {
            const params: object = {
                'sourcePath': encodeBase64(formatPath(folderParams.path)),
                'newFolderName': encodeBase64(folderParams.name)
            };

            const response = await this.axiosInstance.post<HQSuiteRecordItem[]>(baseUrlHqSuite + '/folders/create', params);
            if (
                response &&
                response.status === 200
            ) {
                if (response.data && response.data.length > 0) {
                    records = response.data.map((record) => new HQSuiteRecordItem(record));
                } else {
                    records = [];
                }
            } else {
                throw new Error("Failed to parse record list");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to create the folder.",
                error
            );
            if (throwErrorIfAny)
                throw error;
        }
        return records;
    }


    public async uploadFile(fileData: any, isMultipleFiles: boolean = false): Promise<any | any[]> {
        try {
            let formDataObject: any;
            let formData: FormData = new FormData();
            // if (isMultipleFiles) {
            //     formData.append('destinationPath', formatPath(fileData[0].path))
            //     for (const x of fileData) {
            //         formData.append("files", x.file);
            //     }

            // } else {
            formDataObject = {
                'destinationPath': encodeBase64(formatPath(fileData.path)),
                'files': fileData.file
            };
            for (const name in formDataObject) {
                formData.append(name, formDataObject[name]);
            }
            // }
            const headerData = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const fileUploadURL = baseUrlHqSuite + '/files/upload';
            const result: any = await this.axiosInstance.post(fileUploadURL, formData, headerData);

            let data = await result?.data;
            // sorting based on modified time
            if (data && data.length > 0) {
                const fileList = data.filter((s) => !s.isFolder);
                fileList.sort(function (a, b) {
                    return Date.parse(b.lastEdited) - Date.parse(a.lastEdited);
                });
                data = fileList;
            }
            if (isMultipleFiles) {
                return { id: fileData.uniqueFileName, data: data[0] }
            }
            // select the first file from the sorted files
            return data[0];
        }
        catch (error: any) {
            console.log(error);
        }
    }


    public async deleteFile(filePath: string) {
        let isDeleted = false;
        try {
            const result: any = await this.axiosInstance.delete(baseUrlHqSuite + '/files?filePath=' + encodeBase64(filePath));
            isDeleted = true;
        } catch (error: any) {
            console.log(error);
        }
        return isDeleted;
    }

    public async getFile(filePath: string,): Promise<any> {
        try {
            const axiosConfig: object = {
                'responseType': 'blob',
                'headers': {
                    'Accept': 'application/octet-stream'
                }
            };
            const url: string = `${baseUrlHqSuite}/files?filePath=${encodeBase64(filePath)}&api-version=1.0`;
            return await this.axiosInstance.get(encodeURI(url), axiosConfig);
        }
        catch (error: any) {
            console.error(error);
        }
    }

    public async downloadFile(filePath: string, isDownloadAble: boolean = true): Promise<void> {
        try {
            const data: any = await this.getFile(filePath);
            downloadOrPreviewFile(data, filePath, isDownloadAble);
        }
        catch (error: any) {
            console.error(error);
        }
    }
}

export const hqSuiteApi = new hqSuitesApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor
]);