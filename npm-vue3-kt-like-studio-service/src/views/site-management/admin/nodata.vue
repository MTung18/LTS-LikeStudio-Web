<template>
  <TemplateBoardWrap title="관리자 권한">
    <div class="search-filter">
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

    <div class="select-wrap flex justify-end">
      <RoundButton component="button" color-type="filed" size="medium"
        >등록</RoundButton
      >
    </div>
    <div v-if="tableData && tableData.length > 0" class="manage_list-wrap">
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
          <tbody>
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
    </div>
    <div v-if="tableData && tableData.length <= 0">
      <TemplateDataNone />
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
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import PopupAdminUserSelectNodata from '@/containers/site-management/admin/PopupAdminUserSelect/PopupAdminUserSelectNodata.vue';

const popupUserSelectIsOpen = ref(true);
const tableData = [];
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
.manage_list-wrap {
  overflow: auto;
}
.manage_list-wrap table tbody td.title a {
  border-bottom: 0;
  line-height: 1;
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
