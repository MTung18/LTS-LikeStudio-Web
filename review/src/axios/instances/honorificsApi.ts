import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import Honorific from "@/models/employees/Honorific";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class HonorificsApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/Honorifics`;
    super(interceptors, baseUrl);
  }

  public async getHonorifics(): Promise<Honorific[]> {
    let honorificDropdownData: Honorific[] = [];

    try {
        const response = await this.axiosInstance.get<Honorific[]>("");
        if (response?.data?.length > 0 && response.status === 200) {
          honorificDropdownData = response.data
            .filter(h => h.honorificId)
            .map((honorific) => new Honorific(honorific));
        } else {
          throw new Error("Failed to parse honorific list");
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred attempting to retrieve the honorific list.",
          error
        );
  
        return Promise.reject(error);
      }
      return honorificDropdownData;
  }
}

export const honorificsApi = new HonorificsApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
  