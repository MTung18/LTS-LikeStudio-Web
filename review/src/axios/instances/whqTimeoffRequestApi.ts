import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { Request } from "@/models/timeoff/Request";
import { Event } from "@/models/timeoff/Event";
import { ApiResponse } from "@/models/ApiResponse";
import { showDates } from "@/utilities/formatUtils";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { formatUTCToLocalDate } from "@/functions/DateUtilityFunctions";

export type requestBody = {
  id: number;
  rejectReason?: string;
};

export default class WhqTimeoffRequestApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getRequests(paramsData?): Promise<Request[]> {
    let timeoffRequestList: Request[] = [];
    try {
      const response = await this.axiosInstance.get<Request[]>("TimeOffRequests", {
        params: paramsData
      });
      if (response && response.data && response.status === 200) {
        timeoffRequestList = response.data.map(timeoffRequest => {
          const newTimeoffRequest = new Request(timeoffRequest);
          newTimeoffRequest.dateFilter = showDates(newTimeoffRequest.requestDates);
          return newTimeoffRequest;
        });
      } else {
        throw new Error("Failed to parse timeoff request list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Timeoff Request list.",
      );
    }

    return timeoffRequestList;
  }

  public async getRequest(id: number): Promise<Request> {
    let timeoffRequest: Request;
    try {
      const response = await this.axiosInstance.get<Request>(`TimeOffRequests/${id}/detail`);
      if (response && response.data && response.status === 200) {
        timeoffRequest = new Request(response.data);
      } else {
        throw new Error(`Failed to parse timeoff request ${id} detail`);
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve this Timeoff Request.",
      );
    }

    return timeoffRequest;
  }

  public async approveRequest(request: requestBody): Promise<ApiResponse> {
    return await this.axiosInstance.put("TimeOffRequests/approve", request).then(response => {
      return {
        status: response.status,
        errorMessage: response.data,
        success: true,
        data: response.data?.listOfDateId
      }
    }).catch((error) => {
      return {
        status: error.response.status,
        errorMessage: error.response.data.errorMessage,
        success: false
      }
    });
  }

  public async cancelRequest(id: string | number): Promise<ApiResponse> {
    return await this.axiosInstance.put(`TimeOffRequests/${id}/cancel`).then(response => {
      return {
        status: response.status,
        errorMessage: response.data,
        success: true,
        data: response.data?.listOfDateId
      }
    }).catch((error) => {
      return {
        status: error.response.status,
        errorMessage: error.response.data.errorMessage,
        success: false
      }
    });
  }

  public async rejectRequest(request: requestBody): Promise<ApiResponse> {
    return await this.axiosInstance.put("TimeOffRequests/reject", request).then(response => {
      return {
        status: response.status,
        errorMessage: response.data,
        success: true,
        data: response.data?.listOfDateId
      }
    }).catch((error) => {
      return {
        status: error.response.status,
        errorMessage: error.response.data.errorMessage,
        success: false
      }
    })
  }

  public async bulkApprove(requests: requestBody[]): Promise<ApiResponse> {
    return await this.axiosInstance.post("TimeOffRequests/bulkApprove", requests).then(response => {
      return {
        status: response.status,
        errorMessage: response.data,
        success: true
      }
    }).catch((error) => {
      return {
        status: error.response.status,
        errorMessage: error.response.data.errorMessage,
        success: false
      }
    });
  }

  public async bulkReject(requests: requestBody[]): Promise<ApiResponse> {
    return await this.axiosInstance.post("TimeOffRequests/bulkReject", requests).then(response => {
      return {
        status: response.status,
        errorMessage: response.data,
        success: true
      }
    }).catch((error) => {
      return {
        status: error.response.status,
        errorMessage: error.response.data.errorMessage,
        success: false
      }
    })
  }

  public async addEvent(event: Event): Promise<Event> {
    if (event.id) delete event.id;
    if (event.eventId) delete event.eventId;
    if(event.notificationDate) event.notificationDate = formatUTCToLocalDate(event.notificationDate);

    try {
      const response = await this.axiosInstance.post("Events", event);
      return response.data;
    } catch (error) {
      console.error("Error add event:", error);
    }
  }

  public async updateEvent(event: Event): Promise<void> {
    const eventId = event.eventId;

    if (eventId) delete event.eventId;
    if (event.id) delete event.id;
    if(event.notificationDate) event.notificationDate = formatUTCToLocalDate(event.notificationDate);

    try {
      await this.axiosInstance.put("Events/" + eventId, event);
    } catch (error) {
      console.error("Error update event:", error);
    }
  }

  public async deleteEvent(event: Event): Promise<void> {
    try {
      await this.axiosInstance.delete("Events/" + event.eventId);
    } catch (error) {
      console.error("Error delete event:", error);
    }
  }

  public async getRequestedLeaveYears(): Promise<Request[]> {
    let listRequestedLeaveYears;
    try {
      const response = await this.axiosInstance.get<Request[]>(`TimeOffRequests/requestedLeaveYears`);

      if (
        response &&
        response.data &&
        response.data.length > 0 &&
        response.status === 200
      ) {
        listRequestedLeaveYears = response.data;
      } else {
        throw new Error("Failed to parse the list of requested leave years.");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred while attempting to retrieve the list of requested leave years.",
        error
      );
    }
    return listRequestedLeaveYears;
  }
}

export const whqTimeoffRequestApi = new WhqTimeoffRequestApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor
]);
