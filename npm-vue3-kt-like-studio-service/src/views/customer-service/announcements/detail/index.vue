<template>
  <TemplateDetail>
    <template #body>
      <TemplateDetailHead :title="dummyData.title" :date="dummyData.date" />
      <TemplateDetailBody
        :content="dummyData.content"
        :files="dummyData.files"
        :prev-post="dummyData.prevPost"
        :next-post="dummyData.nextPost"
      />
    </template>
    <template #foot>
      <div class="text-center">
        <UIButton
          component="a"
          href="/customer-service/announcements"
          color-type="standard"
          size="large"
          class-bind="!min-w-[14rem]"
          >목록</UIButton
        >
      </div>
    </template>
  </TemplateDetail>
</template>

<script setup>
import { useRoute } from 'vue-router';

import TemplateDetailBody from '@/components/TemplateDetailBody/TemplateDetailBody.vue';
import TemplateDetailHead from '@/components/TemplateDetailHead/TemplateDetailHead.vue';
import TemplateDetail from '@/components/TemplateDetailWrap/TemplateDetail.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const route = useRoute();
const { notPrevious } = route.query;

const dummyData = {
  title: '마이페이지/고객지원 등 일부 서비스 이용제한 안내',
  date: '2023.09.20 15:32',
  content:
    '안녕하세요 kt.com 입니다. 보다 안정적인 서비스 제공을 위해 아래의 내용으로 시스템 점검 작업을 진행할 예정이오니 참고하셔서 사용에 불편 없으시기를 바랍니다.',
  files: [
    {
      id: 0,
      filename: '서버점검 상세 안내문.docx',
    },
    {
      id: 1,
      filename: '서버점검 상세 안내문.pdf',
    },
  ],
  prevPost: {
    id: 0,
    title: notPrevious
      ? null
      : '인쇄종류의 추가에 따른 약관 및 개인정보취급방침의 개정',
  },
  nextPost: {
    id: 1,
    title: notPrevious
      ? null
      : '[공지] 추석 이벤트 디자인 템플릿 모음, 한복 AI 사진 생성도 가능해요!',
  },
};
</script>

<style scoped></style>
