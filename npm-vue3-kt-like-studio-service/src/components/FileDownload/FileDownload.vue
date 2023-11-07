<template>
  <div :class="props.classBind" class="download__file-wrap">
    <ul class="download__file-list">
      <li v-for="item in props.files" :key="item.id" class="download__file-item flex items-center justify-between">
        <button type="button" class="file-item__area" @click="downloadFile(item.filePath, item.filename)">
          <span class="file-icon">
            <Icons icon-name="download" :width="1.4" :height="1.4" />
          </span>
          {{ item.filename }}
        </button>
        <!-- <span class="text-2xl hover:opacity-50 cursor-pointer" @click="deleteFile(item.id)">X</span> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';

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
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.alert('Tải tệp thành công');
    } else {
      window.alert('Lỗi khi tải tệp');
    }
  } catch (error) {
    console.error('Lỗi khi tải tệp', error);
    window.alert('Lỗi khi tải tệp');
  }
};

</script>

<style scoped>
.download__file-wrap {
  margin-top: 4rem;
  padding: 2rem;
  background-color: #f6f6f6;
}

.download__file-item+.download__file-item {
  margin-top: 1.4rem;
}

.file-item__area {
  display: flex;
  gap: 0 1.2rem;
  align-items: center;
  font-size: var(--fz-m);
}

.file-icon {
  padding: 0.3rem;
  border: 1px solid var(--color-gray-ddd);
}
</style>
