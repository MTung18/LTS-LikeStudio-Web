import { getMsalInstance } from "./msalInstance";
import { EventMessage, EventType } from "@azure/msal-browser";
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { useProductStore } from '@/stores/productStore';
import { getLocalAppsettings } from '@/helper/hqSuite/appSettingsHelper';

let isReady;

export const msalPlugin = {
  install: async () => {
    const azureB2CAuthStore = useAzureB2CAuthStore();
    const productStore = useProductStore();
    const msalInstance = getMsalInstance(getLocalAppsettings());

    isReady = msalInstance.handleRedirectPromise().then(async (authResult: any) => {
      if (!azureB2CAuthStore.activeUserAccount && !authResult?.account) {
        await azureB2CAuthStore.handleLogin();
      }
    });

    msalInstance.addEventCallback(async (event: EventMessage) => {
      switch (event.eventType) {
        case EventType.LOGIN_SUCCESS:
        case EventType.ACQUIRE_TOKEN_SUCCESS:
          if (event.payload) {
            const payload = (event.payload as any);
            await azureB2CAuthStore.setActiveUserAccount(payload.account);
            if (azureB2CAuthStore.acrTokenClaim !== (payload.idTokenClaims["acr"])) {
              console.error('Invalid acr token claim');
              await azureB2CAuthStore.logoutActiveUser();
              break;
            }
          }
          break;
        case EventType.ACQUIRE_TOKEN_FAILURE:
          console.error('Failed to acquire token, logging out');
          await azureB2CAuthStore.logoutActiveUser();
          break;
        case EventType.LOGIN_FAILURE:
          if (event.error.message.indexOf('AADB2C90118') > -1) //AADB2C90118 error code denotes a password reset request
          {
            await azureB2CAuthStore.handlePasswordReset();
          }
          else {
            await azureB2CAuthStore.handleLogin();
          }
      }
      await productStore.fetchAllProducts();
      await azureB2CAuthStore.fetchActiveUserClientList();
      await productStore.fetchProductsByUserIdAndClientId();
    });
  },

  isReady(): Promise<void> {
    return isReady;
  }
}