<template>
  <aside class="sidebar">
    <div class="sidebar__wrap">
      <div class="sidebar__category">
        <div class="sidebar__category-list">
          <div v-for="vmdData in props.data" :key="vmdData.id" :class="[vmdData.isSelected && 'is-selected']"
            class="sidebar__category-item">
            <button type="button" @click="getTitle(vmdData.id)" :is-selected="vmdData.id == vmdId ? true : false">{{ vmdData.title }}</button>
          </div>
        </div>
        <div class="pagination">
          <button :disabled="isDisabledPrevButton" type="button" class="pagination__action action--first"
            @click="firstPage()">
            <Icons icon-name="double_chevron_l" :width="1.4" :height="1.4" />
          </button>
          <button :disabled="isDisabledPrevButton" type="button" class="pagination__action action--prev"
            @click="prevPage()">
            <Icons icon-name="chevron_l" :width="1.4" :height="1.4" />
          </button>
          <ul class="pagination__list">
            <li v-for="item in props.pageNumber" :key="item" class="pagination__item"
              :class="currentPage === item && 'is-selected'">
              <button type="button" @click="navigate(item)">{{ item }}</button>
            </li>
          </ul>
          <button :disabled="isDisabledNextButton" type="button" class="pagination__action action--next"
            @click="nextPage()">
            <Icons icon-name="chevron_r" :width="1.4" :height="1.4" />
          </button>
          <button type="button" class="pagination__action action--last">
            <Icons :disabled="isDisabledNextButton" icon-name="double_chevron_r" :width="1.4" :height="1.4"
              @click="lastPage()" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';
import { onMounted, ref, watch } from 'vue';

const isDisabledPrevButton = ref(false);
const isDisabledNextButton = ref(false);
const vmdId = ref();
const props = defineProps({
  data: {
    type: Array,
    default: null,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageNumber: {
    type: Number,
    default: 5,
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

const getTitle = (id) => {
  vmdId.value = id;
  emit('vmdId', vmdId.value)
}

watch(() => props.currentPage, (newValue, oldValue) => {
  isDisabledPrevButton.value = newValue === 1;
  isDisabledNextButton.value = newValue === props.pageNumber;
});

onMounted(() => {
  // console.log(props.data);
  isDisabledPrevButton.value = props.currentPage === 1;
  isDisabledNextButton.value = props.currentPage === props.pageNumber;
});
</script>

<style scoped>
.sidebar {
  width: 26rem;
}

.sidebar__wrap {
  position: sticky;
  top: 8rem;
  padding: 2rem;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 2.4rem;
  background-color: var(--color-neutrals-white-100);
}

.sidebar__category-list {
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.sidebar__category-item {
  font-size: var(--fz-m);
  color: var(--color-gray-444);
}

.sidebar__category-item.is-selected {
  font-weight: 700;
  color: var(--color-primary);
}

.sidebar__category-item+.sidebar__category-item {
  margin-top: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1.6rem;
}

.pagination__list {
  display: flex;
  align-items: center;
  gap: 0 1.2rem;
  margin: 0 auto;
}

.pagination__item-btn {
  position: relative;
  padding: 0 0.3rem;
  font-size: var(--fz-m);
  font-weight: 500;
  color: var(--color-gray-777);
}

.pagination__item-btn::after {
  position: absolute;
  left: 0;
  bottom: 0;
  content: '';
  display: none;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
}

.pagination__item.is-selected .pagination__item-btn {
  color: var(--color-primary);
}

.pagination__item.is-selected .pagination__item-btn::after {
  display: block;
}

.pagination__action {
  display: flex;
}

.action--prev {
  margin-left: 0.2rem;
}

.action--next {
  margin-right: 0.2rem;
}
</style>
