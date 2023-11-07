<template>
  <TemplateEdit title="공지사항 관리">
    <template #body>
      <TemplateEditTextFields
        :fields-id="inputId"
        label="제목"
        required
        v-model="inputRef"
      >
        <TextFields
          v-bind="$attrs"
          :input-id="inputId"
          v-model="inputRef"
          size="medium"
          placeholder="제목 입력"
          class-bind="w-full"
        />
      </TemplateEditTextFields>
      <div class="flex gap-x-[8rem]">
        <TemplateEditTextFields
          label="공지"
          class-bind="relative flex-1 items-center leading-none !border-b-0 before:absolute before:right-[-4rem] before:w-[1px] before:h-[4.6rem] before:bg-gray-gray-ddd before:content-['']"
        >
          <Switch />
        </TemplateEditTextFields>
        <TemplateEditTextFields
          label="메인 팝업"
          required
          class-bind="flex-1 items-center leading-none !border-b-0"
        >
          <Switch />
        </TemplateEditTextFields>
      </div>
      <TemplateEditTextFields
        label="노출"
        required
        class-bind="items-center leading-none !border-b-0"
      >
        <Switch />
      </TemplateEditTextFields>
      <TemplateEditTextFields label="내용" required v-model="inputRef">
        <div
          class="h-[31.6rem] px-[1.6rem] py-[1.3rem] rounded-[0.6rem] border-[1px] border-gray-gray-ddd"
        >
          에디터 플러그인 들어갈 자리
        </div>
      </TemplateEditTextFields>
      <TemplateEditTextFields
        label="첨부파일"
        class-bind="pt-[3.2rem] border-t-[1px] border-t-gray-gray-ddd"
      >
        <TemplateEditFileFields
          @file-upload="handleFileUpload"
          @file-remove="handleFileRemove"
          :files="dummyfiles"
          file-caption-title="첨부파일은 최대 10개, 1개 파일당 50MB 이하의 아래 확장자만 업로드 가능합니다."
          :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg , jpeg , png , gif',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
          ]"
        />
      </TemplateEditTextFields>
    </template>

    <template #foot>
      <div class="flex mt-[6rem] justify-center gap-x-[1rem]">
        <Button
          component="button"
          color-type="outlined"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="handleCreateCancel"
          >취소</Button
        >
        <Button
          component="button"
          color-type="primary"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="handleCreateSubmit"
          >등록</Button
        >
      </div>
    </template>
  </TemplateEdit>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { ref } from 'vue';

import Button from '@/components/Button/Button.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import customToast from '@/untils/custom_toast';

const inputId = uuid();
const inputRef = ref('');

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

const handleCreateCancel = () => {
  console.log('취소');
};

const handleCreateSubmit = () => {
  console.log('등록');
  customToast.success('글을 등록했습니다.');
  // customToast.error('에러 메세지');
};
</script>

<style scoped>
.detail-row-col--2 {
  display: flex;
  gap: 0 8rem;
}
</style>
