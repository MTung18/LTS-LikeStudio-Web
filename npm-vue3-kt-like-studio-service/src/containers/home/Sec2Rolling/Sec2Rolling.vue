<template>
  <div
    class="rolling"
    ref="rollingContainer"
    @mouseenter="handlerStopRolling"
    @mouseleave="handlerStartRolling"
    @focusin="handlerStopRolling"
    @focusout="handlerStartRolling"
  >
    <ul class="rolling__list" ref="rollingList">
      <li
        v-for="item in [0, 1, 2, 3, 4, 5]"
        :key="item"
        class="rolling__item"
        role="button"
        tabindex="0"
      >
        <img :src="getImageUrl(item + 1)" alt="예시 이미지" />
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
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import Icons from '@/components/Icons/Icons.vue';

const isRolling = ref(true);
const rollingContainer = ref(null);
const rollingList = ref(null);

const handlerStopRolling = () => {
  if (!isRolling.value) return;
  isRolling.value = false;
  const lists = document.querySelectorAll('.rolling__list');
  lists.forEach((list) => {
    const listItem = list;
    listItem.style.animationPlayState = 'paused';
  });
};

const handlerStartRolling = () => {
  if (isRolling.value) return;
  isRolling.value = true;
  const lists = document.querySelectorAll('.rolling__list');
  lists.forEach((list) => {
    const listItem = list;
    listItem.style.animationPlayState = 'running';
  });
};

onMounted(() => {
  const rollingListRef = rollingList.value;
  const rollingContainerRef = rollingContainer.value;
  if (!rollingListRef || !rollingContainerRef) return;
  const cloneRef = rollingListRef.cloneNode(true);
  rollingContainerRef.appendChild(cloneRef);
  rollingListRef.classList.add('original');
  cloneRef.classList.add('clone');
});

const getImageUrl = (name) => {
  return new URL(`./img/${name}.png`, import.meta.url).href;
};
</script>

<style scoped>
.rolling {
  display: flex;
  margin-top: 6.4rem;
  overflow: hidden;
}

.rolling__list {
  display: flex;
  gap: 0 3rem;
  padding: 0 1.5rem;
}

.rolling__list.original {
  animation: rollingleft1 40s linear infinite;
}

.rolling__list.clone {
  animation: rollingleft2 40s linear infinite;
}

.rolling__item {
  position: relative;
  height: 32.8rem;
  border-radius: 2.4rem;
  overflow: hidden;
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

.rolling__item:hover .item-detail {
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

@keyframes rollingleft1 {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-100%);
  }
  50.01% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes rollingleft2 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-200%);
  }
}
</style>
