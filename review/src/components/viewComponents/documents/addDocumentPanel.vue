<script setup lang="ts">
import { DocumentCategory as DocumentCategoryEnum } from "@/enums/DocumentCategory";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { onMounted, Ref, ref, computed, nextTick, watch } from 'vue';
import { Form as VeeForm, FormValidationResult } from 'vee-validate';
import { DocumentMetadata } from '@/models/documents/documentMetadata';
import { useDocumentMetadataStore } from '@/stores/documentMetadataStore';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { formatPath } from '@/helper/hqSuite/formatHelper';
import { focusOnFirstError } from '@/functions/ValidationUtilityFunctions';
import { DocumentTypes } from '@/helper/hqSuite/pathHelper';
import { useAlerts } from '@/composables/useAlerts';
import { storeToRefs } from 'pinia';
import { MESSAGE } from '@/data/message';

library.add(
    faTimes
);

interface Props {
    folderPath: string;
    showPanel?: boolean;
    docType: DocumentTypes;
    employeeId?: number
}

const props = withDefaults(defineProps<Props>(), {
    folderPath: '',
    showPanel: false,
    docType: DocumentTypes.ClientDocument,
    employeeId: null
});

const selectedDocumentCategory = ref(null);
const documentMetadataInput = ref(new DocumentMetadata());
const observer = ref();
const uploadedDocumentInfo: Ref<any> = ref(null);
const fileInput = ref(null);
const file = ref<File | null>({ name: '' } as File);
const formHasValidated = ref(false);
const acceptableFileExtensions = ref('');
const isSaveButtonDisabled = ref(true);

const documentMetadataStore = useDocumentMetadataStore();
const { documentCategories } = storeToRefs(documentMetadataStore);
const hqSuiteStore = useHQSuiteStore();

const { notifySuccess, notifyError } = useAlerts();

const showDocumentCategory = computed(() => props.docType === DocumentTypes.ClientDocument);
const allowedExtensions = computed(() => hqSuiteStore.allowedExtensions);


const emit = defineEmits(['update:showPanel', 'documentUploaded']);

const localShowPanel = computed({
    get() {
        return props.showPanel;
    },
    set(value) {
        // reset form
        resetForm(true);
        nextTick();
        emit("update:showPanel", value);
    },
});

watch(() => [documentMetadataInput.value, file.value, selectedDocumentCategory], () => {
    if (documentMetadataInput.value.name || documentMetadataInput.value.description
        || documentMetadataInput.value.isRestricted || (selectedDocumentCategory.value && selectedDocumentCategory.value.id > 0)
        || file.value?.name) {
        isSaveButtonDisabled.value = false;
    }
}, { immediate: true, deep: true });

function onFileChange($event) {
    const target = $event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
        file.value = target.files[0];
    }
}

async function saveFile() {
    if (file.value) {
        await hqSuiteStore.uploadDocument({ path: formatPath(props.folderPath), file: file.value, fileName: file.value.name }, true);
        uploadedDocumentInfo.value = hqSuiteStore.uploadedDocumentDetails;
    }
}

async function saveDocumentMetaData(isOpen: boolean) {
    // Map metadata value
    if (selectedDocumentCategory.value)
        documentMetadataInput.value.documentCategoryId = selectedDocumentCategory.value.id;

    if (props.employeeId) {
        documentMetadataInput.value.employeeId = props.employeeId;
        documentMetadataInput.value.documentCategoryId = DocumentCategoryEnum.General;
    }


    if (uploadedDocumentInfo.value?.path && uploadedDocumentInfo.value?.path != '') {
        documentMetadataInput.value.filePath = uploadedDocumentInfo.value.path;
        await documentMetadataStore.addDocumentMetadata(documentMetadataInput.value);
        if (documentMetadataStore.isDocumentUploaded) {
            notifySuccess(MESSAGE.DOCUMENT_META.SAVE_SUCCESS);
            localShowPanel.value = isOpen;
            resetForm(isOpen);
            // refresh grid
            emit('documentUploaded');
        }
        else {
            notifyError(MESSAGE.DOCUMENT_META.SAVE_ERROR);
        }
    }
    else {
        notifyError(MESSAGE.DOCUMENT_META.SAVE_ERROR);
    }
}

async function resetForm(resetAgain = false) {
    file.value = { name: '' } as File;
    const uploadElement = document.getElementById('fileInput') as HTMLInputElement;
    if (uploadElement) uploadElement.value = null;
    selectedDocumentCategory.value = null;
    await observer.value.resetForm();
    formHasValidated.value = false;
    documentMetadataInput.value = new DocumentMetadata();
    isSaveButtonDisabled.value = true;
    if (resetAgain) {
        setTimeout(async () => {
            await resetForm();
        }, 25);
    }
}

async function save(isOpen: boolean) {
    try {
        const result: FormValidationResult<any> = await observer.value.validate();
        formHasValidated.value = true;
        if (!result.valid) {
            focusOnFirstError('observer');
            return;
        }
        isSaveButtonDisabled.value = true;
        // upload file
        notifySuccess(MESSAGE.COMMON.UPLOADING);
        await saveFile();
        // save documentMetaData
        await saveDocumentMetaData(isOpen);
    }
    catch (error: any) {
        notifyError(MESSAGE.COMMON.UPLOAD_ERROR);
        console.debug(error);
    } finally {
        isSaveButtonDisabled.value = false;
    }
}

async function getAllowedExtensions() {
    if (allowedExtensions.value?.length <= 0) {
        await hqSuiteStore.fetchAllowedExtensions();
        acceptableFileExtensions.value = allowedExtensions.value?.map(u => u.extensionType)?.join(', ');
    }
}

onMounted(async () => {
    await Promise.all([getAllowedExtensions(), documentMetadataStore.fetchDocumentCategoryList()]);
    isSaveButtonDisabled.value = true;
});

</script>

<template>
    <fs-sidebar sidebar-class="fsi-sidebar help-center" body-class="help-center__body" right no-close-on-esc
        no-close-on-backdrop bg-variant="white" width="425px" shadow="sm" header-class="border-bottom"
        footer-class="border-top" aria-label="addDocumentMetaData" v-model="localShowPanel" title="Add Document">
        <!-- footer -->
        <template #footer="{ hide }">
            <div class="d-flex contain py-3">
                <fs-button variant="outline-secondary" class="btn btn-outline-gray" @click="hide">Cancel</fs-button>

                <fs-button variant="outline-green" class="ms-auto" :disabled="isSaveButtonDisabled"
                    @click="save(false)">SAVE
                    & DONE</fs-button>

                <fs-button variant="btn-primary" class="btn btn-primary" :disabled="isSaveButtonDisabled"
                    @click="save(true)">SAVE & NEW</fs-button>
            </div>
        </template>
        <div class="d-flex flex-column h-100 w-100 pt-3">
            <fs-container fluid class="contain">
                <VeeForm ref="observer" id="observer" v-slot="{ meta }">
                    <fs-input :required="true" v-model="documentMetadataInput.name" type="fsTextInput" label="Name"
                        :maxlength="100" :rules="{ required: true }" name="name"
                        :formMeta="{ ...meta, validated: formHasValidated }"></fs-input>

                    <fs-input type="fsTextInput" label="Description" :maxlength="200"
                        v-model="documentMetadataInput.description" name="description"
                        :formMeta="{ ...meta, validated: formHasValidated }"></fs-input>

                    <fs-form-checkbox class="mb-3" style="margin-left: -0.5em;"
                        v-model="documentMetadataInput.isRestricted">
                        <span class="ms-1">Contains Restricted Info</span>
                    </fs-form-checkbox>

                    <fs-input type="fsMultiselectList" v-if="showDocumentCategory" label="Document Category"
                        id="documentCategory" labelId="documentCategoryLabelId" v-model="selectedDocumentCategory"
                        :required="true" :typeaheaddata="documentCategories" typeaheadkey="name"
                        typeaheadvalueattribute="id" name="documentCategory" autocomplete="donotfill"
                        :dropdownSearchable="true" :rules="{ required: true }"
                        :formMeta="{ ...meta, validated: formHasValidated }">
                    </fs-input>

                    <fs-input id="uploaderText" :required="true" type="fsTextInput" label="Upload Document" :readonly="true"
                        name="upload" :rules="{ required: true }" @click="($refs.fileInput as HTMLElement).click()"
                        :formMeta="{ ...meta, validated: formHasValidated }" :model-value="file?.name ?? ''">
                        <template #input-group-content>
                            <input id="fileInput" type="file" ref="fileInput" :accept="acceptableFileExtensions"
                                v-show="false" @change="onFileChange($event)" />
                            <fs-button variant="btn-primary" class="btn btn-primary">BROWSE</fs-button>
                        </template>
                    </fs-input>
                </VeeForm>
            </fs-container>
        </div>
    </fs-sidebar>
</template>