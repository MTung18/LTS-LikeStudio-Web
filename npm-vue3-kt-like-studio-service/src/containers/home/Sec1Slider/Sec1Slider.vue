<template>
  <div class="relative">
    <div class="slide-container">
      <swiper
        :autoplay="moduleConfig.autoPlayConfig"
        :navigation="moduleConfig.navigationConfig"
        :pagination="moduleConfig.paginationConfig"
        :modules="modules"
        :speed="1000"
        loop
        class="slide-wrap"
      >
        <template v-for="item in [0, 1, 2, 3]" :key="item">
          <swiper-slide>
            <RouterLink to="">
              <img src="./img/banner_area.png" alt="예시 이미지1" />
            </RouterLink>
          </swiper-slide>
        </template>
      </swiper>
    </div>

    <button type="button" class="navigation-button navigation-slide--prev">
      <Icons icon-name="chevron_prev" :width="3" :height="5.8" />
    </button>
    <button type="button" class="navigation-button navigation-slide--next">
      <Icons icon-name="chevron_next" :width="3" :height="5.8" />
    </button>

    <div class="pagination"></div>
  </div>
</template>
<script setup>
/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

import Icons from '@/components/Icons/Icons.vue';
/* eslint-enable import/no-unresolved, import/no-extraneous-dependencies */

const modules = [Autoplay, Navigation, Pagination];
const moduleConfig = {
  autoPlayConfig: {
    delay: 3000,
    disableOnInteraction: false,
  },
  navigationConfig: {
    nextEl: '.navigation-slide--next',
    prevEl: '.navigation-slide--prev',
  },
  paginationConfig: {
    el: '.pagination',
    type: 'bullets',
    clickable: true,
  },
};
</script>
<style scoped>
.section {
  position: relative;
  padding-top: 11rem;
  padding-bottom: 9rem;
}

.slide-container {
  max-width: 1428px;
  margin: 0 auto;
}

.navigation-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 9;
}

.navigation-slide--prev {
  left: 0;
}

.navigation-slide--next {
  right: 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 4.8rem;
}

.pagination :deep(.swiper-pagination-bullet) {
  width: 0.8rem;
  height: 0.8rem;
  margin: 0 0.5rem;
  background-color: var(--color-gray-ddd);
  opacity: 1;
}

.pagination :deep(.swiper-pagination-bullet-active) {
  background-color: var(--color-primary);
}
</style>
