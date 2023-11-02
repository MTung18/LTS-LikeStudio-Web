<template>
  <ManageListWrap title="에셋 관리">
    <div class="tab-list max-w-[1200px] mx-[auto]">
      <div v-for="tab in dummyTabs" :key="tab.id">
        <RoundTabs
          @tabSelected="handleSelectedTab(tab.id)"
          :is-selected="tab.isSelected"
          >{{ tab.tabName }}</RoundTabs
        >
      </div>
    </div>
    <div class="tab-node" v-show="dummyTabs[0].isSelected">
      <ManageHeadForm
        :input-data1="inputData1"
        :input-data2="inputData2"
        :input-data3="inputData3"
        :input-data4="inputData4"
        :input-data5="inputData5"
      />
      <div
        class="select-wrap w-full ml-auto mr-auto flex items-center mb-[2rem]"
      >
        <div class="btn-area flex gap-[0.8rem]">
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            >카테고리 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            >태그 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            >노출 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            >삭제</RoundButton
          >
        </div>
        <DropdownSelect
          :select-list="optionList.listData"
          :default-select="optionList.defaultSelect"
          class="!min-w-[auto] !w-[14rem] ml-auto mr-0"
        ></DropdownSelect>
        <RoundButton
          class="shrink-0 ml-[1.4rem]"
          component="button"
          color-type="filed"
          size="medium"
          @click="popupUploadIsOpen = true"
          >업로드</RoundButton
        >
      </div>
      <div class="manage_list-wrap">
        <div class="manage_table-wrap">
          <table>
            <thead>
              <tr>
                <th width="40px">
                  <CheckBox
                    :check-list="''"
                    :id="'allCheck'"
                    :shape-type="'square'"
                    :name="'choise'"
                    @change="allCheckEvent"
                  ></CheckBox>
                </th>
                <th width="2.24%">NO</th>
                <th width="100px" class="thumb">썸네일</th>
                <th>제목</th>
                <th width="110px">에셋 ID</th>
                <th width="124px">파일 구분</th>
                <th>1차 카테고리</th>
                <th>2차 카테고리</th>
                <th width="320px">태그</th>
                <th width="66px">노출</th>
                <th>수정자</th>
                <th width="134px">수정일시</th>
                <th width="94px">등록자</th>
                <th width="134px">등록일시</th>
                <th width="134px">다운로드</th>
              </tr>
            </thead>
            <tbody v-if="tableData && tableData.length > 0">
              <tr v-for="item in tableData" :key="item.id" @click="routerLink">
                <td class="check-area">
                  <CheckBox
                    :check-list="''"
                    :id="`check${item.id}`"
                    :shape-type="'square'"
                    :name="'choise'"
                  ></CheckBox>
                </td>
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
                <td>{{ item.originalId }}</td>
                <td>{{ item.usage }}</td>
                <td>{{ item.service }}</td>
                <td>{{ item.tag }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.correctDate }}</td>
                <td>{{ item.registrant }}</td>
                <td>{{ item.registrateDate }}</td>
                <td>
                  <Button
                    component="button"
                    color-type="outlined"
                    size="small"
                    :isIcon="true"
                    class="!border-[#ddd] !font-normal"
                  >
                    <Icons icon-name="download" :width="1.4" :height="1.4" />
                    다운로드</Button
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
    </div>
    <div class="tab-node" v-show="dummyTabs[1].isSelected">
      <ManageHeadForm :input-data1="inputData1" :input-data2="inputData6" />
      <div
        class="select-wrap w-full ml-auto mr-auto flex items-center mb-[2rem]"
      >
        <div class="btn-area flex gap-[0.8rem]">
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            @click="popupCategorySettingIsOpen = true"
            >카테고리 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            @click="popupTagSettingIsOpen = true"
            >태그 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            @click="popupAssetVisibilitySettingIsOpen = true"
            >노출 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            @click="popupAssetEditIsOpen = true"
            >삭제</RoundButton
          >
        </div>
        <DropdownSelect
          :select-list="optionList.listData"
          :default-select="optionList.defaultSelect"
          class="!min-w-[auto] !w-[14rem] ml-auto mr-0"
        ></DropdownSelect>
        <RoundButton
          class="shrink-0 ml-[1.4rem]"
          component="button"
          color-type="filed"
          size="medium"
          >업로드</RoundButton
        >
      </div>
      <div class="manage_list-wrap">
        <div class="manage_table-wrap">
          <table>
            <thead>
              <tr>
                <th width="40px">
                  <CheckBox
                    :check-list="''"
                    :id="'allCheck'"
                    :shape-type="'square'"
                    :name="'choise'"
                    @change="allCheckEvent"
                  ></CheckBox>
                </th>
                <th width="2.24%">NO</th>
                <th width="100px" class="thumb">썸네일</th>
                <th>제목</th>
                <th width="110px">에셋 ID</th>
                <th width="124px">파일 구분</th>
                <th>1차 카테고리</th>
                <th>2차 카테고리</th>
                <th width="320px">태그</th>
                <th width="66px">노출</th>
                <th>수정자</th>
                <th width="134px">수정일시</th>
                <th width="94px">등록자</th>
                <th width="134px">등록일시</th>
                <th width="134px">다운로드</th>
              </tr>
            </thead>
            <tbody v-if="tableData && tableData.length > 0">
              <tr v-for="item in tableData" :key="item.id" @click="routerLink">
                <td class="check-area">
                  <CheckBox
                    :check-list="''"
                    :id="`check${item.id}`"
                    :shape-type="'square'"
                    :name="'choise'"
                  ></CheckBox>
                </td>
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
                <td>{{ item.originalId }}</td>
                <td>{{ item.usage }}</td>
                <td>{{ item.service }}</td>
                <td>{{ item.tag }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.correctDate }}</td>
                <td>{{ item.registrant }}</td>
                <td>{{ item.registrateDate }}</td>
                <td>
                  <Button
                    component="button"
                    color-type="outlined"
                    size="small"
                    :isIcon="true"
                    class="!border-[#ddd] !font-normal"
                  >
                    <Icons icon-name="download" :width="1.4" :height="1.4" />
                    다운로드</Button
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
    </div>
    <div class="tab-node" v-show="dummyTabs[2].isSelected">
      <ManageHeadForm
        :input-data1="inputData1"
        :input-data2="inputData2"
        :input-data3="inputData3"
        :input-data4="inputData4"
        :check-box-list="checkBoxList.checkData"
      />
      <div
        class="select-wrap w-full ml-auto mr-auto flex items-center mb-[2rem]"
      >
        <div class="btn-area flex gap-[0.8rem]">
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            >카테고리 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            >태그 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            >노출 설정</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            >삭제</RoundButton
          >
        </div>
        <DropdownSelect
          :select-list="optionList.listData"
          :default-select="optionList.defaultSelect"
          class="!min-w-[auto] !w-[14rem] ml-auto mr-0"
        ></DropdownSelect>
        <RoundButton
          class="shrink-0 ml-[1.4rem]"
          component="button"
          color-type="filed"
          size="medium"
          >업로드</RoundButton
        >
      </div>
      <div class="manage_list-wrap">
        <div class="manage_table-wrap">
          <table>
            <thead>
              <tr>
                <th width="40px">
                  <CheckBox
                    :check-list="''"
                    :id="'allCheck'"
                    :shape-type="'square'"
                    :name="'choise'"
                    @change="allCheckEvent"
                  ></CheckBox>
                </th>
                <th width="2.24%">NO</th>
                <th width="100px" class="thumb">썸네일</th>
                <th>제목</th>
                <th width="110px">에셋 ID</th>
                <th width="124px">파일 구분</th>
                <th>1차 카테고리</th>
                <th>2차 카테고리</th>
                <th width="320px">태그</th>
                <th width="66px">노출</th>
                <th>수정자</th>
                <th width="134px">수정일시</th>
                <th width="94px">등록자</th>
                <th width="134px">등록일시</th>
                <th width="134px">다운로드</th>
              </tr>
            </thead>
            <tbody v-if="tableData && tableData.length > 0">
              <tr v-for="item in tableData" :key="item.id" @click="routerLink">
                <td class="check-area">
                  <CheckBox
                    :check-list="''"
                    :id="`check${item.id}`"
                    :shape-type="'square'"
                    :name="'choise'"
                  ></CheckBox>
                </td>
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
                <td>{{ item.originalId }}</td>
                <td>{{ item.usage }}</td>
                <td>{{ item.service }}</td>
                <td>{{ item.tag }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.correctDate }}</td>
                <td>{{ item.registrant }}</td>
                <td>{{ item.registrateDate }}</td>
                <td>
                  <Button
                    component="button"
                    color-type="outlined"
                    size="small"
                    :isIcon="true"
                    class="!border-[#ddd] !font-normal"
                  >
                    <Icons icon-name="download" :width="1.4" :height="1.4" />
                    다운로드</Button
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
    </div>
  </ManageListWrap>
  <PopupCategorySetting
    :is-open="popupCategorySettingIsOpen"
    @close-button="popupCategorySettingIsOpen = false"
  />
  <PopupTagSetting
    :is-open="popupTagSettingIsOpen"
    @close-button="popupTagSettingIsOpen = false"
  />
  <PopupAssetVisibilitySetting
    :is-open="popupAssetVisibilitySettingIsOpen"
    @close-button="popupAssetVisibilitySettingIsOpen = false"
  />
  <PopupAssetEdit
    :is-open="popupAssetEditIsOpen"
    @close-button="popupAssetEditIsOpen = false"
  />
  <PopupUploadNodata
    :is-open="popupUploadIsOpen"
    @close-button="popupUploadIsOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';

import Button from '@/components/Button/Button.vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import ManageListWrap from '@/components/ManageListWrap/ManageListWrap.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import RoundTabs from '@/components/RoundTabs/RoundTabs.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import PopupAssetEdit from '@/containers/site-management/asset/PopupAssetEdit/PopupAssetEdit.vue';
import PopupAssetVisibilitySetting from '@/containers/site-management/asset/PopupAssetVisibilitySetting/PopupAssetVisibilitySetting.vue';
import PopupCategorySetting from '@/containers/site-management/asset/PopupCategorySetting/PopupCategorySetting.vue';
import PopupTagSetting from '@/containers/site-management/asset/PopupTagSetting/PopupTagSetting.vue';
import PopupUploadNodata from '@/containers/site-management/asset/PopupUpload/PopupUploadNodata.vue';

const popupCategorySettingIsOpen = ref(false);
const popupTagSettingIsOpen = ref(false);
const popupAssetVisibilitySettingIsOpen = ref(false);
const popupAssetEditIsOpen = ref(false);
const popupUploadIsOpen = ref(false);
const optionList = {
  defaultSelect: '등록 순',
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
  cate: '1차<br/>카테고리',
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
  cate: '2차<br/>카테고리',
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
const inputData5 = {
  id: 1,
  cate: '파일 구분',
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
const inputData6 = {
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
const checkBoxList = {
  id: 1,
  cate: 'language',
  checkData: [
    {
      id: 1,
      checkList: '국문',
      checkId: 'korean',
    },
    {
      id: 2,
      checkList: '영문',
      checkId: 'english',
    },
    {
      id: 3,
      checkList: '일문',
      checkId: 'japanese',
    },
    {
      id: 4,
      checkList: '중문',
      checkId: 'chinese',
    },
  ],
};

const getImageUrl = (name) => {
  return new URL(`./img/${name}`, import.meta.url).href;
};

function allCheckEvent(e) {
  const allCheckBox = document.querySelectorAll('input[type="checkbox"]');
  allCheckBox.forEach((i) => {
    // eslint-disable-next-line no-param-reassign
    i.checked = e.target.checked === true;
  });
}

const dummyTabs = ref([
  {
    id: 0,
    tabName: '에셋',
    isSelected: true,
  },
  {
    id: 1,
    tabName: '프레임',
    isSelected: false,
  },
  {
    id: 2,
    tabName: '폰트',
    isSelected: false,
  },
]);
function handleSelectedTab(selectedId) {
  dummyTabs.value = dummyTabs.value.map((tab) => ({
    ...tab,
    isSelected: tab.id === selectedId,
  }));
}
</script>
<style scoped>
.manage_table-wrap {
  max-height: 1100px;
}
.manage_table-wrap :deep(table) {
  width: 2219px;
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
</style>
