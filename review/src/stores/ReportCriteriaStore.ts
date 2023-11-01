import {
    IReportGet
} from "@/models/report/Report";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import { reportsApi } from "@/axios/instances/reportsApi";

export const useReportCriteriaStore = defineStore("reportCriteria", () => {
    const reportsStore: Ref<IReportGet> = ref({});
    const reportTemplateStore: Ref<string> = ref('');

    async function fetchReportCriteriaStore(reportGuid: string): Promise<void> {
        reportsStore.value = await reportsApi.getReportCriteria(reportGuid);
    }

    return {
        fetchReportCriteriaStore,
        reportsStore,
        reportTemplateStore
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useReportCriteriaStore, import.meta.hot));
}


