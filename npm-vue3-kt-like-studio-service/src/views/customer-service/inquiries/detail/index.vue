<template>
  <TemplateDetail>
    <template #body>
      <TemplateDetailHead
        :title="dummyData.title"
        :category="dummyData.category"
        :date="dummyData.date"
      />
      <TemplateDetailBody
        :content="dummyData.content"
        :files="dummyData.files"
        :prev-post="dummyData.prevPost"
        :next-post="dummyData.nextPost"
      />
      <DetailAnswer
        v-if="props.state === 'answered'"
        :content="dummyAnswer.content"
        :files="dummyAnswer.files"
        :date="dummyAnswer.date"
      >
        <FileDownload :files="dummyAnswer.files" />
        <TemplateEditInfo
          class-bind="after:!hidden !pt-[4rem] !pb-0"
          answered-date="2023.01.30 11:32"
        />
      </DetailAnswer>
    </template>
    <template #foot>
      <div class="flex gap-x-[1rem] justify-center">
        <Button
          v-if="state === 'answered'"
          component="button"
          color-type="outlined"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="onDeleteButton"
          >삭제</Button
        >
        <Button
          component="a"
          href="/customer-service/inquiries"
          color-type="standard"
          size="large"
          class-bind="!min-w-[14rem]"
          >목록</Button
        >
      </div>
    </template>
  </TemplateDetail>
</template>

<script setup>
import { defineProps } from 'vue';

import Button from '@/components/Button/Button.vue';
import FileDownload from '@/components/FileDownload/FileDownload.vue';
import TemplateDetailBody from '@/components/TemplateDetailBody/TemplateDetailBody.vue';
import TemplateDetailHead from '@/components/TemplateDetailHead/TemplateDetailHead.vue';
import TemplateDetail from '@/components/TemplateDetailWrap/TemplateDetail.vue';
import TemplateEditInfo from '@/components/TemplateEditInfo/TemplateEditInfo.vue';
import DetailAnswer from '@/containers/customer-service/inquiries/DetailAnswer.vue';

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

const dummyData = {
  title: '갤러리로 보내기 할 때 오류가 발생합니다',
  category: '서비스 오류',
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

const onDeleteButton = () => {
  console.log('삭제');
};
</script>

<style scoped></style>
