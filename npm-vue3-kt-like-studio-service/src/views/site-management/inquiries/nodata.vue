<template>
  <TemplateBoardWrap title="1:1 문의 관리">
    <ManageHeadForm
      :date-drop-down-select-data="registeredDate"
      :first-drop-down-data="visibilityData"
      :second-drop-down-data="applicationData"
      :third-drop-down-data="serviceData"
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
      <DropdownSelect
        :select-list="optionList.listData"
        :default-select="optionList.defaultSelect"
        class-bind="!min-w-[12rem] ml-auto mr-0 "
      ></DropdownSelect>
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

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
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
    category: '로그인',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 2,
    category: '사용법',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 3,
    category: '저작권',
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
    category: '서비스 오류',
    dummyLength: 0,
    isSelected: false,
  },
]);
const optionList = {
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
const tableData = [];
const registeredDate = {
  id: 1,
  cate: '등록일',
  defaultSelect: '등록일',
  listData: [
    {
      id: 1,
      listName: '등록일',
    },
    {
      id: 2,
      listName: '선택일',
    },
  ],
};
const visibilityData = {
  id: 1,
  cate: '노출',
  defaultSelect: '노출',
  listData: [
    {
      id: 1,
      listName: '노출',
    },
    {
      id: 2,
      listName: '미노출',
    },
    {
      id: 3,
      listName: '전체',
    },
  ],
};
const applicationData = {
  id: 1,
  cate: '용도',
  defaultSelect: '전체',
  listData: [
    {
      id: 1,
      listName: '전체',
    },
    {
      id: 2,
      listName: '포스터',
    },
    {
      id: 3,
      listName: '브로셔',
    },
    {
      id: 4,
      listName: '책받침',
    },
    {
      id: 5,
      listName: '전단지',
    },
    {
      id: 6,
      listName: 'X배너',
    },
    {
      id: 7,
      listName: 'SNS용',
    },
    {
      id: 8,
      listName: 'PPT',
    },
    {
      id: 9,
      listName: '기타',
    },
  ],
};
const serviceData = {
  id: 1,
  cate: '상품서비스',
  defaultSelect: '전체',
  listData: [
    {
      id: 1,
      listName: '전체',
    },
    {
      id: 2,
      listName: '무선',
    },
    {
      id: 3,
      listName: '유선',
    },
    {
      id: 4,
      listName: '결합',
    },
    {
      id: 5,
      listName: '가족',
    },
    {
      id: 6,
      listName: '외국인',
    },
    {
      id: 7,
      listName: '멤버쉽',
    },
    {
      id: 8,
      listName: '제휴카드',
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
