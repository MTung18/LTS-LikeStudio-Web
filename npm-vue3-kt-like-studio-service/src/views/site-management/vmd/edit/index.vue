<template>
  <TemplateEdit title="매장 VMD 관리">
    <template #body v-if="vmdByIdData.data">
      <div class="flex gap-x-[8rem]">
        <TemplateEditTextFields label="카테고리" required
          class-bind="relative before:absolute before:right-[-4rem] before:w-[1px] before:h-[4.6rem] before:bg-gray-gray-ddd before:content-['']">
          <DropdownSelect :select-list="categoriesData" :selected="vmdByIdData.data.categoryValue"
            @select="categorySelect" />
        </TemplateEditTextFields>
        <TemplateEditTextFields label="노출" required class-bind="items-center leading-none !border-b-0">
          <Switch :toggle="show" @someEvent="toggleShow" />
        </TemplateEditTextFields>
      </div>
      <TemplateEditTextFields :fields-id="inputId" label="제목" required>
        <TextFields v-bind="$attrs" :input-id="inputId" v-model="title" size="medium" placeholder="제목 입력"
          class-bind="w-full" />
      </TemplateEditTextFields>
      <TemplateEditTextFields label="첨부파일" class-bind="pt-[3.2rem] border-t-[1px] border-t-gray-gray-ddd">
        <TemplateEditFileFields @file-upload="handleFileUpload" @file-remove="handleFileRemove" :files="showFiles"
          file-caption-title="첨부파일은 최대 50개, 1개 파일당 100MB 이하의 아래 확장자만 업로드 가능합니다." fileMaxLength="50" :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg, jpeg , png , gif',
            '디자인 파일 : ai, psd',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
            '음성 파일 : mp3, wma',
          ]" />
      </TemplateEditTextFields>
      <TemplateEditInfo :hits="''" :last-modified-date="vmdByIdData.data.updateDate ? vmdByIdData.data.updateDate : ''"
        :modifier="vmdByIdData.data.editUserName ? vmdByIdData.data.editUserName : ''"
        :modifier-position="vmdByIdData.data.editorPosition ? vmdByIdData.data.editorPosition : ''"
        :createdDate="vmdByIdData.data.createDate" :writer="vmdByIdData.data.createUserName"
        :writerPosition="vmdByIdData.data.createrPosition" />
    </template>

    <template #foot>
      <div class="flex mt-[6rem] justify-center gap-x-[1rem]">
        <UIButton component="button" color-type="standard" size="large" class-bind="!min-w-[14rem]"
          @click="handleEditDelete">삭제</UIButton>
        <UIButton component="button" color-type="outlined" size="large" class-bind="!min-w-[14rem] !ml-auto"
          @click="handleEditToList">목록</UIButton>
        <UIButton component="button" color-type="primary" size="large" class-bind="!min-w-[14rem]" @click="update">수정
        </UIButton>
      </div>
    </template>
  </TemplateEdit>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditInfo from '@/components/TemplateEditInfo/TemplateEditInfo.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import customToast from '@/untils/custom_toast';
import utils from '@/untils/utils';
import { storeToRefs } from 'pinia';
import { vmdStore } from '@/stores/vmdStore';
import { categoryStore } from '@/stores/categoryStore';
import { fileManagerStore } from '@/stores/fileManagerStore';
import userId from '@/untils/loginUserId';

const router = useRouter();
const route = useRoute();

const { vmdById, updateRes, deleteRes } = storeToRefs(vmdStore())
const { listCategory } = storeToRefs(categoryStore())
const { responseUploadFile } = storeToRefs(fileManagerStore());
const responseUploadFileData = ref([]);
const vmdByIdData = ref([])
const categoriesData = ref([])
const currentCategory = ref()
const inputId = uuid();
const title = ref('');
const show = ref()
const files = ref([])
const showFiles = ref([])
const ARCHIVE_FILES = ['zip', '7z', 'alz', 'egg', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'ai', 'psd', 'mp4', 'wmv', 'asf', 'flv', 'mov', 'mpeg', 'mp3', 'wma'];
const maxSizeFile = 50;

onMounted(async () => {
  await vmdStore().getById(route.params.id)
  vmdByIdData.value = vmdById.value

  await categoryStore().getListCategory(3)
  categoriesData.value = listCategory.value

  if (vmdByIdData.value.data.vmdFileList !== null) {
    vmdByIdData.value.data.vmdFileList.forEach(e => {
      showFiles.value.push({ oriFileName: e.oriFileName, uniqFileName: e.uniqFileName, createUserId: userId })
    })
  }

  title.value = vmdByIdData.value.data.title
  show.value = vmdByIdData.value.data.show == 1 ? true : false
  currentCategory.value = vmdByIdData.value.data.category
})

function toggleShow(param) {
  show.value = param ? true : false;
}
function categorySelect(param) {
  currentCategory.value = param.id
}
async function update() {
  await uploadFiles()
  let param = {
    vmd: {
      id: vmdByIdData.value.data.id,
      title: title.value,
      category: currentCategory.value,
      show: show.value ? 1 : 0,
      updateUserId: userId
    },
    vmdFileList: showFiles.value
  }
  await vmdStore().update(param)
  if (title.value == '') customToast.error('title cannot be empty')
  if (updateRes.value.statusCode == 1) {
    router.push('/site-management/vmd');
    setTimeout(function () {
      customToast.success('글을 수정했습니다.');
    }, 500)
  }
}
async function uploadFiles() {
  if (files.value != '') {
    let uploadFileParam = new FormData();

    files.value.forEach(e => uploadFileParam.append('files', e))
    await fileManagerStore().uploadFile(uploadFileParam)
    responseUploadFileData.value = responseUploadFile.value

    if (vmdByIdData.value.data.vmdFileList) {
      let vmdFileListLength = vmdByIdData.value.data.vmdFileList.length
      responseUploadFileData.value.data.forEach((e, i) => showFiles.value[i + vmdFileListLength].uniqFileName = e.uniqFileName)
    } else {
      responseUploadFileData.value.data.forEach((e, i) => showFiles.value[i].uniqFileName = e.uniqFileName)
    }
  }
}
async function handleFileUpload(file) {
  const sizeInMB = file.size / (1024 * 1024);
  const typeFile = utils.getFileType(file.name);

  if (sizeInMB > maxSizeFile) {
    customToast.error('File size must be no more than 50MB.');
    return;
  }
  if (!ARCHIVE_FILES.includes(typeFile)) {
    customToast.error('This file type is not allowed for upload.');
    return;
  }
  if (showFiles.value.size == 10) {
    customToast.error('Maximum of 10 files.');
    return;
  }
  showFiles.value.push({ oriFileName: file.name, uniqFileName: '', createUserId: userId })
  files.value.push(file)
};

async function handleFileRemove(file) {
  showFiles.value.splice(file, 1)
  vmdByIdData.value.data.vmdFileList.splice(file, 1)
};

async function handleEditDelete() {
  if (window.confirm('Are you sure you want to delete')) {
    await vmdStore().deleteById(vmdByIdData.value.data.id)
    if (deleteRes.value.statusCode == 1) {
      router.push('/site-management/vmd')
      setTimeout(function () {
        customToast.success('successfully deleted')
      }, 500)
    } else {
      setTimeout(function () {
        customToast.error('failed to delete')
      }, 500)
    }
  }
};
const handleEditToList = () => {
  console.log('목록');
  router.push('/site-management/vmd');
};

</script>

<style scoped>
.detail-row-col--2 {
  display: flex;
  gap: 0 8rem;
}
</style>
