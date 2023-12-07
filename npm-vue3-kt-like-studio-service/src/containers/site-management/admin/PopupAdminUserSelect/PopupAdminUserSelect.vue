<template>
  <PopupMedium :is-open="props.isOpen" :useCloseButton="true" popupTitle="사용자 선택" @close-button="handleClose">
    <div class="setting-head">
      <CustomerSearchWrap>
        <SearchInput v-model="dummyInputValue" placeholder="검색어를 입력해주세요" size="medium" style-type="square"
          color-type="gray" class-bind="!min-w-[41.2rem]" />
        <RoundButton component="button" color-type="filed" size="medium" @click="searchUser()">검색
        </RoundButton>
      </CustomerSearchWrap>
    </div>
    <div class="setting-body">
      <div class="manage_list-wrap">
        <div v-if="tableData" class="manage_table-wrap">
          <table>
            <thead>
              <tr>
                <th width="110px">사번</th>
                <th width="90px">이름</th>
                <th>소속</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData.list" :key="item.id">
                <td>{{ item.id }}</td>
                <td class="title" @click="addPermisstion(item.id)">{{ item.username }}</td>
                <td>{{ item.departmentName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <TemplateDataNone />
        </div>
      </div>
      <Pagination v-if="tableData.list && tableData.list.length > 0" :currentPage="currentPage" :pageNumber="totalPages"
        @numberPage="navigate" />
    </div>

    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]" v-if="tableData1 && tableData1.length > 0">
      <Button @click="handleClose" component="button" color-type="outlined" size="small">취소</Button>
      <Button component="button" color-type="primary" size="small">업로드</Button>
    </div>
  </PopupMedium>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import RoundButton from '@/components/RoundButton/RoundButton.vue';
import CustomerSearchWrap from '@/components/CustomerSearchWrap/CustomerSearchWrap.vue';
import Button from '@/components/Button/Button.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

import { permisstionStore } from '../../../../stores/permisstionStore';
import { storeToRefs } from 'pinia';
import customToast from '@/untils/custom_toast';

const store = permisstionStore()
const { listUser, createRes } = storeToRefs(store)

const tableData = ref([])
const currentPage = ref()
const totalPages = ref()
const dummyInputValue = ref("")
const dataPermiss = ref({})

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const searchUser = async () => {
  await getListUser(dummyInputValue.value, 1);
}

async function addPermisstion(id) {
  dataPermiss.value = {
    userId: id,
    userIdImpact: "1"
  }
  await store.addPermisstion(dataPermiss.value)
  if (createRes.value.statusCode == 1) {
    setTimeout(function () {
      customToast.success('글을 수정했습니다.');
    }, 500)
  }
}

async function navigate(newPage) {
  await getListUser(dummyInputValue.value, newPage);
}

async function getListUser(keyword, page) {
  await store.getAllUser(keyword, page)
  if (listUser.value) {
    tableData.value = listUser.value;
    currentPage.value = tableData.value.currentPage;
    totalPages.value = tableData.value.totalPages;
  } else {
    tableData.value = null
  }
}

onMounted(async () => {
  await getListUser("", 1);
});

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped>
.manage_list-wrap table tbody td {
  font-weight: 400;
}

.setting-head {
  padding-bottom: 2.4rem;
}

.setting-body {}

.depth-list {
  display: flex;
  gap: 0.6rem;
}

.depth-list>li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.radio-area {
  display: flex;
  align-items: center;
  padding: 2.5rem 0;
  border-top: 1px solid var(--color-gray-ddd);
  border-bottom: 1px solid var(--color-gray-ddd);
  margin-top: 2.4rem;
}

.radio-area .cate {
  font-size: 1.4rem;
  font-weight: bold;
  flex-basis: 10rem;
}

.radio-list {
  display: flex;
  align-items: center;
  gap: 3rem;
}

:deep(.manage_head-form) {
  margin-bottom: 0;
}
</style>
