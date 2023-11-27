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
        <TextArea v-bind="$attrs" :textarea-id="textareaId" v-model="textareaRef" placeholder="내용 입력"
          class-bind="w-full mb-[2.8rem]" />
        <TemplateEditFileFields @file-upload="handleFileUpload" @file-remove="handleFileRemove" :files="showFiles"
          file-caption-title="첨부파일은 최대 10개, 1개 파일당 50MB 이하의 아래 확장자만 업로드 가능합니다." fileMaxLength="10" :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg , jpeg , png , gif',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
          ]" />
      </TemplateEditTextFields>
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
import { v4 as uuid } from 'uuid';
import { defineProps, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import FileDownload from '@/components/FileDownload/FileDownload.vue';
import TemplateDetailBody from '@/components/TemplateDetailBody/TemplateDetailBody.vue';
import TemplateDetailHead from '@/components/TemplateDetailHead/TemplateDetailHead.vue';
import TemplateDetail from '@/components/TemplateDetailWrap/TemplateDetail.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditInfo from '@/components/TemplateEditInfo/TemplateEditInfo.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextArea from '@/components/TextArea/TextArea.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import DetailAnswer from '@/containers/customer-service/inquiries/DetailAnswer.vue';
import customToast from '@/untils/custom_toast';

import { storeToRefs } from 'pinia';
import { lsSupportManagerStore } from '@/stores/lsSupportManagerStore';
import { fileManagerStore } from '@/stores/fileManagerStore';
import moment from 'moment';
import utils from '@/untils/utils';
import userId from '@/untils/loginUserId';


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
const textareaId = uuid();
const textareaRef = ref('');
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
    showFiles.value.push({ oriFileName: e.oriFileName, uniqFileName: e.uniqFileName, createUser: userId })
  })

  // lsSupportManagerByIdData.value.fileManagerListAnswer.forEach(e => {
  //   files.value.push(new File({
  //     lastModified : 1700740222151,
  //     lastModifiedDate : 'Thu Nov 23 2023 18: 50: 22 GMT +0700(Indochina Time) {}',
  //     name : e.oriFileName,
  //     size : 39612,
  //     type : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     webkitRelativePath: ''
  //   }))
  // })
  // files.value = lsSupportManagerByIdData.value.fileManagerListAnswer


  textareaRef.value = lsSupportManagerByIdData.value.contentAnswer
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
function formatDate(str) {
  return moment(str).format("YYYY.MM.DD HH:mm")
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
      createUser: userId,
      category: lsSupportManagerByIdData.value.category
    }, fileManagerList: showFiles.value
  }


  if (textareaRef.value == '') customToast.error('content cannot be empty')

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
      editUser: userId
    },
    fileManagerList: showFiles.value
  }

  if (textareaRef.value == '') customToast.error('content cannot be empty')
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
  if (showFiles.value.size == 10) {
    customToast.error('Maximum of 10 files.');
    return;
  }
  showFiles.value.push({ oriFileName: file.name, uniqFileName: '', createUser: userId })
  files.value.push(file)

};

async function handleFileRemove(file) {
  showFiles.value.splice(file, 1)
  lsSupportManagerByIdData.value.fileManagerListAnswer.splice(file, 1)
};
// const dummyData = {
//   title: '갤러리로 보내기 할 때 오류가 발생합니다',
//   category: '서비스 오류',
//   writer: '홍길동',
//   writerPosition: '전략마케팅팀',
//   date: '2023.01.30 11:32',
//   content:
//     '안녕하세요! 갤러리로 보내기 버튼을 누르면 오류가 발생합니다 첨부파일 참고 부탁드리고... 윈도우 노트북이고 크롬을 쓰고 있는데요 브라우저 문제인지 잘 모르겠네요 확인 부탁드려요',
//   files: [
//     {
//       id: 0,
//       filename: 'screenshot_5907111102.png',
//     },
//     {
//       id: 1,
//       filename: 'screenshot_02352786929249.png',
//     },
//   ],
// };

// const dummyAnswer = {
//   content:
//     '안녕하세요! 고객님. 먼저 불편을 끼쳐드려 정말 죄송합니다. 말씀하신 오류는 어젯밤 통신 장애로 인해 발생한 것으로 밤 10시경 조치 완료했습니다. 지금은 정상적으로 작동하오니 이점 참고해 다시 한 번 시도해 보세요. 라이크 스튜디오를 이용해 주셔서 정말 감사합니다. 오늘도 즐거운 하루 보내세요!',
//   files: [
//     {
//       id: 0,
//       filename: 'screenshot_5907111102.png',
//     },
//     {
//       id: 1,
//       filename: 'screenshot_02352786929249.png',
//     },
//   ],
//   date: '2023.01.30 11:32',
// };

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

// const dummyInfo = {
//   lastModifiedDate: '2023.02.12 15:34',
//   modifier: '박미래',
//   modifierPosition: '판매역량강화팀',
//   createdDate: '2023.02.11 10:16',
//   writer: '박미래',
//   writerPosition: '판매역량강화팀',
// };
</script>

<style scoped></style>
<script setup></script>
