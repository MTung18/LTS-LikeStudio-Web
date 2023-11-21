<template>
  <TemplateBoardWrap title="공지사항 관리">
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
      <div class="flex gap-[0.8rem] items-center">
        <p class="drop-txt">메인팝업</p>
        <DropdownSelect
          :select-list="optionList.listData"
          :default-select="optionList.defaultSelect"
          class-bind="!min-w-[12rem] ml-auto mr-0 "
        ></DropdownSelect>
      </div>
      <RoundButton
        component="a"
        :href="`/site-management/announcements/create`"
        color-type="filed"
        size="medium"
        >등록</RoundButton
      >
    </div>
    <div v-if="tableData && tableData.length > 0" class="manage_list-wrap">
      <div class="manage_table-wrap">
        <table>
          <thead>
            <tr>
              <th width="2.24%">NO</th>
              <th width="560px">제목</th>
              <th>메인 팝업</th>
              <th>노출 여부</th>
              <th>작성자</th>
              <th width="134px">작성일시</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td class="num">{{ item.no }}</td>
              <td class="title !text-left">
                <RouterLink
                  :to="`/site-management/announcements/${item.id}/edit`"
                >
                  <span class="notice-badge" v-if="item.notice">
                    <Icons
                      :width="2"
                      :height="2"
                      icon-name="pin"
                      icon-color="initial"
                    />공지</span
                  >
                  <p v-if="item.notice" class="notice-txt">{{ item.title }}</p>
                  <p v-if="!item.notice" class="title-txt">{{ item.title }}</p>
                </RouterLink>
              </td>

              <td>{{ item.show1 }}</td>
              <td>{{ item.show2 }}</td>
              <td>{{ item.author }}</td>
              <td class="date">{{ item.correctDate }}</td>
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
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const startDate = ref('');
const endDate = ref('');
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
const tableData = [
  {
    id: 1,
    no: 100,
    notice: true,
    cate: '공식 VMD',
    title:
      '2023년 10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: false,
  },
  {
    id: 2,
    no: 99,
    notice: true,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: false,
  },
  {
    id: 3,
    no: 98,
    notice: false,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 4,
    no: 97,
    notice: false,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 5,
    no: 95,
    notice: false,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 6,
    no: 94,
    notice: false,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 7,
    no: 93,
    notice: false,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 8,
    no: 92,
    notice: false,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 9,
    no: 91,
    notice: false,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 10,
    no: 90,
    notice: false,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    show2: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
];
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
.drop-txt {
  font-size: 1.4rem;
  font-weight: bold;
}
.manage_list-wrap {
  max-height: 748px;
  overflow: auto;
}
.manage_list-wrap table tbody td.title a {
  display: inline-flex;
  padding-top: 0;
  align-items: center;
  border-bottom: 0;
  overflow: inherit;
}
.manage_list-wrap table tbody td.title a > p {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.manage_list-wrap table tbody td.title a > p.notice-txt {
  flex-basis: calc(100% - 8.7rem);
}

.notice-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 0 1.6rem;
  border: 1px solid #fcdbdc;
  background: #feeff0;
  line-height: 3.8rem;
  border-radius: 50px;
  margin-right: 1.6rem;
  color: var(--color-primary);
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
