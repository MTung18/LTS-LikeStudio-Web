<script setup lang="ts">
import { defineProps } from "vue";
interface PropType {
  showModal: boolean;
  okText?: string;
  cancelText?: string;
  okTextVariant?: string;
  cancelBtnVariant?: string;
  title: string;
  hideCancelButton?: boolean;
}

const { showModal, title, okText, cancelText, okTextVariant, cancelBtnVariant, hideCancelButton } = defineProps<PropType>();

const enum EmitNames {
  CLOSE = "close",
  OK = "ok",
}

const emit = defineEmits<{
  (e: EmitNames, param?: any): void;
}>();

const onClose = () => {
  emit(EmitNames.CLOSE);
};

const onOk = () => {
  emit(EmitNames.OK);
};
</script>
<template>
  <fs-modal ref="modal" content-class="content-fsModal" body-class="body-fsModal" header-bg-variant="blue"
    header-close-variant="light" header-text-variant="white" hide-header-close="true" backdrop centered no-close-on-esc
    no-close-on-backdrop :modelValue="showModal" footer-bg-variant="light">
    <template #modal-header="{ close }">
      <div class="w-100 d-flex align-items-center justify-content-between">
        <div class="title">{{ title }}</div>
        <fs-link class="text-secondary" tag="a" @click="close">
          <font-awesome-icon :icon="['fal', 'times']" size="lg" class="text-white"></font-awesome-icon>
        </fs-link>
      </div>
    </template>
    <template #default>
      <slot name="content"></slot>
    </template>
    <template #modal-footer>
      <fs-button v-show="!hideCancelButton" @click="onClose" :variant="cancelBtnVariant" class="bg-white mx-2 text-capitalize">{{ cancelText }}
      </fs-button>
      <fs-button @click="onOk" :variant="okTextVariant" class="mx-2 text-capitalize">{{ okText }}
      </fs-button>
    </template>
  </fs-modal>
</template>

<style scoped>
.title {
  font-size: 16px;
  line-height: 28px;
}
</style>
