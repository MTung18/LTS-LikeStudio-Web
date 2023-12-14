<template>
  <TemplateBoardWrap title="매장 VMD" container-size="full">
    <ul class="category__list">
      <li v-for="category in categoryList" :key="category.id" class="category__item">
        <Tabs type="withIcon" use-icon :is-selected="category.id == currentCategory ? true : false"
          @click="setCurrentCategory(category.id)">
          {{ category.value }}
        </Tabs>
      </li>
    </ul>
    <div class="search-wrap">
      <SearchInput v-model="dummyInputValue" placeholder="검색어를 입력해주세요" size="large" style-type="rounded"
        color-type="black" @keydown.enter="handleSearch" />
    </div>
    <div class="template__body" v-if="listVmd.list">
      <CategoryPaginationSideBar :data="listVmd.list" :currentPage="currentPage" :pageNumber="totalPages"
        @numberPage="navigate" @vmdId="idOfVMD" />
      <div class="content" v-if="vmdDetail">
        <div class="content__head">
          <h3 class="content__head-title" v-if="vmdDetail">{{ vmdDetail.title }}</h3>
          <div class="content__head__action" v-if="vmdDetail.vmdFileList">
            <CheckBox :check-list="'전체 선택'" :id="'no'" :shape-type="'square'" :name="'all'" v-model="allCheck"
              @change="handleAllCheck"></CheckBox>
            <RoundButton component="button" color-type="filed" size="medium" @click="downloadFiles">다운로드</RoundButton>
          </div>
        </div>
        <div class="content__list" v-if="vmdDetail.vmdFileList">
          <div v-if="vmdDetail" v-for="item in vmdDetail.vmdFileList" :key="item.id" class="content__item">
            <CheckBox :id="`no${item.id}`" :shape-type="'square'" :name="'content'" :model-value="item.isChecked"
              @click="handleCheck(item)" class="content__check-box"></CheckBox>
            <figure class="content__item-img">
              <img v-if="['jpg', 'jpeg', 'png', 'gif'].includes(item.fileType)" :src="`${getImageUrl(item.uniqFileName)}`"
                alt="Example Image" />
              <Icons v-else-if="item.fileType === 'xls'" icon-name="psd" icon-color="transparent" :width="7.4"
                :height="7.4" class="content__item-icon" />
              <Icons v-else-if="item.fileType === 'ai'" icon-name="ai" icon-color="transparent" :width="7.4" :height="7.4"
                class="content__item-icon" />
              <Icons v-else-if="item.fileType === 'pdf'" icon-name="pdf" icon-color="transparent" :width="7.4"
                :height="7.4" class="content__item-icon" />
              <Icons v-else-if="item.fileType === 'pptx'" icon-name="etc" icon-color="transparent" :width="7.4"
                :height="7.4" class="content__item-icon" />
              <Icons v-else-if="item.fileType === 'zip'" icon-name="zip" icon-color="transparent" :width="7.4"
                :height="7.4" class="content__item-icon" />
              <Icons v-else-if="item.fileType === 'xlsx'" icon-name="text" icon-color="transparent" :width="7.4"
                :height="7.4" class="content__item-icon" />
              <Icons v-else-if="item.fileType === 'mp4' || item.fileType === 'mp3'" icon-name="audio"
                icon-color="transparent" :width="7.4" :height="7.4" class="content__item-icon" />
              <Icons v-else-if="item.fileType === 'video'" icon-name="video" icon-color="transparent" :width="7.4"
                :height="7.4" class="content__item-icon" />
            </figure>
            <div class="content__item-text-box">
              <p class="content__item-file-name">{{ item.oriFileName }}</p>
              <span class="content__item-date">{{ moment(item.createDate).format("YYYY.MM.DD") }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <TemplateDataNone />
        </div>
      </div>
    </div>
    <template v-else>
      <TemplateDataNone />
    </template>
  </TemplateBoardWrap>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment';

import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import CategoryPaginationSideBar from '@/components/CategoryPaginationSideBar/CategoryPaginationSideBar.vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import Icons from '@/components/Icons/Icons.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import { categoryStore } from '../../stores/categoryStore';
import { storeToRefs } from 'pinia';
import { vmdStore } from '../../stores/vmdStore';
import { vmdFileStore } from '../../stores/vmdFileStore';
import utils from '@/untils/utils';
import customToast from '@/untils/custom_toast';

const store = vmdStore();
const cateStore = categoryStore();
const fileStore = vmdFileStore();
const { listOfVmdUser, vmdById } = storeToRefs(store);
const { listCategory } = storeToRefs(cateStore);
const { responseDownloadFile, responseLoadImg } = storeToRefs(fileStore);

const categoryList = ref([]);
const currentCategory = ref(14);
const functionType = 3;
const dummyInputValue = ref('');
const listVmd = ref([]);
const vmdDetail = ref();
const currentPage = ref();
const totalPages = ref();
const fileType = ref();
const allCheck = ref(false);

async function navigate(newPage) {
  await getListVmd(currentCategory.value, dummyInputValue.value, newPage);
}

async function idOfVMD(id) {
  await getVmdById(id)

}
const getListCategory = async () => {
  await cateStore.getListCategory(functionType)
  categoryList.value = listCategory.value;
}

async function setCurrentCategory(param) {
  currentCategory.value = param
  await getListVmd(currentCategory.value, dummyInputValue.value, 1)
}

const handleAllCheck = () => {
  vmdDetail.value.vmdFileList = vmdDetail.value.vmdFileList.map((item) => (
    {
      ...item,
      isChecked: allCheck.value
    }
  ));
};

const handleCheck = (file) => {
  const fileVmd = vmdDetail.value.vmdFileList.find(item => item.id === file.id)
  if (fileVmd) {
    const checkOne = fileVmd.isChecked
    fileVmd.isChecked = !checkOne;
  }
}

const downloadFiles = async () => {
  const selectedFiles = vmdDetail.value.vmdFileList.filter(file => file.isChecked);
  const filePaths = ref([]);
  selectedFiles.forEach(file => {
    const convertedPath = file.uniqFileName.replace(/\\/g, '/');
    const finalString = convertedPath.replace(/\/+/g, '/');
    filePaths.value.push(finalString)
  });

  try {
    await fileStore.downloadFile(filePaths.value)

    const blob = new Blob([responseDownloadFile.value]);

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'files.zip';
    link.click();

    customToast.success('Successfully downloaded file');
  } catch (error) {
    console.error('Error while downloading file', error);
    customToast.error('Error while downloading file');
  }
};

const handleSearch = async () => {
  await getListVmd(currentCategory.value, dummyInputValue.value, 1);
};

const imageUrl = ref()

const getImageUrl = async (name) => {
  const parts = name.replace(/\\/g, '/');

  try {
    await fileStore.loadImg(parts);
    const blob = new Blob([responseLoadImg.value]);
    imageUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error loading image:', error);
  }
  return imageUrl.value;
};


async function getListVmd(category, keyword, page) {
  await store.getAllVmdForUser(category, keyword, page)
  if (listOfVmdUser.value) {
    listVmd.value = listOfVmdUser.value;
    currentPage.value = listOfVmdUser.value.currentPage;
    totalPages.value = listOfVmdUser.value.totalPages;
  } else {
    listVmd.value = null;
  }
}

async function getVmdById(id) {
  await store.getById(id)

  vmdDetail.value = vmdById.value.data;
  if (vmdDetail.value.vmdFileList) {
    const fileTypes = await Promise.all(vmdDetail.value.vmdFileList.map(item => utils.getFileType(item.oriFileName)));
    fileType.value = fileTypes;
    vmdDetail.value.vmdFileList = vmdDetail.value.vmdFileList.map((detail, index) => ({
      ...detail,
      fileType: fileTypes[index],
      isChecked: allCheck.value
    }));
  }
}

onMounted(async () => {
  await getListCategory()
  await getListVmd(currentCategory.value, "", 1);
  await getVmdById(listVmd.value.list[0].id)
});
</script>

<style scoped>
.category__list {
  display: flex;
  justify-content: center;
  gap: 0 4rem;
  margin: 4rem 0;
}

.search-wrap {
  text-align: center;
}

.template__body {
  position: relative;
  display: flex;
  gap: 0 4rem;
  padding-top: 8rem;
}

.content {
  min-width: 0;
  flex: 1;
}

.content__head-title {
  margin-bottom: 2.4rem;
  font-size: var(--ttl-l);
  font-weight: 700;
}

.content__head__action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content__list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5rem 3rem;
  margin-top: 2.4rem;
}

.content__item {
  position: relative;
}

.content__check-box {
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 1;
}

.content__item-img {
  position: relative;
  background-color: #f4f4f4;
  height: 0;
  padding-bottom: 67.16417%;
  overflow: hidden;
}

.content__item-img>img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.content__item .content__item-text-box {
  margin-top: 1.8rem;
  word-break: break-all;
}

.content__item-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.content__item-file-name {
  font-size: var(--fz-m);
  font-weight: 500;
}

.content__item-date {
  display: inline-block;
  margin-top: 0.8rem;
  font-size: var(--fz-s);
  color: var(--color-gray-777);
}
</style>