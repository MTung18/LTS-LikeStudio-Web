import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class CalendarApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
        super(interceptors, baseUrl);
    }

    public async getCalendar(listOfEmployeeIds: number[]): Promise<any> {
        try {
            const response = await this.axiosInstance.get('calendars', {
                params: {
                  listOfEmployeeIds: listOfEmployeeIds?.join(',')
                }
              });

            if (response.status === 200 && response.data) {
                return response.data;
            } else {
                throw new Error("Failed to parse calendar");
            }
        } catch (error) {
            console.error("An unexpected error occurred attempting to retrieve the Calendar List.");
        }
    }

    public async getListOfEmployee(employeeId?: number): Promise<any> {
        try {
            const response = await this.axiosInstance.get(`Calendars/employeeFilter`, {
                params: { employeeId: employeeId }
            });

            if (response.status === 200 && response.data) {
                return response.data;
            } else {
                throw new Error("Failed to parse employee list");
            }
        } catch (error) {
            console.error("An unexpected error occurred attempting to retrieve the Employee List.");
        }
    }

    public async getListOfSupervisor(): Promise<any> {
        try {
            const response = await this.axiosInstance.get(`Calendars/teamFilter`);

            if (response.status === 200 || response.status === 204) {
                return response.data;
            } else {
                throw new Error("Failed to parse supervisor list");
            }
        } catch (error) {
            console.error("An unexpected error occurred attempting to retrieve the Supervisor List.");
        }
    }
}

export const calendarApi = new CalendarApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);
