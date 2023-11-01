import { acceptHMRUpdate, defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { foundationCompanyCasConnectionApi } from "@/axios/instances/foundationCompanyCasConnectionApi";
import type { FoundationCompanyCasConnection } from "@/models/foundationIntegration/FoundationCompanyCasConnection";


export const useFoundationCompanyCasConnectionStore = defineStore("foundationCompanyCasConnection", () => {
    const companyCasConnection: Ref<FoundationCompanyCasConnection> = ref(null);

    async function fetchCompanyCasConnection(): Promise<void> {
        companyCasConnection.value = await foundationCompanyCasConnectionApi.getCompanyCasConnection();
    }

    return {
        companyCasConnection,
        fetchCompanyCasConnection,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFoundationCompanyCasConnectionStore, import.meta.hot));
}
