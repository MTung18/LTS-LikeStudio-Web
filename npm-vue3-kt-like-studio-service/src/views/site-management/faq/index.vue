<template>
  <TemplateBoardWrap title="FAQ 관리">
    <ManageHeadForm
      :input-data1="inputData1"
      :input-data2="inputData2"
      :input-data3="inputData3"
      :input-data4="inputData4"
      :only-search="true"
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
        <table>
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
          <tbody v-if="tableData && tableData.length > 0">
            <tr v-for="item in tableData" :key="item.id">
              <td class="num">{{ item.no }}</td>
              <td>{{ item.cate }}</td>
              <td class="title !text-left">
                <RouterLink to="/site-management/inquiries/create">{{
                  item.title
                }}</RouterLink>
              </td>

              <td>{{ item.show }}</td>
              <td>{{ item.author }}</td>
              <td class="date">{{ item.correctDate }}</td>
              <!--              <td :class="item.answer ? 'complete' : 'waiting'">-->
              <!--                {{ item.answer ? '답변완료' : '답변대기' }}-->
              <!--              </td>-->
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="tableData && tableData.length <= 0">
        <TemplateDataNone />
      </div>
    </div>
    <Pagination v-if="tableData && tableData.length > 0" />
  </TemplateBoardWrap>
</template>

<script setup>
import { ref } from 'vue';

import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

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
const tableData = [
  {
    id: 1,
    no: 100,
    cate: '공식 VMD',
    title:
      '2023년 10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: false,
  },
  {
    id: 2,
    no: 99,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: false,
  },
  {
    id: 3,
    no: 98,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 4,
    no: 97,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 5,
    no: 95,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 6,
    no: 94,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 7,
    no: 93,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 8,
    no: 92,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 9,
    no: 91,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 10,
    no: 90,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
];
const inputData1 = {
  id: 1,
  cate: '등록일',
  defaultSelect: '등록일',
  listData: [
    {
      id: 1,
      listName: '로그인1',
    },
    {
      id: 2,
      listName: '로그인2',
    },
    {
      id: 3,
      listName: '로그인3',
    },
  ],
};
const inputData2 = {
  id: 1,
  cate: '노출',
  defaultSelect: '노출',
  listData: [
    {
      id: 1,
      listName: '로그인1',
    },
    {
      id: 2,
      listName: '로그인2',
    },
    {
      id: 3,
      listName: '로그인3',
    },
  ],
};
const inputData3 = {
  id: 1,
  cate: '용도',
  defaultSelect: '전체',
  listData: [
    {
      id: 1,
      listName: '로그인1',
    },
    {
      id: 2,
      listName: '로그인2',
    },
    {
      id: 3,
      listName: '로그인3',
    },
  ],
};
const inputData4 = {
  id: 1,
  cate: '상품서비스',
  defaultSelect: '전체',
  listData: [
    {
      id: 1,
      listName: '로그인1',
    },
    {
      id: 2,
      listName: '로그인2',
    },
    {
      id: 3,
      listName: '로그인3',
    },
  ],
};
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
.complete {
  color: var(--color-primary);
}
.manage_list-wrap table tbody td.title a {
  border-bottom: 0;
  line-height: 1;
}
</style>
