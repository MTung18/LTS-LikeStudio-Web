<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="카테고리 설정"
    @close-button="handleClose"
  >
    <TemplateEditTextFields size="small" label="1차 카테고리">
      <DropdownSelect
        :select-list="primaryCategory"
        :size="'large'"
        :default-select="'없음'"
        class-bind="!min-w-[auto]"
      ></DropdownSelect>
    </TemplateEditTextFields>
    <TemplateEditTextFields
      size="small"
      label="2차 카테고리"
      class-bind="!pb-0 !border-0"
    >
      <DropdownSelect
        :select-list="secondaryCategory"
        :size="'large'"
        :default-select="'없음'"
        class-bind="!min-w-[auto]"
      ></DropdownSelect>
    </TemplateEditTextFields>
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
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const primaryCategory = [
  {
    id: 0,
    listName: '그래픽',
  },
  {
    id: 1,
    listName: '배경',
  },
  {
    id: 2,
    listName: '로고',
  },
  {
    id: 3,
    listName: '텍스트',
  },
  {
    id: 4,
    listName: '제품',
  },
];

const secondaryCategory = [
  {
    id: 0,
    listName: '사진 / 도형  / 일러스트 / 선',
  },
  {
    id: 1,
    listName: '사진배경 / 패턴배경',
  },
  {
    id: 2,
    listName: 'KT CI / KT BI / 협력사 로고',
  },
  {
    id: 3,
    listName: '텍스트 프리셋',
  },
  {
    id: 4,
    listName: '무선 / 유선 /사은품 / 카드',
  },
];

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped>
:deep(.select-area) {
  width: 100%;
}
</style>
