import AxiosBase from "../axiosBase";
import AccessTokenRequestInterceptor from "../../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

import User from '@/models/settings/PermissionGroupUser';

export default class WhqUserApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/users`; 
        super(interceptors, baseUrl);
    }

    public async getUsers(excludePermissionGroupId? : number, excludeAdminGroup? : boolean): Promise<User[]> {
        let userList: User[] = [];
        let _params: any = {};

        if(excludePermissionGroupId !== null && excludePermissionGroupId !== undefined) 
        {
            _params.excludePermissionGroupId = excludePermissionGroupId;
        }
            
        if(excludeAdminGroup !== null && excludeAdminGroup !== undefined) 
        {
            _params.excludeAdminGroup        = excludeAdminGroup;
        }

        try {
            const response = await this.axiosInstance.get<User[]>("",{
                params: _params
            }); 

            if (response?.data && Array.isArray(response.data) && response.status === 200) {
                if (response.data.length > 0) {
                    userList = response.data.map((user) => new User(user));
                }
            }
            else {
                throw new Error("Failed to parse user list");
            }

            return userList;
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the Users list.",
                error
            );

            return Promise.reject(error);
        }
    }
}

export const whqUserApi = new WhqUserApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);
