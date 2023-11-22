<template>
  <div class="site">
    <div class="site__head">
      <div class="site__head__group">
        <div class="site__head__top">
          <h3 class="site__head__title">문의 순위</h3>
        </div>
        <div class="site__head__chart"></div>
        <div
          v-if="inquiryData && inquiryData.length > 0"
          class="manage_list-wrap"
        >
          <div class="manage_table-wrap">
            <table>
              <thead>
                <tr>
                  <th width="94px">순위</th>
                  <th>카테고리</th>
                  <th width="94px">문의 수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in inquiryData" :key="item.id">
                  <td class="num">{{ item.no }}</td>
                  <td class="title !text-left">{{ item.category }}</td>
                  <td class="!text-right">{{ item.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="site__head__group">
        <div class="site__head__top">
          <h3 class="site__head__title">검색어 순위</h3>
          <RoundButton component="button" color-type="filed" size="medium"
            >다운로드</RoundButton
          >
        </div>
        <div
          v-if="searchData && searchData.length > 0"
          class="manage_list-wrap"
        >
          <div class="manage_table-wrap">
            <table>
              <thead>
                <tr>
                  <th width="94px">순위</th>
                  <th>검색어</th>
                  <th width="94px">문의 수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in searchData" :key="item.id">
                  <td class="num">{{ item.no }}</td>
                  <td class="title !text-left">{{ item.searchWord }}</td>
                  <td class="!text-right">{{ item.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Pagination v-if="searchData && searchData.length > 0" />
      </div>
    </div>
    <div class="site__body">
      <div class="site__body__group">
        <h4 class="site__body__title">사용 갤러리 용도 분포</h4>
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
        <div class="site__body__chart"></div>
      </div>
      <div class="site__body__group">
        <h4 class="site__body__title">시간별 로그인</h4>
        <div class="site__body__chart"></div>
      </div>
      <div class="site__body__group">
        <h4 class="site__body__title">요일별 로그인</h4>
        <div class="site__body__chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import Tabs from '@/components/Tabs/Tabs.vue';

const categories = ref([
  {
    id: 0,
    category: '일별',
    isSelected: true,
  },
  {
    id: 1,
    category: '월별',
    isSelected: false,
  },
]);

const inquiryData = [
  {
    id: 1,
    no: 1,
    category: '사용법',
    count: '51,241',
  },
  {
    id: 2,
    no: 2,
    category: '로그인',
    count: '51,241',
  },
  {
    id: 3,
    no: 3,
    category: '저작권',
    count: '51,241',
  },
  {
    id: 4,
    no: 4,
    category: '팀룸',
    count: '51,241',
  },
  {
    id: 5,
    no: 5,
    category: '서비스 오류',
    count: '51,241',
  },
];

const searchData = [
  {
    id: 1,
    no: 1,
    searchWord:
      '글 최대 20자 노출 글 최대 글 최대 20자 노출 글 최대 글 최대 20자 노출 글 최대',
    count: '51,241',
  },
  {
    id: 2,
    no: 2,
    searchWord:
      '글 최대 20자 노출 글 최대 글 최대 20자 노출 글 최대 글 최대 20자 노출 글 최대',
    count: '51,241',
  },
  {
    id: 3,
    no: 3,
    searchWord: '10월 테마 X  배너',
    count: '9,971',
  },
  {
    id: 4,
    no: 4,
    searchWord: '9월 테마 X  배너',
    count: '9,971',
  },
  {
    id: 5,
    no: 5,
    searchWord: '8월 테마 X  배너',
    count: '9,971',
  },
  {
    id: 6,
    no: 6,
    searchWord: '7월 테마 X  배너',
    count: '9,971',
  },
  {
    id: 7,
    no: 7,
    searchWord: '6월 테마 X  배너',
    count: '9,971',
  },
  {
    id: 8,
    no: 8,
    searchWord: '5월 테마 X  배너',
    count: '9,971',
  },
  {
    id: 9,
    no: 9,
    searchWord: '4월 테마 X  배너',
    count: '9,971',
  },
  {
    id: 10,
    no: 10,
    searchWord: '3월 테마 X  배너',
    count: '9,971',
  },
];

function updateSelectedCategory(selectedId) {
  categories.value = categories.value.map((category) => ({
    ...category,
    isSelected: category.id === selectedId,
  }));
}
</script>

<style scoped>
.site__head {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 2.1rem;
}

.site__head__top {
  display: flex;
  align-items: flex-end;
}

.site__head__title,
.site__body__title {
  margin-right: auto;
  font-size: var(--ttl-s);
  font-weight: 700;
}

.site__head__chart {
  height: 34rem;
  padding: 4rem 0;
  margin-top: 2.4rem;
  border-radius: 2.4rem;
  background-color: #f6f6f6;
}

.manage_list-wrap {
  margin-top: 2.4rem;
  margin-bottom: 4rem;
  border-top: 1px solid var(--color-neutrals-black);
}

.manage_list-wrap table thead th,
.manage_list-wrap table tbody td {
  padding: 1.6rem 0;
}

.site__body {
  margin-top: 7.4rem;
}

.site__body__group + .site__body__group {
  margin-top: 7.4rem;
}

.site__body .category__list {
  display: flex;
  gap: 0 2.4rem;
  margin-top: 2.4rem;
}

.site__body__chart {
  margin-top: 2.4rem;
  height: 42.7rem;
}
</style>
