<template>
  <TemplateBoardWrap title="관리자 권한">
    <ManageHeadForm :only-search="true" :no-calender="true" />

    <div class="select-wrap flex justify-end">
      <RoundButton component="button" color-type="filed" size="medium"
        >등록</RoundButton
      >
    </div>
    <div class="manage_list-wrap">
      <div class="manage_table-wrap">
        <table>
          <thead>
            <tr>
              <th width="40ㅔㅌ">NO</th>
              <th width="217px">사번</th>
              <th width="217px">이름</th>
              <th>소속</th>
              <th width="160px">권한</th>
              <th width="134px">등록일시</th>
              <th width="134px">삭제</th>
            </tr>
          </thead>
          <tbody v-if="tableData && tableData.length > 0">
            <tr v-for="item in tableData" :key="item.id">
              <td class="num">{{ item.no }}</td>
              <td>{{ item.fileNumber }}</td>
              <td class="title">
                <RouterLink to="/site-management/vmd/create">{{
                  item.author
                }}</RouterLink>
              </td>
              <td>{{ item.position }}</td>
              <td>
                <DropdownSelect
                  :select-list="item.selectData.listData"
                  :default-select="item.selectData.defaultSelect"
                  class-bind="!min-w-[auto] w-[16rem] !text-left "
                ></DropdownSelect>
              </td>
              <td class="date">{{ item.correctDate }}</td>
              <td>
                <RoundButton
                  component="button"
                  color-type="lightOutlined"
                  size="small"
                  class-bind="!font-normal !inline-flex !items-center gap-[0.8rem] leading-none"
                >
                  <Icons
                    icon-name="delete_bold"
                    icon-color="var(--color-neutrals-black)"
                    :width="1.4"
                    :height="1.4"
                  />삭제</RoundButton
                >
              </td>
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
  <PopupAdminUserSelect
    :is-open="popupUserSelectIsOpen"
    @close-button="popupUserSelectIsOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import PopupAdminUserSelect from '@/containers/site-management/admin/PopupAdminUserSelect/PopupAdminUserSelect.vue';

const popupUserSelectIsOpen = ref(true);

const tableData = [
  {
    id: 1,
    no: 100,
    cate: '공식 VMD',
    title:
      '2023년 10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 2,
    no: 99,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 3,
    no: 98,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 4,
    no: 97,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 5,
    no: 95,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 6,
    no: 94,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 7,
    no: 93,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 8,
    no: 92,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 9,
    no: 91,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
  {
    id: 10,
    no: 90,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    position: '판매역량강화팀',
    show: 'N',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    selectData: {
      id: 1,
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
    },
  },
];
</script>

<style scoped>
.date {
  color: var(--color-gray-777);
  font-weight: 400;
}
.select-wrap {
  margin-bottom: 2.4rem;
}
.manage_list-wrap {
  overflow: auto;
}
.manage_list-wrap table tbody td.title a {
  border-bottom: 0;
  line-height: 1;
}
</style>
