<script setup lang="ts">
import { computed } from 'vue';

const id = `info-sidebar_${Math.random().toString().slice(2, 8)}`
interface InfoSidebarProps {
    textColor?: string,
    icon?: string,
    faVersion?: string,
    title?: string,
    noFooter?: boolean
    hideDoneBtn?: boolean
}
const props = withDefaults(defineProps<InfoSidebarProps>(), {
    textColor: 'cyan',
    icon: 'info-circle',
    faVersion: 'fal',
    title: 'information',
    noFooter: false,
    hideDoneBtn: false,
})
</script>

<template>
    <fs-link>
        <font-awesome-icon :icon="[faVersion, icon]" :class="[`text-${textColor}`]" v-fs-toggle:id="id" />
    </fs-link>
    <fs-sidebar :id="id" :title="title" sidebar-class="fsi-sidebar" right no-close-on-esc no-close-on-backdrop
        bg-variant="white" width="425px" shadow="sm" header-class="border-bottom bg-grey--000 details_panel_header"
        footer-class="border-top">
        <div class="px-3 py-2">
            <slot />

        </div>
        <template v-if="!noFooter" #footer="{ hide }">
            <div class="d-flex p-3 justify-content-end">
                <slot name="footer-content"></slot>

                <fs-button v-if="!hideDoneBtn" variant="primary" class="btn btn-outline-gray" @click="hide">Done</fs-button>
            </div>
        </template>
    </fs-sidebar>
</template>