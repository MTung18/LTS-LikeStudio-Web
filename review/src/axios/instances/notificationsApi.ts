import Notification from "../../models/notifications/Notification";
import { CreateNotification } from "@/models/notifications/CreateNotification";
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from '@/helper/hqSuite/appSettingsHelper';
import { ApiResponse } from "@/models/ApiResponse";
import { NotificationSetting } from "@/models/settings/NotificationSetting";
import {
  AlertApplicationId
} from "@/enums/notifications/NotificationEnum";

/* Sample class on how to split out axios instances.  
For now since we are using one API, we should still split out these instances by API controller or where it makes sense to do so. 
This makes it easier when we split to multiple micro-services */
export default class NotificationsApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.SystemNotificationsApiRootUrl;
    super(interceptors, baseUrl);
  }

  HRM_ALERT_APPLICATION_ID = 2;

  WHQ_APPLICATION_ID = getLocalAppsettings().AzureB2C.ClientId;

  public async getNotifications(): Promise<Array<Notification>> {
    let notificationList: Array<Notification> = [];
    try {
      const response = await this.axiosInstance.get<Array<Notification>>(
        `api/notification?alertApplicationId=${AlertApplicationId.Hrm}`
      );
      if (
        response &&
        response.data &&
        response.data.length > 0 &&
        response.status === 200
      ) {
        notificationList = response.data.map(
          (notification) => new Notification(notification)
        );
      } else {
        throw new Error("Failed to parse notifications");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the notifications.",
        error
      );
    }

    return notificationList;
  }

  public async readNotification(notificationId: number): Promise<void> {
    try {
      await this.axiosInstance.put<void>(
        `api/notification/${notificationId}`
      );

    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the notifications.",
        error
      );
    }
  }

  public async deleteNotification(notificationId: number): Promise<void> {
    try {
      const response = await this.axiosInstance.delete<void>(
        `api/notification/${notificationId}`
      );
      if (response && response.status !== 200) {
        throw new Error(
          `An error occurred attempting to delete notification: ${notificationId}`
        );
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to delete the notifications.",
        error
      );
    }
  }

  public async createNotification(data: CreateNotification): Promise<CreateNotification> {
    try {
      const response = await this.axiosInstance.post(`api/notification/system`, data)

      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to create Notification");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to create the notification.",
        error
      );
    }
  }

  public async getNotificationSettings(): Promise<NotificationSetting[]> {
    const endPoint = `api/whq/settings/${this.WHQ_APPLICATION_ID}`;
    let notificationSettings: NotificationSetting[];
    try {
      const result = await this.axiosInstance.get<NotificationSetting[]>(endPoint);
      if (result && result.status === 200) {
        notificationSettings = result.data;
      } else {
        throw new Error("Failed to parse notification settings");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the notification settings.",
      );
    }
    return notificationSettings;
  }

  public async changeNotificationSetting({
    notificationSetting,
  }: {
    notificationSetting: NotificationSetting
  }): Promise<ApiResponse> {
    const endPoint = `api/whq/settings`;
    notificationSetting.applicationId = this.WHQ_APPLICATION_ID;
    try {
      const response = await this.axiosInstance.post<NotificationSetting>(endPoint, notificationSetting);
      if (response && response.status === 200) {
        return { success: true };
      } else {
        return {
          success: false,
          errorMessage: "An unexpected error occurred attempting to update request.",
        };
      }
    } catch (error) {
      return {
        success: false,
        status: error.response.status,
        errorMessage: "An unexpected error occurred attempting to update request.",
      };
    }
  }
}

export const notificationsApi = new NotificationsApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
