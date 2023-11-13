<template>
  <TemplateBoardWrap title="공지사항">
    <CustomerSearchWrap>
      <SearchInput v-model="dummyInputValue" placeholder="검색어를 입력해주세요" size="medium" style-type="square" color-type="gray"
        class-bind="!min-w-[41.2rem]" />
      <RoundButton component="button" color-type="filed" size="medium" @click="searchByKeyword()">검색
      </RoundButton>
    </CustomerSearchWrap>
    <template v-if="dummyList.list && dummyList.list.length > 0">
      <div class="list">
        <RouterLink v-for="item in dummyList.list" :key="item.id" :to="`/customer-service/announcements/${item.id}`"
          class="list__item">
          <div class="item-no">{{ item.rowNumber }}</div>
          <div class="item-title flex items-center justify-between gap-5" :class="item.isNotice && 'is-notice'">
            <div v-if="item.gim" class="notice-wrap">
              <Icons :width="2" :height="2" icon-name="pin" />
              공지
            </div>
            <span class="item-title-text">{{ item.title }}</span>
          </div>
          <div class="item-date">{{ moment(item.createDate).format("YYYY.MM.DD HH:mm") }}</div>
        </RouterLink>
      </div>
      <Pagination :currentPage="currentPage" :pageNumber="totalPages" @numberPage="navigate" />
    </template>
    <template v-else>
      <TemplateDataNone />
    </template>
  </TemplateBoardWrap>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment';

import CustomerSearchWrap from '@/components/CustomerSearchWrap/CustomerSearchWrap.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import { noticeBoardStore } from '../../../stores/noticeBoardStore';
import { storeToRefs } from 'pinia';

const store = noticeBoardStore();
const { listOfNoticeUser } = storeToRefs(store);
const dummyInputValue = ref('');
const dummyList = ref([]);
const currentPage = ref();
const totalPages = ref();

async function getListNotice(keyword, page) {
  await store.getAllNoitceForUser(keyword, page)
  dummyList.value = listOfNoticeUser.value;
  currentPage.value = dummyList.value.currentPage;
  totalPages.value = dummyList.value.totalPages;
}

const searchByKeyword = async () => {
  await getListNotice(dummyInputValue.value, 1);
};

async function navigate(newPage) {
  await getListNotice(dummyInputValue.value, newPage);
}

onMounted(async () => {
  await getListNotice("", 1);
});
</script>

<style scoped>
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

.notice-wrap {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
  height: 3.8rem;
  line-height: 3.8rem;
  padding: 0 1.6rem;
  border: 1px solid #fde4e5;
  background-color: #fef1f2;
  border-radius: 5.6rem;
  font-size: var(--fz-m);
  font-weight: 700;
  color: var(--color-primary);
}

.item-date {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}
</style>
