import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';

import Notification, {
    INotificationObj
} from "@/models/notifications/Notification";
export function mapCreateTokenData({
    messagePayload,
    messageType,
    alertEventId,
    alertResourceTypeId,
    resourceId,
    userRecipients,
    alertApplicationId,
    userGuid,
}: INotificationObj): Notification {
    const azureB2CAuthStore = useAzureB2CAuthStore();
    const alertNotificationMetadataInput = {
        alertApplicationId: alertApplicationId ? alertApplicationId : 2,
        alertEventId,
        alertResourceTypeId,
        resourceId,
        userGuid: userGuid || azureB2CAuthStore.activeUserGuid
    }

    return {
        userRecipients,
        messagePayload,
        messageType,
        alertNotificationMetadataInput
    }

}