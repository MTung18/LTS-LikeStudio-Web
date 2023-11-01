<template>
    <div>
        <div class="card-body flex-overflow p-0">
            <div class="m-0 p-0">
                <div class="p-0">
                    <div class="signature-pad-wrapper">
                        <div :class="`${(props.isNotShowTitle) ? 'd-none' : ''} d-flex align-items-center`">
                            <div class="d-flex text-lg font-weight-bold label-required" :style="{ fontWeight: 'bold' }">
                                {{ (props.isTranslator) ? 'Translator Signature' : props.isEmployer ? 'Employer Signature' : 'Employee Signature' }} <div
                                    class="required" :style="{ color: '#fc5555' }">*</div>
                            </div>
                        </div>
                        <div class="alert alert-primary" role="alert">
                            {{ alertMessage }}
                        </div>
                        <div class="signature-pad">
                            <VueSignaturePad width="100%" height="100%" ref="signaturePad"
                                :customStyle="{ border: '#E1E4E8 1px solid' }" :options="{ onEnd }" saveType="image/png">
                            </VueSignaturePad>
                        </div>
                        <div class="signature-pad_note">
                            *Please use mouse, penpad, or finger (on touchscreen
                            device) to sign.
                        </div>
                        <div class="btn-group">
                            <fs-button v-if="!isTranslator" type="button" :disabled="isLock || isDisabledAll || isViewOnly"
                                variant="outline-green" class="ms-0 me-0 px-2 mx-2 btn-signature"
                                @click="loadSavedSignature"> Load signature
                            </fs-button>
                            <fs-button type="button" :variant="isLock ? 'outline-secondary' : 'outline-primary'"
                                :disabled="isLock || isViewOnly" class=" btn-signature" @click="clearSignature"
                                style="width:70px">
                                Clear
                            </fs-button>
                            <div class="d-flex align-items-center">
                                <fs-form-checkbox v-model="isLock" name="lock" :disabled="isViewOnly"
                                    @change="handleToggleLock" switch /> Unlock
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import { VueSignaturePad } from "vue-signature-pad";
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { ISignaturePad } from '@/models/SignaturePad'
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { faFileContract } from "@fortawesome/pro-light-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { blobToBase64 } from '@/helper/hqSuite/formatHelper';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
library.add(faFileContract);
const azureB2CAuthStore = useAzureB2CAuthStore();

const isLock = ref(false);
const clientId = computed(() => azureB2CAuthStore?.activeUserClient?.clientGuid ?? 'Shared');


const hqSuiteStore = useHQSuiteStore();
// Props
const props = defineProps<{
    path?: string;
    isTranslator?: boolean;
    isEdit?: boolean;
    isUpdate?: boolean;
    isNotShowTitle?: boolean;
    isDisabledAll?: boolean;
    isViewOnly?: boolean;
    isEmployer?: boolean;
}>();
const emit = defineEmits(["submit-signature", "clear-signature", "update-path-signature"]);

// Data
const padHasInk: Ref<boolean> = ref(false);
const alertMessage: Ref<string> = ref('');
const signaturePad: Ref<ISignaturePad | undefined> = ref();

// Lifecycle hooks
onMounted(async () => {
    if (props.isViewOnly) {
        isLock.value = true;
        lockSignaturePad();
    } else {
        unlockSignaturePad()
    }
    if (props.path) {
        const res = await hqSuiteStore.getFile(props?.path)
        const base64String = await blobToBase64(res?.data);
        signaturePad.value.fromDataURL(base64String);
        localStorage.setItem('signature', base64String);
    }
    window.addEventListener('resize', resizeCanvas);
});

// Functions
const handleToggleLock = () => {
    isLock.value = !isLock.value
    if (isLock.value) {
        lockSignaturePad()
    } else {
        unlockSignaturePad()
    }
}
onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCanvas);
});
const resizeCanvas = () => {
    const savedSignature: string | null = localStorage.getItem('signature');
    signaturePad.value.clearSignature();
    signaturePad.value.fromDataURL(savedSignature);
};
const isEmpty = (): boolean => {
    if (signaturePad.value) {
        return signaturePad.value.isEmpty();
    }
    return false;
}

watch(() => props.isEdit, async () => {
    if (props.isEdit) {
        if (props.isUpdate) {
            signaturePad.value.clearSignature();
        }
    } else {
        if (props.path) {
            const res = await hqSuiteStore.getFile(props?.path)
            const base64String = await blobToBase64(res?.data);
            signaturePad.value.fromDataURL(base64String);
            localStorage.setItem('signature', base64String);
        }
    }
})

const clearSignature = (): void => {
    if (signaturePad.value) {
        signaturePad.value.clearSignature();
        localStorage.removeItem('signature');
        emit("clear-signature")
    }
    alertMessage.value = 'Signature Cleared!';
}

const lockSignaturePad = (): void => {
    if (signaturePad.value) {
        signaturePad.value.lockSignaturePad();
    }
    alertMessage.value = 'Signature Pad Locked!';
}

const unlockSignaturePad = (): void => {
    if (signaturePad.value) {
        signaturePad.value.openSignaturePad();
    }
    alertMessage.value = 'Signature Pad Unlocked!';
}

const onEnd = (): void => {
    if (!isEmpty()) {
        padHasInk.value = true;
        if (signaturePad.value) {
            const { isEmpty, data } = signaturePad.value.saveSignature();
            if (!isEmpty) {
                emit('submit-signature', data);
            }
        }
    }
}

const loadSavedSignature = async () => {
    if (signaturePad.value) {
        // get latest signature from employee folder
        const employeeSignatureListPath = await makeDocumentPath(DocumentTypes.SignatureEmployeeDocument, `${clientId.value}`, '1');

        await hqSuiteStore.fetchRecordItems(employeeSignatureListPath);
        if (hqSuiteStore.recordItems.length === 0) {
            alertMessage.value = 'There Is No Signature To Be Loaded'
        } else {
            clearSignature()
            const sortSignatureList = hqSuiteStore.recordItems.sort((a, b) => {
                return Date.parse(b.lastEdited) - Date.parse(a.lastEdited)
            });
            const lastSavedSignature = sortSignatureList[0];
            const lastSavedSignaturePath = lastSavedSignature.path;
            const res = await hqSuiteStore.getFile(lastSavedSignaturePath)
            const base64String = await blobToBase64(res?.data);
            signaturePad.value.fromDataURL(base64String);
            localStorage.setItem('signature', base64String);
            emit('update-path-signature', lastSavedSignaturePath);
            alertMessage.value = 'Signature Loaded Successfully'
        }
    }
}


defineExpose({ clearSignature });
</script>

<style scoped>
.signature-pad-wrapper {
    border-radius: 4px;
    margin-bottom: 15px;
    background: rgba(#ffffff, 0.6);
    color: #232324 !important;
    display: inline-block;
    width: 100%;
}

.btn-signature {
    border-radius: 3px !important;
    margin-right: 12px !important;
    height: 35px !important;
    min-height: unset !important;
}

.clear-button {
    padding: 10px;
}

.signature-pad {
    position: relative;
}

.signature-pad>canvas {
    display: block !important;
    cursor: pointer;
}

.date-signed {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10;
}

.signature-icon {
    font-size: 20px;
    bottom: 10px;
    left: 1%;
    position: absolute;
}

.signature-pad_note {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-transform: capitalize;
    color: #6E7C8F;
}
</style>