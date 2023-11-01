<template>
    <div class="hq-pg">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
            <fs-row align-v="center">
                <fs-col cols="auto">
                    <h2 class="hq-pg__title">{{ actionType }} {{ integrationNamePlural }}</h2>
                </fs-col>
                <fs-col cols="auto" class="ms-auto">
                    <fs-button variant="outline-secondary" @click="onCancelClick">Cancel</fs-button>
                    <fs-button variant="primary" :disabled="isSubmitting" @click="onSubmitClick">
                        <fs-spinner small v-if="isSubmitting" class="me-2 outline-secondary"></fs-spinner>
                        {{ actionType }} {{ integrationNamePlural }}
                    </fs-button>
                </fs-col>
            </fs-row>
        </fs-container>

        <fs-container fluid class="contain py-4">
            <span class="fw-bold">Select Foundation {{ integrationNamePlural }} to {{ actionType }}</span>
        </fs-container>

        <fs-list-group flush class="border-top border-bottom">
            <fs-list-group-item class="d-flex align-items-center">
                <fs-form-checkbox @click="onToggleSelectAll" :value="selectAll"></fs-form-checkbox>
                <strong>{{ integrationName }} Name</strong>
            </fs-list-group-item>
            <fs-list-group-item v-if="isLoading" class="list-group-item d-flex align-items-center justify-content-center">
                <fs-spinner small class="me-2 text-primary"></fs-spinner> Loading
            </fs-list-group-item>
            <fs-list-group-item v-else-if="foundationData?.length > 0" class="d-flex align-items-center"
                v-for="data in foundationData" :key="data.key">
                <fs-form-checkbox v-model="data.isSelected"></fs-form-checkbox>
                {{ data.name }}
            </fs-list-group-item>
            <fs-list-group-item v-else class="list-group-item d-flex align-items-center justify-content-center">
                No data to {{ actionType.toLocaleLowerCase() }}
            </fs-list-group-item>
        </fs-list-group>
        <common-modal :showModal="showConfirmationModal" title="Sync Confirmation" okText="SYNC" cancelText="CANCEL"
            okTextVariant="primary" @emitParent="handleSubmit()" @emitCloseParent="onCancelClick()">
            <template #content>
                <div class="message-content">
                    Are you sure you want to sync your <b>{{ integrationNamePlural }}</b> from Foundation?
                    <br /><br />
                    <font-awesome-icon class="text-warning" size="lg"
                        :icon="['fal', 'triangle-exclamation']"></font-awesome-icon>
                    <b> Warning:</b> Foundation values will overwrite existing WorkforceHQ values if they differ.
                </div>
            </template>
        </common-modal>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IntegrationFunction, IntegrationFunctionMap } from '@/enums/IntegrationFunction';
import { pluralize } from '@/functions/FilterFunctions';
import { useAlerts } from '@/composables/useAlerts';
import { useFoundationIntegrationFactory } from '@/factories/foundationIntegrationFactory';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTriangleExclamation } from '@fortawesome/pro-light-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import commonModal from '@/components/common/commonModal.vue'
import _ from 'lodash';

library.add(faTriangleExclamation);

interface Props {
    importType: IntegrationFunction;
    isSync: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    importType: null,
    isSync: false,
});

const actionType: Ref<string> = computed(() => {
    return props.isSync ? 'Sync' : 'Import';
});

const integrationNamePlural: Ref<string> = computed(() => {
    return pluralize(integrationName.value);
});

const integrationName: Ref<string> = computed(() => {
    return IntegrationFunctionMap.displayName(props.importType as number);
});

const selectedFoundationData: Ref<Array<any>> = computed(() => {
    return foundationData.value.filter(data => data.isSelected)
});

const foundationIntegration = useFoundationIntegrationFactory(+props.importType)();

const selectAll: Ref<boolean> = ref(false);
const showConfirmationModal: Ref<boolean> = ref(false);
const foundationData: Ref<Array<any>> = ref(null);
const isLoading: Ref<boolean> = ref(false);
const isSubmitting: Ref<boolean> = ref(false);
const router = useRouter();
const notify = useAlerts();

async function onSubmitClick(): Promise<void> {
    if (selectedFoundationData.value.length === 0) {
        notify.notifyError(`You must select at least one record to ${actionType.value.toLowerCase()}.`);
        return;
    }

    if (props.isSync) {
        showConfirmationModal.value = true;
    } else {
        handleSubmit();
    }
}

async function handleSubmit() {
    let isUpdateSuccessful: boolean;
    isSubmitting.value = true;
    try {
        const dataToSubmit = _.cloneDeep(selectedFoundationData.value);
        if (props.isSync) {
            isUpdateSuccessful = await foundationIntegration.syncData(dataToSubmit);
        } else {
            isUpdateSuccessful = await foundationIntegration.importData(dataToSubmit);
        }
    }
    finally {
        isSubmitting.value = false;
    }
    if (!isUpdateSuccessful) {
        notify.notifyError(`An error occurred attempting to ${actionType.value.toLowerCase()} ${integrationNamePlural.value}.`);
    } else {
        if(props.importType == IntegrationFunction.Employee){
            notify.notifySuccess(`${integrationNamePlural.value} ${actionType.value.toLowerCase()} process triggered successfully. You will be notified once the process complete.`);
        } else {
            notify.notifySuccess(`${integrationNamePlural.value} ${actionType.value.toLowerCase()}ed successfully.`);
        }
        router.push({ name: 'settingsFoundation' });
    }
}

function onToggleSelectAll(): void {
    selectAll.value = !selectAll.value;
    foundationData.value = foundationData.value?.map(data => {
        return { ...data, isSelected: selectAll.value }
    });
}

function onCancelClick(): void {
    router.push({ name: 'settingsFoundation' });
}

function mapFoundationData(foundationData: Array<any>, identifier: string, name: string): Array<object> {
    return foundationData?.map(data => {
        return { ...data, key: data[identifier], name: data[name], isSelected: false };
    })
}

onMounted(async () => {
    isLoading.value = true;
    try {
        const data = await foundationIntegration.getData(props.isSync);
        foundationData.value = mapFoundationData(data, foundationIntegration.propKey.id, foundationIntegration.propKey.name);
    }
    finally {
        isLoading.value = false;
    }
})
</script>