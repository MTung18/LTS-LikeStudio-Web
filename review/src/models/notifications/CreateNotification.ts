export interface IUserRecipients {
    userId?: number;
    userGuid?: string;
    clientId?: number;
}

export interface IAlertNotificationMetadataInput {
    alertApplicationId?: number;
    alertEventId?: number;
    alertResourceTypeId?: number;
    resourceId?: number;
    clientId?: number;
    userGuid?: string;
}

export interface CreateNotification {
    userRecipients?: IUserRecipients[];
    messageType?: string;
    messagePayload?: string;
    alertNotificationMetadataInput?: IAlertNotificationMetadataInput;
}