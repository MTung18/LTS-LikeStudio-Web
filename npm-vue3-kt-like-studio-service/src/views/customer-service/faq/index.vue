<template>
  <TemplateBoardWrap title="FAQ">
    <ul class="category__list">
      <li v-for="category in categories" :key="category.key" class="category__item">
        <Tabs type="underbar" use-icon :is-selected="category.key == currentCategory ? true : false" 
        @click="setCurrentCategory(category.key)">
          {{ category.value }}
        </Tabs>
      </li>
    </ul>
    <CustomerSearchWrap>
      <SearchInput v-model="dummyInputValue" placeholder="검색어를 입력해주세요" size="medium" style-type="square" color-type="gray"
        class-bind="!min-w-[41.2rem]" />
      <RoundButton component="button" color-type="filed" size="medium" @click="search()">검색
      </RoundButton>
    </CustomerSearchWrap>
    <div v-if="listDataQuestion.data == null">
          <TemplateDataNone />
    </div>
    <div class="list" v-else>
      <div class="list__item" v-for="(data) in listDataQuestion.data.list" :key="data.id">
        <div class="item__question-wrap">
          <span class="question__symbol">Q.</span>
          <span class="question__title">{{ data.title }}</span>
          <IconButton v-if="!showDropdown[data.id]" class="text-right" class-bind="question__icon" icon-name="chevron_b"
            size="small" @click="toggleDropdown(data.id)" type="outlined" component="button" />
          <IconButton v-else class="text-right rotate-180" class-bind="question__icon" icon-name="chevron_b" size="small"
            @click="closeToggleDropdown(data.id)" type="outlined" component="button" />
        </div>
        <div :id="data.id" class="item__answer-wrap" v-if="showDropdown[data.id]">
          <div class="answer__wrap">
            <div class="answer__area">
              <div class="answer__symbol">A</div>
              <div class="answer__content">
                <div class="answer__content-text">
                  <div v-html="data.content"></div>
                </div>
                <div class="answer__content-file">
                  <p class="mb-6 text-xl text-slate-950 font-bold">첨부파일</p>
                  <FileDownload class-bind="!mt-0" v-for="item in data.fileManagerList" :key="item.id" :files="[
                    { id: item.id, filename: item.oriFileName, filePath: item.uniqFileName },
                  ]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination :currentPage="currentPage" :pageNumber="totalPages" @numberPage="navigate" />
    </div>
  </TemplateBoardWrap>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import CustomerSearchWrap from '@/components/CustomerSearchWrap/CustomerSearchWrap.vue';
import FileDownload from '@/components/FileDownload/FileDownload.vue';
import IconButton from '@/components/IconButton/IconButton.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import { faqStore } from '../../../stores/faqStore';
import { categoryStore } from '../../../stores/categoryStore';
import { storeToRefs } from 'pinia';

const store = faqStore();
const cateStore = categoryStore();
const { listOfFaqUser } = storeToRefs(store);
const { listCategory } = storeToRefs(cateStore);

const dummyInputValue = ref('');
const categories = ref([]);
const listDataQuestion = ref([]);
const currentCategory = ref(1);
const currentPage = ref();
const totalPages = ref();

const functionType = 1;

async function setCurrentCategory(param) {
  currentCategory.value = param
  await getListFaq('', currentCategory.value, '')
}

const showDropdown = ref(Array(listDataQuestion.value.length).fill(false));

const toggleDropdown = async (index) => {
  showDropdown.value[index] = !showDropdown.value[index];
  await gitListFile(functionType, index);
};

const closeToggleDropdown = (index) => {
  showDropdown.value[index] = !showDropdown.value[index];
};

const getListCategory = async () => {
  await cateStore.getListCategory(functionType)
  categories.value = listCategory.value;
}

async function getListFaq(keyword, category, page) {
  await store.getListFaqForUser(keyword, category, page)
  if (listOfFaqUser.value) {
    listDataQuestion.value = listOfFaqUser.value;
    currentPage.value = listDataQuestion.value.data.currentPage;
    totalPages.value = listDataQuestion.value.data.totalPages;
  } else {
    listDataQuestion.value = null;
  }
}

const search = async () => {
  await getListFaq(dummyInputValue.value, currentCategory.value, 1)
}

async function navigate(newPage) {
  await getListFaq(dummyInputValue.value, currentCategory.value, newPage);
}

onMounted(async () => {
  await getListCategory()
  await getListFaq("", currentCategory.value , 1);
});
</script>

<style scoped>
.category__list {
  display: flex;
  justify-content: center;
  gap: 0 4rem;
  margin: 4rem 0;
}

.list__item {
  border-bottom: 1px solid var(--color-gray-ddd);
}

.item__question-wrap {
  display: flex;
  align-items: center;
  padding: 3rem 0;
  cursor: pointer;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}

.question__symbol {
  margin-right: 1rem;
  font-size: var(--fz-xl);
  font-weight: 700;
}

.question__title {
  font-size: var(--fz-l);
  font-weight: 700;
}

.question__icon {
  margin-left: auto;
}

.list__item[open] .question__icon {
  transform: rotate(180deg);
}

.answer__wrap {
  padding-bottom: 3rem;
}

.answer__area {
  display: flex;
  gap: 0 1rem;
  padding: 2.4rem;
  background-color: #f6f6f6;
  border-radius: 2.4rem;
}

.answer__symbol {
  font-size: var(--fz-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.answer__content {
  flex-grow: 1;
  padding-right: 2.4rem;
}

.answer__content-text {
  font-size: var(--fz-l);
}

.answer__title {
  font-weight: 700;
}

.answer__desc-list {
  margin-top: 4rem;
}

.answer__desc-item+.answer__desc-item {
  margin-top: 4rem;
}

.answer__desc-title {
  font-weight: 700;
}

.answer__desc-text {
  font-weight: 400;
  color: var(--color-gray-444);
}

.answer__content-file {
  margin-top: 3.6rem;
  border-top: 1px solid #ead9ff;
}
</style>
