<template>
  <TemplateDetail>
    <template #body>
      <TemplateDetailHead :title="lsSupportManagerByIdData.title" :category="lsSupportManagerByIdData.valueCate"
        :writer="lsSupportManagerByIdData.username" :writer-position="lsSupportManagerByIdData.roleName"
        :date="lsSupportManagerByIdData.createDate" />
      <TemplateDetailBody :content="lsSupportManagerByIdData.content"
        :files="lsSupportManagerByIdData.fileManagerListQuestion" :prev-post="preLsSupportManagerByIdData"
        :next-post="nextLsSupportManagerByIdData" @someEvent="callback"
        class="pb-[6rem] border-gray-gray-ddd border-b-[1px]" />
      <TemplateEditTextFields v-if="props.state === 'unanswered' || state === 'edit'" label="답변"
        class-bind="relative pt-[2.8rem] after:absolute after:bottom-[-1px] after:left-0 after:content-[''] after:w-full after:h-[1px] after:bg-neutrals-black">
          <CKEditor v-model="textareaRef"></CKEditor>
        <TemplateEditFileFields @file-upload="handleFileUpload" @file-remove="handleFileRemove" :files="showFiles"
          file-caption-title="첨부파일은 최대 10개, 1개 파일당 50MB 이하의 아래 확장자만 업로드 가능합니다." :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg , jpeg , png , gif',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
          ]" />
      </TemplateEditTextFields>
      abc
      <h2>abc</h2>
      <h5>abc</h5>
      <QuillEditor :v-model:content="'<h5>a</h5>'" :toolbar="['']"/>
      <DetailAnswer v-if="props.state === 'answered'" :content="lsSupportManagerByIdData.contentAnswer"
        class="before:absolute before:bottom-[-1px] before:left-0 after:content-[''] before:w-full before:h-[1px] before:bg-neutrals-black">
        <FileDownload class-bind="!mt-0" v-for="item in lsSupportManagerByIdData.fileManagerListAnswer" :key="item.id"
          :files="[
            { id: item.id, filename: item.oriFileName, filePath: item.uniqFileName },
          ]" />
        <TemplateEditInfo :hits="''" :last-modified-date="lsSupportManagerByIdData.editAnswerDate"
          :modifier="lsSupportManagerByIdData.answerEditUser"
          :modifier-position="lsSupportManagerByIdData.departmentEditAnswer"
          :created-date="lsSupportManagerByIdData.dateAnswer" :writer="lsSupportManagerByIdData.usernameAnswer"
          :writer-position="lsSupportManagerByIdData.departmentNameAnswer" class-bind="after:!hidden !pt-[4rem] !pb-0" />
      </DetailAnswer>
    </template>
    <template #foot>
      <div v-if="state === 'unanswered' || state === 'edit'" class="flex gap-x-[1rem] justify-center">
        <RouterLink
          :to="`/site-management/inquiries/${state == 'unanswered' ? '' : `${lsSupportManagerByIdData.id}/answered`}`">
          <UIButton component="button" color-type="outlined" size="large" class-bind="!min-w-[14rem]">취소</UIButton>
        </RouterLink>
        <UIButton v-if="state == 'unanswered'" component="button" color-type="primary" size="large"
          class-bind="!min-w-[14rem]" @click="answer">답변 등록</UIButton>
        <UIButton v-else component="button" color-type="primary" size="large" class-bind="!min-w-[14rem]" @click="update">
          답변 등록</UIButton>
      </div>
      <div v-if="state === 'answered'" class="flex gap-x-[1rem] justify-between">
        <UIButton component="button" color-type="standard" size="large" class-bind="!min-w-[14rem]"
          @click="onDeleteButton">답변 삭제</UIButton>
        <div class="space-x-5">

          <RouterLink :to="`/site-management/inquiries`">
            <UIButton component="a" href="/site-management/inquiries" color-type="outlined" size="large"
              class-bind="ml-auto !min-w-[14rem]">목록</UIButton>
          </RouterLink>
          <RouterLink :to="`/site-management/inquiries/${lsSupportManagerByIdData.id}/edit`">
            <UIButton component="button" color-type="primary" size="large" class-bind="!min-w-[14rem]">답변 수정</UIButton>
          </RouterLink>
        </div>
      </div>
    </template>
  </TemplateDetail>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import FileDownload from '@/components/FileDownload/FileDownload.vue';
import TemplateDetailBody from '@/components/TemplateDetailBody/TemplateDetailBody.vue';
import TemplateDetailHead from '@/components/TemplateDetailHead/TemplateDetailHead.vue';
import TemplateDetail from '@/components/TemplateDetailWrap/TemplateDetail.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditInfo from '@/components/TemplateEditInfo/TemplateEditInfo.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import DetailAnswer from '@/containers/customer-service/inquiries/DetailAnswer.vue';
import customToast from '@/untils/custom_toast';
import CKEditor from '@/components/CKEditor/CKEditor.vue';

import { storeToRefs } from 'pinia';
import { lsSupportManagerStore } from '@/stores/lsSupportManagerStore';
import { fileManagerStore } from '@/stores/fileManagerStore';
import utils from '@/untils/utils';
import userId from '@/untils/loginUserId';
import { QuillEditor } from '@vueup/vue-quill';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
});

const { lsSupportManagerById, allLsSupportManager, answerRes, updateRes } = storeToRefs(lsSupportManagerStore());
const { responseUploadFile } = storeToRefs(fileManagerStore());
const  responseUploadFileData  = ref([]);
const lsSupportManagerByIdData = ref([])
const allLsSupportManagerData = ref([])
const preLsSupportManagerByIdData = ref([])
const nextLsSupportManagerByIdData = ref([])
const files = ref([])
const showFiles = ref([])
const preLsSupportManagerId = ref()
const nextLsSupportManagerId = ref()
const route = useRoute()
const router = useRouter();
const textareaRef = ref({});
const ARCHIVE_FILES = ['zip', '7z', 'alz', 'egg', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'wmv', 'asf', 'flv', 'mov', 'mpeg'];
const maxSizeFile = 50;

onMounted(async () => {
  await lsSupportManagerStore().getLsSupportManagerById(route.params.id)
  lsSupportManagerByIdData.value = lsSupportManagerById.value

  await lsSupportManagerStore().getAllLsSupportManager('')
  allLsSupportManagerData.value = allLsSupportManager.value

  await getPreNextLsSupportManagerId()

  if (preLsSupportManagerId.value == undefined) {
    preLsSupportManagerByIdData.value = ''
  } else {
    await lsSupportManagerStore().getLsSupportManagerById(preLsSupportManagerId.value)
    preLsSupportManagerByIdData.value = lsSupportManagerById.value
  }

  if (nextLsSupportManagerId.value == undefined) {
    nextLsSupportManagerByIdData.value = ''
  } else {
    await lsSupportManagerStore().getLsSupportManagerById(nextLsSupportManagerId.value)
    nextLsSupportManagerByIdData.value = lsSupportManagerById.value
  }

  lsSupportManagerByIdData.value.fileManagerListAnswer.forEach(e => {
    showFiles.value.push({ oriFileName: e.oriFileName, uniqFileName: e.uniqFileName, createUserId: userId })
  })

  textareaRef.value = lsSupportManagerByIdData.value.contentAnswer
  console.log('text area content: ', lsSupportManagerByIdData.value.contentAnswer);
});

function getPreNextLsSupportManagerId() {
  const ls = allLsSupportManagerData.value
  const currentId = lsSupportManagerByIdData.value.id

  for (let i = 0; i < ls.length; i++) {
    if (i < ls.length - 1 && ls[i + 1].id == currentId) preLsSupportManagerId.value = ls[i].id
    if (i > 0 && ls[i - 1].id == currentId) nextLsSupportManagerId.value = ls[i].id
  }
}
function callback(postId) {
  window.location.href = `/site-management/inquiries/${postId}/${nextLsSupportManagerByIdData.value.status == 1 ? 'answered' : 'unanswered'}`;
}
async function onDeleteButton() {
  if (window.confirm("confirm to delete")) {
    await lsSupportManagerStore().deleteLsSupportManagerForAdmin(lsSupportManagerByIdData.value.idAnswer, lsSupportManagerByIdData.value.id)
    router.push('/site-management/inquiries')
    customToast.success('successful delete answer id', lsSupportManagerByIdData.value.idAnswer);
  }
};


async function answer() {
  await uploadFiles()
  let param = {
    lsSupportManagerQuestionId: lsSupportManagerByIdData.value.id,
    lsSupportManagerAnswer: {
      content: textareaRef.value,
      createUserId: userId,
      category: lsSupportManagerByIdData.value.category
    }, fileManagerList: showFiles.value
  }


  if (textareaRef.value == '') customToast.error('content cannot be empty')
  if (textareaRef.value && textareaRef.value.length > 3000) customToast.error('content cannot be more 3000 characters')
  await lsSupportManagerStore().answer(param)
  if (answerRes.value.statusCode == 1) {
    router.push('/site-management/inquiries')
    setTimeout(function () {
      customToast.success('successful answer')
    }, 500)
  }
};
async function update() {
  await uploadFiles()
  let param = {
    lsSupportManager: {
      id: lsSupportManagerByIdData.value.idAnswer,
      content: textareaRef.value,
      updateUserId: userId
    },
    fileManagerList: showFiles.value
  }

  if (textareaRef.value == '') customToast.error('content cannot be empty')
  if (textareaRef.value && textareaRef.value.length > 3000) customToast.error('content cannot be more than 3000 characters')
  await lsSupportManagerStore().update(param)
  if (updateRes.value.statusCode == 1) {
    router.push('/site-management/inquiries')
    setTimeout(function () {
      customToast.success('successful edit the answer')
    }, 500);
  }
};

async function uploadFiles() {
  if (files.value != '') {
    let uploadFileParam = new FormData();

    files.value.forEach(e => uploadFileParam.append('files', e))
    await fileManagerStore().uploadFile(uploadFileParam)
    responseUploadFileData.value = responseUploadFile.value

    let answerListLength = lsSupportManagerByIdData.value.fileManagerListAnswer.length
    responseUploadFileData.value.data.forEach((e, i) => showFiles.value[i + answerListLength].uniqFileName = e.uniqFileName)
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
  if (showFiles.value.length == 10) {
    customToast.error('Maximum of 10 files.');
    return;
  }
  showFiles.value.push({ oriFileName: file.name, uniqFileName: '', createUserId: userId })
  files.value.push(file)

};

async function handleFileRemove(file) {
  showFiles.value.splice(file, 1)
  lsSupportManagerByIdData.value.fileManagerListAnswer.splice(file, 1)
};
</script>

<style scoped></style>
<script setup></script>
