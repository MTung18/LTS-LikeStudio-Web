<template>
  <TemplateBoardWrap title="매장 VMD 관리">
    <div class="search-filter">
      <div class="search-filter__bottom">
        <CalenderGroup :startDate = fromDate :endDate = toDate
          @fromDate="handleFromDate" 
          @toDate="handleToDate"
          class="mr-[2.6rem]"
        />
        <SearchInput
          v-model="dummyInput2"
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
          @click = "searchVmd"
          >검색</RoundButton
        >
        <RoundButton component="button" color-type="outlined" size="medium" @click = "resetSearch"
          >초기화</RoundButton
        >
      </div>
    </div>

    <div class="select-wrap flex justify-between">
      <ul class="category__list">
        <li v-for="category in categories" :key="category.id" class="category__item">
          <Tabs type="withIcon" use-icon :is-selected="category.id == currentCategory ? true : false"
            @click="setCurrentCategory(category.id)">
            {{ category.value }}</Tabs>
        </li>
      </ul>
      <RoundButton
        component="a"
        href="/site-management/vmd/create"
        color-type="filed"
        size="medium"
        >등록</RoundButton
      >
    </div>
    <div  class="manage_list-wrap">
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
          <tbody>
            <tr v-for="item in tableData.list" :key="item.id">
              <td class="num">{{ item.rowNumber }}</td>
              <td>{{ item.categoryValue }}</td>
              <td class="title !text-left">
                <RouterLink :to="`/site-management/vmd/${item.id}/edit`">{{
                  item.title
                }}</RouterLink>
              </td>
              <td>{{ item.totalFiles }}</td>
              <td>{{ item.show == 1 ? "Y" : "N" }}</td>
              <td>{{ item.createUserName }}</td>
              <td class="date">{{ moment(item.createDate).format("YYYY.MM.DD HH:mm") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination v-if="tableData != null" :currentPage="currentPage" :pageNumber="totalPages" @numberPage="navigate" />
  </TemplateBoardWrap>
</template>

<script setup>
import moment from 'moment';
import { onMounted, ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import { vmdStore } from '../../../stores/vmdStore';
import { categoryStore } from '../../../stores/categoryStore';
import { storeToRefs } from 'pinia';

const functionType = 3;

const storeOfCategory = categoryStore();
const storeOfVmd = vmdStore();
const { listCategory } = storeToRefs(storeOfCategory);
const { listOfVmdAdmin } = storeToRefs(storeOfVmd);

const categories = ref([]);
const tableData = ref([]);
const currentCategory = ref("");
const currentPage = ref();
const totalPages = ref();
const dummyInput2 = ref('');
let fromDate = ref();
let toDate = ref();

async function setCurrentCategory(id) {
  currentCategory.value = id
  await getListForAdmin(id,'',  '', '', '')
}

async function getListCategory(functionType) {
  await storeOfCategory.getListCategory(functionType)
  categories.value = listCategory.value;
  console.log(listCategory.value);
  categories.value.unshift({
    id: "",
    value: "Default",
    functionType: "",
    key: ""
  }); 
}

async function searchVmd() {
  await getListForAdmin(currentCategory.value, dummyInput2.value, fromDate.value, toDate.value, 1);
}

async function getListForAdmin(category, keyword, startDate, endDate, page) {
  await storeOfVmd.getAllVmdForAdmin(category, keyword,  startDate, endDate, page);
  if (listOfVmdAdmin.value) {
    tableData.value = listOfVmdAdmin.value;
    console.log(tableData.value);
    currentPage.value = tableData.value.currentPage;
    totalPages.value = tableData.value.totalPages;
  } else {
    tableData.value = null;
  }
}

async function navigate(newPage) {
  await getListForAdmin(currentCategory.value, dummyInput2.value, fromDate.value, toDate.value, newPage);
}

async function resetSearch() {
  dummyInput2.value = "";
  currentCategory.value = "";
  fromDate.value = "";
  toDate.value = "";
  await getListForAdmin(currentCategory.value, dummyInput2.value, fromDate.value, toDate.value, 1);
  fromDate.value = moment().format('YYYY-MM-DD');
  toDate.value = moment().format('YYYY-MM-DD');
}

onMounted(async () => {
  await getListCategory(functionType);
  await getListForAdmin("", "", "", "", 1);
})

const handleFromDate = (value) => {
    fromDate.value = value;
  };

  const handleToDate = (value) => {
    toDate.value = value;
  };


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
  // {
  //   id: 1,
  //   no: 100,
  //   cate: '공식 VMD',
  //   title:
  //     '2023년 10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 2,
  //   no: 99,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 3,
  //   no: 98,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 4,
  //   no: 97,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 5,
  //   no: 95,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 6,
  //   no: 94,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 7,
  //   no: 93,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 8,
  //   no: 92,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 9,
  //   no: 91,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
  // {
  //   id: 10,
  //   no: 90,
  //   cate: '공식 VMD',
  //   title: '2023년 10월',
  //   fileNumber: '1234',
  //   show: 'N',
  //   author: '홍길동',
  //   correctDate: '2023.09.18 15:32',
  // },
// ];

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