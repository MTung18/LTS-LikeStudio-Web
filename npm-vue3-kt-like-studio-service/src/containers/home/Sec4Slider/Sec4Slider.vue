<template>
  <SlideCategory
    :categories="dummyCategories"
    @category-selected="updateSelectedCategory"
  />
  <ul class="template-list">
    <li
      v-for="item in [1, 2, 3, 4, 5]"
      :key="item"
      class="template-item"
      tabindex="0"
      @click="handleSliderLayoutPopupOpen"
      @keydown.enter="handleSliderLayoutPopupOpen"
    >
      <figure class="template-img-wrap">
        <img :src="getImageUrl(item)" alt="예시 이미지" />
      </figure>
      <div class="item-detail">
        <div class="item-detail__area">
          <b class="item-detail__title"
            >KT만의 강인한 혜택 이강인 가족 패키지</b
          >
          <ul class="item-detail__category-list">
            <li class="item-detail__category-item">전략기획팀</li>
            <li class="item-detail__category-item">김동욱</li>
          </ul>
          <div class="item-detail__length">
            <Icons icon-name="sheet" />
            <span>2</span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

import Icons from '@/components/Icons/Icons.vue';
import SlideCategory from '@/containers/home/SlideCategory.vue';
import useMainStore from '@/stores/modules/main';

const mainStore = useMainStore();
const { handleSliderLayoutPopupOpen } = mainStore;

const dummyCategories = ref([
  {
    id: 0,
    title: '포스터',
    isSelected: true,
  },
  {
    id: 1,
    title: '브로셔',
    isSelected: false,
  },
  {
    id: 2,
    title: '책받침',
    isSelected: false,
  },
  {
    id: 3,
    title: '전단지',
    isSelected: false,
  },
  {
    id: 4,
    title: 'X배너',
    isSelected: false,
  },
  {
    id: 5,
    title: 'SNS용',
    isSelected: false,
  },
  {
    id: 6,
    title: 'PPT',
    isSelected: false,
  },
  {
    id: 7,
    title: '기타',
    isSelected: false,
  },
  {
    id: 8,
    title: '기타1',
    isSelected: false,
  },
  {
    id: 9,
    title: '기타2',
    isSelected: false,
  },
]);

function updateSelectedCategory(selectedId) {
  const newCategories = dummyCategories.value.map((category) => ({
    ...category,
    isSelected: category.id === selectedId,
  }));

  dummyCategories.value = newCategories;
}
const getImageUrl = (name) => {
  return new URL(`./img/${name}.png`, import.meta.url).href;
};
</script>

<style scoped>
.template-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0 3rem;
}

.template-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 2.4rem;
}

.template-img-wrap {
  width: 100%;
  height: 100%;
}

.template-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-detail {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%);
  display: none;
  flex-direction: column;
}

.template-item:hover .item-detail {
  display: flex;
}

.item-detail__area {
  margin-top: auto;
  padding: 1.6rem 2rem;
}

.item-detail__title {
  font-size: var(--ttl-m);
  font-weight: 700;
  color: var(--color-neutrals-white-100);
}

.item-detail__category-list {
  display: flex;
  gap: 0 1.4rem;
  margin-top: 1.6rem;
  font-size: var(--fz-m);
  font-weight: 500;
  color: var(--color-neutrals-white-100);
}

.item-detail__category-item {
  position: relative;
  max-width: 50%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.item-detail__category-item:last-child::before {
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 1px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
}
.item-detail__category-item:last-child {
  padding-left: 1.4rem;
}
.item-detail__length {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
  margin-top: 1.2rem;
  font-size: var(--fz-m);
  font-weight: 500;
  color: var(--color-neutrals-white-100);
}

.item-detail__length :deep(.icon-wrap) path {
  fill: var(--color-neutrals-white-100);
}
</style>
