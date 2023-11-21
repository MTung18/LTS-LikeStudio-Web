<template>
  <TemplateBoardWrap title="FAQ 관리">
    <ManageHeadForm :input-data1="inputData1" :input-data2="inputData2" :input-data3="inputData3"
      :input-data4="inputData4" :only-search="true" @search="searchNotice" />

    <div class="select-wrap flex justify-between">
      <ul class="category__list">
        <li v-for="category in categories" :key="category.id" class="category__item">
          <Tabs type="withIcon" use-icon :is-selected="category.id == currentCategory ? true : false"
            @click="setCurrentCategory(category.id)">
            {{ category.value }}</Tabs>
        </li>
      </ul>
        <RoundButton  href="/site-management/faq/create" component="a" color-type="filed" size="medium">등록</RoundButton>
    </div>
    <div class="manage_list-wrap">
      <div class="manage_table-wrap">
        <template v-if="tableData == null">
          <TemplateDataNone />
        </template>
        <table v-else>
          <thead>
            <tr>
              <th width="2.24%">NO</th>
              <th width="134px">카테고리</th>
              <th width="560px">제목</th>
              <th width="90px">노출여부</th>
              <th width="134px">작성자</th>
              <th width="134px">작성일시</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData.list" :key="item.id">
              <td class="num">{{ item.rowNumber }}</td>
              <td>{{ item.categoryValue }}</td>
              <td class="title !text-left">
                <RouterLink :to="`/site-management/faq/${item.id}/edit`">{{
                  item.title
                }}</RouterLink>
              </td>

              <td>{{ item.show == 1 ? "Y" : "N" }}</td>
              <td>{{ item.userName }}</td>
              <td class="date">{{ moment(item.createDate).format("YYYY.MM.DD HH:mm") }}</td>
              <!--              <td :class="item.answer ? 'complete' : 'waiting'">-->
              <!--                {{ item.answer ? '답변완료' : '답변대기' }}-->
              <!--              </td>-->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination v-if="tableData != null" :currentPage="currentPage" :pageNumber="totalPages" @numberPage="navigate" />
  </TemplateBoardWrap>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import moment from 'moment';
import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import { faqStore } from '../../../stores/faqStore';
import { categoryStore } from '../../../stores/categoryStore';
import { storeToRefs } from 'pinia';

const functionType = 1;

const storeOfCategory = categoryStore();
const storeOfFaq = faqStore();
const { listCategory } = storeToRefs(storeOfCategory);
const { listOfFaqAdmin } = storeToRefs(storeOfFaq);

const categories = ref([]);
const tableData = ref([]);
const currentCategory = ref("");
const currentPage = ref();
const totalPages = ref();
const dummyInputValue = ref('');
const fromDateValue = ref('');
const toDateValue = ref('');

async function setCurrentCategory(param) {
  currentCategory.value = param
  await getListForAdmin('', currentCategory.value, '', '', '')
}

async function getListCategory(functionType) {
  await storeOfCategory.getListCategory(functionType)
  categories.value = listCategory.value;
  categories.value.unshift({
    id: "0",
    value: "Default",
    functionType: 1,
    key: ""
  });
}

async function searchNotice(dummyInput, category, fromDate, toDate) {
  dummyInputValue.value = dummyInput;
  fromDateValue.value = fromDate;
  toDateValue.value = toDate;
  currentCategory.value = category;
  await getListForAdmin(dummyInputValue.value, currentCategory.value, fromDateValue.value, toDateValue.value, 1);
}

async function getListForAdmin(keyword, category, startDate, endDate, page) {
  await storeOfFaq.getListFaqForAdmin(keyword, category, startDate, endDate, page);
  if (listOfFaqAdmin.value) {
    tableData.value = listOfFaqAdmin.value.data;
    currentPage.value = tableData.value.currentPage;
    totalPages.value = tableData.value.totalPages;
  } else {
    tableData.value = null;
  }
}

async function navigate(newPage) {
  await getListForAdmin(dummyInputValue.value, currentCategory.value, fromDateValue.value, toDateValue.value, newPage);
}

onMounted(async () => {
  await getListCategory(functionType)
  await getListForAdmin("", "", "", "", 1)
})
</script>

<style scoped>
.date {
  color: var(--color-gray-777);
  font-weight: 400;
}

.select-wrap {
  margin-bottom: 2.4rem;
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
</style>
