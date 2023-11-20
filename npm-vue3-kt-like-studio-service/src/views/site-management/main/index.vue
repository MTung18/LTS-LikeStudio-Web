<template>
  <TemplateBoardWrap title="메인 관리">
    <div class="tab-list">
      <div v-for="tab in dummyTabs" :key="tab.id">
        <RoundTabs
          @tabSelected="handleSelectedTab(tab.id)"
          :is-selected="tab.isSelected"
          >{{ tab.tabName }}</RoundTabs
        >
      </div>
    </div>
    <div class="tab-node" v-show="dummyTabs[0].isSelected">
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
      <div class="select-wrap flex justify-end">
        <RoundButton
          component="a"
          href="/site-management/main/create"
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
                <th width="2.24%"></th>
                <th width="130px">썸네일</th>
                <th width="356px">제목</th>
                <th width="108px">상태</th>
                <th>진행기간</th>
                <th>노출 여부</th>
                <th>작성자</th>
                <th width="134px">작성일시</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id">
                <td class="num"><Icons icon-name="sort" /></td>
                <td class="thumb">
                  <div class="img-area">
                    <img
                      :src="`../src/views/site-management/main/img/${item.img}`"
                      alt="cloud"
                    />
                  </div>
                </td>
                <td class="title !text-left">
                  <RouterLink :to="`/site-management/main/${item.id}/edit`">
                    {{ item.title }}
                  </RouterLink>
                </td>
                <td
                  :class="{
                    progress: item.state === 'progress',
                    waiting: item.state === 'waiting',
                    completed: item.state === 'completed',
                  }"
                >
                  {{
                    item.state === 'progress'
                      ? '진행중'
                      : item.state === 'waiting'
                      ? '진행예정'
                      : '완료'
                  }}
                </td>
                <td class="date">{{ item.period }}</td>
                <td>{{ item.show1 }}</td>
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
    </div>
    <div class="tab-node" v-show="dummyTabs[1].isSelected">
      <div class="select-wrap flex justify-end">
        <RoundButton
          component="button"
          color-type="filed"
          size="medium"
          @click="popupTemplateAddIsOpen = true"
          >템플릿 추가</RoundButton
        >
      </div>
      <div v-if="imgList && imgList.length > 0" class="manage_list-wrap">
        <ul class="manage_table-wrap">
          <li class="manage_list-node" v-for="item in imgList" :key="item.id">
            <div class="sort-area">
              <Icons icon-name="sort" />
            </div>
            <div class="template-cnt-area">
              <div class="option-list">
                <h3 class="cate-name">{{ item.cate }}</h3>
                <ul class="edit-area">
                  <li>
                    <button type="button" class="basic-btn">수정</button>
                  </li>
                  <li><button type="button" class="basic-btn">삭제</button></li>
                </ul>
              </div>
              <ul class="template-img-list">
                <li
                  class="template-img-node"
                  v-for="i in item.listData"
                  :key="i.id"
                >
                  <RouterLink to=""
                    ><img :src="getImageUrl(i.imgName)" alt="i.imgName" />
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="imgList && imgList.length <= 0">
        <TemplateDataNone />
      </div>
      <div class="manage__btn-area flex justify-center gap-[1rem]">
        <UIButton
          component="button"
          class="cancel-btn w-[14rem]"
          color-type="outlined"
          size="large"
          >취소</UIButton
        >
        <UIButton
          component="button"
          class="edit-btn w-[14rem]"
          color-type="primary"
          size="large"
          >저장</UIButton
        >
      </div>
    </div>
  </TemplateBoardWrap>
  <PopupTemplateAdd
    :is-open="popupTemplateAddIsOpen"
    @close-button="popupTemplateAddIsOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import RoundTabs from '@/components/RoundTabs/RoundTabs.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import PopupTemplateAdd from '@/containers/site-management/main/PopupTemplateAdd/PopupTemplateAdd.vue';

const startDate = ref('');
const endDate = ref('');
const popupTemplateAddIsOpen = ref(false);

const dummyTabs = ref([
  {
    id: 0,
    tabName: '비주얼',
    isSelected: true,
  },
  {
    id: 1,
    tabName: '공식 템플릿',
    isSelected: false,
  },
]);

function handleSelectedTab(selectedId) {
  dummyTabs.value = dummyTabs.value.map((tab) => ({
    ...tab,
    isSelected: tab.id === selectedId,
  }));
}

const getImageUrl = (name) => {
  return new URL(`./img/${name}`, import.meta.url).href;
};

const imgList = [
  {
    id: 1,
    cate: '유선',
    listData: [
      {
        id: 1,
        imgName: 'img_poster_01_01.png',
      },
      {
        id: 2,
        imgName: 'img_poster_01_02.png',
      },
      {
        id: 3,
        imgName: 'img_poster_01_03.png',
      },
      {
        id: 4,
        imgName: 'img_poster_01_04.png',
      },
      {
        id: 5,
        imgName: 'img_poster_01_05.png',
      },
    ],
  },
  {
    id: 2,
    cate: '멤버십',
    listData: [
      {
        id: 1,
        imgName: 'img_poster_01_01.png',
      },
      {
        id: 2,
        imgName: 'img_poster_01_02.png',
      },
      {
        id: 3,
        imgName: 'img_poster_01_03.png',
      },
      {
        id: 4,
        imgName: 'img_poster_01_04.png',
      },
      {
        id: 5,
        imgName: 'img_poster_01_05.png',
      },
    ],
  },
  {
    id: 3,
    cate: 'X배너',
    listData: [
      {
        id: 1,
        imgName: 'img_poster_01_01.png',
      },
      {
        id: 2,
        imgName: 'img_poster_01_02.png',
      },
      {
        id: 3,
        imgName: 'img_poster_01_03.png',
      },
      {
        id: 4,
        imgName: 'img_poster_01_04.png',
      },
      {
        id: 5,
        imgName: 'img_poster_01_05.png',
      },
    ],
  },
  {
    id: 4,
    cate: 'SNS용',
    listData: [
      {
        id: 1,
        imgName: 'img_poster_01_01.png',
      },
      {
        id: 2,
        imgName: 'img_poster_01_02.png',
      },
      {
        id: 3,
        imgName: 'img_poster_01_03.png',
      },
      {
        id: 4,
        imgName: 'img_poster_01_04.png',
      },
      {
        id: 5,
        imgName: 'img_poster_01_05.png',
      },
    ],
  },
  {
    id: 5,
    cate: '가족',
    listData: [
      {
        id: 1,
        imgName: 'img_poster_01_01.png',
      },
      {
        id: 2,
        imgName: 'img_poster_01_02.png',
      },
      {
        id: 3,
        imgName: 'img_poster_01_03.png',
      },
      {
        id: 4,
        imgName: 'img_poster_01_04.png',
      },
      {
        id: 5,
        imgName: 'img_poster_01_05.png',
      },
    ],
  },
];
const tableData = [
  {
    id: 1,
    no: 100,
    state: 'waiting',
    cate: '공식 VMD',
    img: 'img_template_01.png',
    title:
      '2023년 10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: false,
  },
  {
    id: 2,
    no: 99,
    state: 'waiting',
    cate: '공식 VMD',
    img: 'img_template_01.png',
    title: '2023년 10월',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: false,
  },
  {
    id: 3,
    no: 98,
    state: 'progress',
    cate: '공식 VMD',
    title: '2023년 10월',
    img: 'img_template_01.png',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 4,
    no: 97,
    state: 'progress',
    cate: '공식 VMD',
    title: '2023년 10월',
    img: 'img_template_01.png',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 5,
    no: 95,
    state: 'progress',
    cate: '공식 VMD',
    title: '2023년 10월',
    img: 'img_template_01.png',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 6,
    no: 94,
    state: true,
    cate: '공식 VMD',
    title: '2023년 10월',
    img: 'img_template_01.png',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 7,
    no: 93,
    state: true,
    cate: '공식 VMD',
    title: '2023년 10월',
    img: 'img_template_01.png',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 8,
    no: 92,
    state: true,
    cate: '공식 VMD',
    title: '2023년 10월',
    img: 'img_template_01.png',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 9,
    no: 91,
    state: true,
    cate: '공식 VMD',
    title: '2023년 10월',
    img: 'img_template_01.png',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    answer: true,
  },
  {
    id: 10,
    no: 90,
    state: true,
    cate: '공식 VMD',
    title: '2023년 10월',
    img: 'img_template_01.png',
    fileNumber: '1234',
    show1: 'N',
    period: '2023.08.30~2023.10.30',
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
  overflow: auto;
}
.manage_list-wrap table tbody td.title a {
  border-bottom: 0;
}

.tab-list {
  display: flex;
  margin-bottom: 4rem;
  margin-top: 7.2rem;
}
.tab-list > * {
  flex: 1;
  width: 100%;
}
:deep(.round-tabs) {
  width: 100%;
}
.thumb .img-area {
  border: 1px solid var(--color-gray-ddd);
  background: transparent !important;
  width: auto !important;
  height: auto !important;
}
.progress {
  color: var(--color-primary);
}
.manage_list-node {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.manage_list-node:first-child {
  padding-top: 2.8rem;
}
.manage_list-node + .manage_list-node {
  margin-top: 2.8rem;
  padding-top: 2.8rem;
  border-top: 1px solid var(--color-gray-ddd);
}
.cate-name {
  font-size: 2rem;
  font-weight: bold;
}
.template-cnt-area {
  display: flex;
  flex-flow: column;
}
.template-cnt-area .option-list {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.template-cnt-area .option-list .edit-area {
  display: flex;
  font-size: 1.4rem;
  color: var(--color-gray-444);
  align-items: center;
}
.template-cnt-area .option-list .edit-area > li {
  position: relative;
  line-height: 1;
}
.template-cnt-area .option-list .edit-area > li + li {
  margin-left: 1.6rem;
  padding-left: 1.6rem;
}
.template-cnt-area .option-list .edit-area > li + li:after {
  content: '';
  display: block;
  width: 1px;
  height: 1.2rem;
  background: var(--color-gray-ddd);
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.template-img-list {
  display: flex;
  gap: 2rem;
}
.template-img-node {
  overflow: hidden;
  border-radius: 1.2rem;
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
