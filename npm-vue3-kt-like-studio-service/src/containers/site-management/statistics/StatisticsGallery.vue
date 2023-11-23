<template>
  <div>
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
    <div class="chart">
      <div class="chart__group">
        <h3 class="chart__title">사용 갤러리 용도 분포</h3>
        <div class="chart__item"></div>
      </div>
      <div class="chart__group">
        <h3 class="chart__title">사용 갤러리 상품 서비스 분포</h3>
        <div class="chart__item"></div>
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-wrap__head">
        <h4 class="table-wrap__title">갤러리 순위</h4>
        <RoundButton component="button" color-type="filed" size="medium"
          >다운로드</RoundButton
        >
      </div>

      <div v-if="tableData && tableData.length > 0" class="manage_list-wrap">
        <div class="manage_table-wrap">
          <table>
            <thead>
              <tr>
                <th width="40px">NO</th>
                <th width="100px">썸네일</th>
                <th>제목</th>
                <th width="129px">프로젝트 ID</th>
                <th width="129px">사용 수</th>
                <th width="129px">추천 수</th>
                <th width="129px">댓글 수</th>
                <th width="129px">용도</th>
                <th width="129px">상품 서비스</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id">
                <td class="num">{{ item.no }}</td>
                <td class="thumb">
                  <div class="img-area">
                    <img :src="getImageUrl(item.thumb)" alt="cloud" />
                  </div>
                </td>
                <td class="title !text-left">
                  <button type="button" @click="popupSliderLayoutIsOpen = true">
                    {{ item.title }}
                  </button>
                </td>

                <td>{{ item.projectId }}</td>
                <td class="!text-right">{{ item.usageCount }}</td>
                <td class="!text-right">{{ item.recommendationCount }}</td>
                <td class="!text-right">{{ item.commentCount }}</td>
                <td>{{ item.purpose }}</td>
                <td>{{ item.productServiceData }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="tableData && tableData.length <= 0">
        <TemplateDataNone />
      </div>
      <Pagination v-if="tableData && tableData.length > 0" />
    </div>
  </div>
  <PopupSliderLayout
    :is-open="popupSliderLayoutIsOpen"
    @close-button="popupSliderLayoutIsOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';

import Pagination from '@/components/Pagination/Pagination.vue';
import PopupSliderLayout from '@/components/PopupSliderLayout/PopupSliderLayout.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const popupSliderLayoutIsOpen = ref(false);
const categories = ref([
  {
    id: 0,
    category: '조회 수',
    isSelected: true,
  },
  {
    id: 1,
    category: '사용 수',
    isSelected: false,
  },
  {
    id: 2,
    category: '추천 수',
    isSelected: false,
  },
  {
    id: 3,
    category: '댓글 수',
    isSelected: false,
  },
]);

const tableData = [
  {
    id: 1,
    no: 100,
    thumb: 'img_template_01.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 2,
    no: 99,
    thumb: 'img_template_01.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 3,
    no: 98,
    thumb: 'img_template_02.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 4,
    no: 97,
    thumb: 'img_template_02.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 5,
    no: 96,
    thumb: 'img_template_02.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 6,
    no: 95,
    thumb: 'img_template_02.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 7,
    no: 94,
    thumb: 'img_template_02.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 8,
    no: 93,
    thumb: 'img_template_02.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 9,
    no: 92,
    thumb: 'img_template_02.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
  {
    id: 10,
    no: 91,
    thumb: 'img_template_02.png',
    title:
      '글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출 글 최대 20자 노출',
    projectId: 'p99',
    usageCount: '52,540',
    recommendationCount: '212,140',
    commentCount: '9,971',
    purpose: '브로셔',
    productServiceData: '무선',
  },
];

function updateSelectedCategory(selectedId) {
  categories.value = categories.value.map((category) => ({
    ...category,
    isSelected: category.id === selectedId,
  }));
}

const getImageUrl = (name) => {
  return new URL(`./img/${name}`, import.meta.url).href;
};
</script>

<style scoped>
.category__list {
  display: flex;
  align-items: flex-end;
  gap: 0 2.4rem;
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-neutrals-black);
  font-size: 1.6rem;
  line-height: 2.4rem;
}

.chart {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 2.2rem;
  margin-top: 4rem;
}

.chart__title {
  margin-bottom: 2.4rem;
  font-size: var(--ttl-s);
  font-weight: 700;
}

.chart__item {
  height: 32.8rem;
  padding-top: 4rem;
  padding-bottom: 3.6rem;
  border-radius: 2.4rem;
  background-color: #f6f6f6;
}

.table-wrap {
  margin-top: 6rem;
}

.table-wrap__head {
  display: flex;
  align-items: flex-end;
}

.table-wrap__title {
  margin-right: auto;
  font-size: var(--ttl-s);
  font-weight: 700;
}

.manage_list-wrap {
  margin-top: 2.4rem;
  border-top: 1px solid var(--color-neutrals-black);
}
</style>
