import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import JobTitle from '../../models/JobTitle';
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import { ActionType } from "../../enums/ActionType";

export default class JobTitleApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getJobTitles(): Promise<JobTitle[]> {
    let jobTitle: JobTitle[];
    try {
      const url = `/JobTitles`;
      jobTitle = await this.PerformFetch<JobTitle[]>(url);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
      throw error;
    }
    return jobTitle;
  }

  public async createJobTitle(jobTitleName: string): Promise<boolean> {
    try {
      return await this.PerformPost<boolean>(`JobTitles`, { jobTitleName });
    } catch (error) {
      console.error(this.errormessage(ActionType.Create), error);
    }
    return false;
  }
}

export const jobTitleApi = new JobTitleApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
