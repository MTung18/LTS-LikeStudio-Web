<template>
  <div class="notice">
    <div class="notice__top">
      <div class="notice__top-title">공지사항</div>
      <IconButton
        class-bind="notice__top-link"
        icon-name="arrow_next_bold"
        icon-color="#47CDDA"
        size="large"
        type="outlined"
        component="a"
        href=""
      />
      <!--      <RouterLink to="" class="notice__top-link">-->
      <!--        <Icons-->
      <!--          :width="2.4"-->
      <!--          :height="2.4"-->
      <!--          icon-name="arrow_next_bold"-->
      <!--          icon-color="#47CDDA"-->
      <!--        />-->
      <!--      </RouterLink>-->
    </div>
    <ul class="notice__list">
      <li class="notice__item" v-for="item in data" :key="item.id">
        <RouterLink to="" class="notice__item-wrap">
          <p class="notice__item-title">{{ item.title }}</p>
          <span class="notice__item-date">{{ item.date }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import IconButton from '@/components/IconButton/IconButton.vue';

const data = [
  {
    id: 0,
    title: '아이폰 15 템플릿 출시! 이벤트 참여하시고 기프티콘 받아가세요!',
    date: '2023.09.20',
  },
  {
    id: 1,
    title: '추석 이벤트 디자인 템플릿 모음, 한복 AI 사진 생성도 가능해요!',
    date: '2023.09.20',
  },
  {
    id: 2,
    title: '(업데이트) 추석 한가위 템플릿 외',
    date: '2023.09.20',
  },
  {
    id: 3,
    title: 'AI로 고퀄리티 이미지, 사진 쉽게 만들어 보세요!',
    date: '2023.09.20',
  },
];
</script>

<style scoped>
.notice {
  max-width: 56.6rem;
  width: 100%;
  border-radius: 2.4rem;
  background-color: var(--color-neutrals-white-100);
  padding: 3rem 3rem 0 3rem;
}

.notice__top {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
}

.notice__top-title {
  padding: 0 1.5rem;
  height: 4.2rem;
  line-height: 4.4rem;
  border-radius: 0.7rem;
  background-color: #47cdda;
  font-size: var(--ttl-s);
  font-weight: 700;
  color: var(--color-neutrals-white-100);
}

.notice__top-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.8rem;
  height: 4.8rem;
  margin-left: auto;
  border-radius: 9999px;
  border: 1px solid var(--color-gray-ddd);
}

.notice__item {
  padding-bottom: 1.6rem;
  border-bottom: 1px solid #e9e9e9;
}

.notice__list .notice__item:nth-of-type(4) {
  border-bottom: 0;
}

.notice__item + .notice__item {
  margin-top: 1.6rem;
}

.notice__item-title {
  display: block;
  margin-bottom: 0.8rem;
  font-size: var(--fz-l);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice__item-date {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}
</style>
