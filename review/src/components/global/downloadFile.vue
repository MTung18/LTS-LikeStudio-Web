<script setup lang="ts">
import { useAlerts } from "@/composables/useAlerts";
import { MESSAGE } from "@/data/message";
import { DownloadButtonStyle } from "@/enums/downloadButtonStyle";
import { getFileName } from "@/helper/hqSuite/formatHelper";
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { computed, ref } from "vue";
interface Props {
    type: DownloadButtonStyle;
    path: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: DownloadButtonStyle.Link,
});
const hqSuiteStore = useHQSuiteStore();
const showLoader = ref(false);
const { notifySuccess } = useAlerts();
function download() {
    if (props.path != null && props.path.trim() != '') {
        notifySuccess(MESSAGE.COMMON.DOWNLOADING);
        showLoader.value = true;
        hqSuiteStore.downloadFile(props.path).then(
            () => { showLoader.value = false; },
            () => { showLoader.value = false; })
    }

}

const fileName = computed(() => getFileName(props.path, true))

</script>
<template>
    <div>
        <fs-spinner v-if="showLoader" small class="me-1 text-primary"></fs-spinner>
        <fs-link v-if="type === DownloadButtonStyle.Link" tag="a" @click.prevent="download()">
            {{ fileName }}
        </fs-link>
        <span v-if="type === DownloadButtonStyle.Icon" @click.prevent="download()">
            <i class="b-action-item b-fa b-fa-download btn btn-link text-success no-underline"></i>
            {{ fileName }}
        </span>
        <fs-button v-if="type === DownloadButtonStyle.Button" variant="primary" @click.prevent="download()">
            <i class="b-fa b-fa-download text-white pe-1"></i>
            {{ fileName }}
        </fs-button>
    </div>
</template>
