<template>
  <TemplateEdit title="1:1 문의하기">
    <template #body>
      <TemplateEditTextFields label="카테고리" required>
        <DropdownSelect :select-list="dummySelect" :default-select="'선택'" />
      </TemplateEditTextFields>
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
      <TemplateEditTextFields
        :fields-id="inputId"
        label="내용"
        required
        v-model="inputRef"
      >
        <TextArea
          v-bind="$attrs"
          :textarea-id="textareaId"
          v-model="textareaRef"
          placeholder="내용 입력"
          class-bind="w-full mb-[2.8rem]"
        />
      </TemplateEditTextFields>

      <TemplateEditTextFields
        label="첨부파일"
        class-bind="pt-[3.2rem] border-t-[1px] border-t-gray-gray-ddd"
      >
        <TemplateEditFileFields
          @file-upload="handleFileUpload"
          @file-remove="handleFileRemove"
          :files="dummyfiles"
          file-caption-title="첨부파일은 최대 3개, 1개 파일당 50MB 이하의 아래 확장자만 업로드 가능합니다."
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
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextArea from '@/components/TextArea/TextArea.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import customToast from '@/untils/custom_toast';

const inputId = uuid();
const inputRef = ref('');
const textareaId = uuid();
const textareaRef = ref('');

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

const dummySelect = [
  {
    id: 0,
    listName: '로그인',
  },
  {
    id: 1,
    listName: '사용법',
  },
  {
    id: 2,
    listName: '저작권',
  },
  {
    id: 3,
    listName: '팀룸',
  },
  {
    id: 4,
    listName: '서비스 오류',
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
