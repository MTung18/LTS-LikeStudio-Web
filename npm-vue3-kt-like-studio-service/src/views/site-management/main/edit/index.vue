<template>
  <h2 class="template-sub-title">메인 관리</h2>
  <TemplateEdit class-bind="!pt-0">
    <template #tab>
      <div class="flex mb-[7.2rem]">
        <template v-for="tab in dummyTabs" :key="tab.id">
          <RoundTabs
            @tabSelected="handleSelectedTab(tab.id)"
            :is-selected="tab.isSelected"
            class-bind="!min-w-[auto] flex-1"
            >{{ tab.tabName }}</RoundTabs
          >
        </template>
      </div>
    </template>
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
          <CalenderGroup />
        </TemplateEditTextFields>
        <TemplateEditTextFields
          label="노출"
          required
          class-bind="flex-1 items-center leading-none !border-b-0"
        >
          <Switch />
        </TemplateEditTextFields>
      </div>
      <TemplateEditTextFields
        label="이미지"
        class-bind="pt-[3.2rem] border-t-[1px] border-t-gray-gray-ddd"
      >
        <TemplateEditFileFields
          style-type="image"
          @file-upload="handleFileUpload"
          @file-remove="handleFileRemove"
          :files="dummyfiles"
        />
      </TemplateEditTextFields>
      <TemplateEditTextFields
        :fields-id="inputId"
        label="URL"
        v-model="inputRef"
        class-bind="pt-[2.8rem] border-t-[1px] border-t-gray-ddd"
      >
        <div class="flex gap-x-[2rem] items-center">
          <TextFields
            v-bind="$attrs"
            :input-id="inputId"
            v-model="inputRef"
            size="medium"
            placeholder="URL 입력"
            class-bind="flex-1"
          />
          <CheckBox
            :check-list="'새창'"
            :id="'no'"
            :shape-type="'square'"
            :name="'choice'"
          ></CheckBox>
        </div>
      </TemplateEditTextFields>
      <TemplateEditTextFields
        :fields-id="inputId"
        label="배너 설명"
        v-model="inputRef"
      >
        <TextFields
          v-bind="$attrs"
          :input-id="inputId"
          v-model="inputRef"
          size="medium"
          placeholder="설명 입력"
          class-bind="w-full"
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

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import RoundTabs from '@/components/RoundTabs/RoundTabs.vue';
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

const dummyTabs = ref([
  {
    id: 0,
    tabName: '비주얼',
    isSelected: true,
  },
  {
    id: 1,
    tabName: '공식 템플릿',
    isSelected: false,
  },
]);

const dummyInfo = {
  hits: 6300,
  lastModifiedDate: '2023.02.12 15:34',
  modifier: '박미래',
  modifierPosition: '판매역량강화팀',
  createdDate: '2023.02.11 10:16',
  writer: '박미래',
  writerPosition: '판매역량강화팀',
};

function handleSelectedTab(selectedId) {
  dummyTabs.value = dummyTabs.value.map((tab) => ({
    ...tab,
    isSelected: tab.id === selectedId,
  }));
}

const dummyfiles = [
  {
    id: 0,
    filename: 'screenshot_5907111102.png',
  },
];

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
  router.push('/site-management/main');
};
const handleEdit = () => {
  console.log('수정');
  customToast.success('글을 수정했습니다.');
};
</script>

<style scoped>
.template-sub-title {
  margin-top: 7.2rem;
  margin-bottom: 7.2rem;
  font-size: var(--ttl-xl);
  font-weight: 700;
  text-align: center;
}

.detail-row-col--2 {
  display: flex;
  gap: 0 8rem;
}
</style>
