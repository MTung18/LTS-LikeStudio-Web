<template>
  <div class="pagination">
    <div class="pagination__prev-wrap">
      <IconButton :disabled="isDisabledPrevButton" icon-name="double_chevron_l" size="semi-medium" type="outlined"
        component="button" @click="firstPage()" />
      <IconButton :disabled="isDisabledPrevButton" icon-name="chevron_l" size="semi-medium" type="outlined"
        component="button" @click="prevPage()" />
    </div>

    <ul class="pagination__list">
      <li v-for="item in props.pageNumber" :key="item" class="pagination__item"
        :class="currentPage === item && 'is-selected'">
        <button type="button" @click="navigate(item)">{{ item }}</button>
      </li>
    </ul>

    <div class="pagination__next-wrap">
      <IconButton :disabled="isDisabledNextButton" icon-name="chevron_r" size="semi-medium" type="outlined"
        component="button" @click="nextPage()" />
      <IconButton :disabled="isDisabledNextButton" icon-name="double_chevron_r" size="semi-medium" type="outlined"
        component="button" @click="lastPage()" />
    </div>
  </div>
</template>

<script setup>
import IconButton from '@/components/IconButton/IconButton.vue';
import { onMounted, ref, watch } from 'vue';


const isDisabledPrevButton = ref(false);
const isDisabledNextButton = ref(false);
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageNumber: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(['numberPage']);

function navigate(newPage) {
  emit('numberPage', newPage);
}

function prevPage() {
  emit('numberPage', props.currentPage - 1);
}

function firstPage() {
  emit('numberPage', 1);
}

function nextPage() {
  emit('numberPage', props.currentPage + 1);
}

function lastPage() {
  emit('numberPage', props.pageNumber);
}

watch(() => props.currentPage, (newValue) => {
  isDisabledPrevButton.value = newValue === 1;
  isDisabledNextButton.value = newValue === props.pageNumber;
});

watch(() => props.pageNumber, (newValue) => {
  if (newValue == 1) {
    isDisabledPrevButton.value = true
    isDisabledNextButton.value = true
  } else {
    isDisabledPrevButton.value = false
    isDisabledNextButton.value = false
  }
});

onMounted(() => {
  isDisabledPrevButton.value = props.currentPage === 1;
  isDisabledNextButton.value = props.currentPage === props.pageNumber;
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination__prev-wrap,
.pagination__next-wrap {
  display: flex;
  gap: 0 0.8rem;
}

.pagination__list {
  display: flex;
  gap: 0 2rem;
  margin: 0 2.8rem;
}

.pagination__item {
  position: relative;
  padding: 0.3rem;
  font-size: var(--fz-m);
  font-weight: 500;
  color: var(--color-gray-777);
}

.pagination__item:hover {
  color: var(--color-primary);
}

.pagination__item::before {
  position: absolute;
  left: 0;
  bottom: 0;
  content: '';
  display: none;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
}

.pagination__item.is-selected {
  color: var(--color-primary);
}

.pagination__item.is-selected::before {
  display: block;
}
</style>
