import { WhqDocumentApi } from "@/axios/instances/whqDocumentsApi";
import DocumentCategory from "@/models/documents/documentCategory";
import { DocumentMetadata } from "@/models/documents/documentMetadata";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, Ref } from "vue";

export const useDocumentMetadataStore = defineStore("documentMetadataStore", () => {
    const isDocumentUploaded: Ref<boolean> = ref(false);
    const documentList: Ref<DocumentMetadata[]> = ref(new Array<DocumentMetadata>());
    const isDocumentDeleted: Ref<boolean> = ref(false);
    const documentCategories: Ref<DocumentCategory[]> = ref([]);
    
    async function addDocumentMetadata(documentMetadata: DocumentMetadata): Promise<void> {
        isDocumentUploaded.value = await WhqDocumentApi.addDocument(documentMetadata)
    }

    async function fetchDocumentList() {
        documentList.value = await WhqDocumentApi.fetchDocumentList();
    }
    async function fetchDocumentCategoryList() {
        documentCategories.value = await WhqDocumentApi.fetchDocumentCategoryList();
    }
    async function deleteDocument(documentMetadataId) {
        isDocumentDeleted.value = await WhqDocumentApi.deleteDocument(documentMetadataId);
    }

    return {
        isDocumentUploaded,
        addDocumentMetadata,
        documentList,
        fetchDocumentList,
        documentCategories,
        fetchDocumentCategoryList,
        isDocumentDeleted,
        deleteDocument
    };

});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDocumentMetadataStore, import.meta.hot));
}