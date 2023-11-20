<template>
  <ManageListWrap title="템플릿 관리">
    <div class="search-filter">
      <div class="search-filter__top">
        <div class="top__left">
          <DropdownSelect
            :select-list="registeredDate.listData"
            :default-select="registeredDate.defaultSelect"
            class-bind="!min-w-[auto] !w-[10.7rem] mr-[1.4rem]"
          ></DropdownSelect>
          <CalenderGroup
            :start-date="startDate"
            :end-date="endDate"
            @update:startDate="startDate = $event"
            @update:endDate="endDate = $event"
          />
        </div>
        <div class="top__center">
          <div class="mr-[2rem]">
            <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
              >노출</span
            >
            <DropdownSelect
              :select-list="visibilityData.listData"
              :default-select="visibilityData.defaultSelect"
              class="!w-[10.7rem] !min-w-[auto]"
            ></DropdownSelect>
          </div>
          <div class="mr-[2rem]">
            <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
              >용도</span
            >
            <DropdownSelect
              :select-list="applicationData.listData"
              :default-select="applicationData.defaultSelect"
              class="!w-[10.7rem] !min-w-[auto]"
            ></DropdownSelect>
          </div>
          <div>
            <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
              >상품서비스</span
            >
            <DropdownSelect
              :select-list="serviceData.listData"
              :default-select="serviceData.defaultSelect"
              class="!w-[10.7rem] !min-w-[auto]"
            ></DropdownSelect>
          </div>
        </div>
      </div>
      <div class="search-filter__bottom">
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
    <div
      class="select-wrap w-full text-right pb-[2rem] border-b-neutrals-black border-b-[1px]"
    >
      <DropdownSelect
        :select-list="optionList.listData"
        :default-select="optionList.defaultSelect"
        class-bind="!min-w-[auto] !w-[14rem] ml-auto mr-0 "
      ></DropdownSelect>
    </div>
    <div v-if="tableData && tableData.length > 0" class="manage_list-wrap">
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
          <tbody>
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
    </div>
    <div v-if="tableData && tableData.length <= 0">
      <TemplateDataNone />
    </div>
    <Pagination v-if="tableData && tableData.length > 0" />
  </ManageListWrap>
</template>

<script setup>
import { ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import ManageListWrap from '@/components/ManageListWrap/ManageListWrap.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const startDate = ref('');
const endDate = ref('');

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

const getImageUrl = (name) => {
  return new URL(`./img/${name}`, import.meta.url).href;
};
</script>
<style scoped>
.manage_table-wrap {
  max-height: 1128px;
}
.manage_table-wrap :deep(table) {
  width: 1913px;
}

.search-filter {
  max-width: 1200px;
  padding: 2.6rem;
  margin: 7.2rem auto 10rem;
  background-color: #f6f6f6;
}

.search-filter__top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0 4.2rem;
}

.top__left {
  position: relative;
  display: flex;
  align-items: center;
}

.top__left::after {
  position: absolute;
  top: 0;
  right: -2.1rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.top__center {
  display: flex;
  align-items: center;
}

.search-filter__bottom {
  display: flex;
}

.search-filter__top + .search-filter__bottom {
  margin-top: 2.6rem;
}
</style>
