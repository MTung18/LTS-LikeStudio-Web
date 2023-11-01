import { defineStore } from 'pinia'
import { WhqDocumentApi } from "@/axios/instances/whqDocumentsApi";
import { DocumentMetadata } from '@/models/documents/documentMetadata';
import { Ref, ref } from 'vue';

export const useEmployeeDocumentationStore = defineStore('employeeDocumentation', () => {
    const employeeDocumentations: Ref<DocumentMetadata[]> = ref([]);

    async function fetchEmployeeDocumentations(employeeId: number = null): Promise<void> {
        employeeDocumentations.value = await WhqDocumentApi.fetchDocumentList(employeeId);
    }
    return {
        employeeDocumentations,
        fetchEmployeeDocumentations
    };
});