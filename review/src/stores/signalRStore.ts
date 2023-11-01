import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, Ref } from "vue";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useNotificationStore } from "./notificationStore";
import { useAzureB2CAuthStore } from "./azureB2CAuthStore";
import { getLocalAppsettings } from '@/helper/hqSuite/appSettingsHelper';
import {
  AlertApplicationId
} from "@/enums/notifications/NotificationEnum";

export const useSignalRStore = defineStore("signalR", () => {
  const { addNotification } = useNotificationStore();
  const { fetchAccessToken } = useAzureB2CAuthStore();
  // SIGNALR SETUP - https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-5.0
  const baseUrl = getLocalAppsettings().ClientSide.SystemNotificationsApiRootUrl;
  const signalRNotificationHubConnection: HubConnection =
    new HubConnectionBuilder()
      .withUrl(`${baseUrl}/notificationHub`, {
        accessTokenFactory: async () => await fetchAccessToken(),
      })
      .configureLogging(LogLevel.Information)
      .build();

  const startNotificationSignalRHandler: any = async () => {
    signalRNotificationHubConnection.on("create", (message: any) => {
      if (message.alertApplicationId === AlertApplicationId.Hrm) {
        addNotification(message);
      }
    });
    await signalRNotificationHubConnection.start();
  };

  const isConnectionOpen: Ref<boolean> = ref(false);

  async function startSignalRConnection(): Promise<void> {
    if (
      signalRNotificationHubConnection.state !== HubConnectionState.Connected
    ) {
      await startNotificationSignalRHandler();
      isConnectionOpen.value = true;
    }
  }

  async function stopSignalRConnection(): Promise<void> {
    if (
      signalRNotificationHubConnection.state !== HubConnectionState.Disconnected
    ) {
      await signalRNotificationHubConnection.stop();
    }
    isConnectionOpen.value = false;
  }

  return {
    isConnectionOpen,
    startSignalRConnection,
    stopSignalRConnection,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSignalRStore, import.meta.hot));
}