<template>
  <TemplateBoardWrap title="FAQ 관리">
    <div class="search-filter">
      <div class="search-filter__bottom">
        <CalenderGroup
          :start-date="startDate"
          :end-date="endDate"
          @update:startDate="startDate = $event"
          @update:endDate="endDate = $event"
          class="mr-[2.6rem]"
        />
        <SearchInput
          placeholder="검색어를 입력해주세요"
          size="medium"
          style-type="square"
          color-type="gray"
          class="flex-1 mr-[1.4rem]"
        />
        <RoundButton
          component="button"
          color-type="filed"
          size="medium"
          class="mr-[1.4rem]"
          >검색</RoundButton
        >
        <RoundButton component="button" color-type="outlined" size="medium"
          >초기화</RoundButton
        >
      </div>
    </div>

    <div class="select-wrap flex justify-between">
      <ul class="category__list">
        <li
          v-for="category in categories"
          :key="category.id"
          class="category__item"
        >
          <Tabs
            type="withIcon"
            use-icon
            :is-selected="category.isSelected"
            @tab-selected="updateSelectedCategory(category.id)"
          >
            {{ category.category }}</Tabs
          >
        </li>
      </ul>
      <RoundButton component="button" color-type="filed" size="medium"
        >등록</RoundButton
      >
    </div>
    <div v-if="tableData && tableData.length > 0" class="manage_list-wrap">
      <div class="manage_table-wrap">
        <table>
          <thead>
            <tr>
              <th width="2.24%">NO</th>
              <th>카테고리</th>
              <th width="560px">제목</th>
              <th>작성자</th>
              <th width="134px">작성일시</th>
              <th width="134px">답변여부</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td class="num">{{ item.no }}</td>
              <td>{{ item.cate }}</td>
              <td class="title !text-left">
                <RouterLink to="/site-management/inquiries/create">{{
                  item.title
                }}</RouterLink>
              </td>

              <td>{{ item.author }}</td>
              <td class="date">{{ item.correctDate }}</td>
              <td :class="item.answer ? 'complete' : 'waiting'">
                {{ item.answer ? '답변완료' : '답변대기' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="tableData && tableData.length <= 0">
      <TemplateDataNone />
    </div>
    <Pagination v-if="tableData && tableData.length > 0" />
  </TemplateBoardWrap>
</template>

<script setup>
import { ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const startDate = ref('');
const endDate = ref('');

const categories = ref([
  {
    id: 0,
    category: '전체',
    dummyLength: 10,
    isSelected: true,
  },
  {
    id: 1,
    category: '자주 묻는 질문 10',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 2,
    category: '저작권',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 3,
    category: '로그인',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 4,
    category: '팀룸',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 5,
    category: '사용법',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 6,
    category: '다운로드',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 7,
    category: 'PDF 인쇄',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 8,
    category: '서비스 오류',
    dummyLength: 0,
    isSelected: false,
  },
]);
const tableData = [];
function updateSelectedCategory(selectedId) {
  categories.value = categories.value.map((category) => ({
    ...category,
    isSelected: category.id === selectedId,
  }));
}
</script>

<style scoped>
.date {
  color: var(--color-gray-777);
  font-weight: 400;
}
.select-wrap {
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-neutrals-black);
}
.category__list {
  display: flex;
  align-items: flex-end;
  gap: 0 2.4rem;
  font-size: 1.6rem;
  line-height: 2.4rem;
}
.manage_list-wrap {
  max-height: 748px;
  overflow: auto;
}
.complete {
  color: var(--color-primary);
}
.manage_list-wrap table tbody td.title a {
  border-bottom: 0;
  line-height: 1;
}

.search-filter {
  max-width: 1200px;
  padding: 2.6rem;
  margin: 7.2rem auto 7.2rem;
  background-color: #f6f6f6;
}

.search-filter__bottom {
  display: flex;
}

.search-filter__top + .search-filter__bottom {
  margin-top: 2.6rem;
}
</style>
