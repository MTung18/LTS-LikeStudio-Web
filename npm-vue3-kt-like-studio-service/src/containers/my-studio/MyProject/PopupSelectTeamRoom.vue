<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="팀룸 선택"
    @close-button="handleClose"
  >
    <TemplateEditTextFields size="small" label="팀룸" class="items-center">
      <DropdownSelect
        :select-list="dummyCategory.listData"
        :size="'large'"
        :default-select="dummyCategory.defaultSelect"
        class-bind="!min-w-[auto] w-full"
      ></DropdownSelect>
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
        >완료</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const dummyCategory = {
  id: 1,
  cate: '팀룸1',
  defaultSelect: '팀룸1',
  listData: [
    {
      id: 1,
      listName: '팀룸1',
    },
    {
      id: 2,
      listName: '팀룸2',
    },
  ],
};

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped></style>
