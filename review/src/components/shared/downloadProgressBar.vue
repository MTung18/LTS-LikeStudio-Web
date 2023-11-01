<script setup lang="ts">
import { BatchDownload, BatchDownloadStatus, BatchFileStatus } from '@/models/hqSuite/batchDownload';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { computed, Ref, ref } from 'vue';

const hqSuiteStore = useHQSuiteStore();

const status: Ref<BatchDownload> = computed(() => { return hqSuiteStore.batchDownload; });
const disableClose: Ref<boolean> = computed(() => {
    return (hqSuiteStore.batchDownload.status === BatchDownloadStatus.InProgress
        || hqSuiteStore.batchDownload.status === BatchDownloadStatus.Zipping);
});
const showFiles = ref(false);

function closeDownloadPanel() {
    hqSuiteStore.clearBatchDownload();
    showFiles.value = false;
}
</script>
<template>
    <div class="downloadBar shadow-lg p-2 rounded-4" v-if="hqSuiteStore.batchDownload.status != BatchDownloadStatus.Idle">
        <div class="d-flex flex-column">
            <div class="d-flex flex-row justify-content-between">
                <div class="mt-2  p-2">
                    <div class="percent">
                        <svg>
                            <circle cx="52" cy="52" r="47"></circle>
                            <circle cx="52" cy="52" r="47"
                                :class="`percent_${status.status.indexOf('Error') > -1 ? 'error' : ''} percent_${status.percentageCompleted}`">
                            </circle>
                        </svg>
                        <div class="number mt-1">
                            <h3>{{ status.percentageCompleted }}<span>%</span></h3>
                        </div>
                    </div>
                </div>
                <div class="mt-3 p-2 flex-grow-1">
                    <div class="d-flex flex-column">
                        <div class="p-2 text-secondary lead">Downloaded {{ status.totalNumberOfFilesDownloaded }} of {{
                            status.totalNumberOfFilesToDownload }}</div>
                        <div class="p-2 blockquote">{{ status.status }}</div>
                    </div>
                </div>
                <div class="p-2">
                    <fs-link class="ms-auto text-secondary" tag="a" v-if="!disableClose" @click="closeDownloadPanel">
                        <font-awesome-icon :icon="['fal', 'times']" size="lg"></font-awesome-icon>
                    </fs-link>
                </div>
            </div>
            <div class="d-flex flex-row-reverse pe-2 showmore" @click="showFiles = !showFiles">
                <div>
                    <i class="b-fa w-100" :class="showFiles ? 'b-fa-caret-up' : 'b-fa-caret-down'">
                        <span class="ms-2"> {{ showFiles ? 'Show less' : 'Show more' }} </span>
                    </i>
                </div>
            </div>
            <Transition mode="out-in">
                <div class="scroll-y-auto scroll--md pt-2" v-if="showFiles">
                    <p v-for="(file, index) in hqSuiteStore.batchDownload.files" :key="index" class="m-3">
                        <i class="text-primary b-fa b-fa-spinner" v-if="file.status === BatchFileStatus.InProgress">
                        </i>
                        <i class="text-danger b-fa b-fa-triangle-exclamation"
                            v-if="file.status === BatchFileStatus.Error"></i>
                        <i class="text-success b-fa b-fa-check" v-if="file.status === BatchFileStatus.Downloaded"></i>
                        <span class="ps-2">{{ file.name }}</span>
                    </p>
                </div>
            </Transition>
        </div>
    </div>
</template> 
<style lang="scss" scoped>
//styling
$default-color: #f0f0f0;
$initial-fill-color: #6e7c8f82;
$middle-fill-color: #03A9F4;
$final-fill-color: #1ABC9C;
$error-fill-color: #FF2A2A;
$size: 5rem;

// to create how many steps
$howManySteps: 100;

.downloadBar {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 400px;
    max-width: 500px;
    background: rgb(255 255 255);
    border-radius: 1rem;
}

.percent {
    position: relative;

    svg {
        position: relative;
        width: 105px;
        height: 105px;
        transform: rotate(-90deg);

        circle {
            width: 100%;
            height: 100%;
            fill: none;
            stroke: $default-color;
            stroke-width: 10;
            stroke-linecap: round;

            &:last-of-type {
                stroke-dasharray: 312px;
                stroke-dashoffset: calc(312px - (312px * var(--percent)) / 100);
                stroke: var(--percentColor);
            }
        }
    }

    .number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        h3 {
            font-weight: 300;
            font-size: 1.5rem;

            span {
                font-size: 1rem;
            }
        }
    }
}

.showmore {
    color: var(--bs-grey--500);
    font-weight: 500;

    i {
        font-style: italic;
    }
}

@for $i from 0 through $howManySteps {
    .percent_#{$i} {
        --percent:#{$i} !important;

        @if $i<=50 {
            --percentColor: #{$initial-fill-color};
        }

        @else if $i<=99 {
            --percentColor: #{$middle-fill-color};
        }

        @else if $i<=100 {
            --percentColor: #{$final-fill-color};
        }
    }
}

.percent_error {
    --percent: 100 !important;
    --percentColor: #{$error-fill-color} !important;
}
</style>