import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import Notification, { INotificationObj } from "../models/notifications/Notification";
import { CreateNotification } from "@/models/notifications/CreateNotification";
import { NotificationState } from "../enums/notifications/NotificationState";
import { notificationsApi } from "@/axios/instances/notificationsApi";
import { NotificationSetting } from "@/models/settings/NotificationSetting";
import { ApiResponse } from "@/models/ApiResponse";
import { mapCreateTokenData } from '@/utilities/createNotification'


export const useNotificationStore = defineStore("notification", () => {

  const notifications: Ref<Notification[]> = ref(new Array<Notification>());

  const notificationSettings: Ref<NotificationSetting[]> = ref<NotificationSetting[]>([]);

  const hasUnreadNotifications: ComputedRef<boolean> = computed(() =>
    notifications.value.some(
      (notification) => notification.state === NotificationState.Unread
    )
  );

  async function fetchNotifications(): Promise<void> {
    notifications.value = await notificationsApi.getNotifications();
    notifications.value.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async function createNotification(CreateNotification: INotificationObj): Promise<CreateNotification> {
    const notificationData = mapCreateTokenData(CreateNotification)
    return notificationsApi.createNotification(notificationData);
  }

  async function addNotification(notification: Notification): Promise<void> {
    // Push new notification to the top of the notification list
    notifications.value.unshift(notification);
  }

  async function readNotification(notificationId: number): Promise<void> {
    notifications.value.forEach((notification: Notification) => {
      if (notification.id === notificationId) {
        notification.state = NotificationState.Read;
      }
    });
    await notificationsApi.readNotification(notificationId);
  }

  async function readAllNotification(): Promise<void> {
    notifications.value.forEach(
      async (notification: Notification): Promise<void> => {
        notification.state = NotificationState.Read;
        await notificationsApi.readNotification(notification.id);
      }
    );
  }

  async function deleteNotification(notificationId: number): Promise<void> {
    notifications.value = notifications.value.filter(
      (notification: Notification) => notification.id !== notificationId
    );
    await notificationsApi.deleteNotification(notificationId);
  }

  async function deleteAllNotification(): Promise<void> {
    notifications.value.forEach(
      async (notification: Notification): Promise<void> => {
        await notificationsApi.deleteNotification(notification.id);
      }
    );
    notifications.value = new Array<Notification>();
  }

  async function fetchNotificationSettings(): Promise<void> {
    notificationSettings.value = await notificationsApi.getNotificationSettings();
  }

  async function changeNotificationSetting({
    notificationSetting,
  }: {
    notificationSetting: NotificationSetting
  }): Promise<ApiResponse> {
    return await notificationsApi.changeNotificationSetting({
      notificationSetting
    })
  }

  return {
    notifications,
    hasUnreadNotifications,
    notificationSettings,
    fetchNotifications,
    createNotification,
    addNotification,
    readNotification,
    readAllNotification,
    deleteNotification,
    deleteAllNotification,
    fetchNotificationSettings,
    changeNotificationSetting
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useNotificationStore, import.meta.hot)
  );
}
