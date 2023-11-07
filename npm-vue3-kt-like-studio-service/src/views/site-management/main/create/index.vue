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
            :name="'choise'"
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
import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import RoundTabs from '@/components/RoundTabs/RoundTabs.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import customToast from '@/untils/custom_toast';

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
