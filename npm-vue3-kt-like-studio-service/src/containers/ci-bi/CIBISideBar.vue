<template>
  <div class="sidebar">
    <ul class="sidebar__list">
      <li class="sidebar__item" :class="isActiveId === 0 && 'is-active'">
        <a href="#watermark">워터마크</a>
      </li>
      <li class="sidebar__item" :class="isActiveId === 1 && 'is-active'">
        <a href="#watermarkColor">워드마크 색상 규정</a>
      </li>
      <li class="sidebar__item" :class="isActiveId === 2 && 'is-active'">
        <a href="#watermarkBackground">워드마크 배경색 규정</a>
      </li>
      <li class="sidebar__item" :class="isActiveId === 3 && 'is-active'">
        <a href="#exampleOfUseError">사용 오류 예시</a>
      </li>
      <li class="sidebar__item" :class="isActiveId === 4 && 'is-active'">
        <a href="#ktServiceCategory">KT 서비스 카테고리 조합</a>
      </li>
      <li class="sidebar__item" :class="isActiveId === 5 && 'is-active'">
        <a href="#ktSpaceCategory">KT 공간표기 카테고리 조합</a>
      </li>
      <li class="sidebar__item" :class="isActiveId === 6 && 'is-active'">
        <a href="#ciBIRegulation">CI/BI 관련 규정 안내</a>
      </li>
      <li class="sidebar__item" :class="isActiveId === 7 && 'is-active'">
        <a href="#ciBIFAQ">주요 질문사항 모음</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import imagesLoaded from 'imagesloaded';
import { onMounted, onUnmounted, ref } from 'vue';

const isActiveId = ref(0);
const $element = ref(null);
const elementsTop = ref([]);

// const cibiStore = useCIBIStore();
// const { scrollY, componentsPosition } = storeToRefs(cibiStore);
//
// watchEffect(() => {
//   console.log('scrollY', scrollY);
//   console.log('componentsPosition', elementsTop.value);
// });

const hanldeScrollEvent = () => {
  const scrollY = window.pageYOffset;
  if (scrollY <= elementsTop.value[1]) {
    isActiveId.value = 0;
  } else if (
    scrollY >= elementsTop.value[1] &&
    scrollY < elementsTop.value[2]
  ) {
    isActiveId.value = 1;
  } else if (
    scrollY >= elementsTop.value[2] &&
    scrollY < elementsTop.value[3]
  ) {
    isActiveId.value = 2;
  } else if (
    scrollY >= elementsTop.value[3] &&
    scrollY < elementsTop.value[4]
  ) {
    isActiveId.value = 3;
  } else if (
    scrollY >= elementsTop.value[4] &&
    scrollY < elementsTop.value[5]
  ) {
    isActiveId.value = 4;
  } else if (
    scrollY >= elementsTop.value[5] &&
    scrollY < elementsTop.value[6]
  ) {
    isActiveId.value = 5;
  } else if (
    scrollY >= elementsTop.value[6] &&
    scrollY < elementsTop.value[7]
  ) {
    isActiveId.value = 6;
  } else if (scrollY >= elementsTop.value[7]) {
    isActiveId.value = 7;
  }
};

onMounted(() => {
  $element.value = document.querySelectorAll('.ci-bi .content .article');

  imagesLoaded($element.value, () => {
    if ($element.value) {
      [...$element.value].forEach((el, idx) => {
        elementsTop.value[idx] = el.offsetTop;
      });
    }
  });

  window.addEventListener('scroll', hanldeScrollEvent);
});

onUnmounted(() => {
  window.removeEventListener('scroll', hanldeScrollEvent);
});
</script>

<style scoped>
.sidebar {
  width: 26.8rem;
}

.sidebar__list {
  position: sticky;
  top: 8rem;
}

.sidebar__item {
  font-size: var(--fz-l);
  color: var(--color-gray-777);
}

.sidebar__item.is-active {
  font-weight: 700;
  color: var(--color-primary);
}

.sidebar__item + .sidebar__item {
  margin-top: 1.6rem;
}
</style>
