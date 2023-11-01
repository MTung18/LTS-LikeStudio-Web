import { usePermissionItemStore } from "@/stores/settings/permissionItemStore";
import { storeToRefs } from "pinia";

let fetchPermissionsPromise;

export const RefreshPermissionsPlugin = {
  install(app) {
    let intervalId = null;
    const oneSecond = 1000;

    const { fetchPermissions} = usePermissionItemStore();
    const { permissions } = storeToRefs(usePermissionItemStore());
    
    const startFetchPermissions = (interval = oneSecond * 30) => {      
      intervalId = setInterval(fetchPermissions, interval);
    };

    const stopFetchPermissions = () => {
      clearInterval(intervalId);
      intervalId = null;
    }

    app.provide('$providePermissions', permissions);
    
    fetchPermissionsPromise = fetchPermissions();
    startFetchPermissions();
  },

  isReady(): Promise<void> {
    return fetchPermissionsPromise;
  }
};