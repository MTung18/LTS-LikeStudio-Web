<template>
  <TemplateBoardWrap title="1:1 문의 관리">
    <ManageHeadForm :only-search="true" @search="search" @reset="reset" />

    <div class="select-wrap flex justify-between">
      <ul class="category__list">
        <li v-for="category in lsSupportManagerCategoryListData" :key="category.id" class="category__item">
          <Tabs type="withIcon" use-icon :is-selected="category.id == currentCategory ? true : false"
            @click="setCurrentCategory(category.id)">
            {{ category.value }}</Tabs>
        </li>
      </ul>
      <select class="rounded-lg text-2xl p-5" v-model="currentStatus" @change="changeStatus">
        <option selected hidden>{{ optionList.defaultSelect }}</option>
        <option :value="e.id" v-for="e in optionList.listData">{{ e.listName }}</option>
      </select>
    </div>
    <div class="manage_list-wrap">
      <div class="manage_table-wrap">
        <table v-if="lsSupportManagerListForAdminData.statusCode == 1">
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
            <tr v-for="item in lsSupportManagerListForAdminData.data.list" :key="item.id">
              <td class="num">{{ item.rowNumber }}</td>
              <td>{{ item.category }}</td>
              <td class="title !text-left">
                <RouterLink :to="`/site-management/inquiries/${item.id}/${item.status == 1 ? 'answered': 'unanswered'}`">{{
                  item.title
                }}</RouterLink>
              </td>

              <td>{{ item.username }}</td>
              <td class="date">{{ moment(item.createDate).format("YYYY.MM.DD HH:mm") }}</td>
              <td :class="item.status == 1 ? 'complete' : 'waiting'">
                {{ item.status == 1 ? '답변완료' : '답변대기' }}
              </td>
            </tr>
          </tbody>
        </table>
        <TemplateDataNone v-else />
      </div>
    </div>
    <Pagination :currentPage="currentPage" :pageNumber="totalPages" @numberPage="navigate" />
  </TemplateBoardWrap>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import { storeToRefs } from 'pinia';
import { lsSupportManagerStore } from '@/stores/lsSupportManagerStore';
import moment from 'moment';

const { lsSupportManagerListForAdmin, lsSupportManagerCategoryList } = storeToRefs(lsSupportManagerStore())
const lsSupportManagerListForAdminData = ref([])
const lsSupportManagerCategoryListData = ref([])
const currentPage = ref()
const totalPages = ref()
const currentCategory = ref('')
const inputValue = ref('')
const fromDateValue = ref()
const toDateValue = ref()
const currentStatus = ref('')

onMounted(async () => {
  await updatePage('')

  await lsSupportManagerStore().getLsSupportManagerCategoryList()
  lsSupportManagerCategoryListData.value = [
    {
      id: 0,
      value: 'All'
    }, ...lsSupportManagerCategoryList.value
  ]
})
function changeStatus() {
  updatePage('')
}
async function reset() {
  await lsSupportManagerStore().getLsSupportManagerListForAdmin('','','','','','')
  currentCategory.value = 0
  lsSupportManagerListForAdminData.value = lsSupportManagerListForAdmin.value
  currentPage.value = lsSupportManagerListForAdminData.value.data.currentPage
  totalPages.value = lsSupportManagerListForAdminData.value.data.totalPages
}
function setCurrentCategory(category) {
  currentCategory.value = category
  updatePage('')
}
async function search(input, fromDate, toDate) {
  inputValue.value = input;
  fromDateValue.value = fromDate;
  toDateValue.value = toDate
  await updatePage('');
}
async function navigate(newPage) {
  await updatePage(newPage)
}
async function updatePage(page) {
  let keyword = inputValue.value
  let category = currentCategory.value == 0 ? '' : currentCategory.value
  let status = currentStatus.value
  let startDate = fromDateValue.value ? fromDateValue.value : ''
  let endDate = toDateValue.value ? toDateValue.value : ''
  await lsSupportManagerStore().getLsSupportManagerListForAdmin(keyword, category, status, startDate, endDate, page)
  lsSupportManagerListForAdminData.value = lsSupportManagerListForAdmin.value
  currentPage.value = lsSupportManagerListForAdminData.value.data.currentPage
  totalPages.value = lsSupportManagerListForAdminData.value.data.totalPages
}
const optionList = {
  defaultSelect: '전체',
  listData: [
    {
      id: '',
      listName: 'all',
    },
    {
      id: 1,
      listName: 'answer',
    },
    {
      id: 0,
      listName: 'unanswer',
    },
  ],
};
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
