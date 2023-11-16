<template>
  <TemplateDetail>
    <template #body>
      <TemplateDetailHead :title="noticeBoarDetail.title" :date="noticeBoarDetail.date" />
      <TemplateDetailBody
        :content="noticeBoarDetail.content"
        :files="listFile"
        :prev-post="prevPost"
        :next-post="nextItem"
        @someEvent="callback"
      />
    </template>
    <template #foot>
      <div class="text-center">
        <Button component="a" href="/customer-service/announcements" color-type="standard" size="large"
          class-bind="!min-w-[14rem]">목록</Button>
      </div>
    </template>
  </TemplateDetail>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import Button from '@/components/Button/Button.vue';
import TemplateDetailBody from '@/components/TemplateDetailBody/TemplateDetailBody.vue';
import TemplateDetailHead from '@/components/TemplateDetailHead/TemplateDetailHead.vue';
import TemplateDetail from '@/components/TemplateDetailWrap/TemplateDetail.vue';
import { noticeBoardStore } from '@/stores/noticeBoardStore';
import { fileManagerStore } from '@/stores/fileManagerStore';
import { storeToRefs } from 'pinia';
import { useRoute } from "vue-router";

const store = noticeBoardStore();
const fileStore = fileManagerStore();
const { noticeBoard, listNotice } = storeToRefs(store);
const { listOfFile } = storeToRefs(fileStore);
const route = useRoute();

const functionType = 0;

const dummyList = ref([]);
const noticeBoarDetail = ref([]);
const listFile = ref([]);
const noticeId = ref()

const prevPost = ref();
const nextItem = ref();

async function getNoticeById(noticeId) {
  await store.getNoticeById(noticeId)
  noticeBoarDetail.value = noticeBoard.value
}

async function gitListFile(functionType, titleId) {
  await fileStore.getListFile(functionType, titleId)
  listFile.value = listOfFile.value;
}

async function getListNotice() {
  await store.findAllNoitce();
  dummyList.value = listNotice.value.filter((item) => item.show = 1);
  for (let i = 0; i < dummyList.value.length; i++) {
    if (dummyList.value[i].id == noticeId.value) {
      if (i > 0) {
        await store.getNoticeById(dummyList.value[i - 1].id)
        prevPost.value = noticeBoard.value;
      }
      if (i < dummyList.value.length - 1) {
        await store.getNoticeById(dummyList.value[i + 1].id)
        nextItem.value = noticeBoard.value;
      }
      break;
    }
  }
}

function callback(postId) {
  window.location.href = '/customer-service/announcements/' + postId;
}

onMounted(async () => {
  noticeId.value = route.params.id;
  await getNoticeById(noticeId.value)
  await gitListFile(functionType, noticeId.value);
  await getListNotice();
});
</script>

<style scoped></style>
