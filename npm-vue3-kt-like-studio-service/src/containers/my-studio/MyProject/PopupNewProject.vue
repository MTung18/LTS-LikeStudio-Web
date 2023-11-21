<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="슬라이드 사이즈"
    @close-button="handleClose"
  >
    <TemplateEditTextFields
      size="small"
      label="슬라이드 프리셋"
      class="items-center"
    >
      <DropdownSelect
        :select-list="dummyCategory.listData"
        :size="'large'"
        :default-select="dummyCategory.defaultSelect"
        class-bind="!min-w-[auto] w-full"
      ></DropdownSelect>
    </TemplateEditTextFields>
    <TemplateEditTextFields size="small" label="사이즈" class="items-center">
      <div class="flex items-center">
        <div class="flex items-center">
          <label for="width" class="text-fz-m text-gray-gray-444 mr-[1rem]"
            >가로</label
          >
          <TextFields
            :input-id="'width'"
            v-model="width"
            size="medium"
            class-bind="max-w-[8.4rem]"
          />
        </div>

        <button
          type="button"
          class="flex justify-center items-center w-[2.4rem] h-[2.4rem] rounded-full border-[1px] border-solid border-gray-gray-ddd mx-[1.2rem]"
        >
          <Icons icon-name="fix" :width="1.4" :height="1.4" />
        </button>

        <div class="flex items-center">
          <label for="height" class="text-fz-m text-gray-gray-444 mr-[1rem]"
            >세로</label
          >
          <TextFields
            :input-id="'height'"
            v-model="height"
            size="medium"
            class-bind="max-w-[8.4rem] mr-[1.4rem]"
          />
          <DropdownSelect
            :select-list="dummyUnit.listData"
            :size="'large'"
            :default-select="dummyUnit.defaultSelect"
            class-bind="!min-w-[auto] max-w-[9rem]"
          ></DropdownSelect>
        </div>
      </div>
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

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
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

const width = ref('');
const height = ref('');
const dummyCategory = {
  id: 1,
  cate: '전단지(A4',
  defaultSelect: '전단지(A4',
  listData: [
    {
      id: 1,
      listName: '전단지(A4)',
    },
    {
      id: 2,
      listName: '포스터(A2)',
    },
  ],
};
const dummyUnit = {
  id: 1,
  cate: 'mm',
  defaultSelect: 'mm',
  listData: [
    {
      id: 1,
      listName: 'mm',
    },
    {
      id: 2,
      listName: 'px',
    },
  ],
};

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped></style>
