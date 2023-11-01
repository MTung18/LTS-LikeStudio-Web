import { ref, Ref } from 'vue';
import { acceptHMRUpdate, defineStore } from "pinia";
import { reportTemplateApi } from '@/axios/instances/reportTemplateApi';

export const useReportTemplate = defineStore("reportTemplate", () => {
    const stateDocuments: Ref<string[] | undefined> = ref([]);
    async function getDocumentTemplate(filename: string, isDownload: boolean) {
        try {
            return await reportTemplateApi.getDocumentTemplate(filename, isDownload);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function getStateDocuments(stateName: string): Promise<void> {
        stateDocuments.value = await reportTemplateApi.getStateRelatedDocuments(stateName);
    }

    return {
        stateDocuments,
        getDocumentTemplate,
        getStateDocuments
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useReportTemplate, import.meta.hot)
    )
}