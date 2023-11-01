import { NotificationState } from "../../enums/notifications/NotificationState";

import { AlertEvent, AlertResourceType } from "@/enums/notifications/NotificationEnum";

export interface IUserRecipient {
  userId?: number,
  userGuid?: string,
  clientId?: number
}

export interface IAlertNotificationMetadataInput {
  alertApplicationId?: number,
  alertEventId?: AlertEvent,
  alertResourceTypeId?: AlertResourceType,
  resourceId?: number,
  resourceGuid?: string,
  clientId?: number,
  userGuid?: string
}

export interface INotificationObj {
  messagePayload?: string,
  messageType?: string,
  alertEventId?: AlertEvent,
  alertResourceTypeId?: AlertResourceType,
  resourceId?: number,
  userRecipients?: IUserRecipient[],
  alertApplicationId?: number,
  userGuid?: string,
}

export default class Notification {
  public id?: number;
  public userId?: number;
  public payload?: string;
  public state?: NotificationState;
  public alertEventId?: AlertEvent;
  public alertResourceTypeId?: AlertResourceType;
  public resourceId?: number;
  public resourceGuid?: string;
  public date?: string;
  public alertApplicationId?: number;
  public userRecipients?: IUserRecipient[];
  public messageType?: string;
  public messagePayload?: string;
  public alertNotificationMetadataInput?: IAlertNotificationMetadataInput;

  public constructor(init?: Partial<Notification>) {
    Object.assign(this, init);
  }
}
