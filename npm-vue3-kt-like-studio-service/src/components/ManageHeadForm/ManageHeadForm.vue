<template>
  <!--  <div>
    <template v-for="tab in dummyTabs" :key="tab.id">
      <RoundTabs
        @tabSelected="handleSelectedTab(tab.id)"
        :is-selected="tab.isSelected"
        >{{ tab.tabName }}</RoundTabs
      >
    </template>
  </div>
  <PopupLarge is-open useCloseButton> asd </PopupLarge>


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


--->
  <div class="manage_head-form">
    <div class="manage_setting-area">
      <ul
        class="manage_setting-list"
        v-if="!props.onlySearch"
        :class="[
          props.fileTypeData ? '!gap-[1.2rem]' : '',
          props.checkBoxList ? '!gap-[1rem]' : '',
        ]"
      >
        <li
          class="manage_setting-node"
          :class="[
            props.fileTypeData ? '!gap-[1.4rem]' : '',
            props.checkBoxList ? '!gap-[1rem]' : '',
          ]"
        >
          <div class="select-wrap" v-if="props.registeredDate">
            <DropdownSelect
              :select-list="props.registeredDate.listData"
              :default-select="props.registeredDate.defaultSelect"
              :class="props.checkBoxList ? ' !w-[10rem]' : ''"
              class-bind="!min-w-[auto] !w-[10.7rem]"
            ></DropdownSelect>
          </div>
          <div class="select-wrap">
            <CalenderGroup />
          </div>
        </li>
        <li
          class="manage_setting-node"
          :class="[
            props.fileTypeData ? '!pl-[1.2rem]' : '',
            props.checkBoxList ? '!pl-[1rem] !gap-[0.8rem]' : '',
          ]"
        >
          <div class="select-wrap" v-if="props.visibilityData">
            <span v-html="props.visibilityData.cate"></span>
            <DropdownSelect
              :select-list="props.visibilityData.listData"
              :default-select="props.visibilityData.defaultSelect"
              :class="[
                props.fileTypeData
                  ? '!min-w-[auto] !w-[12.1rem] '
                  : '!min-w-[auto] !w-[10.7rem]',
                props.checkBoxList ? '!w-[9rem]' : '',
              ]"
            ></DropdownSelect>
          </div>
          <div class="select-wrap" v-if="props.applicationData">
            <span v-html="props.applicationData.cate"></span>
            <DropdownSelect
              :select-list="props.applicationData.listData"
              :default-select="props.applicationData.defaultSelect"
              :class="[
                props.fileTypeData
                  ? '!min-w-[auto] !w-[9.5rem] drop-width-120'
                  : '!min-w-[auto] !w-[10.7rem]',
                props.checkBoxList ? '!w-[9rem]' : '',
              ]"
            ></DropdownSelect>
          </div>
          <div class="select-wrap" v-if="props.serviceData">
            <span v-html="props.serviceData.cate"></span>
            <DropdownSelect
              :select-list="props.serviceData.listData"
              :default-select="props.serviceData.defaultSelect"
              :class="[
                props.fileTypeData
                  ? '!min-w-[auto] !w-[9.5rem] drop-width-120'
                  : '!min-w-[auto] !w-[10.7rem]',
                props.checkBoxList ? '!w-[9rem]' : '',
              ]"
            ></DropdownSelect>
          </div>
          <div class="select-wrap" v-if="props.fileTypeData">
            <span v-html="props.fileTypeData.cate"></span>
            <DropdownSelect
              :select-list="props.fileTypeData.listData"
              :default-select="props.fileTypeData.defaultSelect"
              :class-bind="
                props.fileTypeData
                  ? '!min-w-[auto] !w-[9.5rem] drop-width-120'
                  : '!min-w-[auto] !w-[10.7rem]'
              "
            ></DropdownSelect>
          </div>
        </li>
        <li
          class="manage_setting-node !pl-[1rem] !gap-[1rem]"
          v-show="props.checkBoxList"
        >
          <div class="flex gap-[1rem]">
            <CheckBox
              v-for="item in props.checkBoxList"
              :key="item.id"
              :check-list="item.checkList"
              :id="item.checkId"
              :shape-type="'square'"
              :name="item.checkId"
              >{{ item }}</CheckBox
            >
          </div>
        </li>
      </ul>
      <div
        class="flex gap-[1.4rem]"
        :class="[
          props.onlySearch ? 'gap-[2.6rem]' : '',
          props.noReset ? '!gap-[1.4rem]' : '',
        ]"
      >
        <div
          v-if="props.onlySearch && props.onlySearch & !props.noCalender"
          class="select-wrap"
        >
          <CalenderGroup />
        </div>
        <SearchInput
          v-model="dummyInputValue"
          placeholder="검색어를 입력해주세요"
          size="medium"
          style-type="square"
          color-type="gray"
          class-bind="flex-1"
        />
        <div class="btn-area">
          <RoundButton
            class="shrink-0"
            component="button"
            color-type="filed"
            size="medium"
            >검색</RoundButton
          >
          <RoundButton
            v-if="!props.noReset"
            class="shrink-0 !bg-transparent"
            component="button"
            color-type="outlined"
            size="medium"
            >초기화</RoundButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';

const dummyInputValue = ref('');
const props = defineProps({
  formData: {
    type: Array,
    default: () => [],
  },
  registeredDate: {
    type: Object,
    default: null,
  },
  visibilityData: {
    type: Object,
    default: null,
  },
  applicationData: {
    type: Object,
    default: null,
  },
  serviceData: {
    type: Object,
    default: null,
  },
  fileTypeData: {
    type: Object,
    default: null,
  },
  listData: {
    type: Array,
    default: () => [],
  },
  checkBoxList: {
    type: Object,
    default: null,
  },
  defaultSelect: {
    type: String,
    default: '',
  },
  onlySearch: {
    type: Boolean,
    default: false,
  },
  noCalender: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
  noReset: {
    type: String,
    default: '',
  },
});
</script>
<style scoped>
.manage_head-form {
  background: #f6f6f6;
  padding: 2.6rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 10rem;
}

.template__title + .manage_head-form {
  margin-top: 7.2rem;
}

.manage_setting-list,
.manage_setting-node {
  display: flex;
  align-items: center;
}

.manage_setting-list {
  gap: 3.2rem;
  margin-bottom: 2.6rem;
}

.manage_setting-node {
  gap: 2rem;
  position: relative;
}

.manage_setting-node + .manage_setting-node {
  padding-left: 3.2rem;
}

.manage_setting-node + .manage_setting-node:after {
  content: '';
  display: block;
  width: 1px;
  height: 4.6rem;
  position: absolute;
  background: var(--color-gray-ddd);
  top: 50%;
  transform: translateY(-50%);
  left: 0;
}

.select-wrap {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 2rem;
}
.btn-area {
  display: flex;
  gap: 1.4rem;
}
.manage_setting-node > .select-wrap > span {
  font-size: 1.4rem;
  font-weight: bold;
}
</style>
