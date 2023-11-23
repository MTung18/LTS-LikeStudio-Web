<template>
  <div class="not-project container-1200">
    <h3 class="not-project__title">보유 중인 프로젝트가 없어요!</h3>
    <p class="not-project__desc">
      프로젝트 만들기로 새로운 디자인을 만들어 보세요. 템플릿과 갤러리 페이지의
      프로젝트를 사용할 수도 있어요!
    </p>
    <div class="action-list">
      <div
        class="action-item action-item--new-project"
        role="button"
        tabindex="0"
        @click="popupNewProjectIsOpen = true"
        @keydown="popupNewProjectIsOpen = true"
      >
        <div class="action-item__icon">
          <svg
            class="action-item__icon-bar"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 29 28"
            fill="none"
          >
            <path
              d="M1.5 14H27.5M14.5 1L14.5 27"
              stroke="#111111"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <p class="action-item__text">새 프로젝트 만들기</p>
      </div>
      <div class="action-item action-item--view-template">
        <figure class="action-item__img">
          <img src="./img/img_template_bg.png" alt="템플릿 둘러보기" />
        </figure>
        <div class="text-center mt-[3.2rem]">
          <UIButton
            component="a"
            href="/template"
            color-type="standard"
            size="medium"
            >템플릿 둘러보기</UIButton
          >
        </div>
      </div>
      <div class="action-item action-item--view-template">
        <figure class="action-item__img">
          <img src="./img/img_gallery_bg.png" alt="갤러리 둘러보기" />
        </figure>
        <div class="text-center mt-[3.2rem]">
          <UIButton
            component="a"
            href="/gallery"
            color-type="standard"
            size="medium"
            >갤러리 둘러보기</UIButton
          >
        </div>
      </div>
    </div>
  </div>
  <PopupNewProject
    :is-open="popupNewProjectIsOpen"
    @close-button="popupNewProjectIsOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';

import UIButton from '@/components/UIButton/UIButton.vue';
import PopupNewProject from '@/containers/my-studio/MyProject/PopupNewProject.vue';

const popupNewProjectIsOpen = ref(false);
</script>

<style scoped>
.not-project {
  padding-top: 12rem;
}

.not-project__title {
  margin-bottom: 1.6rem;
  font-size: var(--ttl-m);
  font-weight: 700;
  text-align: center;
}

.not-project__desc {
  font-size: var(--fz-l);
  color: var(--color-gray-444);
  text-align: center;
}

.action-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 4rem;
  margin-top: 7.2rem;
}

.action-item--new-project {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.6rem 0;
  border-radius: 2.4rem;
  border: 1px solid var(--color-gray-ddd);
  background-color: #f6f6f6;
}

.action-item__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 6rem;
  border: 2px solid var(--color-neutrals-black);
  border-radius: 9999px;
  background-color: var(--color-neutrals-white-100);
}

.action-item__icon-bar {
  width: 2.6rem;
  height: 2.6rem;
}

.action-item__text {
  font-size: var(--fz-xl);
  font-weight: 700;
}
</style>
