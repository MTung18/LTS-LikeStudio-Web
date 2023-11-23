<template>
  <div class="masonry__list" ref="MasonryList">
    <div
      v-for="item in [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      ]"
      :key="item"
      role="button"
      tabindex="0"
      class="masonry__item group"
      @click="handleGalleryClick(item)"
      @keydown.enter="handleGalleryClick(item)"
    >
      <img :src="getImageUrl(item)" alt="예시 이미지" />
      <GalleryDetailInfo
        class="group-hover:flex"
        title="KT만의 강인한 혜택 이강인 가족 패키지"
        position="전략기획팀"
        writer="김동욱"
        :item-length="2"
      />
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import imagesLoaded from 'imagesloaded';
import Masonry from 'masonry-layout';
import { onMounted, ref } from 'vue';

import GalleryDetailInfo from '@/components/GalleryDetailInfo/GalleryDetailInfo.vue';

const MasonryList = ref(null);

const emit = defineEmits(['gallery-click']);

const handleGalleryClick = (id) => {
  emit('gallery-click', id);
};

onMounted(() => {
  if (MasonryList.value) {
    imagesLoaded(MasonryList.value, () => {
      MasonryList.value = new Masonry(MasonryList.value, {
        itemSelector: '.masonry__item',
        transitionDuration: 0,
        gutter: 20,
      });
    });
  }
});

const getImageUrl = (name) => {
  return new URL(`./img/${name}.png`, import.meta.url).href;
};
</script>

<style scoped>
.masonry__list {
  margin-top: 2.4rem;
}

.masonry__item {
  width: 100%;
  max-width: calc((100% - 80px) / 5);
  float: left;
  margin-bottom: 1rem;
  border-radius: 1.2rem;
  overflow: hidden;
  cursor: pointer;
}

.masonry__item--sizer {
  width: 26.8rem;
}

@media screen and (max-width: 1280px) {
  .masonry__item {
    max-width: calc((100% - 40px) / 3);
  }
}
</style>
