<script setup lang="ts">
import DetailsPanelInfo from '@/models/detailsPanelInfo';
import { computed, ref } from "vue";
import { DetailItemType } from "@/models/employees/detailItemType";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { DownloadButtonStyle } from "@/enums/downloadButtonStyle";
import sensitiveText from "@/components/global/sensitiveText.vue";
import downloadFile from "@/components/global/downloadFile.vue";

library.add(
    faCircle
)

interface Props {
    detail: DetailsPanelInfo;
    showBorder: boolean;
}

const props = defineProps<Props>();

const borderClass = ref(props.showBorder ? 'border border-top-0 border-start-0 border-end-0 mt-3' : 'mt-3');
const DEFAULT_VALUE = '-';

const computedValue = computed(() => {
    if (props.detail && props.detail.value && props.detail.value.toString().trim() != '') {
        return props.detail?.value;
    }
    return DEFAULT_VALUE;
});

</script>
<template>
    <fs-container fluid class="w-100" >

    <fs-row :class="borderClass" v-if="detail.type === DetailItemType.ReadOnly">
        <fs-col lg="12">
            <h6 class="fw-bold">{{ detail.label }}</h6>
        </fs-col>
        <fs-col lg="12" class="mt-1 text-break">
            <p class="text-grey--700">{{ computedValue }}</p>
        </fs-col>
    </fs-row>
    <fs-row :class="borderClass" v-else-if="detail.type === DetailItemType.ReadOnlyWithIcon">
        <fs-col lg="12">
            <h6 class="fw-bold">{{ detail.label }}</h6>
        </fs-col>
        <fs-col lg="11" class="mt-1 text-break">
            <p class="text-grey--700">
                <i class="me-1" v-if="computedValue != DEFAULT_VALUE" :class="detail.icon" aria-hidden="true"></i>
                {{ computedValue }}
            </p>
        </fs-col>
    </fs-row>
    <fs-row :class="borderClass" v-else-if="detail.type === DetailItemType.Sensitive">
        <fs-col lg="12">
            <h6 class="fw-bold">{{ detail.label }}</h6>
        </fs-col>
        <fs-col lg="12" class="mt-1" :class="computedValue != DEFAULT_VALUE ? 'mb-3' : ''">
            <sensitive-text v-if="computedValue != DEFAULT_VALUE" :mask="detail.maskValue" :text="detail.value" />
            <p v-else class="text-grey--700">{{ computedValue }}</p>
        </fs-col>
    </fs-row>
    <fs-row :class="borderClass" v-else-if="detail.type === DetailItemType.Downloadable">
        <fs-col lg="12">
            <h6 class="fw-bold">{{ detail.label }}</h6>
        </fs-col>
        <fs-col lg="12" class="mt-1" :class="computedValue != DEFAULT_VALUE ? 'mb-3' : ''">
            <download-file v-if="computedValue != DEFAULT_VALUE && detail.isDownloadable" :type="DownloadButtonStyle.Link"
                :path="detail.value"></download-file>
            <span v-else class="text-grey--700">
                <i v-if="!detail.isDownloadable" :title="detail.downloadableTitle" class="me-2 b-fa-solid b-fa-circle text--status-pending"></i>
                {{ computedValue }}</span>
        </fs-col>
    </fs-row>
    </fs-container>
</template>