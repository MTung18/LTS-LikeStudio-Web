<script setup lang="ts">
import { computed } from "vue";

interface Props {
    showConfirmationModal: boolean;
    title: string;
    type?: string;
    yesTitle?: string;
    noTitle?: string;
    discardTitle?: string;
    showDiscard?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    okButtonStyle?: 'primary' | 'secondary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    showConfirmationModal: false,
    type: null,
    yesTitle: 'yes',
    noTitle: 'no',
    discardTitle: 'discard',
    showDiscard: false,
    okButtonStyle: 'danger'
});
const enum EmitNames {
    OK = "OK",
    CANCEL = "CANCEL",
    DISCARD = "DISCARD",
    MODEL = "update:showConfirmationModal"
}
const emits = defineEmits<{
    (e: EmitNames.OK): void;
    (e: EmitNames.CANCEL): void;
    (e: EmitNames.DISCARD): void;
    (e: EmitNames.MODEL, value: boolean): void;
}>();


const showConfirmationModel = computed({
    get() {
        return (props.showConfirmationModal);
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
function onDiscardButtonClick() {
    showConfirmationModel.value = false;
    emits(EmitNames.DISCARD);
}
</script>
<template>
    <fs-modal v-model="showConfirmationModel" centered content-class="phq-modal" header-class="phq-modal__header" 
        :size="size || 'md'"
        title-class="phq-modal__title" body-class="phq-modal__body" footer-class="phq-modal__footer"
        header-text-variant="light" header-bg-variant="blue--dk" :lazy="true" hide-header-close no-close-on-backdrop
        no-close-on-esc @ok="onOKButtonClick()" @cancel="onCancelButtonClick()" :title="title">
        <slot></slot>
        <template v-slot:modal-footer="slotProps">
            <template v-if="showDiscard">
                <div class="d-flex justify-content-between w-100">
                    <fs-button variant="outline-secondary" @click="slotProps.cancel">{{ noTitle }}</fs-button>
                    <div>
                        <fs-button variant="secondary" @click="onDiscardButtonClick()">{{ discardTitle }}</fs-button>
                        <fs-button variant="primary" @click="onOKButtonClick">{{ yesTitle }}</fs-button>
                    </div>
                </div>
            </template>
            <template v-else>
                <fs-button variant="outline-secondary" @click="slotProps.cancel">{{ noTitle }}</fs-button>
                <fs-button :variant="okButtonStyle" @click="slotProps.ok">{{ yesTitle }}</fs-button>
            </template>
        </template>
    </fs-modal>
</template>
