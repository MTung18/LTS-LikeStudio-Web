<script setup lang="ts">
import { MESSAGE } from "@/data/message";
import { formatPath } from "@/helper/hqSuite/formatHelper";
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { computed, onMounted, ref, watch } from "vue";
import { DownloadButtonStyle } from "@/enums/downloadButtonStyle";
import downloadFile from "@/components/global/downloadFile.vue";
import { useAlerts } from '@/composables/useAlerts';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashCan } from "@fortawesome/pro-light-svg-icons";
library.add(
    faTrashCan
);

interface Props {
    file: any;
    isValid: boolean;
    title: string;
    rootFolder?: string;
    filePath: string;
    acceptFileList?: string[];
    selectedFile?: any;
}

const props = withDefaults(defineProps<Props>(), {
    file: null,
    isValid: true,
    title: '',
    rootFolder: '',
    filePath: '',
    selectedFile: null,
});

const enum EmitNames {
    MODEL = "update:file",
    ISVALID = "update:isValid",
    REMOVE = "removefile"
}
const emits = defineEmits<{
    (e: EmitNames.MODEL, value: any): void;
    (e: EmitNames.ISVALID, value: any): void;
    (e: EmitNames.REMOVE): void;
}>();

defineExpose({
    upload,
});

const MAX_FILE_SIZE = MESSAGE.HQSUITE.FILE_SIZE_10MB;
const ALLOWED_EXTENSION = MESSAGE.HQSUITE.DIRECTDEPOSIT_ALLOWED_EXTENSION;
const maxFileSize = 10000000;
const fileToDownload = ref(props.filePath);

const hqSuiteStore = useHQSuiteStore();
const acceptableFileExtensions = ref('');
const allowedExtensions = computed(() => hqSuiteStore.allowedExtensions);
const fileInput = ref(null);
const localFile = ref(null);
const { notifySuccess, notifyError } = useAlerts();
const errorMessage = ref('');
async function getAllowedExtensions() {
    if (props.acceptFileList?.length <= 0) {
        if (allowedExtensions.value?.length <= 0) {
            await hqSuiteStore.fetchAllowedExtensions();
        }
        acceptableFileExtensions.value = allowedExtensions.value?.map(u => u.extensionType)?.join(', ');
    } else {
        acceptableFileExtensions.value = props.acceptFileList?.join(', ');
    }
}

function isFileTypeSupported(fileType: string) {
    return props.acceptFileList.includes(fileType);
}

function onFileChange($event) {
    const target = $event.target as HTMLInputElement;
    errorMessage.value = '';
    let isValid = true;
    if (target && target.files && target.files.length > 0) {
        localFile.value = target.files[0];
        if (!isFileTypeSupported(localFile.value.type)) {
            notifyError(ALLOWED_EXTENSION);
            errorMessage.value = MAX_FILE_SIZE;
            isValid = false;
        }
        if (localFile.value.size > maxFileSize) {
            notifyError(MAX_FILE_SIZE);
            errorMessage.value = MAX_FILE_SIZE;
            isValid = false;
        }
        emits(EmitNames.MODEL, localFile.value);
        emits(EmitNames.ISVALID, isValid);
    }
}


watch(() => props.file,
    async () => {
        // clear localFile value when reset parent form
        if (!props.file && localFile.value) {
            localFile.value = null;
        }
    },
);

watch(() => props.filePath,
    async () => {
        fileToDownload.value = props.filePath;
    },
);

watch(() => props.selectedFile,
    async () => {
        if (props.selectedFile && props.selectedFile.file)
            localFile.value = props.selectedFile.file;
    },
);

async function upload(path: string = null) {
    const rootPath = path ?? props.rootFolder;
    if (localFile.value) {
        await hqSuiteStore.uploadDocument({ path: formatPath(rootPath), file: localFile.value, fileName: localFile.value.name }, true);
        return hqSuiteStore.uploadedDocumentDetails;
    }
}

const handleRemoveFileItem = (file) => {
    localFile.value = null;
    fileInput.value.value = null;
    fileToDownload.value = "";
    emits(EmitNames.REMOVE);
};

onMounted(async () => {
    await getAllowedExtensions();
});

</script>
<template>
    <div class="form-group fs-input__form-group">
        <label class="fs-input__label" id="fs_label">{{ title }}</label>
        <fs-row>
            <fs-col cols="auto">
                <input id="fileInput" type="file" ref="fileInput" :accept="acceptableFileExtensions" v-show="false"
                    @change="onFileChange($event)" />
                <fs-button variant="outline-primary" size="md" class="btn btn-outline-primary p-2"
                    @click="($refs.fileInput as HTMLElement).click()">
                    <font-awesome-icon icon="fa-solid fa-upload" />
                    <span> Upload</span>
                </fs-button>
                <div class="fs-input__message fs-input__message--error mt-1" v-if="errorMessage.length > 0">
                    {{ errorMessage }}
                </div>
            </fs-col>
            <fs-col cols="auto" class="d-flex align-items-center pe-3">
                <span class="ms-1 text-wrap" style="width: 25rem;" v-if="localFile && localFile.name">{{ localFile.name }}</span>
                <download-file v-else-if="fileToDownload?.length > 0" :type="DownloadButtonStyle.Link"
                    :path="filePath"></download-file>
                <div v-if="(localFile && localFile.name) || fileToDownload?.length > 0" class="d-inline ms-3 px-1"
                    @click="handleRemoveFileItem">
                    <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                </div>
            </fs-col>
        </fs-row>
    </div>
</template>
