<template>
  <TemplateEdit title="1:1 문의하기">
    <template #body>
      <TemplateEditTextFields label="카테고리" required>
        <DropdownSelect :select-list="lsSupportManagerCategoryListData" @select="setCurrentCategory" />
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
import utils from '@/untils/utils';
import userId from '@/untils/loginUserId';

const router = useRouter();
const { addRes, lsSupportManagerCategoryList } = storeToRefs(lsSupportManagerStore());
const { responseUploadFile } = storeToRefs(fileManagerStore());
const lsSupportManagerCategoryListData = ref([])
const titleId = uuid();
const title = ref('');
const contentId = uuid();
const content = ref('');
const textareaId = uuid();
const firstSelect = ref('');
const files = ref([])
const showFiles = ref([])
const currentCategory = ref('');
const ARCHIVE_FILES = ['zip', '7z', 'alz', 'egg', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'wmv', 'asf', 'flv', 'mov', 'mpeg'];
const maxSizeFile = 50;


onMounted(async () => {
  await lsSupportManagerStore().getLsSupportManagerCategoryList()
  lsSupportManagerCategoryListData.value = lsSupportManagerCategoryList.value

  firstSelect.value = lsSupportManagerCategoryListData.value[0].value
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
  currentCategory.value = param.id
}
const handleFileUpload = async (file) => {
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
  if (showFiles.value.length == 3) {
    customToast.error('Maximum of 3 files.');
    return;
  }
  showFiles.value.push({ oriFileName: file.name, uniqFileName: '', createUser: userId })
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
      createUser: userId
    },
    fileManagerList: showFiles.value
  }
  if (currentCategory.value == '') customToast.error('category cannot be empty')
  if (title.value == '') customToast.error('title cannot be empty')
  if (content.value == '') customToast.error('content cannot be empty')
  if(title.value.length && title.value.length > 100) customToast.error('title cannot be more 100 characters')
  if(content.value.length && content.value.length > 3000) customToast.error('content cannot be more 3000 characters')
  await lsSupportManagerStore().add(param)
  if (addRes.value.statusCode == 1) {
    router.push('/customer-service/inquiries')
    setTimeout(function () {
      customToast.success('글을 등록했습니다.');
    }, 500)
  } else customToast.error('an error occurred')
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
