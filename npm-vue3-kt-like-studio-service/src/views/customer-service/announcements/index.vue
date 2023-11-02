<template>
  <TemplateBoardWrap title="공지사항">
    <CustomerSearchWrap>
      <SearchInput
        v-model="dummyInputValue"
        placeholder="검색어를 입력해주세요"
        size="medium"
        style-type="square"
        color-type="gray"
        class-bind="!min-w-[41.2rem]"
      />
      <RoundButton component="button" color-type="filed" size="medium"
        >검색</RoundButton
      >
    </CustomerSearchWrap>
    <template v-if="dummyList && dummyList.length > 0">
      <div class="list">
        <RouterLink
          v-for="item in dummyList"
          :key="item.id"
          :to="`/customer-service/announcements/${item.id}`"
          class="list__item"
        >
          <div class="item-no">{{ item.no }}</div>
          <div class="item-title" :class="item.isNotice && 'is-notice'">
            <div v-if="item.isNotice" class="notice-wrap">
              <Icons :width="2" :height="2" icon-name="pin" />
              공지
            </div>
            <span class="item-title-text">{{ item.title }}</span>
          </div>
          <div class="item-date">{{ item.date }}</div>
        </RouterLink>
      </div>
      <Pagination />
    </template>
    <template v-else>
      <TemplateDataNone />
    </template>
  </TemplateBoardWrap>
</template>

<script setup>
import { ref } from 'vue';

import CustomerSearchWrap from '@/components/CustomerSearchWrap/CustomerSearchWrap.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const dummyInputValue = ref('');
const dummyList = [
  {
    id: 0,
    no: 100,
    title: '아이폰 15 템플릿 출시! 이벤트 참여하시고 기프티콘 받아가세요!',
    date: '2023.09.20 15:32',
    isNotice: true,
  },
  {
    id: 1,
    no: 99,
    title: '추석 이벤트 디자인 템플릿 모음, 한복 AI 사진 생성도 가능해요!',
    date: '2023.09.20 15:32',
    isNotice: true,
  },
  {
    id: 2,
    no: 98,
    title: '마이페이지/고객지원 등 일부 서비스 이용제한 안내',
    date: '2023.09.18 15:32',
    isNotice: false,
  },
  {
    id: 3,
    no: 97,
    title: '인쇄종류의 추가에 따른 약관 및 개인정보취급방침의 개정',
    date: '2023.09.10 15:32',
    isNotice: false,
  },
  {
    id: 4,
    no: 96,
    title: 'AI로 고퀄리티 이미지, 사진 쉽게 만들어 보세요!',
    date: '2023.09.06 15:32',
    isNotice: false,
  },
  {
    id: 5,
    no: 95,
    title: '(업데이트) 부처님 오신날 석가탄신일 관련 템플릿 외',
    date: '2023.09.01 15:32',
    isNotice: false,
  },
  {
    id: 6,
    no: 94,
    title: '업데이트로 인한 작업 게시물 내 콘텐츠 순서 오류 안내',
    date: '2023.08.28 15:32',
    isNotice: false,
  },
  {
    id: 7,
    no: 93,
    title: '인쇄종류의 추가에 따른 약관 및 개인정보취급방침의 개정',
    date: '2023.08.21 15:32',
    isNotice: false,
  },
  {
    id: 8,
    no: 92,
    title: 'AI로 고퀄리티 이미지, 사진 쉽게 만들어 보세요!',
    date: '2023.08.17 15:32',
    isNotice: false,
  },
  {
    id: 9,
    no: 91,
    title: '업데이트로 인한 작업 게시물 내 콘텐츠 순서 오류 안내',
    date: '2023.08.12 15:32',
    isNotice: false,
  },
];
</script>

<style scoped>
.list {
  margin-bottom: 6rem;
}

.list__item {
  display: flex;
  align-items: center;
  gap: 0 2.6rem;
  height: 8.4rem;
  padding-left: 0.4rem;
  padding-right: 0.8rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.item-no {
  width: 2.6rem;
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.item-title {
  flex: 1;
  overflow: hidden;
}

.item-title.is-notice {
  display: flex;
  align-items: center;
  gap: 0 1.6rem;
}

.item-title.is-notice .item-title-text {
  font-weight: 700;
}

.item-title .item-title-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  font-size: var(--fz-l);
  line-height: 1;
}

.notice-wrap {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
  height: 3.8rem;
  line-height: 3.8rem;
  padding: 0 1.6rem;
  border: 1px solid #fde4e5;
  background-color: #fef1f2;
  border-radius: 5.6rem;
  font-size: var(--fz-m);
  font-weight: 700;
  color: var(--color-primary);
}

.item-date {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}
</style>
