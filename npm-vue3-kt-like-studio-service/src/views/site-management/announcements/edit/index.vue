<template>
  <TemplateEdit title="공지사항 관리">
    <template #body>
      <TemplateEditTextFields :fields-id="noticeId" label="제목" required v-model="inputRef">
        <TextFields v-bind="$attrs" :input-id="noticeId" v-model="noticeBoarDetail.title" size="medium"
          placeholder="제목 입력" class-bind="w-full" />
      </TemplateEditTextFields>
      <div class="flex gap-x-[8rem]">
        <TemplateEditTextFields label="공지"
          class-bind="relative flex-1 items-center leading-none !border-b-0 before:absolute before:right-[-4rem] before:w-[1px] before:h-[4.6rem] before:bg-gray-gray-ddd before:content-['']">
          <Switch :toggle="gimValue" />
        </TemplateEditTextFields>
        <TemplateEditTextFields label="메인 팝업" required class-bind="flex-1 items-center leading-none !border-b-0">
          <Switch :toggle="popupValue" />
        </TemplateEditTextFields>
      </div>
      <TemplateEditTextFields label="노출" required class-bind="items-center leading-none !border-b-0">
        <Switch :toggle="showValue" />
      </TemplateEditTextFields>
      <TemplateEditTextFields label="내용" required v-model="inputRef">
        <textarea class="h-[31.6rem] px-[1.6rem] py-[1.3rem] rounded-[0.6rem] border-[1px] border-gray-gray-ddd w-full"
          id="message" name="message" rows="4" cols="50" v-model="noticeBoarDetail.content"></textarea>
      </TemplateEditTextFields>
      <TemplateEditTextFields label="첨부파일" class-bind="pt-[3.2rem] border-t-[1px] border-t-gray-gray-ddd">
        <TemplateEditFileFields @file-upload="handleFileUpload" @file-remove="handleFileRemove" :files="listFile"
          file-caption-title="첨부파일은 최대 10개, 1개 파일당 50MB 이하의 아래 확장자만 업로드 가능합니다." :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg , jpeg , png , gif',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
          ]" />
      </TemplateEditTextFields>
    </template>

    <template #foot>
      <div class="flex mt-[6rem] justify-center gap-x-[1rem]">
        <Button component="button" color-type="standard" size="large" class-bind="!min-w-[14rem]"
          @click="handleEditDelete">삭제</Button>
        <Button component="button" color-type="outlined" size="large" class-bind="!min-w-[14rem] !ml-auto"
          @click="handleEditToList">목록</Button>
        <Button component="button" color-type="primary" size="large" class-bind="!min-w-[14rem]"
          @click="handleEdit">수정</Button>
      </div>
    </template>
  </TemplateEdit>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from "vue-router";

import Button from '@/components/Button/Button.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import customToast from '@/untils/custom_toast';
import utils from '@/untils/utils';

import { noticeBoardStore } from '@/stores/noticeBoardStore';
import { fileManagerStore } from '@/stores/fileManagerStore';
import { storeToRefs } from 'pinia';

const store = noticeBoardStore();
const fileStore = fileManagerStore();
const { noticeBoard } = storeToRefs(store);
const { listOfFile } = storeToRefs(fileStore);
const router = useRouter();
const route = useRoute();

const inputRef = ref('');

const noticeId = ref();
const noticeBoarDetail = ref({});
const listFile = ref([]);

const functionType = 0;
const ARCHIVE_FILES = ['zip', '7z', 'alz', 'egg', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'wmv', 'asf', 'flv', 'mov', 'mpeg'];
const maxSizeFile = 50;

const gimValue = ref();
const showValue = ref();
const popupValue = ref();
const listFileSave = ref([]);

const handleFileUpload = async (file) => {
  const sizeInMB = file.size / (1024 * 1024);
  const typeFile = utils.getFileType(file.name);

  if (sizeInMB > maxSizeFile) {
    customToast.error('File size should not exceed 50MB');
    return;
  }
  if (!ARCHIVE_FILES.includes(typeFile)) {
    customToast.error('This file type is not allowed for upload');
    return;
  }
  if (listFile.value.size == 10) {
    customToast.error('Maximum of 10 files');
    return;
  }
  listFile.value.push({
    oriFileName: file.name,
  });
  listFileSave.value.push(file)
}

const handleFileRemove = async (index) => {
  listFile.value.splice(index, 1)
};
const handleEditDelete = async () => {
  if (window.confirm('Are you sure you want to delete?')) {
    await store.deleteNotice(noticeId.value)
    router.push(`/site-management/announcements`)
    customToast.success('Successfully delete notice')
  }
};
const handleEditToList = () => {
  router.push('/site-management/announcements');
};

const noticeBoardData = ref({});
const handleEdit = async () => {
  const formData = new FormData();
    for (let i = 0; i < listFileSave.value.length; i++) {
      formData.append('files', listFileSave.value[i])
    }
    await fileStore.uploadFile(formData)

  noticeBoardData.value = {
    noticeBoard: {
      id: noticeId.value,
      title: inputRef,
      content: noticeBoarDetail.value.content,
      views: 0,
      create_user: 1,
      edit_use: 1,
      gim: gimValue.value,
      show: showValue.value,
      popup: popupValue.value 
    },
    fileManagerList: listFile.value.map((file) => ({
      oriFileName: file.oriFileName,
      createUser: 1,
      uniqFileName: null, 
    })),
  }
  // await store.updateNotice(noticeBoardData.value);
  customToast.success('글을 수정했습니다.');
};

async function getNoticeById(noticeId) {
  await store.getNoticeById(noticeId)
  noticeBoarDetail.value = noticeBoard.value || {}
  gimValue.value = noticeBoarDetail.value.gim
  showValue.value = noticeBoarDetail.value.show
  popupValue.value = noticeBoarDetail.value.popup
}

async function gitListFile(functionType, titleId) {
  await fileStore.getListFile(functionType, titleId)
  listFile.value = listOfFile.value;
}

onMounted(async () => {
  noticeId.value = route.params.id
  await getNoticeById(noticeId.value)
  await gitListFile(functionType, noticeId.value)
});
</script>

<style scoped>
.detail-row-col--2 {
  display: flex;
  gap: 0 8rem;
}
</style>
