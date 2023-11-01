import AxiosBase from "../axiosBase";
import AccessTokenRequestInterceptor from "../../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../../interceptors/accessToken-response-interceptor";
import PermissionGroup from '@/models/settings/PermissionGroup';
import PermissionGroupLookup from '@/models/settings/PermissionGroupLookup';
import PermissionGroupDetails from '@/models/settings/PermissionGroupDetails';
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class WhqPermissionGroupsApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/permissiongroups`;
    super(interceptors, baseUrl);
  }

  public async getPermissionGroups(): Promise<PermissionGroup[]> {
    let permissionGroupList: PermissionGroup[];

    try {
      const response = await this.axiosInstance.get<PermissionGroup[]>("");
      if (response?.data?.length > 0 && response.status === 200) {
        permissionGroupList = response.data.map((permissionGroup) => new PermissionGroup(permissionGroup));
      } else {
        throw new Error("Failed to parse permission group list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the permission group list.",
        error
      );

      return Promise.reject(error);
    }
    return permissionGroupList;
  }

  public async createPermissionGroup(permissionGroupFormModel: PermissionGroupDetails): Promise<PermissionGroupDetails> {
    try {
      const response = await this.axiosInstance.post<PermissionGroupDetails>("", permissionGroupFormModel);

      if (response && response.status === 201) {
        return new PermissionGroupDetails(response.data);
      } else {
        throw new Error("Failed to create permission group.");
      }
    }
    catch (error) {
      console.error(
        "An unexpected error occurred attempting to create permission group.",
        error
      );

      return Promise.reject(error);
    }
  }

  public async editPermissionGroup(id: number, permissionGroupFormModel: PermissionGroupDetails): Promise<boolean> {
    try {
      const response = await this.axiosInstance.put<boolean>(`${id}`, permissionGroupFormModel);

      if (response.status === 200) {
        return true;
      } else {
        throw new Error("Failed to edit permission group.");
      }

    } catch (error) {
      console.error(
        "An unexpected error occurred attempting editting permission group.",
        error
      );
    }
  }

  public async deletePermissionGroup(id: number): Promise<boolean> {
    try {
      const response = await this.axiosInstance.delete<boolean>(`${id}`);

      if (response.status === 204) {
        return true;
      } else {
        throw new Error("Failed to delete permission group.");
      }

    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to delete permission group.",
        error
      );
    }
  }

  public async getPermissionGroupsLookup(excludeAdminGroup?: boolean){
    let permissionGroupLookup: PermissionGroupLookup[];

    let _params: any = {};

    if(excludeAdminGroup !== null && excludeAdminGroup !== undefined) 
    {
        _params.excludeAdminGroup = excludeAdminGroup;
    }

    try {
      const response = await this.axiosInstance.get<PermissionGroupLookup[]>("lookup", {
        params: _params
      });
      
      if (response?.data?.length > 0 && response.status === 200) {
        permissionGroupLookup = response.data.map((permissionGroupLookup) => new PermissionGroupLookup(permissionGroupLookup));
      } else {
        throw new Error("Failed to parse permission group lookup");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the permission group lookup.",
        error
      );
    }
    return permissionGroupLookup;
  }

  public async getPermissionGroupDetails(id: number): Promise<PermissionGroupDetails> {
    let permissionGroupDetails: PermissionGroupDetails;
    try {
      const response = await this.axiosInstance.get<PermissionGroupDetails>(`${id}/details`);
      if (response?.data && response.status === 200) {
        permissionGroupDetails = new PermissionGroupDetails(response.data);
      } else {
        throw new Error("Failed to parse permission group details");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the permission group details.",
        error
      );

      return Promise.reject(error);
    }
    return permissionGroupDetails;
  }

  public async postMoveUsersToPermissionGroup(userIds: Array<number>, permissionGroupId: number): Promise<PermissionGroupDetails> {
    let permissionGroupDetails: PermissionGroupDetails;

    try {
      const response = await this.axiosInstance.post<PermissionGroupDetails>(
        `moveUsers/${permissionGroupId}`,
        userIds
      );

      if (response?.data && response.status === 200) {
        permissionGroupDetails = new PermissionGroupDetails(response.data);
      } else {
        throw new Error("Failed to parse permission group details");
      }
    } catch (error) {
      console.error(
        `An unexpected error occurred.`,
        error
      );

      return Promise.reject(error);
    }
    return permissionGroupDetails;
  }
}

export const whqPermissionGroupsApi = new WhqPermissionGroupsApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
