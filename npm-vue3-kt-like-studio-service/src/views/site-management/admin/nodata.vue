<template>
  <TemplateBoardWrap title="관리자 권한">
    <ManageHeadForm
      :input-data1="inputData1"
      :input-data2="inputData2"
      :input-data3="inputData3"
      :input-data4="inputData4"
      :only-search="true"
      :no-calender="true"
    />

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
  <PopupAdminUserSelectNodata
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
import PopupAdminUserSelectNodata from '@/containers/site-management/admin/PopupAdminUserSelect/PopupAdminUserSelectNodata.vue';

const popupUserSelectIsOpen = ref(true);
const tableData = [];
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
