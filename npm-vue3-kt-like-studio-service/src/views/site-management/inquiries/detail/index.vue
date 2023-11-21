<template>
  <TemplateDetail>
    <template #body>
      <TemplateDetailHead
        :title="dummyData.title"
        :category="dummyData.category"
        :writer="dummyData.writer"
        :writer-position="dummyData.writerPosition"
        :date="dummyData.date"
      />
      <TemplateDetailBody
        :content="dummyData.content"
        :files="dummyData.files"
        :prev-post="dummyData.prevPost"
        :next-post="dummyData.nextPost"
        class="pb-[6rem] border-gray-gray-ddd border-b-[1px]"
      />
      <TemplateEditTextFields
        v-if="props.state === 'unanswered' || state === 'edit'"
        label="답변"
        class-bind="relative pt-[2.8rem] after:absolute after:bottom-[-1px] after:left-0 after:content-[''] after:w-full after:h-[1px] after:bg-neutrals-black"
      >
        <TextArea
          v-bind="$attrs"
          :textarea-id="textareaId"
          v-model="textareaRef"
          placeholder="내용 입력"
          class-bind="w-full mb-[2.8rem]"
        />
        <TemplateEditFileFields
          @file-upload="handleFileUpload"
          @file-remove="handleFileRemove"
          :files="dummyfiles"
          file-caption-title="첨부파일은 최대 10개, 1개 파일당 50MB 이하의 아래 확장자만 업로드 가능합니다."
          fileMaxLength="10"
          :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg , jpeg , png , gif',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
          ]"
        />
      </TemplateEditTextFields>
      <DetailAnswer
        v-if="props.state === 'answered'"
        :content="dummyAnswer.content"
        class="before:absolute before:bottom-[-1px] before:left-0 after:content-[''] before:w-full before:h-[1px] before:bg-neutrals-black"
      >
        <FileDownload :files="dummyAnswer.files" />
        <TemplateEditInfo
          :hits="dummyInfo.hits"
          :last-modified-date="dummyInfo.lastModifiedDate"
          :modifier="dummyInfo.modifier"
          :modifier-position="dummyInfo.modifierPosition"
          :created-date="dummyInfo.createdDate"
          :writer="dummyInfo.writer"
          :writer-position="dummyInfo.writerPosition"
          class-bind="after:!hidden !pt-[4rem] !pb-0"
        />
      </DetailAnswer>
    </template>
    <template #foot>
      <div
        v-if="state === 'unanswered' || state === 'edit'"
        class="flex gap-x-[1rem] justify-center"
      >
        <UIButton
          component="button"
          color-type="outlined"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="onDeleteButton"
          >취소</UIButton
        >
        <UIButton
          component="button"
          color-type="primary"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="onSubmitButton"
          >답변 등록</UIButton
        >
      </div>
      <div v-if="state === 'answered'" class="flex gap-x-[1rem]">
        <UIButton
          component="button"
          color-type="standard"
          size="large"
          class-bind="!min-w-[14rem]"
          >답변 삭제</UIButton
        >
        <UIButton
          component="a"
          href="/site-management/inquiries"
          color-type="outlined"
          size="large"
          class-bind="ml-auto !min-w-[14rem]"
          >목록</UIButton
        >
        <UIButton
          component="button"
          color-type="primary"
          size="large"
          class-bind="!min-w-[14rem]"
          >답변 수정</UIButton
        >
      </div>
    </template>
  </TemplateDetail>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';

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

const router = useRouter();

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

const textareaId = uuid();
const textareaRef = ref('');

const dummyData = {
  title: '갤러리로 보내기 할 때 오류가 발생합니다',
  category: '서비스 오류',
  writer: '홍길동',
  writerPosition: '전략마케팅팀',
  date: '2023.01.30 11:32',
  content:
    '안녕하세요! 갤러리로 보내기 버튼을 누르면 오류가 발생합니다 첨부파일 참고 부탁드리고... 윈도우 노트북이고 크롬을 쓰고 있는데요 브라우저 문제인지 잘 모르겠네요 확인 부탁드려요',
  files: [
    {
      id: 0,
      filename: 'screenshot_5907111102.png',
    },
    {
      id: 1,
      filename: 'screenshot_02352786929249.png',
    },
  ],
};

const dummyAnswer = {
  content:
    '안녕하세요! 고객님. 먼저 불편을 끼쳐드려 정말 죄송합니다. 말씀하신 오류는 어젯밤 통신 장애로 인해 발생한 것으로 밤 10시경 조치 완료했습니다. 지금은 정상적으로 작동하오니 이점 참고해 다시 한 번 시도해 보세요. 라이크 스튜디오를 이용해 주셔서 정말 감사합니다. 오늘도 즐거운 하루 보내세요!',
  files: [
    {
      id: 0,
      filename: 'screenshot_5907111102.png',
    },
    {
      id: 1,
      filename: 'screenshot_02352786929249.png',
    },
  ],
  date: '2023.01.30 11:32',
};

const dummyfiles = [
  {
    id: 0,
    filename: 'screenshot_5907111102.png',
  },
  {
    id: 0,
    filename: 'screenshot_02352786929249.png',
  },
];

const dummyInfo = {
  lastModifiedDate: '2023.02.12 15:34',
  modifier: '박미래',
  modifierPosition: '판매역량강화팀',
  createdDate: '2023.02.11 10:16',
  writer: '박미래',
  writerPosition: '판매역량강화팀',
};

const onDeleteButton = () => {
  console.log('취소');
  router.push('/site-management/inquiries');
};

const onSubmitButton = () => {
  console.log('답변 등록');
};

const handleFileUpload = async (file) => {
  await console.log('file upload', file);
};

const handleFileRemove = async (file) => {
  await console.log('file remove', file);
};
</script>

<style scoped></style>
<script setup></script>
