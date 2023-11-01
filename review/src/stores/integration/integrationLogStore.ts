import { acceptHMRUpdate, defineStore } from "pinia";
import { integrationLogApi } from "@/axios/instances/integrationLogApi";
import type { IntegrationLog } from "@/models/foundationIntegration/IntegrationLog";

export const useIntegrationLogStore = defineStore("integrationLog", () => {

    async function getIntegrationLogs(integrationProvider: number): Promise<IntegrationLog[]> {
        const result = await integrationLogApi.getIntegrationLogs(integrationProvider);
        return result;
    }

    return {
        getIntegrationLogs,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useIntegrationLogStore, import.meta.hot));
}
