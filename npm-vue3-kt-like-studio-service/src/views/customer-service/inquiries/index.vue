<template>
  <TemplateBoardWrap title="1:1 문의" v-if="listData != ''">
    <div class="mt-[4rem] text-center">
      <Button class-bind="!min-w-[18rem]" component="a" href="/customer-service/inquiries/create" color-type="primary"
        size="big" isIcon>
        문의하기
        <Icons icon-name="arrow_next_bold" icon-color="var(--color-neutrals-white-100)" />
      </Button>
    </div>
    <CustomerSearchWrap>
      <CalenderGroup @fromDate="fromDate" @toDate="toDate" />
      <SearchInput v-model="inputValue" placeholder="검색어를 입력해주세요" size="medium" style-type="square" color-type="gray"
        class-bind="ml-auto !min-w-[41.2rem]" />
      <div class="search__button-group">
        <RoundButton component="button" color-type="filed" size="medium" @click="search()">검색</RoundButton>

        <RoundButton component="button" color-type="outlined" size="medium">초기화</RoundButton>
      </div>
    </CustomerSearchWrap>

    <div class="list">
      <RouterLink v-for="item in listData.list" :key="item.id" :to="`/customer-service/inquiries/${item.id}/${item.status == 1 ? 'answered' : 'unanswered'
        }`" class="list__item">
        <div class="item-no">{{ item.rowNumber }}</div>
        <div class="item-title">
          <span class="item-title-text">{{ item.title }}</span>
        </div>
        <div class="item-answer">
          <span v-if="item.status == 1" class="item-answer--complete">답변완료</span>
          <span v-else>답변대기</span>
        </div>
        <div class="item-date">
          {{ `${item.createDate.slice(0, 4)}.${item.createDate.slice(5, 7)}.${item.createDate.slice(8, 10)}
                    ${item.createDate.slice(11, 16)}` }}</div>
      </RouterLink>
    </div>
    <Pagination :currentPage="currentPage" :pageNumber="totalPages" @numberPage="navigate" />
    <!-- dev: 1:1 문의를 한적이 없을 때 -->
  </TemplateBoardWrap>
  <TemplateDataNone v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Button from '@/components/Button/Button.vue';
import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import CustomerSearchWrap from '@/components/CustomerSearchWrap/CustomerSearchWrap.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import { storeToRefs } from 'pinia';
import { lsSupportManagerStore } from '@/stores/lsSupportManagerStore';

const { lsSupportManagerListForUser } = storeToRefs(lsSupportManagerStore());
const listData = ref([])
const inputValue = ref('')
const currentPage = ref();
const totalPages = ref();
const fromDateValue = ref()
const toDateValue = ref()

const userId = 1

onMounted(async () => {
  await updatePage('', userId, '', '', '')
});
async function navigate(newPage) {
  await updatePage(inputValue.value, userId, '', '', newPage)
}
async function search() {
  let startDate = fromDateValue.value ? fromDateValue.value : ''
  let endDate = toDateValue.value ? toDateValue.value : ''
  await updatePage(inputValue.value, userId, startDate, endDate, '')
}
async function updatePage(keyword, userId, startDate, endDate, page) {
  await lsSupportManagerStore().getLsSupportManagerListForUser(keyword, userId, startDate, endDate, page);
  listData.value = lsSupportManagerListForUser.value;
  currentPage.value = listData.value.currentPage;
  totalPages.value = listData.value.totalPages;
}
async function fromDate(newValue) {
  fromDateValue.value = newValue
}
async function toDate(newValue) {
  toDateValue.value = newValue
}
</script>

<style scoped>
.search__button-group {
  display: flex;
  gap: 0 1rem;
  margin-left: 1.6rem;
}

.list {
  margin-bottom: 6rem;
}

.list__item {
  display: flex;
  align-items: center;
  gap: 0 2.6rem;
  height: 8.4rem;
  padding-left: 0.4rem;
  padding-right: 0.8rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.item-no {
  width: 2.6rem;
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.item-title {
  flex: 1;
  overflow: hidden;
}

.item-title.is-notice {
  display: flex;
  align-items: center;
  gap: 0 1.6rem;
}

.item-title.is-notice .item-title-text {
  font-weight: 700;
}

.item-title .item-title-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  font-size: var(--fz-l);
  line-height: 1;
}

.item-date {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.item-answer {
  font-size: var(--fz-l);
}

.item-answer .item-answer--complete {
  color: var(--color-primary);
}
</style>
