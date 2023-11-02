<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="노출 설정"
    @close-button="handleClose"
  >
    <DropdownSelect
      :select-list="listData"
      :default-select="listData[0].listName"
      class-bind="!min-w-[auto] !w-full"
    />
    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <Button
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        >취소</Button
      >
      <Button component="button" color-type="primary" size="small">수정</Button>
    </div>
  </PopupMedium>
</template>

<script setup>
import Button from '@/components/Button/Button.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const listData = [
  {
    id: 1,
    listName: '미노출',
  },
  {
    id: 2,
    listName: '노출',
  },
];

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped></style>
