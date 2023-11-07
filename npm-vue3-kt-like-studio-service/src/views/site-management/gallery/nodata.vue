<template>
  <ManageListWrap title="갤러리 관리">
    <ManageHeadForm
      :input-data1="inputData1"
      :input-data2="inputData2"
      :input-data3="inputData3"
      :input-data4="inputData4"
    />
    <div class="select-wrap w-full ml-auto mr-auto mb-[2rem]">
      <DropdownSelect
        :select-list="optionList.listData"
        :default-select="optionList.defaultSelect"
        class-bind="!min-w-[auto] !w-[14rem] ml-auto mr-0 "
      ></DropdownSelect>
    </div>
    <div class="manage_list-wrap">
      <div class="manage_table-wrap">
        <table>
          <thead>
            <tr>
              <th width="40px">NO</th>
              <th width="100px" class="thumb">썸네일</th>
              <th width="285px">제목</th>
              <th>용도</th>
              <th>상품 서비스</th>
              <th width="320px">태그</th>
              <th>노출</th>
              <th>사용 수</th>
              <th>추천 수</th>
              <th>댓글 수</th>
              <th>프로젝트 ID</th>
              <th width="5.39%">수정자</th>
              <th width="5.39%">수정자 부서</th>
              <th width="140px">수정일시</th>
              <th width="100px">등록자</th>
              <th width="100px">등록자 부서</th>
              <th width="155px">등록일시</th>
            </tr>
          </thead>
          <tbody v-if="tableData && tableData.length > 0">
            <tr v-for="item in tableData" :key="item.id">
              <td class="num">{{ item.no }}</td>
              <td class="thumb">
                <div class="img-area">
                  <img :src="getImageUrl(item.thumb)" alt="cloud" />
                </div>
              </td>
              <td class="title !text-left">
                <RouterLink to="/site-management/template/detail">{{
                  item.title
                }}</RouterLink>
              </td>
              <td>{{ item.usage }}</td>
              <td>{{ item.service }}</td>
              <td>{{ item.tag }}</td>

              <td>{{ item.show }}</td>

              <td>{{ item.usingNumber }}</td>
              <td>{{ item.recommendNumber }}</td>
              <td>{{ item.projectId }}</td>
              <td>{{ item.commentNumber }}</td>
              <td>{{ item.author }}</td>
              <td>{{ item.position }}</td>
              <td>{{ item.correctDate }}</td>
              <td>{{ item.registrant }}</td>
              <td>{{ item.position }}</td>
              <td>{{ item.registrateDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="tableData && tableData.length <= 0">
        <TemplateDataNone />
      </div>
    </div>
    <Pagination v-if="tableData && tableData.length > 0" />
  </ManageListWrap>
</template>

<script setup>
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import ManageListWrap from '@/components/ManageListWrap/ManageListWrap.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const optionList = {
  defaultSelect: '댓글 많은 순',
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
  cate: '정지',
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

const getImageUrl = (name) => {
  return new URL(`./img/${name}`, import.meta.url).href;
};
</script>
<style scoped>
.manage_table-wrap {
  max-height: 1128px;
}
.manage_table-wrap :deep(table) {
  width: 2189px;
}
</style>
