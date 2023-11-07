<template>
  <TemplateBoardWrap title="FAQ">
    <ul class="category__list">
      <li
        v-for="category in categories"
        :key="category.id"
        class="category__item"
      >
        <Tabs
          type="underbar"
          :is-selected="category.isSelected"
          @tab-selected="updateSelectedCategory(category.id)"
        >
          {{ category.category }}
          <span v-show="category.dummyLength && category.dummyLength > 0">
            {{ category.dummyLength }}
          </span>
        </Tabs>
      </li>
    </ul>
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
    <!-- dev: 데이터가 없을 때 -->

    <TemplateDataNone />
  </TemplateBoardWrap>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import CustomerSearchWrap from '@/components/CustomerSearchWrap/CustomerSearchWrap.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const dummyInputValue = ref('');
const categories = ref([
  {
    id: 0,
    category: '자주 묻는 질문',
    dummyLength: 10,
    isSelected: true,
  },
  {
    id: 1,
    category: '저작권',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 2,
    category: '로그인',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 3,
    category: '팀룸',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 4,
    category: '사용법',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 5,
    category: '다운로드',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 6,
    category: 'PDF 인쇄',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 7,
    category: '서비스 오류',
    dummyLength: 0,
  },
]);

let detailsElements = [];
const handleToggle = (event) => {
  if (event.target.open) {
    detailsElements.forEach((otherDetail) => {
      if (otherDetail !== event.target) {
        otherDetail.removeAttribute('open');
      }
    });
  }
};

function updateSelectedCategory(selectedId) {
  categories.value = categories.value.map((category) => ({
    ...category,
    isSelected: category.id === selectedId,
  }));
}

onMounted(() => {
  detailsElements = document.querySelectorAll('details');
  detailsElements.forEach((detail) => {
    detail.addEventListener('toggle', handleToggle);
  });
});

onUnmounted(() => {
  detailsElements.forEach((detail) => {
    detail.removeEventListener('toggle', handleToggle);
  });
});
</script>

<style scoped>
.category__list {
  display: flex;
  justify-content: center;
  gap: 0 4rem;
  margin: 4rem 0;
}

.list {
  margin-top: 2rem;
}

.list__item {
  border-bottom: 1px solid var(--color-gray-ddd);
}

.list__item:first-child {
  border-top: 1px solid var(--color-gray-ddd);
}

.item__question-wrap {
  display: flex;
  align-items: center;
  padding: 3rem 0;
  cursor: pointer;
}

.question__symbol {
  margin-right: 1rem;
  font-size: var(--fz-xl);
  font-weight: 700;
}

.question__title {
  font-size: var(--fz-l);
  font-weight: 700;
}

.question__icon {
  margin-left: auto;
}

.list__item[open] .question__icon {
  transform: rotate(180deg);
}

.answer__wrap {
  padding-bottom: 3rem;
}

.answer__area {
  display: flex;
  gap: 0 1rem;
  padding: 2.4rem;
  background-color: #f6f6f6;
  border-radius: 2.4rem;
}

.answer__symbol {
  font-size: var(--fz-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.answer__content {
  flex-grow: 1;
  padding-right: 2.4rem;
}

.answer__content-text {
  font-size: var(--fz-l);
}

.answer__title {
  font-weight: 700;
}

.answer__desc-list {
  margin-top: 4rem;
}

.answer__desc-item + .answer__desc-item {
  margin-top: 4rem;
}

.answer__desc-title {
  font-weight: 700;
}

.answer__desc-text {
  font-weight: 400;
  color: var(--color-gray-444);
}

.answer__content-file {
  margin-top: 3.6rem;
  padding-top: 2rem;
  border-top: 1px solid #ead9ff;
}
</style>
