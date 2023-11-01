<script setup lang="ts">
import { defineProps } from "vue";

interface PropType {
  showModal: boolean;
  size?: "sm" | "md" | "lg" | "xl"
  okText?: string;
  cancelText?: string;
  okTextVariant?: string;
  cancelBtnVariant?: string;
  title: string;
  data?: any;
  closeFnc?: any;
  centered?: boolean;
  buttonCancelCustomClass?: string;
}

const props = withDefaults(defineProps<PropType>(), {
  showModal: false,
  center: true
});

const emit = defineEmits(["emitParent", "emitCloseParent"])


const onClose = () => {
  emit("emitCloseParent", props.closeFnc);
};

const onOk = () => {
  emit("emitParent", props.data);
};
</script>
<template>
  <fs-modal id="common-modal" ref="modal" content-class="content-fsModal" body-class="body-fsModal"
    header-bg-variant="blue" footer-bg-variant="light" header-close-variant="light" header-text-variant="white"
    :size="size || 'md'" :centered="centered" hide-header-close="true" :modelValue="showModal" @ok="onOk"
    @close="onClose">
    <template #modal-header="{ close }">
      <div class="w-100 d-flex align-items-center justify-content-between position-relative">
        <div class="title">{{ title }}</div>
        <button class="close-btn" @click="close">
          <font-awesome-icon :icon="['fal', 'times']" size="lg" class="text-white"></font-awesome-icon>
        </button>
      </div>
    </template>

    <template #default>
      <slot name="content"></slot>
    </template>

    <template #modal-footer="{ ok, close }">
      <fs-button @click="close" variant="outline-secondary" :class="'mx-2 text-uppercase ' + buttonCancelCustomClass">
        {{ cancelText }}
      </fs-button>
      <fs-button @click="ok" :variant="okTextVariant" class="mx-2 text-uppercase">
        {{ okText }}
      </fs-button>
    </template>
  </fs-modal>
</template>

<style scoped lang="scss">
.title {
  font-size: 16px;
  line-height: 28px;
}

.text-uppercase {
  text-transform: uppercase !important;
}

:deep(.modal-header) {
  position: relative !important;
}

.modal-header {
  position: relative;
}

.close-btn {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  border: none;
}

.custom-btn {
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
  border-radius: 4px;
  color: #5F6368;
}

.btn-danger {
  background: #FF2A2A !important;
}
</style>
