<template>
  <TemplateEdit title="매장 VMD 관리">
    <template #body>
      <div class="flex gap-x-[8rem]">
        <TemplateEditTextFields
          label="카테고리"
          required
          class-bind="relative before:absolute before:right-[-4rem] before:w-[1px] before:h-[4.6rem] before:bg-gray-gray-ddd before:content-['']"
        >
          <DropdownSelect :select-list="dummySelect" :default-select="'선택'" />
        </TemplateEditTextFields>
        <TemplateEditTextFields
          label="노출"
          required
          class-bind="items-center leading-none !border-b-0"
        >
          <Switch />
        </TemplateEditTextFields>
      </div>
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
        label="첨부파일"
        class-bind="pt-[3.2rem] border-t-[1px] border-t-gray-gray-ddd"
      >
        <TemplateEditFileFields
          @file-upload="handleFileUpload"
          @file-remove="handleFileRemove"
          :files="dummyfiles"
          file-caption-title="첨부파일은 최대 50개, 1개 파일당 100MB 이하의 아래 확장자만 업로드 가능합니다."
          fileMaxLength="50"
          :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg, jpeg , png , gif',
            '디자인 파일 : ai, psd',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
            '음성 파일 : mp3, wma',
          ]"
        />
      </TemplateEditTextFields>

      <TemplateEditInfo
        :hits="dummyInfo.hits"
        :last-modified-date="dummyInfo.lastModifiedDate"
        :modifier="dummyInfo.modifier"
        :modifier-position="dummyInfo.modifierPosition"
        :created-date="dummyInfo.createdDate"
        :writer="dummyInfo.writer"
        :writer-position="dummyInfo.writerPosition"
      />
    </template>

    <template #foot>
      <div class="flex mt-[6rem] justify-center gap-x-[1rem]">
        <UIButton
          component="button"
          color-type="standard"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="handleEditDelete"
          >삭제</UIButton
        >
        <UIButton
          component="button"
          color-type="outlined"
          size="large"
          class-bind="!min-w-[14rem] !ml-auto"
          @click="handleEditToList"
          >목록</UIButton
        >
        <UIButton
          component="button"
          color-type="primary"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="handleEdit"
          >수정</UIButton
        >
      </div>
    </template>
  </TemplateEdit>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditInfo from '@/components/TemplateEditInfo/TemplateEditInfo.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import customToast from '@/untils/custom_toast';

const router = useRouter();

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

const dummyInfo = {
  hits: 6300,
  lastModifiedDate: '2023.02.12 15:34',
  modifier: '박미래',
  modifierPosition: '판매역량강화팀',
  createdDate: '2023.02.11 10:16',
  writer: '박미래',
  writerPosition: '판매역량강화팀',
};

const handleFileUpload = async (file) => {
  await console.log('file upload', file);
};

const handleFileRemove = async (file) => {
  await console.log('file remove', file);
};

const handleEditDelete = () => {
  console.log('삭제');
};
const handleEditToList = () => {
  console.log('목록');
  router.push('/site-management/vmd');
};
const handleEdit = () => {
  console.log('수정');
  customToast.success('글을 수정했습니다.');
};
</script>

<style scoped>
.detail-row-col--2 {
  display: flex;
  gap: 0 8rem;
}
</style>
