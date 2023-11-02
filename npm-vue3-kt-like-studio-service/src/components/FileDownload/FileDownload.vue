<template>
  <div :class="props.classBind" class="download__file-wrap">
    <p class="download__title">첨부파일</p>
    <ul class="download__file-list">
      <li
        v-for="item in props.files"
        :key="item.id"
        class="download__file-item"
      >
        <button type="button" class="file-item__area">
          <span class="file-icon">
            <Icons icon-name="download" :width="1.4" :height="1.4" />
          </span>
          {{ item.filename }}
        </button>
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

.download__file-item + .download__file-item {
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
