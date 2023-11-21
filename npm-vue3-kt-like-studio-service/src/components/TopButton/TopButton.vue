<template>
  <div class="fixed-button" :class="computedClasses">
    <div class="alarm">
      <button @click="handleToggleAlarm" type="button" class="alarm__btn">
        <span class="alarm__length">10</span>
        <IconEmail class="alarm__icon" />
      </button>
      <ul v-if="isOpenAlarmList" class="alarm__list">
        <li class="alarm__item">
          <div class="alarm__item-head">
            <span class="alarm__item-category">초대</span>
            <span class="alarm__item-date">2023.01.30 11:32</span>
          </div>
          <div class="alarm__item-body">
            <p class="alarm__item-desc">
              김아림님께서 라이크 스튜디오팀에 초대하였습니다.
            </p>
          </div>
          <div class="alarm__item-foot">
            <UIButton component="button" color-type="outlined" size="small"
              >닫기</UIButton
            >
            <UIButton component="button" color-type="standard" size="small"
              >팀룸으로 이동</UIButton
            >
          </div>
        </li>
        <li class="alarm__item">
          <div class="alarm__item-head">
            <span class="alarm__item-category">초대</span>
            <span class="alarm__item-date">2023.01.30 11:32</span>
          </div>
          <div class="alarm__item-body">
            <p class="alarm__item-desc">
              김아림님께서 라이크 스튜디오팀에 초대하였습니다.
            </p>
          </div>
          <div class="alarm__item-foot">
            <UIButton component="button" color-type="outlined" size="small"
              >닫기</UIButton
            >
            <UIButton component="button" color-type="standard" size="small"
              >팀룸으로 이동</UIButton
            >
          </div>
        </li>
        <li class="alarm__item">
          <div class="alarm__item-head">
            <span class="alarm__item-category">초대</span>
            <span class="alarm__item-date">2023.01.30 11:32</span>
          </div>
          <div class="alarm__item-body">
            <p class="alarm__item-desc">
              김아림님께서 라이크 스튜디오팀에 초대하였습니다.
            </p>
          </div>
          <div class="alarm__item-foot">
            <UIButton component="button" color-type="outlined" size="small"
              >닫기</UIButton
            >
            <UIButton component="button" color-type="standard" size="small"
              >팀룸으로 이동</UIButton
            >
          </div>
        </li>
        <li class="alarm__item">
          <div class="alarm__item-head">
            <span class="alarm__item-category">초대</span>
            <span class="alarm__item-date">2023.01.30 11:32</span>
          </div>
          <div class="alarm__item-body">
            <p class="alarm__item-desc">
              김아림님께서 라이크 스튜디오팀에 초대하였습니다.
            </p>
          </div>
          <div class="alarm__item-foot">
            <UIButton component="button" color-type="outlined" size="small"
              >닫기</UIButton
            >
            <UIButton component="button" color-type="standard" size="small"
              >팀룸으로 이동</UIButton
            >
          </div>
        </li>
      </ul>
    </div>
    <IconButton
      ref="topButtonRef"
      icon-name="arrow_top_bold"
      icon-color="var(--color-neutrals-white-100)"
      size="large"
      type="outlined"
      component="button"
      class="bg-neutrals-black !border-neutrals-black"
      @click="handleGoToTop"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import IconButton from '@/components/IconButton/IconButton.vue';
import IconEmail from '@/components/TopButton/IconEmail.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const isOpenAlarmList = ref(false);
const topButtonRef = ref(null);
const isFixed = ref(true);
const stylesRef = computed(() => (isFixed.value ? 'fixed' : 'absolute'));
const staticClasses = 'bottom-[2.5rem] right-[8rem]';
const computedClasses = computed(() => `${staticClasses} ${stylesRef.value}`);

const handleGoToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

const handlerScroll = () => {
  const winY = window.pageYOffset;
  const winH = window.innerHeight;
  const root = document.querySelector('.root');
  const footer = document.querySelector('.footer');
  const rootScrollHeight = root.scrollHeight;
  const footerHeight = footer.offsetHeight;
  const currentY = winY + winH;
  const boundaryLine = rootScrollHeight - footerHeight;
  isFixed.value = currentY < boundaryLine;
};

const handleToggleAlarm = () => {
  isOpenAlarmList.value = !isOpenAlarmList.value;
};
onMounted(() => {
  window.addEventListener('scroll', handlerScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handlerScroll);
});
</script>

<style scoped>
.fixed-button {
  z-index: 9;
}
.alarm {
  position: relative;
  margin-bottom: 0.8rem;
}

.alarm__btn {
  position: relative;
  width: 5.6rem;
  height: 5.6rem;
  padding: 0.8rem 0.4rem;
  margin-left: -0.4rem;
}

.alarm__length {
  position: absolute;
  top: -0.4rem;
  right: -0.6rem;
  width: 3.7rem;
  height: 2.8rem;
  line-height: 2.8rem;
  background-color: var(--color-primary);
  border-radius: 3.4rem;
  font-size: var(--fz-m);
  font-weight: 700;
  color: var(--color-neutrals-white-100);
}

.alarm__list {
  position: absolute;
  bottom: calc(100% + 3.2rem);
  right: 0;
}

.alarm__item {
  padding: 2.4rem;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 2.4rem;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: var(--color-neutrals-white-100);
}

.alarm__item + .alarm__item {
  margin-top: 0.8rem;
}

.alarm__item-head {
  margin-bottom: 1.4rem;
  line-height: 1;
}

.alarm__item-category {
  position: relative;
  display: inline-block;
  margin-right: 2.4rem;
  font-size: var(--fz-l);
  font-weight: 700;
}

.alarm__item-category::after {
  position: absolute;
  top: 0;
  right: -1.2rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.alarm__item-date {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.alarm__item-body {
  margin-bottom: 1.4rem;
}

.alarm__item-desc {
  font-size: var(--fz-m);
  color: var(--color-gray-444);
}

.alarm__item-foot {
  display: flex;
  gap: 0 1rem;
}
</style>
