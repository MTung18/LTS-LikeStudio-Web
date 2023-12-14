<template>
  <div :class="props.classBind" class="download__file-wrap">
    <p class="download__title">첨부파일</p>
    <ul class="download__file-list">
      <li v-for="item in props.files" :key="item.id" class="download__file-item">
        <button type="button" class="file-item__area" @click="downloadFile(item.filePath, item.filename)">
          <span class="file-icon">
            <Icons icon-name="download" :width="1.4" :height="1.4" />
          </span>
          <span class="file-name">{{ item.filename }}</span>
        </button>
        <!-- <span class="text-2xl hover:opacity-50 cursor-pointer" @click="deleteFile(item.id)">X</span> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';
import customToast from '@/untils/custom_toast';
import { fileManagerStore } from '../../stores/fileManagerStore';
import { storeToRefs } from 'pinia';

const store = fileManagerStore();
const { responseDownloadFile } = storeToRefs(store);

const props = defineProps({
  files: {
    type: Array,
    default: () => [],
  },
  classBind: {
    type: String,
    default: '',
  },
});

const downloadFile = async (filePath, filename) => {
  const convertedPath = filePath.replace(/\\/g, '/');
  const finalString = convertedPath.replace(/\/+/g, '/');
  const fileUrl = finalString;

  try {
    await store.downloadFile(fileUrl);

    const blob = new Blob([responseDownloadFile.value]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); 

    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    customToast.success('Successfully downloaded file');
  } catch (error) {
    console.error('Error while downloading file', error);
    customToast.error('Error while downloading file');
  }
};

</script>

<style scoped>
.download__file-wrap {
  margin-top: 4rem;
  padding: 2rem;
  background-color: #f6f6f6;
}

.download__title {
  margin-bottom: 1.6rem;
  font-size: var(--fz-l);
  color: var(--color-gray-444);
  font-weight: 700;
}

.download__file-item+.download__file-item {
  margin-top: 1.4rem;
}

.file-item__area {
  display: flex;
  gap: 0 1.2rem;
  align-items: center;
  width: 100%;
  text-align: left;
  font-size: var(--fz-m);
}

.file-icon {
  padding: 0.3rem;
  border: 1px solid var(--color-gray-ddd);
  background-color: var(--color-neutrals-white-100);
}

.file-name {
  min-width: 0;
  flex: 1;
  display: -webkit-box;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  /* 텍스트를 자를 때 원하는 단위 ex) 3줄 */
  -webkit-box-orient: vertical;
}
</style>
