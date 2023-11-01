import { acceptHMRUpdate, defineStore } from "pinia";
import { IImportSync } from "@/contracts/IImportSync";
import { IntegrationFunction } from "@/enums/IntegrationFunction";
import AccessTokenRequestInterceptor from "../axios/interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../axios/interceptors/accessToken-response-interceptor";
import FoundationImportSyncAPI from "../axios/instances/foundationImportSyncAPI";
import { FoundationImportSyncPropertyKey } from "@/models/foundationIntegration/FoundationImportSyncPropertyKey";
import { getFoundationImportSyncPropertyKey } from "@/functions/FoundationImportSyncFunction";
import { encodeBase64 } from "@/functions/FormatterUtilityFunction";

export function useFoundationIntegrationFactory(integrationFunction: IntegrationFunction) {

  const propKey: FoundationImportSyncPropertyKey = getFoundationImportSyncPropertyKey(integrationFunction);
  const tokenInterceptor = [AccessTokenRequestInterceptor, AccessTokenResponseInterceptor];
  const apiInstance: IImportSync = new FoundationImportSyncAPI(tokenInterceptor, propKey?.endpointName, propKey?.overRideEachEndpointName);
  const storeName = `foundationIntegration${integrationFunction}`;

  const foundationIntegrationStore = defineStore(storeName, () => {

    async function getData(isSynced: boolean): Promise<any> {
      const foundationData = await apiInstance.fetch(isSynced);
      return foundationData;
    }

    async function importData(data: any[]): Promise<boolean> {
      formatDataForSubmit(data);
      return await apiInstance.import(data);
    }

    async function syncData(data: any[]): Promise<boolean> {
      formatDataForSubmit(data);
      return await apiInstance.sync(data);
    }

    function formatDataForSubmit(data: any[]) {
      data.forEach(currentData => {
        //Remove all the property which doesn't need to post in body
        delete currentData["key"];
        delete currentData["name"];
        delete currentData["isDeleted"];
        delete currentData["isSelected"];
        
        if (propKey.toEncodeProperties != null && propKey.toEncodeProperties.length > 0) {
          for (let index = 0; index < propKey.toEncodeProperties.length; index++) {
            const propertyNameToEncode = propKey.toEncodeProperties[index];
            const valueToEncode = currentData[propertyNameToEncode];
            if (valueToEncode)
              currentData[propertyNameToEncode] = encodeBase64(valueToEncode);
          }
        }
      });

    }

    return {
      propKey,
      getData,
      importData,
      syncData
    };
  });

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(foundationIntegrationStore, import.meta.hot));
  }
  return foundationIntegrationStore;
}
