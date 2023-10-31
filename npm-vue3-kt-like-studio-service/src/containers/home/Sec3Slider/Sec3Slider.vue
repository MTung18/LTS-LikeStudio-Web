<template>
  <div class="category-container">
    <IconButton
      icon-name="arrow_prev_bold"
      class-bind="!border-neutrals-black-20 hover:!border-neutrals-black"
      size="large"
      type="outlined"
      component="button"
    />
    <div class="category-group">
      <ul class="category-list">
        <li class="category-item">
          <button type="button" class="">포스터</button>
        </li>
        <li class="category-item">
          <button type="button" class="">브로셔</button>
        </li>
        <li class="category-item">
          <button type="button" class="">책받침</button>
        </li>
        <li class="category-item">
          <button type="button" class="">전단지</button>
        </li>
        <li class="category-item">
          <button type="button" class="">X배너</button>
        </li>
        <li class="category-item">
          <button type="button" class="">SNS용</button>
        </li>
        <li class="category-item">
          <button type="button" class="">PPT</button>
        </li>
        <li class="category-item">
          <button type="button" class="">기타</button>
        </li>
      </ul>
    </div>

    <IconButton
      icon-name="arrow_next_bold"
      class-bind="!border-neutrals-black-20 hover:!border-neutrals-black"
      size="large"
      type="outlined"
      component="button"
    />
  </div>
  <ul class="template-list">
    <li
      v-for="item in [1, 2, 3, 4, 5]"
      :key="item"
      class="template-item"
      role="button"
      tabindex="0"
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
import IconButton from '@/components/IconButton/IconButton.vue';
import Icons from '@/components/Icons/Icons.vue';

const getImageUrl = (name) => {
  return new URL(`./img/${name}.png`, import.meta.url).href;
};
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

.category-list {
  display: flex;
  gap: 0 1rem;
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
}

.category-item:hover {
  border-color: var(--color-neutrals-black);
  background-color: var(--color-neutrals-black);
  color: var(--color-neutrals-white-100);
}

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
  gap: 0 2.8rem;
  margin-top: 1.6rem;
  font-size: var(--fz-m);
  font-weight: 500;
  color: var(--color-neutrals-white-100);
}

.item-detail__category-item {
  position: relative;
}

.item-detail__category-item:not(:last-child):before {
  position: absolute;
  top: 0;
  right: -1.4rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
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
