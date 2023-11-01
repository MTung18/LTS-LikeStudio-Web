<script setup lang="ts">
import { computed } from "vue";

interface Props {
    showPanel: boolean;
    title?: string;
    numberOfItemsSelected:number
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Actions',
    showPanel: true,
    entry:0
});

const enum EmitNames {
    MODEL = "update:showPanel"
}
const emits = defineEmits<{
    (e: EmitNames.MODEL, value: boolean): void;
}>();

const showActionPanel = computed({
    get() {
        return (props.showPanel);
    },
    set(value) {
        emits(EmitNames.MODEL, value);
    },
});

</script>
<template>
     <fs-sidebar id="sidebar"
            sidebar-class="fsi-sidebar border-start"
            shadow 
            right 
            v-model="showActionPanel" 
            no-header-close 
            header-class="border-bottom"
            width="320px">
    <template #title>
        <div class="d-flex align-items-center justify-content-around w-100">
            <div class="fsi-pg__title">Actions</div>
            <fs-link class="ms-auto text-secondary" tag="a" @click="showActionPanel = false">
                <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
            </fs-link>
        </div>
    </template>
    <fs-container fluid class="fsi-pg__container contain">
        <div class="text-secondary my-3">{{numberOfItemsSelected}} {{numberOfItemsSelected === 1 ? 'entry' : 'entries'}} selected</div>
        <slot></slot>
    </fs-container>
    </fs-sidebar>
</template>
