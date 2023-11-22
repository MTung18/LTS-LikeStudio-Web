<!--
  231109 :
  - 테이블 마크업이나 로직이 변경 될 수 있음
  - 에셋 업로드 팝업의 테이블 마크업이나 로직이 변경 될 수 있음
-->
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
      <div class="search-filter">
        <div class="search-filter__top">
          <div class="top__left">
            <DropdownSelect
              :select-list="registeredDate.listData"
              :default-select="registeredDate.defaultSelect"
              class-bind="!min-w-[auto] !w-[10rem] mr-[1.4rem]"
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
                class="!w-[10rem] !min-w-[auto]"
              ></DropdownSelect>
            </div>
            <div class="flex items-center mr-[2rem]">
              <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
                >1차<br />카테고리</span
              >
              <DropdownSelect
                :select-list="applicationData.listData"
                :default-select="applicationData.defaultSelect"
                class="!w-[10rem] !min-w-[auto]"
              ></DropdownSelect>
            </div>
            <div class="flex items-center mr-[2rem]">
              <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
                >2차<br />카테고리</span
              >
              <DropdownSelect
                :select-list="serviceData.listData"
                :default-select="serviceData.defaultSelect"
                class="!w-[10rem] !min-w-[auto]"
              ></DropdownSelect>
            </div>
            <div class="flex items-center">
              <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
                >파일 구분</span
              >
              <DropdownSelect
                :select-list="fileTypeData.listData"
                :default-select="fileTypeData.defaultSelect"
                class="!w-[10rem] !min-w-[auto]"
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
            class="flex-1 mr-[1.4rem] !max-w-none"
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
        class="select-wrap flex w-full text-right pb-[2rem] border-b-neutrals-black border-b-[1px]"
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
          @click="popupUploadIsOpen = true"
          >업로드</RoundButton
        >
      </div>
      <div class="manage_list-wrap">
        <div class="manage_table-wrap custom-scrollbar">
          <table>
            <thead>
              <tr>
                <th width="40px">
                  <CheckBox
                    :check-list="''"
                    :id="'allCheck'"
                    :shape-type="'square'"
                    :name="'choice'"
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
                    :name="'choice'"
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
                  <UIButton
                    component="button"
                    color-type="outlined"
                    size="small"
                    :isIcon="true"
                    class="!border-[#ddd] !font-normal"
                  >
                    <Icons icon-name="download" :width="1.4" :height="1.4" />
                    다운로드</UIButton
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
      <div class="search-filter">
        <div class="search-filter__top">
          <div class="top__left">
            <DropdownSelect
              :select-list="registeredDate.listData"
              :default-select="registeredDate.defaultSelect"
              class-bind="!min-w-[auto] !w-[10rem] mr-[1.4rem]"
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
          </div>
        </div>
        <div class="search-filter__bottom">
          <SearchInput
            placeholder="검색어를 입력해주세요"
            size="medium"
            style-type="square"
            color-type="gray"
            class="flex-1 mr-[1.4rem] !max-w-none"
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
        class="select-wrap flex w-full text-right pb-[2rem] border-b-neutrals-black border-b-[1px]"
      >
        <div class="btn-area flex gap-[0.8rem]">
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            @click="popupStyleIsOpen = true"
            >스타일 설정</RoundButton
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
          @click="popupAssetUploadFrameIsOpen = true"
          >업로드</RoundButton
        >
      </div>
      <div class="manage_list-wrap">
        <div class="manage_table-wrap custom-scrollbar">
          <table>
            <thead>
              <tr>
                <th width="40px">
                  <CheckBox
                    :check-list="''"
                    :id="'allCheck2'"
                    :shape-type="'square'"
                    :name="'choice'"
                    @change="allCheckEvent"
                  ></CheckBox>
                </th>
                <th width="2.24%">NO</th>
                <th width="100px" class="thumb">썸네일</th>
                <th>제목</th>
                <th width="110px">에셋 ID</th>
                <th width="400px">태그</th>
                <th width="66px">노출</th>
                <th>수정자</th>
                <th>수정일시</th>
                <th>등록자</th>
                <th>등록일시</th>
                <th width="134px">다운로드</th>
              </tr>
            </thead>
            <tbody v-if="tableData && tableData.length > 0">
              <tr v-for="item in tableData" :key="item.id" @click="routerLink">
                <td class="check-area">
                  <CheckBox
                    :check-list="''"
                    :id="`check1_${item.id}`"
                    :shape-type="'square'"
                    :name="'choice'"
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
                <td>{{ item.tag }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.correctDate }}</td>
                <td>{{ item.registrant }}</td>
                <td>{{ item.registrateDate }}</td>
                <td>
                  <UIButton
                    component="button"
                    color-type="outlined"
                    size="small"
                    :isIcon="true"
                    class="!border-[#ddd] !font-normal"
                  >
                    <Icons icon-name="download" :width="1.4" :height="1.4" />
                    다운로드</UIButton
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
      <div class="search-filter">
        <div class="search-filter__top">
          <div class="top__left">
            <DropdownSelect
              :select-list="registeredDate.listData"
              :default-select="registeredDate.defaultSelect"
              class-bind="!min-w-[auto] !w-[10rem] mr-[1.4rem]"
            ></DropdownSelect>
            <CalenderGroup
              :start-date="startDate"
              :end-date="endDate"
              @update:startDate="startDate = $event"
              @update:endDate="endDate = $event"
            />
          </div>
          <div class="top__center">
            <div class="mr-[0.8rem]">
              <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
                >노출</span
              >
              <DropdownSelect
                :select-list="visibilityData.listData"
                :default-select="visibilityData.defaultSelect"
                class="!w-[9rem] !min-w-[auto]"
              ></DropdownSelect>
            </div>
            <div class="flex items-center mr-[0.8rem]">
              <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
                >스타일</span
              >
              <DropdownSelect
                :select-list="applicationData.listData"
                :default-select="applicationData.defaultSelect"
                class="!w-[9rem] !min-w-[auto]"
              ></DropdownSelect>
            </div>
            <div class="flex items-center">
              <span class="inline-block mr-[0.8rem] text-fz-m font-bold"
                >라이센스</span
              >
              <DropdownSelect
                :select-list="serviceData.listData"
                :default-select="serviceData.defaultSelect"
                class="!w-[9rem] !min-w-[auto]"
              ></DropdownSelect>
            </div>
          </div>
          <div class="top__right">
            <div class="top__right__checkbox-list">
              <CheckBox
                v-for="item in checkBoxList.checkData"
                :key="item.id"
                :check-list="item.checkList"
                :id="item.checkId"
                :shape-type="'square'"
                :name="item.checkId"
                >{{ item }}</CheckBox
              >
            </div>
          </div>
        </div>
        <div class="search-filter__bottom">
          <SearchInput
            placeholder="검색어를 입력해주세요"
            size="medium"
            style-type="square"
            color-type="gray"
            class="flex-1 mr-[1.4rem] !max-w-none"
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
        class="select-wrap flex w-full text-right pb-[2rem] border-b-neutrals-black border-b-[1px]"
      >
        <div class="btn-area flex gap-[0.8rem]">
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="small"
            class="!h-[4.6rem]"
            @click="popupStyleIsOpen = true"
            >스타일 설정</RoundButton
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
          @click="popupFontUploadIsOpen = true"
          >업로드</RoundButton
        >
      </div>
      <div class="manage_list-wrap">
        <div class="manage_table-wrap custom-scrollbar">
          <table>
            <thead>
              <tr>
                <th width="40px">
                  <CheckBox
                    :check-list="''"
                    :id="'allCheck1'"
                    :shape-type="'square'"
                    :name="'choice'"
                    @change="allCheckEvent"
                  ></CheckBox>
                </th>
                <th width="2.24%">NO</th>
                <th>제목</th>
                <th width="66px">노출</th>
                <th width="320px">스타일</th>
                <th>국문</th>
                <th>영문</th>
                <th>일문</th>
                <th>중문</th>
                <th>라이선스</th>
                <th>라이선스 기간</th>
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
                    :id="`check2_${item.id}`"
                    :shape-type="'square'"
                    :name="'choice'"
                  ></CheckBox>
                </td>
                <td class="num">{{ item.no }}</td>
                <td class="title !text-left">
                  <button type="button" @click="popupFontEditIsOpen = true">
                    {{ item.title }}
                  </button>
                </td>

                <td>{{ item.show }}</td>
                <td>{{ item.tag }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.show }}</td>
                <td>{{ item.correctDate }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.correctDate }}</td>
                <td>{{ item.registrant }}</td>
                <td>{{ item.registrateDate }}</td>
                <td>
                  <UIButton
                    component="button"
                    color-type="outlined"
                    size="small"
                    :isIcon="true"
                    class="!border-[#ddd] !font-normal"
                  >
                    <Icons icon-name="download" :width="1.4" :height="1.4" />
                    다운로드</UIButton
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
  <PopupAssetUploadFrames
    :is-open="popupAssetUploadFrameIsOpen"
    @close-button="popupAssetUploadFrameIsOpen = false"
  />
  <PopupAssetEditFont
    :is-open="popupAssetUploadFontIsOpen"
    @close-button="popupAssetUploadFontIsOpen = false"
  />
  <PopupUpload
    :is-open="popupUploadIsOpen"
    @close-button="popupUploadIsOpen = false"
  />
  <PopupStyleSetting
    :is-open="popupStyleIsOpen"
    @close-button="popupStyleIsOpen = false"
  />
  <PopupFontUpload
    :is-open="popupFontUploadIsOpen"
    @close-button="popupFontUploadIsOpen = false"
  />
  <PopupFontEdit
    :is-open="popupFontEditIsOpen"
    @close-button="popupFontEditIsOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import ManageListWrap from '@/components/ManageListWrap/ManageListWrap.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import RoundTabs from '@/components/RoundTabs/RoundTabs.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import PopupAssetEdit from '@/containers/site-management/asset/PopupAssetEdit/PopupAssetEdit.vue';
import PopupAssetEditFont from '@/containers/site-management/asset/PopupAssetEditFont/PopupAssetEditFont.vue';
import PopupAssetUploadFrames from '@/containers/site-management/asset/PopupAssetUploadFrames/PopupAssetUploadFrames.vue';
import PopupAssetVisibilitySetting from '@/containers/site-management/asset/PopupAssetVisibilitySetting/PopupAssetVisibilitySetting.vue';
import PopupCategorySetting from '@/containers/site-management/asset/PopupCategorySetting/PopupCategorySetting.vue';
import PopupFontEdit from '@/containers/site-management/asset/PopupFontEdit/PopupFontEdit.vue';
import PopupFontUpload from '@/containers/site-management/asset/PopupFontUpload/PopupFontUpload.vue';
import PopupStyleSetting from '@/containers/site-management/asset/PopupStyleSetting/PopupStyleSetting.vue';
import PopupTagSetting from '@/containers/site-management/asset/PopupTagSetting/PopupTagSetting.vue';
import PopupUpload from '@/containers/site-management/asset/PopupUpload/PopupUpload.vue';

const popupCategorySettingIsOpen = ref(false);
const popupTagSettingIsOpen = ref(false);
const popupAssetVisibilitySettingIsOpen = ref(false);
const popupAssetEditIsOpen = ref(false);
const popupAssetUploadFrameIsOpen = ref(false);
const popupAssetUploadFontIsOpen = ref(false);
const popupUploadIsOpen = ref(false);
const popupStyleIsOpen = ref(false);
const popupFontUploadIsOpen = ref(false);
const popupFontEditIsOpen = ref(false);
const startDate = ref('');
const endDate = ref('');
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
    registrateDate: '2023.09.18 15:32',
  },
  {
    id: 2,
    no: 99,
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
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
    author: '홍길동',
    correctDate: '2023.09.18 15:32',
    registrant: '홍길동',
    registrateDate: '2023.09.18 15:32',
  },
];
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
const applicationData = {
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
const serviceData = {
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
const fileTypeData = {
  id: 1,
  cate: '파일 구분',
  defaultSelect: '옵션',
  listData: [
    {
      id: 1,
      listName: '전체',
    },
    {
      id: 2,
      listName: '비트맵',
    },
    {
      id: 3,
      listName: '백터',
    },
    {
      id: 4,
      listName: '그룹',
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
  const parent = e.target.closest('table');
  const allCheckBox = parent.querySelectorAll('input[type="checkbox"]');
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
  max-height: calc(100vh - 150px);
}

.manage_table-wrap :deep(table) {
  width: 2219px;
}

.manage_table-wrap :deep(th) {
  position: sticky;
  top: 0;
  background-color: var(--color-neutrals-white-100);
  z-index: 1;
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

.search-filter {
  max-width: 1200px;
  padding: 2.6rem;
  margin: 4rem auto 10rem;
  background-color: #f6f6f6;
}

.search-filter__top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0 2rem;
}

.top__left {
  position: relative;
  display: flex;
  align-items: center;
}

.top__left::after {
  position: absolute;
  top: 0;
  right: -1rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.top__center {
  display: flex;
  align-items: center;
}

.top__right {
  display: flex;
  align-self: stretch;
}

.top__right__checkbox-list {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0 1rem;
}

.top__right__checkbox-list::after {
  position: absolute;
  top: 0;
  left: -1rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.search-filter__bottom {
  display: flex;
}

.search-filter__top + .search-filter__bottom {
  margin-top: 2.6rem;
}
</style>
