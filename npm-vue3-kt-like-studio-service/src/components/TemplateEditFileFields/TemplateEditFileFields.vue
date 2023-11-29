<template>
  <div class="template-edit-file__inner">
    <template v-if="props.styleType === 'image'">
      <div class="upload-group upload-group--image">
        <div>
          <RoundButton component="button" color-type="filed" size="medium" @click="onClickUploadButton">파일선택</RoundButton>
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label-->
        <input ref="fileRef" class="visually--hidden" type="file" readonly @change="onChangeFile" />
        <div class="upload-group__inner">
          <p class="upload-group__title">
            가로 1920px X 세로 680px<br />20MB 이하의 JPG, JPEG, GIF, PNG 파일
          </p>
        </div>
      </div>

      <div class="preview-wrap">
        <figure class="preview">
          <img class="preview__img" src="./img/img_example.png" alt="예시 이미지" />
        </figure>
        <button type="button" class="preview__remove-btn">
          <Icons icon-name="delete" icon-color="var(--color-neutrals-white-100)" :width="1.4" :height="1.4" />
        </button>
      </div>
      <ul v-if="props.files && props.files.length > 0" class="upload-image-list">
        <li v-for="(file, index) in props.files" :key="file.id" class="upload-image-item">
          <button type="button" @click="onDownloadFile(file.filePath, file.filename)" class="upload-image-button">
            <IconButton icon-name="download" size="small" type="outlined" component="button"
              class-bind="upload-image-icon" @click="onRemoveFile(index)" />
            <p class="upload-image-filename">
              <span>{{ file.name }}</span>
            </p>
          </button>
        </li>
      </ul>
    </template>
    <template v-else>
      <div class="upload-group">
        <div>
          <RoundButton component="button" color-type="filed" size="medium" @click="onClickUploadButton">파일선택({{
            files.length }}/{{ props.fileMaxLength }})</RoundButton>
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label-->
        <input ref="fileRef" class="visually--hidden" type="file" readonly @change="onChangeFile" />
        <div v-if="props.fileCaptionTitle || fileFormat || fileFormat.length > 0" class="upload-group__inner">
          <p v-if="props.fileCaptionTitle" class="upload-group__title">
            {{ props.fileCaptionTitle }}
          </p>
          <ul v-if="fileFormat && fileFormat.length > 0" class="upload-group__list">
            <li v-for="(format, idx) in fileFormat" :key="idx" class="upload-group__item">
              {{ format }}
            </li>
          </ul>
        </div>
      </div>

      <ul v-if="props.files && props.files.length > 0" class="upload-file-list">
        <li v-for="(file, index) in props.files" :key="file.id" class="upload-file-item">
          <button type="button" @click="onDownloadFile(file)">
            {{ file.oriFileName }}
          </button>
          <IconButton icon-name="delete" size="small" type="outlined" component="button" @click="onRemoveFile(index)" />
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import IconButton from '@/components/IconButton/IconButton.vue';
import Icons from '@/components/Icons/Icons.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import customToast from '@/untils/custom_toast';

const props = defineProps({
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
  fileMaxLength: {
    type: String,
    default: '10'
  }
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

const onRemoveFile = (index) => {
  emit('file-remove', index);
};

const onDownloadFile = async (file) => {
  const convertedPath = file.uniqFileName.replace(/\\/g, '/');
  const finalPath = convertedPath.split('public')[1];
  const finalString = finalPath.replace(/\/+/g, '/');
  const fileUrl = finalString;

  try {
    const response = await fetch(fileUrl);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = file.oriFileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      customToast.success('Successfully downloaded file');
    } else {
      customToast.error('Error while downloading file');
    }
  } catch (error) {
    console.error('Error while downloading file', error);
    customToast.error('Error while downloading file');
  }
};
</script>

<style scoped>
.upload-group {
  display: flex;
  gap: 0 2rem;
}

.upload-group__title {
  margin-bottom: 1rem;
  font-size: var(--fz-m);
  font-weight: 500;
}

.upload-group--image .upload-group__title {
  margin-bottom: 0;
}

.upload-group__list {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.upload-file-list {
  margin-top: 4rem;
}

.upload-group--image .upload-file-list {
  margin-top: 2rem;
}

.upload-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  gap: 0 1rem;
  height: 5.2rem;
  padding: 0 2rem;
  background-color: #f6f6f6;
  border-radius: 0.6rem;
  border: 1px solid var(--color-gray-ddd);
  font-size: var(--fz-m);
}

.upload-file-item+.upload-file-item {
  margin-top: 1.2rem;
}

.upload-file-item__name {
  min-width: 0;
  flex: 1;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.preview-wrap {
  position: relative;
  width: 50.8rem;
  margin-top: 2.8rem;
}

.preview:before {
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-gray-ddd);
}

.preview__remove-btn {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.5);
}

.preview__remove-btn:hover {
  background-color: #000;
}

.upload-image-button {
  display: flex;
  align-items: center;
  gap: 0 1.2rem;
  margin-top: 1.4rem;
  font-size: var(--fz-m);
}

.upload-image-icon {
  width: 2rem !important;
  height: 2rem !important;
  border-radius: 0 !important;
}
</style>
