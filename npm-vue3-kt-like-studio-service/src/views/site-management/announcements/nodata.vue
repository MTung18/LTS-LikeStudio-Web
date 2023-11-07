<template>
  <TemplateBoardWrap title="공지사항 관리">
    <ManageHeadForm
      :input-data1="inputData1"
      :input-data2="inputData2"
      :input-data3="inputData3"
      :input-data4="inputData4"
      :only-search="true"
    />

    <div class="select-wrap flex justify-between">
      <div class="flex gap-[0.8rem] items-center">
        <p class="drop-txt">메인팝업</p>
        <DropdownSelect
          :select-list="optionList.listData"
          :default-select="optionList.defaultSelect"
          class-bind="!min-w-[12rem] ml-auto mr-0 "
        ></DropdownSelect>
      </div>
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
              <th width="560px">제목</th>
              <th>메인 팝업</th>
              <th>노출 여부</th>
              <th>작성자</th>
              <th width="134px">작성일시</th>
            </tr>
          </thead>
          <tbody v-if="tableData && tableData.length > 0">
            <tr v-for="item in tableData" :key="item.id">
              <td class="num">{{ item.no }}</td>
              <td class="title !text-left">
                <RouterLink to="/site-management/announcements/create">
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
      <div v-if="tableData && tableData.length <= 0">
        <TemplateDataNone />
      </div>
    </div>
    <Pagination v-if="tableData && tableData.length > 0" />
  </TemplateBoardWrap>
</template>

<script setup>
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

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
</style>
