<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";

interface PropType {
  showModal: boolean;
  okText?: string;
  cancelText?: string;
  okTextVariant?: string;
  cancelBtnVariant?: string;
  title: string;
}

const { showModal, title, okText, cancelText, okTextVariant, cancelBtnVariant } =
  defineProps<PropType>();

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
  <fs-modal
    ref="modal"
    content-class="content-fsModal"
    body-class="body-fsModal"
    header-bg-variant="blue"
    header-close-variant="light"
    header-text-variant="white"
    hide-header-close="true"
    backdrop
    centered 
    no-close-on-esc
    no-close-on-backdrop
    :modelValue="showModal"
    footer-bg-variant="light"
  >
    <template #modal-header>
      <div class="w-100 d-flex align-items-center justify-content-between">
        <div class="title">{{ title }}</div>
        <fs-link class="text-secondary" tag="a" @click="onClose">
          <font-awesome-icon
            :icon="['fal', 'times']"
            size="lg"
            class="text-white"
          ></font-awesome-icon>
        </fs-link>
      </div>
    </template>
    <template #default>
      <slot name="content"></slot>
    </template>
    <template #modal-footer>
        <fs-button @click="onClose" :variant="cancelBtnVariant" class="mx-2 text-capitalize bg-white" id="custom-color"
        >{{ cancelText }}
      </fs-button>
      <fs-button @click="onOk" :variant="okTextVariant" class="mx-2 text-capitalize"
      >{{ okText }}
    </fs-button>
    </template>
  </fs-modal>
</template>

<style scoped>
.title {
  font-size: 16px;
}
#custom-color{
    color: #5F6368 !important;
  }
</style>
