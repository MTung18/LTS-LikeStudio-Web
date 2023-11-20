<template>
  <TemplateDetail>
    <template #body>
      <TemplateDetailHead :title="lsSupportManagerByIdData.title"
        :category="lsSupportManagerByIdData.category ? lsSupportManagerByIdData.category : 'not found category'"
        :date="lsSupportManagerByIdData.createDate" />
      <TemplateDetailBody :content="lsSupportManagerByIdData.content"
        :files="lsSupportManagerByIdData.fileManagerListQuestion" :prev-post="preLsSupportManagerByIdData"
        :next-post="nextLsSupportManagerByIdData" @someEvent="callback" />
      <DetailAnswer v-if="props.state === 'answered'" :content="lsSupportManagerByIdData.contentAnswer">
        <FileDownload class-bind="!mt-0" v-for="item in lsSupportManagerByIdData.fileManagerListAnswer" :key="item.id"
          :files="[
            { id: item.id, filename: item.oriFileName, filePath: item.uniqFileName },
          ]" />
        <TemplateEditInfo class-bind="after:!hidden !pt-[4rem] !pb-0"
          :answeredDate="formatDate(lsSupportManagerByIdData.dateAnswer)" />
      </DetailAnswer>
    </template>
    <template #foot>
      <div class="flex gap-x-[1rem] justify-center">
        <Button v-if="state === 'answered'" component="button" color-type="outlined" size="large"
          class-bind="!min-w-[14rem]" @click="onDeleteButton">삭제</Button>
        <Button component="a" href="/customer-service/inquiries" color-type="standard" size="large"
          class-bind="!min-w-[14rem]">목록</Button>
      </div>
    </template>
  </TemplateDetail>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia';
import moment from 'moment'

import Button from '@/components/Button/Button.vue';
import FileDownload from '@/components/FileDownload/FileDownload.vue';
import TemplateDetailBody from '@/components/TemplateDetailBody/TemplateDetailBody.vue';
import TemplateDetailHead from '@/components/TemplateDetailHead/TemplateDetailHead.vue';
import TemplateDetail from '@/components/TemplateDetailWrap/TemplateDetail.vue';
import TemplateEditInfo from '@/components/TemplateEditInfo/TemplateEditInfo.vue';
import DetailAnswer from '@/containers/customer-service/inquiries/DetailAnswer.vue';

import { lsSupportManagerStore } from '@/stores/lsSupportManagerStore';

const route = useRoute()
const router = useRouter()

const { lsSupportManagerById } = storeToRefs(lsSupportManagerStore());
const { allLsSupportManager } = storeToRefs(lsSupportManagerStore());
const lsSupportManagerByIdData = ref([])
const allLsSupportManagerData = ref([])
const preLsSupportManagerByIdData = ref([])
const nextLsSupportManagerByIdData = ref([])
const userId = 1
let preLsSupportManagerId, nextLsSupportManagerId

onMounted(async () => {
  await lsSupportManagerStore().getLsSupportManagerById(route.params.id)
  lsSupportManagerByIdData.value = lsSupportManagerById.value

  await lsSupportManagerStore().getAllLsSupportManager()
  allLsSupportManagerData.value = allLsSupportManager.value

  getPreNextLsSupportManagerId()

  await lsSupportManagerStore().getLsSupportManagerById(preLsSupportManagerId)
  preLsSupportManagerByIdData.value = lsSupportManagerById.value

  await lsSupportManagerStore().getLsSupportManagerById(nextLsSupportManagerId)
  nextLsSupportManagerByIdData.value = lsSupportManagerById.value
});

function getPreNextLsSupportManagerId() {
  const ls = allLsSupportManagerData.value.filter(e => e.createUser == userId && e.questionId == 0)
  const currentId = lsSupportManagerByIdData.value.id

  for (let i = 0; i < ls.length; i++) {
    if (i < ls.length - 1 && ls[i + 1].id == currentId) preLsSupportManagerId = ls[i].id
    if (i > 0 && ls[i - 1].id == currentId) nextLsSupportManagerId = ls[i].id
  }
}
function callback(postId) {
  window.location.href = `/customer-service/inquiries/${postId}/${nextLsSupportManagerByIdData.value.status == 1 ? 'answered' : 'unanswered'}`;
}
function formatDate(str) {
  return moment(str).format("YYYY.MM.DD HH:mm")
}
async function onDeleteButton() {
  if (window.confirm("confirm to delete")) {
    await lsSupportManagerStore().deleteLsSupportManagerForUser(lsSupportManagerByIdData.value.id)
    router.push('/customer-service/inquiries')
    console.log('delete', lsSupportManagerByIdData.value.id);
  }
};
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
  title: '갤러리로 보내기 할 때 오류가 발생합니다 detail content',
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

</script>

<style scoped></style>
