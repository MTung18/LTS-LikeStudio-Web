<template>
  <div class="pagination">
    <div class="pagination__prev-wrap">
      <IconButton
        icon-name="double_chevron_l"
        size="semi-medium"
        type="outlined"
        component="button"
      />
      <IconButton
        icon-name="chevron_l"
        size="semi-medium"
        type="outlined"
        component="button"
      />
    </div>

    <ul class="pagination__list">
      <li
        v-for="item in props.pageNumber"
        :key="item"
        class="pagination__item"
        :class="currentPage === item && 'is-selected'"
      >
        <button type="button">{{ item }}</button>
      </li>
    </ul>

    <div class="pagination__next-wrap">
      <IconButton
        icon-name="chevron_r"
        size="semi-medium"
        type="outlined"
        component="button"
      />
      <IconButton
        icon-name="double_chevron_r"
        size="semi-medium"
        type="outlined"
        component="button"
      />
    </div>
  </div>
</template>

<script setup>
import IconButton from '@/components/IconButton/IconButton.vue';

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
