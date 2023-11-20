<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="에셋 설정"
    @close-button="handleClose"
  >
    <TemplateEditTextFields size="small" label="썸네일">
      <div class="upload-group">
        <div>
          <RoundButton
            component="button"
            color-type="filed"
            size="small"
            @click="onClickUploadButton"
            >파일선택</RoundButton
          >
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label-->
        <input
          ref="fileRef"
          class="visually--hidden"
          type="file"
          readonly
          @change="onChangeFile"
        />
        <div
          v-if="props.fileCaptionTitle || fileFormat || fileFormat.length > 0"
          class="upload-group__inner"
        >
          <p v-if="props.fileCaptionTitle" class="upload-group__title">
            {{ props.fileCaptionTitle }}
          </p>
          <ul
            v-if="fileFormat && fileFormat.length > 0"
            class="upload-group__list"
          >
            <li
              v-for="(format, idx) in fileFormat"
              :key="idx"
              class="upload-group__item"
            >
              {{ format }}
            </li>
          </ul>
        </div>
      </div>
      <p class="sub-txt">50MB 이하의 jpg, jpeg, png 만 업로드 가능합니다.</p>
      <ul class="file-upload-list">
        <li>
          <button class="down-btn" type="button">
            <span>
              <Icons icon-name="download" :width="1.4" :height="1.4" />
            </span>
            나눔스퀘어네오.otf
          </button>
        </li>
      </ul>
    </TemplateEditTextFields>
    <TemplateEditTextFields size="small" label="SVG">
      <div class="upload-group">
        <div>
          <RoundButton
            component="button"
            color-type="filed"
            size="small"
            @click="onClickUploadButton"
            >파일선택</RoundButton
          >
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label-->
        <input
          ref="fileRef"
          class="visually--hidden"
          type="file"
          readonly
          @change="onChangeFile"
        />
        <div
          v-if="props.fileCaptionTitle || fileFormat || fileFormat.length > 0"
          class="upload-group__inner"
        >
          <p v-if="props.fileCaptionTitle" class="upload-group__title">
            {{ props.fileCaptionTitle }}
          </p>
          <ul
            v-if="fileFormat && fileFormat.length > 0"
            class="upload-group__list"
          >
            <li
              v-for="(format, idx) in fileFormat"
              :key="idx"
              class="upload-group__item"
            >
              {{ format }}
            </li>
          </ul>
        </div>
      </div>
      <p class="sub-txt">
        50MB 이하의 svg 만 업로드 가능합니다. clipPath가 포함된 svg만 업로드
        해주세요.
      </p>
    </TemplateEditTextFields>
    <TemplateEditTextFields
      size="small"
      label="태그"
      class-bind="!pb-[2.8rem] border-b-[1px] border-b-gray-gray-ddd"
    >
      <TextArea
        size="medium"
        :textarea-id="textareaId2"
        v-model="textareaRef"
        placeholder="태그를 ,(쉼표) 구분해주세요."
      />
    </TemplateEditTextFields>
    <TemplateEditTextFields
      size="small"
      label="노출"
      class-bind="pt-[1rem] !pb-[1rem]"
    >
      <Switch />
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
        >업로드</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { ref } from 'vue';

import Icons from '@/components/Icons/Icons.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextArea from '@/components/TextArea/TextArea.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  styleType: {
    type: String,
    default: 'file',
    validator: (value) => {
      return ['file', 'image'].includes(value);
    },
  },
  files: {
    type: Array,
    default: () => [],
  },
  fileCaptionTitle: {
    type: String,
    default: null,
  },
  fileFormat: {
    type: Array,
    default: () => [],
  },
});

const textareaId2 = uuid();
const textareaRef = ref('');

const emit = defineEmits(['close-button', 'file-upload', 'file-remove']);

const handleClose = () => {
  emit('close-button', false);
};

const fileRef = ref();

const onClickUploadButton = () => {
  fileRef.value.click();
};

const onChangeFile = (event) => {
  const file = event.target.files[0];
  emit('file-upload', file);
};
</script>

<style scoped>
.setting-head {
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.setting-head__area {
  display: flex;
  gap: 0 2rem;
}

.setting-head__img-wrap {
  position: relative;
  width: 12.8rem;
  height: 12.8rem;
  background-color: #f4f4f4;
  overflow: hidden;
}

.setting-head__img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.setting-head__info-item {
  display: flex;
  gap: 0 2rem;
  padding: 0.6rem 0;
}

.setting-head__info-title {
  width: 8rem;
  font-size: var(--fz-m);
  font-weight: 700;
}

.setting-head__info-desc {
  font-size: var(--fz-m);
}

.setting-body {
  padding-top: 2.4rem;
}
.sub-txt {
  font-size: 1.4rem;
  color: var(--color-gray-777);
  margin-top: 1rem;
}
.template-edit-input {
  border-bottom: 1px solid var(--color-gray-ddd);
  margin-bottom: 2.4rem;
  padding-bottom: 2.4rem !important;
}
.file-upload-list {
  color: var(--color-gray-444);
  font-size: 1.4rem;
  margin-top: 2rem;
}
.file-upload-list > li .down-btn {
  display: flex;
  align-items: center;
}
.down-btn span {
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  border: 1px solid var(--color-gray-ddd);
  align-items: center;
  justify-content: center;
  margin-right: 1.2rem;
}
</style>
