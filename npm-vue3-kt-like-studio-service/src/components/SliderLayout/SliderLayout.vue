<template>
  <div class="slide-container">
    <div class="navigation">
      <IconButton
        icon-name="arrow_prev_bold"
        class-bind="navigation-slide--prev !border-neutrals-black-20 hover:!border-neutrals-black"
        size="medium"
        type="outlined"
        component="button"
      />
      <IconButton
        icon-name="arrow_next_bold"
        class-bind="navigation-slide--next !border-neutrals-black-20 hover:!border-neutrals-black"
        size="medium"
        type="outlined"
        component="button"
      />
    </div>
    <swiper
      class="slide-wrap"
      :modules="modules"
      :navigation="moduleConfig.navigationConfig"
      :slides-per-view="'auto'"
      :slidesPerGroupAuto="true"
      :spaceBetween="30"
      :loop="true"
    >
      <swiper-slide
        class="slide-item"
        v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
        :key="item"
        role="button"
        tabindex="0"
        @click="handleSlideClick(item)"
      >
        <img :src="getImageUrl(item)" alt="예시 이미지" />
      </swiper-slide>
    </swiper>
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

const emit = defineEmits(['slide-click']);

const handleSlideClick = (id) => {
  emit('slide-click', id);
};

const getImageUrl = (name) => {
  return new URL(`./img/${name}.png`, import.meta.url).href;
};
</script>

<style scoped>
.slide-container {
  position: relative;
  margin-top: 2.4rem;
}

.navigation {
  position: absolute;
  bottom: calc(100% + 2.8rem);
  right: 0;
  display: flex;
  gap: 0 1rem;
}

.slide-item {
  min-width: 0;
  flex-basis: content;
  height: 26.6rem;
}

.slide-item > img {
  height: 100%;
}
</style>
