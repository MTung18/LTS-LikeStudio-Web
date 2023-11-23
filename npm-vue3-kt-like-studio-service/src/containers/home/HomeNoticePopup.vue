<template>
  <PopupMedium
    :is-open="isOpen"
    popupTitle="긴급 공지"
    class-bind-area="min-w-[73.8rem]"
    @close-button="handleClose"
  >
    <div class="popup-notice">
      <div class="popup-notice__list">
        <button type="button" class="popup-notice__item is-selected">
          <p class="popup-notice__title">
            마이페이지/고객지원 등 일부 서비스 이용제한 안내
          </p>
          <p class="popup-notice__date">2023.01.30 11:32</p>
        </button>
        <button type="button" class="popup-notice__item">
          <p class="popup-notice__title">
            KT 이메일 명세서 사칭 피싱 예방을 위한 안내
          </p>
          <p class="popup-notice__date">2023.01.30 11:32</p>
        </button>
        <button type="button" class="popup-notice__item">
          <p class="popup-notice__title">
            2023년 kt와 함께하는 제3회 개인정보 보호의 날
          </p>
          <p class="popup-notice__date">2023.01.30 11:32</p>
        </button>
      </div>
      <div class="popup-notice__content-wrap">
        <div class="popup-notice__content custom-scrollbar">
          데이터 들어갈 자리
        </div>
      </div>
    </div>
    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <UIButton
        component="button"
        color-type="standard"
        size="small"
        class="!min-w-[14.1rem]"
        @click="handleClose"
        >오늘 하루 안보기</UIButton
      >
      <UIButton
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        class="!min-w-[14.1rem]"
        >닫기</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const isOpen = ref(false);

const handleStorage = {
  setStorage: (name, exp) => {
    const date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    localStorage.setItem(name, date.toString());
  },
  getStorage: (name) => {
    const now = new Date();
    const itemDate = localStorage.getItem(name);
    const itemTime = itemDate ? new Date(itemDate).getTime() : null;
    return Boolean(itemTime && itemTime > now.getTime());
  },
};
const handleClose = () => {
  isOpen.value = false;
  handleStorage.setStorage('today', 1);
};

onMounted(() => {
  isOpen.value = !handleStorage.getStorage('today');
  console.log('Storage', isOpen.value);
});
</script>

<style scoped>
.popup-notice {
  display: flex;
  gap: 0 1.4rem;
}

.popup-notice__item + .popup-notice__item {
  margin-top: 2.4rem;
}

.popup-notice__title {
  font-size: var(--fz-m);
  font-weight: 700;
}

.popup-notice__item {
  text-align: left;
}

.is-selected .popup-notice__title {
  color: var(--color-primary);
  text-decoration: underline;
}

.popup-notice__date {
  margin-top: 1rem;
  font-size: var(--fz-s);
  color: var(--color-gray-777);
}

.popup-notice__list {
  min-width: 0;
  flex: 1;
}

.popup-notice__content-wrap {
  width: 41.6rem;
  padding: 2rem;
  border-radius: 2.4rem;
  border: 1px solid var(--color-gray-ddd);
}

.popup-notice__content {
  height: 37.4rem;
  overflow-y: auto;
}
</style>
