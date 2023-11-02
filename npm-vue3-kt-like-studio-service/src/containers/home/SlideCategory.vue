<template>
  <div class="category-container">
    <IconButton
      icon-name="arrow_prev_bold"
      class-bind="navigation-slide--prev !border-neutrals-black-20 hover:!border-neutrals-black"
      size="large"
      type="outlined"
      component="button"
    />
    <div class="category-group">
      <swiper
        :modules="modules"
        :navigation="moduleConfig.navigationConfig"
        :slides-per-view="'auto'"
        :space-between="10"
      >
        <swiper-slide
          v-for="category in props.categories"
          :key="category.id"
          class="category-item"
          :class="category.isSelected && 'is-selected'"
        >
          <button
            type="button"
            class="category-button"
            @click="handleCategoryClick(category.id)"
          >
            {{ category.title }}
          </button>
        </swiper-slide>
      </swiper>
    </div>

    <IconButton
      icon-name="arrow_next_bold"
      class-bind="navigation-slide--next !border-neutrals-black-20 hover:!border-neutrals-black"
      size="large"
      type="outlined"
      component="button"
    />
  </div>
</template>

<script setup>
/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

import IconButton from '@/components/IconButton/IconButton.vue';

const modules = [Navigation];
const moduleConfig = {
  navigationConfig: {
    nextEl: '.navigation-slide--next',
    prevEl: '.navigation-slide--prev',
  },
};

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['category-selected']);

function handleCategoryClick(id) {
  emit('category-selected', id);
}
</script>

<style scoped>
.category-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 6.4rem 0;
}

.category-group {
  max-width: 84.6rem;
  margin: 0 3rem;
}

.category-item {
  min-width: 9.7rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4.8rem;
  height: 4.8rem;
  line-height: 4.8rem;
  text-align: center;
  font-size: var(--fz-l);
  font-weight: 500;
  flex: 1;
}

.category-item:hover {
  border-color: var(--color-neutrals-black);
  background-color: var(--color-neutrals-black);
  color: var(--color-neutrals-white-100);
}

.category-item.is-selected {
  border-color: var(--color-neutrals-black);
  background-color: var(--color-neutrals-black);
  color: var(--color-neutrals-white-100);
}

.category-button {
  width: 100%;
  height: 100%;
}
</style>
