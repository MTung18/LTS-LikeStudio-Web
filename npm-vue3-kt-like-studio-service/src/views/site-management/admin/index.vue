<!--
  231109 : 사용자 등록 팝업에 테이블 마크업이나 로직이 변경 될 수 있음
-->
<template>
  <TemplateBoardWrap title="관리자 권한">
    <div class="search-filter">
      <div class="search-filter__bottom">
        <SearchInput v-model="dummyInputValue" placeholder="검색어를 입력해주세요" size="medium" style-type="square"
          color-type="gray" class="flex-1 mr-[1.4rem]" />
        <RoundButton component="button" color-type="filed" size="medium" class="mr-[1.4rem]" @click="searchByKeyword()">검색
        </RoundButton>
        <RoundButton component="button" color-type="outlined" size="medium" @click="resetSearch">초기화</RoundButton>
      </div>
    </div>

    <div class="select-wrap flex justify-end">
      <RoundButton component="button" color-type="filed" size="medium" @click="popupUserSelectIsOpen = true">등록
      </RoundButton>
    </div>
    <div v-if="tableData" class="manage_list-wrap">
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
            <tr v-for="item in tableData.list" :key="item.id">
              <td class="num">{{ item.no }}</td>
              <td>{{ item.userId }}</td>
              <td class="title">
                {{ item.username }}
              </td>
              <td>{{ item.departmentName }}</td>
              <td>
                <DropdownSelect :selectList="roles" @select="handleSelect(item.id, $event)" :selected="item.roleName">
                </DropdownSelect>
              </td>
              <td class="date">{{ moment(item.createDate).format("YYYY.MM.DD HH:mm") }}</td>
              <td>
                <RoundButton component="button" color-type="lightOutlined" size="small"
                  class-bind="!font-normal !inline-flex !items-center gap-[0.8rem] leading-none">
                  <Icons icon-name="delete_bold" icon-color="var(--color-neutrals-black)" :width="1.4" :height="1.4" @click="handleEditDelete(item.id)"/>삭제
                </RoundButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <TemplateDataNone />
    </div>
    <Pagination v-if="tableData.list && tableData.list.length > 0" :currentPage="currentPage" :pageNumber="totalPages"
      @numberPage="navigate" />
  </TemplateBoardWrap>
  <PopupAdminUserSelect :is-open="popupUserSelectIsOpen" @close-button="popupUserSelectIsOpen = false" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import PopupAdminUserSelect from '@/containers/site-management/admin/PopupAdminUserSelect/PopupAdminUserSelect.vue';

import { permisstionStore } from '../../../stores/permisstionStore';
import { storeToRefs } from 'pinia';
import customToast from '@/untils/custom_toast';

const store = permisstionStore()
const { listPermisstion, listRole, updateRes } = storeToRefs(store)

const popupUserSelectIsOpen = ref(false)
const dummyInputValue = ref('')
const tableData = ref([])
const currentPage = ref()
const totalPages = ref()
const idOfRole = ref()
const roles = ref([])
const dataPermiss = ref({})

const searchByKeyword = async () => {
  await getListPermisstion(dummyInputValue.value, 1);
};

async function resetSearch() {
  dummyInputValue.value = "";
  await getListPermisstion(dummyInputValue.value, 1);
}

const handleEditDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete?')) {
    await store.deleteDataById(id)
    router.push(`/site-management/admin`)
    customToast.success('Successfully delete')
  }
};

const handleSelect = async (id, selectedOption) => {
  idOfRole.value = selectedOption.id
  dataPermiss.value = {
    id: id,
    roleId: idOfRole.value,
    userIdImpact: 1
  }

  await store.update(dataPermiss.value)
  if (updateRes.value.statusCode == 1) {
    setTimeout(function () {
      customToast.success('글을 수정했습니다.');
    }, 500)
  }
};

async function navigate(newPage) {
  await getListPermisstion(dummyInputValue.value, newPage);
}

async function getListPermisstion(keyword, page) {
  await store.getAllPermisstion(keyword, page)
  if (listPermisstion.value) {
    tableData.value = listPermisstion.value;
    currentPage.value = tableData.value.currentPage;
    totalPages.value = tableData.value.totalPages;
    tableData.value.list = tableData.value.list.sort((a, b) => b.id - a.id)
      .map((item, index, array) => ({
        ...item,
        no: array.length - index
      }));
  } else {
    tableData.value = null
  }
}

async function getListRole() {
  await store.getListRole()
  roles.value = listRole.value
}

onMounted(async () => {
  await getListPermisstion("", 1)
  await getListRole()
});

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
  overflow: visible;
}

.manage_table-wrap {
  overflow: visible;
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

.search-filter__top+.search-filter__bottom {
  margin-top: 2.6rem;
}
</style>
