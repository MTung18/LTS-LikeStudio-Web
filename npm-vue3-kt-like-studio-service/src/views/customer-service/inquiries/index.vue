<template>
  <TemplateBoardWrap title="1:1 문의">
    <template v-if="!firstVisit">
      <div class="mt-[4rem] text-center">
        <UIButton
          class-bind="!min-w-[18rem]"
          component="a"
          href="/customer-service/inquiries/create"
          color-type="primary"
          size="big"
          isIcon
        >
          문의하기
          <Icons
            icon-name="arrow_next_bold"
            icon-color="var(--color-neutrals-white-100)"
          />
        </UIButton>
      </div>
      <CustomerSearchWrap>
        <CalenderGroup />
        <SearchInput
          v-model="dummyInputValue"
          placeholder="검색어를 입력해주세요"
          size="medium"
          style-type="square"
          color-type="gray"
          class-bind="ml-auto !min-w-[41.2rem] flex-1"
        />
        <div class="search__button-group">
          <RoundButton component="button" color-type="filed" size="medium"
            >검색</RoundButton
          >

          <RoundButton component="button" color-type="outlined" size="medium"
            >초기화</RoundButton
          >
        </div>
      </CustomerSearchWrap>

      <template v-if="dummyList && dummyList.length > 0">
        <div class="list">
          <RouterLink
            v-for="item in dummyList"
            :key="item.id"
            :to="`/customer-service/inquiries/${item.id}/${
              item.isAnswer ? 'answered' : 'unanswered'
            }`"
            class="list__item"
          >
            <div class="item-no">{{ item.no }}</div>
            <div class="item-title">
              <span class="item-title-text">{{ item.title }}</span>
            </div>
            <div class="item-answer">
              <span v-if="item.isAnswer" class="item-answer--complete"
                >답변완료</span
              >
              <span v-else>답변대기</span>
            </div>
            <div class="item-date">{{ item.date }}</div>
          </RouterLink>
        </div>
        <Pagination />
      </template>
      <template v-else>
        <TemplateDataNone />
      </template>
    </template>
    <!-- dev: 1:1 문의를 한적이 없을 때 -->
    <template v-else>
      <FirstVisit />
    </template>
  </TemplateBoardWrap>
</template>

<script setup>
import { ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import CustomerSearchWrap from '@/components/CustomerSearchWrap/CustomerSearchWrap.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import FirstVisit from '@/containers/customer-service/inquiries/FirstVisit.vue';

const dummyList = [
  {
    id: 0,
    no: 100,
    title: '갤러리로 보내기 할 때 오류가 발생합니다.',
    date: '2023.09.20 15:32',
    isAnswer: true,
  },
  {
    id: 1,
    no: 99,
    title: "'미지원 요소'를 사용했다며 저장과 다운로드가 안돼요.",
    date: '2023.09.20 15:32',
    isAnswer: true,
  },
  {
    id: 2,
    no: 98,
    title: '디자인이 모두 사라졌어요!!',
    date: '2023.09.18 15:32',
    isAnswer: false,
  },
  {
    id: 3,
    no: 97,
    title:
      '저장공간을 초과하여 요소(사진, 일러스트, 이미지 등)을 업로드할 수 없는데 어떻게 해야 하나요?',
    date: '2023.09.10 15:32',
    isAnswer: false,
  },
  {
    id: 4,
    no: 96,
    title: '라이크스튜디오에서 제공하는 모든 글꼴을 사용해도 되나요?',
    date: '2023.09.06 15:32',
    isAnswer: false,
  },
  {
    id: 5,
    no: 95,
    title: '갤러리로 보내기 할 때 오류가 발생합니다.',
    date: '2023.09.01 15:32',
    isAnswer: false,
  },
  {
    id: 6,
    no: 94,
    title: "'미지원 요소'를 사용했다며 저장과 다운로드가 안돼요.",
    date: '2023.08.28 15:32',
    isAnswer: false,
  },
  {
    id: 7,
    no: 93,
    title: '디자인이 모두 사라졌어요!!',
    date: '2023.08.21 15:32',
    isAnswer: false,
  },
  {
    id: 8,
    no: 92,
    title:
      '저장공간을 초과하여 요소(사진, 일러스트, 이미지 등)을 업로드할 수 없는데 어떻게 해야 하나요?',
    date: '2023.08.17 15:32',
    isAnswer: false,
  },
  {
    id: 9,
    no: 91,
    title: '라이크스튜디오에서 제공하는 모든 글꼴을 사용해도 되나요?',
    date: '2023.08.12 15:32',
    isAnswer: false,
  },
];
const dummyInputValue = ref('');
const firstVisit = ref(false);
</script>

<style scoped>
.search__button-group {
  display: flex;
  gap: 0 1rem;
  margin-left: 1.6rem;
}

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

.item-date {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.item-answer {
  font-size: var(--fz-l);
}

.item-answer .item-answer--complete {
  color: var(--color-primary);
}
</style>
