import { acceptHMRUpdate, defineStore } from "pinia";
import { reportsApi } from "@/axios/instances/reportsApi";
import type { Ref } from "vue";
import { ref } from "vue";
import {
    IReportGet
} from "@/models/report/Report";

export const useReportsStore = defineStore("reportStore", () => {
    const reportsCriteriaStore: Ref<IReportGet> = ref({});

    async function fetchReportCriteriaStore(reportGuid: string): Promise<void> {
        reportsCriteriaStore.value = await reportsApi.getReportCriteria(reportGuid);
    }

    return {
        fetchReportCriteriaStore,
        reportsCriteriaStore,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useReportsStore, import.meta.hot));
}
