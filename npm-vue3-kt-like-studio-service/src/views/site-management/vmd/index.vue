<template>
  <TemplateBoardWrap title="매장 VMD 관리">
    <ManageHeadForm
      :input-data1="inputData1"
      :input-data2="inputData2"
      :input-data3="inputData3"
      :input-data4="inputData4"
      :only-search="true"
      @search="searchVmd"
    />

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
    <div class="manage_list-wrap">
      <div class="manage_table-wrap">
        <template v-if="tableData == null">
          <TemplateDataNone />
        </template>
        <table v-else>
          <thead>
            <tr>
              <th width="2.24%">NO</th>
              <th>카테고리</th>
              <th width="560px">제목</th>
              <th>파일 개수</th>
              <th>노출 여부</th>
              <th>작성자</th>
              <th width="134px">작성일시</th>
            </tr>
          </thead>
          <tbody v-if="tableData && tableData.length > 0">
            <tr v-for="item in tableData" :key="item.id">
              <td class="num">{{ item.rowNumber }}</td>
              <td>{{ item.categoryValue }}</td>
              <td class="title !text-left">
                <RouterLink to="/site-management/vmd/create">{{
                  item.title
                }}</RouterLink>
              </td>
              <td>{{ item.totalFiles }}</td>
              <td>{{ item.show == 1 ? "Y" : "N" }}</td>
              <td>{{ item.userName }}</td>
              <td class="date">{{ moment(item.createDate).format("YYYY.MM.DD HH:mm") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="tableData && tableData.length <= 0">
        <TemplateDataNone />
      </div>
    </div>
    <!-- <Pagination v-if="tableData != null" :currentPage="currentPage" :pageNumber="totalPages" @numberPage="navigate" /> -->
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
import { vmdStore } from '../../../stores/vmdStore';
import { categoryStore } from '../../../stores/categoryStore';
import { storeToRefs } from 'pinia';

// const functionType = 1;

const storeOfCategory = categoryStore();
const storeOfVmd = vmdStore();
const { listCategory } = storeToRefs(storeOfCategory);
const { listOfVmdAdmin } = storeToRefs(storeOfVmd);

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
    id: 0,
    value: "Default",
    functionType: 1,
    key: ""
  });
}

async function searchVmd( category,dummyInput, fromDate, toDate) {
  dummyInputValue.value = dummyInput;
  fromDateValue.value = fromDate;
  toDateValue.value = toDate;
  currentCategory.value = category;
  await getListForAdmin("", "",  "", "", 1);
}

async function getListForAdmin(category, keyword, startDate, endDate, page) {
  await storeOfVmd.getAllVmdForAdmin(keyword, category, startDate, endDate, page);
  if (listOfVmdAdmin.value) {
    tableData.value = listOfVmdAdmin.value.list;
    console.log(listOfVmdAdmin.value.list);
    // currentPage.value = tableData.value.currentPage;
    // totalPages.value = tableData.value.totalPages;
  } else {
    tableData.value = null;
  }
}

// async function navigate(newPage) {
//   await getListForAdmin("", "",  "", "", "");
// }

// onMounted(async () => {
//   // await getListCategory(functionType)
//   await getListForAdmin("", "", "", "", '')
// })

// const categories = ref([
//   {
//     id: 0,
//     category: '전체',
//     dummyLength: 10,
//     isSelected: true,
//   },
//   {
//     id: 1,
//     category: '공식 VMD',
//     dummyLength: 0,
//     isSelected: false,
//   },
//   {
//     id: 2,
//     category: '세일즈 VMD',
//     dummyLength: 0,
//     isSelected: false,
//   },
//   {
//     id: 3,
//     category: '가이드북',
//     dummyLength: 0,
//     isSelected: false,
//   },
//   {
//     id: 4,
//     category: '카테고리 04',
//     dummyLength: 0,
//     isSelected: false,
//   },
//   {
//     id: 5,
//     category: '카테고리 05',
//     dummyLength: 0,
//     isSelected: false,
//   },
//   {
//     id: 6,
//     category: '카테고리 06',
//     dummyLength: 0,
//     isSelected: false,
//   },
// ]);
// const tableData = [
//   {
//     id: 1,
//     no: 100,
//     cate: '공식 VMD',
//     title:
//       '2023년 10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 2,
//     no: 99,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 3,
//     no: 98,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 4,
//     no: 97,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 5,
//     no: 95,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 6,
//     no: 94,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 7,
//     no: 93,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 8,
//     no: 92,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 9,
//     no: 91,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
//   {
//     id: 10,
//     no: 90,
//     cate: '공식 VMD',
//     title: '2023년 10월',
//     fileNumber: '1234',
//     show: 'N',
//     author: '홍길동',
//     correctDate: '2023.09.18 15:32',
//   },
// ];
// const inputData1 = {
//   id: 1,
//   cate: '등록일',
//   defaultSelect: '등록일',
//   listData: [
//     {
//       id: 1,
//       listName: '로그인1',
//     },
//     {
//       id: 2,
//       listName: '로그인2',
//     },
//     {
//       id: 3,
//       listName: '로그인3',
//     },
//   ],
// };
// const inputData2 = {
//   id: 1,
//   cate: '노출',
//   defaultSelect: '노출',
//   listData: [
//     {
//       id: 1,
//       listName: '로그인1',
//     },
//     {
//       id: 2,
//       listName: '로그인2',
//     },
//     {
//       id: 3,
//       listName: '로그인3',
//     },
//   ],
// };
// const inputData3 = {
//   id: 1,
//   cate: '용도',
//   defaultSelect: '전체',
//   listData: [
//     {
//       id: 1,
//       listName: '로그인1',
//     },
//     {
//       id: 2,
//       listName: '로그인2',
//     },
//     {
//       id: 3,
//       listName: '로그인3',
//     },
//   ],
// };
// const inputData4 = {
//   id: 1,
//   cate: '상품서비스',
//   defaultSelect: '전체',
//   listData: [
//     {
//       id: 1,
//       listName: '로그인1',
//     },
//     {
//       id: 2,
//       listName: '로그인2',
//     },
//     {
//       id: 3,
//       listName: '로그인3',
//     },
//   ],
// };
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
.manage_list-wrap table tbody td.title a {
  border-bottom: 0;
  line-height: 1;
}
</style>
