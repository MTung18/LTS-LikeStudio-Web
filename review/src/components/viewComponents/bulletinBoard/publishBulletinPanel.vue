<script setup lang="ts">
import { ref, watch } from "vue";
import { Bulletin } from "@/models/Bulletin";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBullhorn,
  faTimes,
  faCircleXmark,
  faCircleExclamation,
} from "@fortawesome/pro-light-svg-icons";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useBulletinBoardStore } from "@/stores/bulletinBoardStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { FormatDateByLocale } from "@/utilities/formatUtils";
import { useAlerts } from "@/composables/useAlerts";
import { toBase64 } from '@/helper/hqSuite/formatHelper';

library.add(
  faBullhorn,
  faTimes,
  faExclamationCircle,
  faCircleXmark,
  faCircleExclamation
);
const { notifySuccess, notifyError } = useAlerts();

const formPlan = ref(null);
const store = useBulletinBoardStore();
const { bulletinBoardDetail } = storeToRefs(store);
const router = useRouter();

interface Props {
  showPublishBulletin: Bulletin[];
}

const isOpen = ref(false);

defineExpose({
  isOpen,
});

const dataForm = ref();

const props = defineProps<Props>();

const emits = defineEmits(['changePublishStatus']);

const closeSideBar = async () => {
  isOpen.value = !isOpen.value;
};

watch(props, async () => {
  dataForm.value = props.showPublishBulletin;
});


const onDelete = async (currentId) => {
  await store.fetchBulletinBoardDetail(currentId);
  try {
    const response = await store.updateBulletinBoardDetail(currentId, {
      essDashboardPublishDate: bulletinBoardDetail.value.essDashboardPublishDate,
      essDashboardExpirationDate: bulletinBoardDetail.value.essDashboardPublishDate,
      title: bulletinBoardDetail.value.title,
      postStatusId: bulletinBoardDetail.value.postStatusId,
      thumbnailUrl: bulletinBoardDetail.value.thumbnailUrl,
      postContent: toBase64(bulletinBoardDetail.value.postContent),
      postDocumentMetadata: bulletinBoardDetail.value.postDocumentMetadata,
      postCategoryId: bulletinBoardDetail.value.postCategoryId,
      documentCategoryName: "General",
      isPublishedOnESSDashboard: false,
    });
    if (response) {
      const indexFound = dataForm.value.findIndex((el: Bulletin) => el.postId === currentId);
      if (indexFound > -1) {
        emits('changePublishStatus', currentId);
        dataForm.value.splice(indexFound, 1);
      }
    }

    notifySuccess('Change publish updated.')
  } catch (error) {
    notifyError('Change publish fail.')
  }

};

const viewBulletin = (id: number) => {
  router.push({ name: "viewBulletinDetail", params: { id: id } });
};
</script>
<template>
  <div id="publishBulletinPanel">
    <fs-form ref="formPlan" class="publishBulletinPanel">
      <fs-sidebar :visible="isOpen" id="publishPostForm-right" class="publishPostForm" right
        sidebar-class="fsi-sidebar help-center" body-class="help-center__body" no-close-on-esc no-close-on-backdrop
        bg-variant="white" width="425px" shadow header-class="border-bottom" footer-class="border-top" no-header-close>
        <template #title>
          <div class="mr-3 d-flex align-items-center">
            <div class="h5 pl-2 my-auto fw-bold">
              <font-awesome-icon :icon="['fal', 'fa-bullhorn']" class="text-black" />
              Manage Published Posts
            </div>
            <div class="ms-auto">
              <fs-link class="text-secondary" tag="a" @click.prevent="closeSideBar()">
                <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
              </fs-link>
            </div>
          </div>
        </template>
        <div class="d-flex flex-column h-100 w-100 pt-3">
          <div class="title mb-0">
            <p> Published posts on employee’s dashboard are arranged according to posting time. Maximum 3 publish posts at
              a
              time.</p>
          </div>
          <div class="my-table">
            <div v-for="(data, idx) in dataForm" :key="data.postId">
              <div @click="viewBulletin(data.postId)" class="subject" :class="'id-' + data.postId">
                <div class="idx">{{ idx + 1 }}</div>
                <div class="data-title">
                  <strong>{{ data.title }}</strong>
                  <p>
                    {{ FormatDateByLocale(data.essDashboardPublishDate) }} -
                    {{ FormatDateByLocale(data.essDashboardExpirationDate) }}
                  </p>
                </div>
                <!-- class="icon-remove-post" -->
                <a role="button" class="ms-auto py-2 px-3" @click.stop="onDelete(data.postId)">
                  <font-awesome-icon :icon="['fal', 'fa-circle-xmark']" class="text-red" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </fs-sidebar>
    </fs-form>
  </div>
</template>

<style scoped lang="scss">
.title {
  color: #6E7C8F;
  margin: 0px 20px;
  font-size: 12px;

  p {
    margin-bottom: 0px;
  }
}
</style>
