<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="태그 설정"
    @close-button="handleClose"
  >
    <TextArea
      size="medium"
      :textarea-id="textareaId"
      v-model="textareaRef"
      placeholder="태그를 ,(쉼표) 구분해주세요."
    />
    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <UIButton
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        >취소</UIButton
      >
      <UIButton component="button" color-type="primary" size="small"
        >수정</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { ref } from 'vue';

import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import TextArea from '@/components/TextArea/TextArea.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const textareaId = uuid();
const textareaRef = ref('');

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped></style>
