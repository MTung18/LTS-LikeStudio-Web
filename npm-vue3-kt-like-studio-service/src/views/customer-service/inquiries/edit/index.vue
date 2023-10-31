<template>
  <TemplateEdit :title="dummyData.title">
    <TemplateEditTextFields
      :fields-id="inputId"
      component="input"
      label="제목"
      placeholder="제목 입력"
      required
      v-model="inputRef"
    />
    <TemplateEditTextFields
      :fields-id="textareaId"
      component="textarea"
      label="내용"
      placeholder="내용 입력"
      required
      v-model="textareaRef"
    />
    <TemplateEditFileFields
      @file-upload="handleFileUpload"
      @file-remove="handleFileRemove"
      :files="dummyfiles"
    />
    <div class="flex mt-[6rem] justify-center gap-x-[1rem]">
      <Button
        component="button"
        color-type="outlined"
        size="large"
        class-bind="!min-w-[14rem]"
        @click="handleCancel"
        >취소</Button
      >
      <Button
        component="button"
        color-type="primary"
        size="large"
        class-bind="!min-w-[14rem]"
        @click="handleSubmit"
        >등록</Button
      >
    </div>
  </TemplateEdit>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { ref } from 'vue';

import Button from '@/components/Button/Button.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import customToast from '@/untils/custom_toast';

const inputId = uuid();
const textareaId = uuid();
const inputRef = ref('');
const textareaRef = ref('');

const dummyData = {
  title: '1:1 문의하기',
};

const dummyfiles = [
  {
    id: 0,
    filename: 'screenshot_5907111102.png',
  },
  {
    id: 0,
    filename: 'screenshot_02352786929249.png',
  },
];

const handleFileUpload = async (file) => {
  await console.log('file upload', file);
};

const handleFileRemove = async (file) => {
  await console.log('file remove', file);
};

const handleCancel = () => {
  console.log('취소');
};

const handleSubmit = () => {
  console.log('등록');
  // customToast.success('글을 등록했습니다.');
  customToast.error('에러 메세지');
};
</script>

<style scoped></style>
