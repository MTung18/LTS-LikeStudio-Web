<template>
  <div class="project">
    <CategorySideBar
      :data="dummyCategory"
      @category-selected="handleCategorySelected"
    />
    <div class="project__wrap">
      <div class="studio__head">
        <h3 class="studio__head__title">갤러리 공유</h3>
        <div class="studio__head__length">2,850</div>
      </div>
      <div class="search-filter">
        <div
          class="relative flex items-center gap-x-[1.4rem] ml-auto mr-[4rem] before:absolute before:content-[''] before:right-[-2rem] before:top-0 before:w-[1px] before:h-full before:bg-gray-gray-ddd"
        >
          <SearchInput
            v-model="dummyInputValue"
            placeholder="검색어를 입력해주세요"
            size="medium"
            style-type="square"
            color-type="gray"
            class="flex-1"
          />
          <RoundButton component="button" color-type="filed" size="medium"
            >검색</RoundButton
          >
        </div>
        <div class="flex items-center">
          <DropdownSelect
            :select-list="dummyDropdown.listData"
            :default-select="dummyDropdown.defaultSelect"
            class="!min-w-[13rem] mr-[1.4rem]"
          ></DropdownSelect>
        </div>
      </div>
      <template v-if="!nodata">
        <div class="manage_list-wrap">
          <div class="manage_table-wrap custom-scrollbar">
            <table>
              <thead>
                <tr>
                  <th width="40px">NO</th>
                  <th width="100px" class="thumb">썸네일</th>
                  <th width="142px">제목</th>
                  <th width="100px">프로젝트 ID</th>
                  <th width="100px">용도</th>
                  <th width="100px">상품 서비스</th>
                  <th width="220px">태그</th>
                  <th width="66px">노출</th>
                  <th width="94px">사용 수</th>
                  <th width="94px">추천 수</th>
                  <th width="94px">댓글 수</th>
                  <th width="134px">수정일시</th>
                  <th width="134px">등록일시</th>
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
                  <td>{{ item.projectId }}</td>
                  <td>{{ item.usage }}</td>
                  <td>{{ item.service }}</td>
                  <td>{{ item.tag }}</td>
                  <td>{{ item.show }}</td>
                  <td>{{ item.usingNumber }}</td>
                  <td>{{ item.recommendNumber }}</td>
                  <td>{{ item.commentNumber }}</td>
                  <td>{{ item.correctDate }}</td>
                  <td>{{ item.registrateDate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Pagination />
      </template>
      <template v-else>
        <TemplateDataNone />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import CategorySideBar from '@/components/CategorySideBar/CategorySideBar.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const route = useRoute();
const { nodata } = route.query;
const dummyInputValue = ref('');
const dummyCategory = ref([
  {
    id: 1,
    name: '용도별',
    subcategories: [
      {
        id: 101,
        name: '포스터',
        isSelected: true,
      },
      {
        id: 102,
        name: '브로셔',
        isSelected: true,
      },
      {
        id: 103,
        name: '책받침',
        isSelected: false,
      },
      {
        id: 104,
        name: 'X배너',
        isSelected: false,
      },
      {
        id: 105,
        name: 'SNS용',
        isSelected: false,
      },
      {
        id: 106,
        name: 'PPT',
        isSelected: false,
      },
      {
        id: 107,
        name: '기타',
        isSelected: false,
      },
    ],
  },
  {
    id: 2,
    name: '상품/서비스별',
    subcategories: [
      {
        id: 201,
        name: '무선',
        isSelected: false,
      },
      {
        id: 202,
        name: '유선',
        isSelected: false,
      },
      {
        id: 203,
        name: '결합',
        isSelected: true,
      },
      {
        id: 204,
        name: '가족',
        isSelected: false,
      },
      {
        id: 205,
        name: '외국인',
        isSelected: false,
      },
      {
        id: 206,
        name: '멤버십',
        isSelected: true,
      },
      {
        id: 207,
        name: '제휴카드',
        isSelected: false,
      },
      {
        id: 208,
        name: '기타1',
        isSelected: false,
      },
      {
        id: 209,
        name: '기타2',
        isSelected: false,
      },
    ],
  },
]);
const dummyDropdown = {
  id: 1,
  cate: '등록순',
  defaultSelect: '등록순',
  listData: [
    {
      id: 1,
      listName: '등록순',
    },
    {
      id: 2,
      listName: '최근 수정순',
    },
    {
      id: 3,
      listName: '이름순',
    },
  ],
};
const tableData = [
  {
    id: 1,
    no: 100,
    thumb: 'img_template_01.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 2,
    no: 99,
    thumb: 'img_template_01.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 3,
    no: 98,
    thumb: 'img_template_01.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 4,
    no: 97,
    thumb: 'img_template_02.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 5,
    no: 96,
    thumb: 'img_template_02.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 6,
    no: 95,
    thumb: 'img_template_01.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 7,
    no: 94,
    thumb: 'img_template_02.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 8,
    no: 93,
    thumb: 'img_template_01.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 9,
    no: 92,
    thumb: 'img_template_01.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 10,
    no: 91,
    thumb: 'img_template_01.png',
    title: '10월 테마 X  배너',
    projectId: 'p99',
    originalId: 'p60',
    usage: '브로셔',
    service: '무선',
    tag: '동아리·모임, 서포터즈·기자, 인포그래픽세로, 문화, 항목, 잘파세대, 젠지세대, MZ세대, MZ, mz, 트렌드, 요즘애들, 요즘세대, 신세대, 트렌디, 캐릭터, 성격, 별명, 특기, 차이점, 특징, 키워드, 재테크, 친환경, 핸드폰, 스마트폰, 어플',
    show: 'N',
    usingNumber: '1234',
    recommendNumber: '1234',
    commentNumber: '1234',
    correctDate: '2023.09.18 15:32',
    registrateDate: '2023.09.18 15:32',
  },
];

const handleCategorySelected = (categoryId, subcategoryId) => {
  const category = dummyCategory.value.find((cat) => cat.id === categoryId);
  if (category) {
    const subcategory = category.subcategories.find(
      (subcat) => subcat.id === subcategoryId,
    );
    if (subcategory) {
      subcategory.isSelected = !subcategory.isSelected;
    }
  }
};

const getImageUrl = (name) => {
  return new URL(`./img/${name}`, import.meta.url).href;
};
</script>

<style scoped>
.project {
  position: relative;
  display: flex;
  gap: 0 4rem;
  padding-top: 7.2rem;
}

.project__wrap {
  flex: 1;
  min-width: 0;
}

.studio__head {
  display: flex;
  align-items: center;
  gap: 0 1rem;
  margin-bottom: 6rem;
}

.studio__head__title {
  font-size: var(--ttl-m);
  font-weight: 700;
}

.studio__head__length {
  height: 3.4rem;
  line-height: 3.4rem;
  padding: 0 1.3rem;
  border-radius: 3.4rem;
  border: 1px solid var(--color-gray-ddd);
  font-size: var(--fz-l);
  font-weight: 700;
  background-color: #f6f6f6;
}

.search-filter {
  display: flex;
  align-items: center;
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-neutrals-black);
}

.manage_table-wrap {
  max-height: calc(100vh - 150px);
}

.manage_table-wrap table {
  width: 1460px;
}

.manage_table-wrap :deep(th) {
  position: sticky;
  top: 0;
  background-color: var(--color-neutrals-white-100);
  z-index: 1;
}
</style>
