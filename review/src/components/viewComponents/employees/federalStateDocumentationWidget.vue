<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue';
import { BryntumGrid } from '@bryntum/grid-vue-3';
import { EmployeeDocumentState } from "@/enums/EmployeeDocumentState";
import { useAlerts } from '@/composables/useAlerts';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { formatPath } from '@/helper/hqSuite/formatHelper';
import { MESSAGE } from '@/data/message';
import { DocumentMetadata } from '@/models/documents/documentMetadata';
import { DocumentCategory as DocumentCategoryEnum } from "@/enums/DocumentCategory";
import { useDocumentMetadataStore } from '@/stores/documentMetadataStore';
import { Store } from '@bryntum/grid';
import EmployeeRenderedDocumentInformation from "@/models/employees/EmployeeRenderedDocumentInformation";

interface Props {
    federalStateGridConfig: any;
    federalStateGridRenderedConfig: any;
    folderPath: string;
    employeeId?: number;
    title: string;
    dataForGrid: DocumentMetadata[];
    hasPendingFoundationApproval: boolean;
    dataForRenderedGrid: EmployeeRenderedDocumentInformation[];
}

const props = withDefaults(defineProps<Props>(), {
    federalStateGridConfig: [],
    federalStateGridRenderedConfig: [],
    folderPath: '',
    title: '',
    employeeId: null,
    hasPendingFoundationApproval: false
});

const emit = defineEmits(['documentUploaded']);


const activeTab: Ref<EmployeeDocumentState> = ref(EmployeeDocumentState.Rendered);
const uploadedDocumentInfo: Ref<any> = ref(null);
const fileInput = ref(null);
const file = ref<File | null>({ name: '' } as File);
const acceptableFileExtensions = ref('');
const documentMetadataInput = ref(new DocumentMetadata());

const { notifySuccess, notifyError } = useAlerts();
const hqSuiteStore = useHQSuiteStore();
const documentMetadataStore = useDocumentMetadataStore();
const allowedExtensions = computed(() => hqSuiteStore.allowedExtensions);

const gridStore: Ref<Store> = ref(
  new Store({
    sorters: [{ field : 'updatedOn', ascending : true }]
  })
);

onMounted(async () => {
    await getAllowedExtensions();
});

function switchTab(tab: EmployeeDocumentState): void {
    activeTab.value = tab;
}

async function getAllowedExtensions() {
    if (allowedExtensions.value?.length <= 0) {
        await hqSuiteStore.fetchAllowedExtensions();
        acceptableFileExtensions.value = allowedExtensions.value?.map(u => u.extensionType)?.join(', ');
    }
}

async function onFileChange($event): Promise<void> {
    const target = $event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
        file.value = target.files[0];
        await save();
    }
}

async function save() {
    try {
        await saveFile();
        await saveDocumentMetaData();
    } catch (error: any) {
        notifyError(MESSAGE.COMMON.UPLOAD_ERROR);
        console.debug(error);
    }
}

async function saveFile(): Promise<void> {
    if (file.value) {
        await hqSuiteStore.uploadDocument({ path: formatPath(props.folderPath), file: file.value, fileName: file.value.name }, true);
        uploadedDocumentInfo.value = hqSuiteStore.uploadedDocumentDetails;
    }
}

async function saveDocumentMetaData(): Promise<void> {
    documentMetadataInput.value.documentCategoryId = DocumentCategoryEnum.General;
    documentMetadataInput.value.name = file.value.name;
    documentMetadataInput.value.description = props.title;
    if (props.employeeId) {
        documentMetadataInput.value.employeeId = props.employeeId;
    }

    if (uploadedDocumentInfo.value?.path && uploadedDocumentInfo.value?.path != '') {
        documentMetadataInput.value.filePath = uploadedDocumentInfo.value.path;
        await documentMetadataStore.addDocumentMetadata(documentMetadataInput.value);
        notifySuccess(MESSAGE.DOCUMENT_META.SAVE_SUCCESS);
        // refresh grid
        emit('documentUploaded');
    }
}

</script>

<template>
    <fs-card class="dashboard-card" no-body>
        <fs-card-header class="dashboard-card__header">
            <fs-col>
                <h2 class="hq-pg__title ml-2 text-cyan">{{ title }}</h2>
            </fs-col>
            <fs-col lg="auto" class="mb-1">
            <div class="ms-auto filter-tabs">
                <fs-button-group>
                    <fs-button variant="link" @click="switchTab(EmployeeDocumentState.Rendered)" :class="{'active': activeTab === EmployeeDocumentState.Rendered}">Rendered</fs-button>
                    <fs-button variant="link" @click="switchTab(EmployeeDocumentState.Uploaded)" :class="{'active': activeTab === EmployeeDocumentState.Uploaded}">Uploaded</fs-button>
                </fs-button-group>
            </div>
        </fs-col>
        </fs-card-header>
        <fs-card-body class="p-0">
            <div class="list__integration list__table">
                <fs-card-body class="dashboard-card__content chart-card__content">
                    <bryntum-grid v-if="activeTab === EmployeeDocumentState.Rendered" :readOnly="true" ref="grid" v-bind="federalStateGridRenderedConfig" :data="$props.dataForRenderedGrid"/>
                    <bryntum-grid v-else :readOnly="true" ref="grid" v-bind="federalStateGridConfig" :data="$props.dataForGrid" :store="gridStore" />
                </fs-card-body>
            </div>
        </fs-card-body>
        <fs-card-footer class="federalStateCard_footer upload_text">
            <font-awesome-icon :icon="['fal', 'upload']"
                class="text-primary"
            />
            <input id="fileInput" type="file" ref="fileInput" :accept="acceptableFileExtensions"
                v-show="false" @change="onFileChange($event)" />
            <fs-link :class="`upload_text ${hasPendingFoundationApproval ? 'disabled' : ''}`" @click="($refs.fileInput as HTMLElement).click()">
                Upload</fs-link>
        </fs-card-footer>
    </fs-card>            
</template>

<style lang="scss" scoped>

.upload_text {
    align-items: center;
    text-decoration: none;
    margin-left: .5em;
}

.federalStateCard_footer {
    height: 48px;
    padding: 0 16px;
    display: flex;
    background-color: #FFFFFF;
    justify-content: flex-end;
    font-size: 1.15em;
}

.bg-gray {
  background-color: #eff1f3;
}

</style>