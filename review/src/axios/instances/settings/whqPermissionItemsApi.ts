import AxiosBase from "../axiosBase";
import AccessTokenRequestInterceptor from "../../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../../interceptors/accessToken-response-interceptor";
import { PermissionItem } from "@/models/settings/PermissionItem";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class WhqPermissionItemsApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/PermissionItems`;
    super(interceptors, baseUrl);
  }

  public async getPermissionItems(): Promise<PermissionItem[]> {
    let permissionGroupsPermissionItem: PermissionItem[];
    try {
      const response = await this.axiosInstance.get<PermissionItem[]>("");
      if (response?.data?.length > 0 && response.status === 200) {
        permissionGroupsPermissionItem = response.data.map((permissionItem) => new PermissionItem(permissionItem));
      } else {
        throw new Error("Failed to parse permission items");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve permission items.",
        error
      );
    }
    return permissionGroupsPermissionItem;
  }

  public async getPermissions(): Promise<Record<string, boolean>> {

    let permissions: Record<string, boolean> = { "NOT_GRANULAR": true };

    try {
      const response = await this.axiosInstance.get<Array<string>>("me");

      if (response?.data && Array.isArray(response.data) && response.status === 200) {

        response.data.forEach(p => {
          permissions[p] = true;
        });
      }
    }
    catch (error) {
      console.error(error);
    }

    return permissions;
  }
}

export const whqPermissionItemsApi = new WhqPermissionItemsApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
