<template>
  <TemplateDetail>
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
    <!-- dev: 답변 후 DetailAnswer 노출 -->
    <DetailAnswer
      v-if="dummyAnswer"
      :content="dummyAnswer.content"
      :files="dummyAnswer.files"
      :date="dummyAnswer.date"
    />
    <TemplateDetailFooter
      :useRemoveButton="!!dummyAnswer"
      @on-delete="handleRemove"
      to-list-href="/customer-service/announcements"
    />
  </TemplateDetail>
</template>

<script setup>
import TemplateDetailBody from '@/components/TemplateDetailBody/TemplateDetailBody.vue';
import TemplateDetailFooter from '@/components/TemplateDetailFooter/TemplateDetailFooter.vue';
import TemplateDetailHead from '@/components/TemplateDetailHead/TemplateDetailHead.vue';
import TemplateDetail from '@/components/TemplateDetailWrap/TemplateDetail.vue';
import DetailAnswer from '@/containers/customer-service/inquiries/DetailAnswer.vue';

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

const handleRemove = (arg) => {
  console.log(arg);
};
</script>

<style scoped></style>
