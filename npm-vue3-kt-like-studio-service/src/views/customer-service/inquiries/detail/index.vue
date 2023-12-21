<template>
  <TemplateDetail>
    <template #body>
      <TemplateDetailHead :title="lsSupportManagerByIdData.title"
        :category="lsSupportManagerByIdData.valueCate"
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
        <UIButton v-if="state === 'answered'" component="button" color-type="outlined" size="large"
          class-bind="!min-w-[14rem]" @click="onDeleteButton">삭제</UIButton>
        <UIButton component="a" href="/customer-service/inquiries" color-type="standard" size="large"
          class-bind="!min-w-[14rem]">목록</UIButton>
      </div>
    </template>
  </TemplateDetail>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia';
import moment from 'moment'

import FileDownload from '@/components/FileDownload/FileDownload.vue';
import TemplateDetailBody from '@/components/TemplateDetailBody/TemplateDetailBody.vue';
import TemplateDetailHead from '@/components/TemplateDetailHead/TemplateDetailHead.vue';
import TemplateDetail from '@/components/TemplateDetailWrap/TemplateDetail.vue';
import TemplateEditInfo from '@/components/TemplateEditInfo/TemplateEditInfo.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import DetailAnswer from '@/containers/customer-service/inquiries/DetailAnswer.vue';
import customToast from '@/untils/custom_toast';
import userId from '@/untils/loginUserId';

import { lsSupportManagerStore } from '@/stores/lsSupportManagerStore';

const route = useRoute()
const router = useRouter()

const { lsSupportManagerById } = storeToRefs(lsSupportManagerStore());
const { allLsSupportManager } = storeToRefs(lsSupportManagerStore());
const lsSupportManagerByIdData = ref([])
const allLsSupportManagerData = ref([])
const preLsSupportManagerByIdData = ref([])
const nextLsSupportManagerByIdData = ref([])
let preLsSupportManagerId, nextLsSupportManagerId

onMounted(async () => {
  await lsSupportManagerStore().getLsSupportManagerById(route.params.id)
  lsSupportManagerByIdData.value = lsSupportManagerById.value

  await lsSupportManagerStore().getAllLsSupportManager(userId)
  allLsSupportManagerData.value = allLsSupportManager.value

  getPreNextLsSupportManagerId()

  if (preLsSupportManagerId == undefined) {
    preLsSupportManagerByIdData.value = ''
  } else {
    await lsSupportManagerStore().getLsSupportManagerById(preLsSupportManagerId)
    preLsSupportManagerByIdData.value = lsSupportManagerById.value
  }

  if (nextLsSupportManagerId == undefined) {
    nextLsSupportManagerByIdData.value = ''
  } else {
    await lsSupportManagerStore().getLsSupportManagerById(nextLsSupportManagerId)
    nextLsSupportManagerByIdData.value = lsSupportManagerById.value
  }
});

function getPreNextLsSupportManagerId() {
  const ls = allLsSupportManagerData.value
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
    setTimeout(function () {
      customToast.success('successful delete');
    }, 500)
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
</script>

<style scoped></style>
