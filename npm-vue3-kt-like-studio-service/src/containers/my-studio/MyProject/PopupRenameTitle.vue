<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="제목 변경"
    @close-button="handleClose"
  >
    <TemplateEditTextFields size="small" label="제목" class="items-center">
      <TextFields v-model="dummyInputValue" size="medium" class="w-full" />
    </TemplateEditTextFields>
    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <UIButton
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        >취소</UIButton
      >
      <UIButton component="button" color-type="primary" size="small"
        >확인</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import { ref } from 'vue';

import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const dummyInputValue = ref('');
const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped></style>
