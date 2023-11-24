<template>
  <div class="text-5xl" @click="c">check</div>
  <TemplateEdit title="1:1 문의하기">
    <template #body>
      <TemplateEditTextFields label="카테고리" required>
        <DropdownSelect :select-list="lsSupportManagerCategoryListData" :default-select="'login'"
          @select="setCurrentCategory" />
      </TemplateEditTextFields>
      <TemplateEditTextFields :fields-id="titleId" label="제목" required v-model="title">
        <TextFields v-bind="$attrs" :input-id="titleId" v-model="title" size="medium" placeholder="제목 입력"
          class-bind="w-full" />
      </TemplateEditTextFields>
      <TemplateEditTextFields :fields-id="contentIdId" label="내용" required class="!pb-[3.2rem]">
        <TextArea v-bind="$attrs" :textarea-id="textareaId" v-model="content" placeholder="내용 입력" class-bind="w-full" />
      </TemplateEditTextFields>

      <TemplateEditTextFields label="첨부파일" class-bind="pt-[3.2rem] !pb-[3.2rem] border-t-[1px] border-t-gray-gray-ddd">
        <TemplateEditFileFields @file-upload="handleFileUpload" @file-remove="handleFileRemove" :files="showFiles"
          file-caption-title="첨부파일은 최대 3개, 1개 파일당 50MB 이하의 아래 확장자만 업로드 가능합니다." fileMaxLength="3" :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg , jpeg , png , gif',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
          ]" />
      </TemplateEditTextFields>
    </template>

    <template #foot>
      <div class="flex mt-[6rem] justify-center gap-x-[1rem]">
        <RouterLink to="/customer-service/inquiries"> 
        <UIButton component="button" color-type="outlined" size="large" class-bind="!min-w-[14rem]"
          @click="handleCreateCancel">취소</UIButton>
</RouterLink>
        <UIButton component="button" color-type="primary" size="large" class-bind="!min-w-[14rem]"
          @click="handleCreateSubmit">등록</UIButton>
      </div>
    </template>
  </TemplateEdit>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { ref, onMounted } from 'vue';

import { useRouter } from 'vue-router';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextArea from '@/components/TextArea/TextArea.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import customToast from '@/untils/custom_toast';
import { storeToRefs } from 'pinia';
import { lsSupportManagerStore } from '@/stores/lsSupportManagerStore';
import { fileManagerStore } from '@/stores/fileManagerStore';

const router = useRouter();
const { addRes, lsSupportManagerCategoryList } = storeToRefs(lsSupportManagerStore());
const { responseUploadFile } = storeToRefs(fileManagerStore());
const lsSupportManagerCategoryListData = ref([])
const titleId = uuid();
const title = ref('');
const contentId = uuid();
const content = ref('');
const textareaId = uuid();
const textareaRef = ref('');
const firstSelect = ref('');
const files = ref([])
const showFiles = ref([])
const currentCategory = ref('');
const loginUserId = 1


function c() {
  console.log('title', title.value);
  console.log('content', content.value);
}

onMounted(async () => {
  await lsSupportManagerStore().getLsSupportManagerCategoryList()
  lsSupportManagerCategoryListData.value = lsSupportManagerCategoryList.value

  firstSelect.value = lsSupportManagerCategoryListData.value[0].value
  console.log(lsSupportManagerCategoryListData.value[0].value);
})
async function uploadFiles() {
  if (files.value != '') {
    let uploadFileParam = new FormData();

    files.value.forEach(e => uploadFileParam.append('files', e))
    await fileManagerStore().uploadFile(uploadFileParam)

    responseUploadFile.value.data.forEach((e, i) => showFiles.value[i].uniqFileName = e.uniqFileName)
  }
}
function setCurrentCategory(param) {
  console.log('param:', param);
  currentCategory.value = param.id
}
const handleFileUpload = async (file) => {
  showFiles.value.push({ oriFileName: file.name, uniqFileName: '', createUser: loginUserId })
  files.value.push(file)
};

const handleFileRemove = async (file) => {
  showFiles.value.splice(file, 1)
  files.value.splice(file, 1)
};

const handleCreateCancel = () => {
  console.log('취소');
};

async function handleCreateSubmit() {
  await uploadFiles()
  let param = {
    lsSupportManager: {
      title: title.value,
      category: currentCategory.value,
      content: content.value,
      createUser: loginUserId
    },
    fileManagerList: showFiles.value
  }
  await lsSupportManagerStore().add(param)
  console.log('add res: ', addRes.value);
  customToast.success('글을 등록했습니다.');
};
// const dummyfiles = [
//   {
//     id: 0,
//     filename: 'screenshot_5907111102.png',
//   },
//   {
//     id: 0,
//     filename: 'screenshot_02352786929249.png',
//   },
// ];

// const dummySelect = [
//   {
//     id: 0,
//     listName: '로그인',
//   },
//   {
//     id: 1,
//     listName: '사용법',
//   },
//   {
//     id: 2,
//     listName: '저작권',
//   },
//   {
//     id: 3,
//     listName: '팀룸',
//   },
//   {
//     id: 4,
//     listName: '서비스 오류',
//   },
// ];

</script>

<style scoped>
.detail-row-col--2 {
  display: flex;
  gap: 0 8rem;
}
</style>
