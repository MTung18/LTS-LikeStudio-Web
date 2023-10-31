<template>
  <div class="detail-answer">
    <div class="detail-answer__tag">라이크 스튜디오의 답변입니다.</div>
    <div class="detail-answer__content">{{ props.content }}</div>
    <FileDownload
      :files="props.files"
      class-bind="detail-answer__file-download"
    />
    <span class="detail-answer__date">{{ props.date }}</span>
  </div>
</template>

<script setup>
import FileDownload from '@/components/FileDownload/FileDownload.vue';

const props = defineProps({
  content: {
    type: String,
    required: true,
    default: '',
  },
  files: {
    type: Array,
    default: () => [],
  },
  date: {
    type: String,
    required: true,
    default: '',
  },
});
</script>

<style scoped>
.detail-answer {
  position: relative;
  margin-bottom: 6rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.detail-answer::after {
  position: absolute;
  top: -6rem;
  left: 0;
  content: '';
  width: 100%;
  height: 1px;
  background-color: var(--color-primary);
}

.detail-answer__tag {
  display: inline-block;
  min-width: 20.2rem;
  height: 4.4rem;
  line-height: 4.4rem;
  margin-bottom: 2rem;
  border-radius: 0.6rem;
  text-align: center;
  background-color: var(--color-primary);
  font-size: var(--fz-m);
  font-weight: 700;
  color: var(--color-neutrals-white-100);
}

.detail-answer__content {
  margin-bottom: 4rem;
}

.detail-answer__date {
  display: block;
  margin-bottom: 6rem;
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}
</style>
