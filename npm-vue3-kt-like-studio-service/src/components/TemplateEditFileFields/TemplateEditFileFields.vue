<template>
  <div class="template-edit-file">
    <div class="template-edit-file__label">첨부파일</div>
    <div class="template-edit-file__inner">
      <div class="upload-group">
        <div>
          <Button
            component="button"
            color-type="standard"
            size="large"
            @click="onClickUploadButton"
            >파일선택(2/3)</Button
          >
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label-->
        <input
          ref="fileRef"
          class="visually--hidden"
          type="file"
          @change="onChangeFile"
        />
        <div class="upload-group__inner">
          <p class="upload-group__title">
            첨부파일은 최대 3개, 1개 파일당 50MB 이하의 아래 확장자만 업로드
            가능합니다.
          </p>
          <ul class="upload-group__list">
            <li class="upload-group__item">압축 파일 : zip, 7z, alz, egg</li>
            <li class="upload-group__item">
              문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf
            </li>
            <li class="upload-group__item">
              이미지 파일 : jpg , jpeg , png , gif
            </li>
            <li class="upload-group__item">
              영상 파일 : mp4, wmv, asf , flv, mov, mpeg
            </li>
          </ul>
        </div>
      </div>
      <ul
        v-show="props.files && props.files.length > 0"
        class="upload-file-list"
      >
        <li v-for="file in props.files" :key="file.id" class="upload-file-item">
          <button type="button" @click="onDownloadFile">
            {{ file.filename }}
          </button>
          <IconButton
            icon-name="delete"
            size="small"
            type="outlined"
            component="button"
            @click="onRemoveFile"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Button from '@/components/Button/Button.vue';
import IconButton from '@/components/IconButton/IconButton.vue';

const props = defineProps({
  files: {
    type: Array,
    default: () => [],
  },
});

const fileRef = ref();
const emit = defineEmits(['file-upload', 'file-remove']);

const onClickUploadButton = () => {
  fileRef.value.click();
};

const onChangeFile = (event) => {
  const file = event.target.files[0];
  emit('file-upload', file);
};

const onRemoveFile = () => {
  emit('file-remove', 'dummyfile');
};

const onDownloadFile = () => {
  console.log('download file');
};
</script>

<style scoped>
.template-edit-file {
  display: flex;
  gap: 0 2rem;
  padding-top: 4rem;
  padding-bottom: 4rem;
  border-top: 1px solid var(--color-gray-ddd);
  border-bottom: 1px solid var(--color-neutrals-black);
}

.template-edit-file__label {
  min-width: 18.3rem;
  padding: 1.45rem 0;
  font-size: var(--fz-xl);
  font-weight: 700;
}

.template-edit-file__inner {
  flex-grow: 1;
}

.upload-group__button {
  display: inline-block;
  cursor: pointer;
}

.upload-group {
  display: flex;
  gap: 0 3.4rem;
}

.upload-group__title {
  margin-bottom: 1rem;
  font-size: var(--fz-m);
  font-weight: 700;
}

.upload-group__list {
  font-size: var(--fz-m);
  color: var(--color-gray-444);
}

.upload-file-list {
  margin-top: 4rem;
}

.upload-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  height: 5.2rem;
  padding: 0 2rem;
  background-color: #f6f6f6;
  border-radius: 0.6rem;
  border: 1px solid var(--color-gray-ddd);
  font-size: var(--fz-m);
}

.upload-file-item + .upload-file-item {
  margin-top: 1.2rem;
}
</style>
