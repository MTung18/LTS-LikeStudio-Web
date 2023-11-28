<template>
  <TemplateBoardWrap title="공지사항 관리">
    <ManageHeadForm :input-data1="inputData1" :input-data2="inputData2" :input-data3="inputData3"
      :input-data4="inputData4" :only-search="true" @search="searchNotice" @reset="reset"/>

    <div class="select-wrap flex justify-between">
      <div class="flex gap-[0.8rem] items-center">
        <p class="drop-txt">메인팝업</p>
        <DropdownSelect :selectList="optionList.listData" :dselectefault-="optionList.defaultSelect"
          @select="handleSelect"></DropdownSelect>
      </div>
      <RoundButton component="a" href="/site-management/announcements/create" color-type="filed" size="medium">등록
      </RoundButton>
    </div>
    <div class="manage_list-wrap">
      <div class="manage_table-wrap">
        <template v-if="tableData == null">
          <TemplateDataNone />
        </template>
        <table v-else>
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
          <tbody>
            <tr v-for="item in tableData.list" :key="item.id">
              <td class="num">{{ item.rowNumber }}</td>
              <td class="title !text-left">
                <RouterLink :to="`/site-management/announcements/${item.id}/edit`">
                  <span class="notice-badge" v-if="item.gim">
                    <Icons :width="2" :height="2" icon-name="pin" icon-color="initial" />공지
                  </span>
                  <p v-if="item.notice" class="notice-txt">{{ item.title }}</p>
                  <p v-if="!item.notice" class="title-txt">{{ item.title }}</p>
                </RouterLink>
              </td>

              <td v-if="item.popup == 0">N</td>
              <td v-else="item.popup == 1">y</td>
              <td v-if="item.show == 0">N</td>
              <td v-else="item.show == 1">y</td>
              <td>{{ item.createUser }}</td>
              <td class="date">{{ moment(item.createDate).format("YYYY.MM.DD HH:mm") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination v-if="tableData != null" :currentPage="currentPage" :pageNumber="totalPages" @numberPage="navigate" />
  </TemplateBoardWrap>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import { noticeBoardStore } from '@/stores/noticeBoardStore';
import { storeToRefs } from 'pinia';

const optionList = {
  defaultSelect: '전체',
  listData: [
    {
      id: 0,
      value: '로그인1',
    },
    {
      id: 1,
      value: '로그인2',
    }
  ],
};

const store = noticeBoardStore();
const { listOfNoticeAdmin } = storeToRefs(store);
const tableData = ref([]);
const currentPage = ref();
const totalPages = ref();
const dummyInputValue = ref('');
const fromDateValue = ref('');
const toDateValue = ref('');
const selectedOptionValue = ref('');

async function getListNotice(keyword, dateParamStart, dateParamEnd, popup, page) {
  await store.getAllNoitceForAdmin(keyword, dateParamStart, dateParamEnd, popup, page)
  if (listOfNoticeAdmin.value) {
    tableData.value = listOfNoticeAdmin.value;
    currentPage.value = tableData.value.currentPage;
    totalPages.value = tableData.value.totalPages;
  } else {
    tableData.value = null;
  }
}

async function searchNotice(dummyInput, fromDate, toDate) {
  dummyInputValue.value = dummyInput;
  fromDateValue.value = fromDate;
  toDateValue.value = toDate
  await getListNotice(dummyInputValue.value, fromDateValue.value, toDateValue.value, selectedOptionValue.value, 1);
}

async function navigate(newPage) {
  await getListNotice(dummyInputValue.value, fromDateValue.value, toDateValue.value, selectedOptionValue.value, newPage);
}

const handleSelect = async (selectedOption) => {
  selectedOptionValue.value = selectedOption.id;
  await getListNotice(dummyInputValue.value, fromDateValue.value, toDateValue.value, selectedOptionValue.value, 1)
};

onMounted(async () => {
  await getListNotice("", "", "", "", 1);
});

async function reset() {
  await getListNotice("", "", "", "", 1);
}
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

.manage_list-wrap table tbody td.title a>p {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.manage_list-wrap table tbody td.title a>p.notice-txt {
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

.search-filter {
  max-width: 1200px;
  padding: 2.6rem;
  margin: 7.2rem auto 7.2rem;
  background-color: #f6f6f6;
}

.search-filter__bottom {
  display: flex;
}

.search-filter__top+.search-filter__bottom {
  margin-top: 2.6rem;
}
</style>
