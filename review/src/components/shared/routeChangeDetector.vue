<script setup lang="ts">
import { MESSAGE } from "@/data/message";
import { computed, onBeforeUnmount, onMounted, Ref, ref } from "vue";
import { useRouter , onBeforeRouteLeave } from "vue-router";

interface Props {
    showDetectionModal: boolean;
    title: string;
    okTitle?: string;
    noTitle?: string;
    cancelTitle?: string;
    ShowOk?: boolean;
    ShowNo?: boolean;
    ShowCancel?: boolean;
    isPending: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    showConfirmationModal: false,
    okTitle: MESSAGE.COMMON.YES,
    noTitle: MESSAGE.COMMON.NO,
    cancelTitle: MESSAGE.COMMON.CANCEL,
    ShowOk: true,
    ShowNo: true,
    ShowCancel: false
});
const router = useRouter();
const reRouteRequestedPath: Ref<String> = ref('');

const enum EmitNames {
    OK = "OK",
    NO = "NO",
    CANCEL = "CANCEL",
    MODEL = "update:showDetectionModal"
}

const emits = defineEmits<{
    (e: EmitNames.OK): void;
    (e: EmitNames.NO): void;
    (e: EmitNames.CANCEL): void;
    (e: EmitNames.MODEL, value: boolean): void;
}>();


const showConfirmationModel = computed({
    get() {
        return (props.showDetectionModal);
    },
    set(value) {
        emits(EmitNames.MODEL, value);
    },
});

function onOKButtonClick() {
    emits(EmitNames.OK);
}

async function onNoButtonClick() {
    emits(EmitNames.NO);
    router.push(reRouteRequestedPath.value.toString());
    showConfirmationModel.value = false;
}

function onCancelButtonClick() {
    emits(EmitNames.CANCEL);
}

async function handleBeforeUnload(event) {
    if (props.isPending) {
        showConfirmationModel.value = true;
        if (event) {
            event.preventDefault();
            event.returnValue = '';
        }
        return false;
    }
}

onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
onBeforeRouteLeave(async (to, from) => {
    reRouteRequestedPath.value = to.fullPath;
    if (props.isPending) {
        showConfirmationModel.value = true;
        return false;
    }
});

</script>
<template>
    <fs-modal v-model="showConfirmationModel" centered content-class="phq-modal" header-class="phq-modal__header"
        title-class="phq-modal__title" body-class="phq-modal__body" footer-class="phq-modal__footer"
        header-text-variant="light" header-bg-variant="blue--dk" :lazy="true" hide-header-close no-close-on-backdrop
        no-close-on-esc @ok="onOKButtonClick" @cancel="onCancelButtonClick" :title="title">
        <slot></slot>
        <template v-slot:modal-footer="slotProps">
            <fs-button variant="outline-secondary" class="me-auto" @click="slotProps.cancel">{{ cancelTitle }}</fs-button>
            <fs-button variant="outline-primary" @click="onNoButtonClick">{{ noTitle }}</fs-button>
            <fs-button variant="primary" @click="slotProps.ok">{{ okTitle }}</fs-button>
        </template>
    </fs-modal>
</template>
