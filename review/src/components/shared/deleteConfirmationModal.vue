<script setup lang="ts">
import { computed } from "vue";

interface Props {
    showDeleteModal: boolean;
    title?: string;
    type?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Delete Confirmation',
    showDeleteModal: false,
    type: null
});
const enum EmitNames {
    OK = "OK",
    CANCEL = "CANCEL",
    MODEL = "update:showDeleteModal"
}
const emits = defineEmits<{
    (e: EmitNames.OK): void;
    (e: EmitNames.CANCEL): void;
    (e: EmitNames.MODEL, value: boolean): void;
}>();


const showDeleteConfirmationModel = computed({
    get() {
        return (props.showDeleteModal);
    },
    set(value) {
        emits(EmitNames.MODEL, value);
    },
});

function onOKButtonClick() {
    emits(EmitNames.OK);
}

function onCancelButtonClick() {
    emits(EmitNames.CANCEL);
}

</script>
<template>
    <fs-modal v-model="showDeleteConfirmationModel" centered content-class="phq-modal" header-class="phq-modal__header"
        title-class="phq-modal__title" body-class="phq-modal__body" footer-class="phq-modal__footer"
        header-text-variant="light" header-bg-variant="blue--dk" :lazy="true" hide-header-close no-close-on-backdrop
        no-close-on-esc @ok="onOKButtonClick()" @cancel="onCancelButtonClick()" :title="title">
        <slot></slot>
        <template v-slot:modal-footer="slotProps">
            <fs-button variant="outline-secondary" @click="slotProps.cancel">CANCEL</fs-button>
            <fs-button variant="danger" @click="slotProps.ok">{{ type ? `Delete ${type}` : `Delete` }}</fs-button>
        </template>
    </fs-modal>
</template>
