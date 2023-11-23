<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="템플릿 등록"
    @close-button="handleClose"
  >
    <div>
      <TemplateEditTextFields
        size="small"
        label="프로젝트 명"
        class="items-center !pb-[2.4rem]"
      >
        <TextFields v-model="dummyProjectName" size="medium" class="w-full" />
      </TemplateEditTextFields>
    </div>

    <div class="py-[2.4rem] border-b-gray-gray-ddd border-b-[1px]">
      <div class="flex items-center gap-x-[2rem]">
        <p class="min-w-[10rem] py-[0.6rem] text-fz-m font-bold">페이지 수</p>
        <p class="text-fz-m">10장</p>
      </div>
      <div class="flex items-center gap-x-[2rem]">
        <p class="min-w-[10rem] py-[0.6rem] text-fz-m font-bold">파일 구분</p>
        <p class="text-fz-m">1920mm X 1230mm</p>
      </div>
    </div>
    <div class="pt-[2.4rem]">
      <TemplateEditTextFields size="small" label="용도" class="items-center">
        <DropdownSelect
          :select-list="dummyPurpose.listData"
          :size="'large'"
          :default-select="dummyPurpose.defaultSelect"
          class-bind="!min-w-[auto] w-full"
        ></DropdownSelect>
      </TemplateEditTextFields>
      <TemplateEditTextFields
        size="small"
        label="상품 서비스"
        class="items-center !pb-[2.4rem]"
      >
        <DropdownSelect
          :select-list="dummyService.listData"
          :size="'large'"
          :default-select="dummyService.defaultSelect"
          class-bind="!min-w-[auto] w-full"
        ></DropdownSelect>
      </TemplateEditTextFields>
    </div>
    <div class="pt-[2.4rem]">
      <TemplateEditTextFields
        size="small"
        label="프로젝트 설명"
        class="!pb-[2.4rem]"
      >
        <TextArea
          size="medium"
          :textarea-id="'dummyProjectDesc'"
          v-model="dummyProjectDesc"
          placeholder="프로젝트 설명을 입력해 주세요"
        />
      </TemplateEditTextFields>
    </div>
    <div class="pt-[2.4rem]">
      <TemplateEditTextFields size="small" label="태그" class="!pb-[2.4rem]">
        <TextArea
          size="medium"
          :textarea-id="'dummyProjectTag'"
          v-model="dummyProjectTag"
          placeholder="태그를 ,(쉼표) 구분해주세요."
        />
      </TemplateEditTextFields>
    </div>

    <div class="pt-[2.4rem]">
      <TemplateEditTextFields size="small" label="노출" class="!pb-[2.4rem]">
        <Switch />
      </TemplateEditTextFields>
    </div>

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
import { ref } from 'vue';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextArea from '@/components/TextArea/TextArea.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const dummyProjectName = ref('');
const dummyProjectDesc = ref('');
const dummyProjectTag = ref('');
const dummyPurpose = {
  id: 1,
  cate: '선택',
  defaultSelect: '선택',
  listData: [
    {
      id: 1,
      listName: '포스터',
    },
    {
      id: 2,
      listName: '브로셔',
    },
    {
      id: 3,
      listName: '책받침',
    },
    {
      id: 4,
      listName: '전단지',
    },
    {
      id: 5,
      listName: 'X배너',
    },
    {
      id: 6,
      listName: 'SNS용',
    },
    {
      id: 7,
      listName: 'PPT',
    },
    {
      id: 8,
      listName: '기타',
    },
  ],
};
const dummyService = {
  id: 1,
  cate: '선택',
  defaultSelect: '선택',
  listData: [
    {
      id: 1,
      listName: '무선',
    },
    {
      id: 2,
      listName: '유선',
    },
    {
      id: 3,
      listName: '결합',
    },
    {
      id: 4,
      listName: '가족',
    },
    {
      id: 5,
      listName: '외국인',
    },
    {
      id: 6,
      listName: '멤버쉽',
    },
    {
      id: 7,
      listName: '제휴카드',
    },
  ],
};

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped></style>
