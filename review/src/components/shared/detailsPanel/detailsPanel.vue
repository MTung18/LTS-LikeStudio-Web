<script setup lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, nextTick } from 'vue';
import DetailsPanelInfo from '@/models/detailsPanelInfo';
import detailItem from '@/components/shared/detailsPanel/detailItem.vue';
import { sortBy } from "lodash";
import { ActionPlacement, PanelActionConfig, PanelConfig } from "@/models/panelConfig";

library.add(
    faTimes
);

interface Props {
    details?: DetailsPanelInfo[];
    config: PanelConfig;
    showPanel: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showPanel: false
});
const emit = defineEmits(['update:showPanel', 'actionHandler', 'editHandler']);

const localShowPanel = computed({
    get() {
        return props.showPanel;
    },
    set(value) {
        nextTick();
        emit("update:showPanel", value);
    },
});
const orderedDetails = computed(() => sortBy(props.details, 'order'));

const footerActions = computed(() => props.config.actions.filter((action: PanelActionConfig) => action.placement === ActionPlacement.Footer));

const headerActions = computed(() => props.config.actions.filter((action: PanelActionConfig) => action.placement === ActionPlacement.Header));

</script>

<template>
    <fs-sidebar sidebar-class="fsi-sidebar" right no-close-on-esc no-close-on-backdrop bg-variant="white" width="425px"
        shadow="sm" header-class="border-bottom bg-grey--000 details_panel_header" footer-class="border-top"
        aria-label="addDocumentMetaData" no-header-close v-model="localShowPanel">
        <!-- header -->
        <template #title="{ hide }">
            <div class="mr-3 d-flex align-items-center">
                <div class="h5 pl-2 my-auto fw-bold">{{ config.title }}</div>
                <strong>
                    <div class="d-flex align-items-center">
                        <fs-link class="ms-auto text-secondary" tag="a" @click="hide">
                            <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
                        </fs-link>
                    </div>
                </strong>
            </div>
        </template>
        <!-- footer -->
        <template v-if="config.showFooter" #footer="{ hide }">
            <div class="d-flex justify-content-between p-2">
                <fs-button variant="outline-secondary" class="btn btn-outline-gray" @click="hide">CLOSE</fs-button>
                <fs-button v-for="(footerAction, index) in footerActions" :key="index" :variant="footerAction.variant"
                    @click="footerAction.handler(config.source)">
                    <font-awesome-icon :icon="footerAction.icon" />
                    <span class="d-none d-lg-inline">{{ footerAction.name }}</span>
                </fs-button>

            </div>
        </template>
        <div class="d-flex flex-column h-100 w-100">
            <fs-container fluid v-if="config.showHeader">
                <fs-row class="align-items-center py-2 border border-top-0 border-start-0 border-end-0 mt-2">
                    <fs-col>
                        <div class="h5 fw-bold">
                            {{ config.subTitle }}
                        </div>
                    </fs-col>
                    <fs-col cols="auto">
                        <fs-button v-for="(headerAction, index) in headerActions" :key="index"
                            :class="headerAction.class" :title="headerAction.tooltip"
                            :variant="headerAction.variant" @click="headerAction.handler(config.source)">
                            <font-awesome-icon :icon="headerAction.icon" />
                            <span class="d-none d-lg-inline">{{ headerAction.name }}</span>
                        </fs-button>
                    </fs-col>
                </fs-row>
            </fs-container>

            <fs-container fluid>
                <detail-item v-for="(detail, index) in orderedDetails" :key="index" :detail="detail"
                    :show-border="(orderedDetails?.length - 1) != index">
                </detail-item>
            </fs-container>
        </div>
    </fs-sidebar>
</template>

<style lang="scss">
.details_panel_header {
    padding: 0.75rem 1rem !important;
}
</style>