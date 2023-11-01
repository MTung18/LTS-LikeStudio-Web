<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import { useBulletinBoardStore } from "@/stores/bulletinBoardStore";
import { useRoute, useRouter } from "vue-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import preview from "@/components/viewComponents/bulletinBoard/preview.vue";
import { Bulletin, DocumentCategoryName, IAttachmentPost } from "@/models/Bulletin";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useAlerts } from "@/composables/useAlerts";

import {
  faArrowLeft,
  faPenToSquare,
  faTrashCan,
  faTimes,
  faCircleExclamation,
  faPaperclip,
  faArrowDownToLine,
} from "@fortawesome/pro-light-svg-icons";

library.add(
  faArrowLeft,
  faPenToSquare,
  faTrashCan,
  faTimes,
  faCircleExclamation,
  faPaperclip,
  faArrowDownToLine
);
const router = useRouter();
const route = useRoute();
const store = useBulletinBoardStore();

const { downloadFile, getFile } = useHQSuiteStore();
const { notifySuccess, notifyError } = useAlerts();


const dataBulletinBoardDetail: Ref<Bulletin> = ref({
  postId: null,
  title: null,
  postDescription: null,
  postContent: null,
  thumbnailUrl: null,
  updatedEmployeeFullName: null,
  createdEmployeeFullName: null,
  isPublishedOnESSDashboard: null,
  essDashboardPublishDate: null,
  essDashboardExpirationDate: null,
  postCategoryId: null,
  categoryName: null,
  categoriesColor: null,
  statusId: null,
  updatedEmployeeId: null,
  phqClientId: null,
  createdEmployeeId: null,
  createdDateUTC: null,
  updatedDateUTC: null,
  postDocumentMetadata: [],
  documentCategoryName: DocumentCategoryName
});

const thumbnail = ref<string>("");
onMounted(async () => {
  await store.fetchBulletinBoardDetail(Number(route.params.id));
  dataBulletinBoardDetail.value = store.bulletinBoardDetail;

  const THUMBNAIL_DEFAULT = "/images/default-thumbnail.png";
  if (store.bulletinBoardDetail.thumbnailUrl) {
    try {
      const fileGot = await getFile(store.bulletinBoardDetail.thumbnailUrl);
      const reader = new FileReader();
      reader.readAsDataURL(fileGot.data);
      reader.onloadend = async function () {
        thumbnail.value = reader.result as string;
      };

    } catch (error) {
      thumbnail.value = THUMBNAIL_DEFAULT;
    }
  } else {
    thumbnail.value = THUMBNAIL_DEFAULT;
  }
});

const openDeleteConfirmModal = ref(false);
const currentId = ref(null);

const onDelete = async () => {
  try {
    store.deletePost(currentId.value);
    router.push({ name: "bulletinBoard" });
    notifySuccess("Post deleted.");
  } catch (error) {
    notifyError("Post deleted fail.");
  }
};

const goBefore = () => {
  router.push({ name: "bulletinBoard" });
};

async function downloadFileAttachment(data: IAttachmentPost) {
  await downloadFile(data.filePath);
}
</script>

<template>
  <div id="view-bulletinDetail">
    <div class="view-bulletin">
      <div class="view-bulletin__header d-flex justify-content-between m-3">
        <div class="d-flex align-items-center">
          <fs-button variant="outline-info" class="btn rounded-circle icon-arrow-left px-2" @click="goBefore">
            <font-awesome-icon :icon="['fal', 'fa-arrow-left']" />
          </fs-button>
          <strong class="ms-2">Post Detail</strong>
        </div>
        <div class="d-flex">
          <fs-button variant="outline-info" class="btn btn-custom py-0" @click="
            $router.push({
              name: 'editPost',
              params: { id: dataBulletinBoardDetail.postId },
            })
            ">
            <font-awesome-icon :icon="['fal', 'fa-pen-to-square']" />
          </fs-button>

          <fs-button variant="outline-danger" class="btn btn-custom py-0" @click="openDeleteConfirmModal = true">
            <font-awesome-icon :icon="['fal', 'fa-trash-can']" />
          </fs-button>
        </div>
      </div>

      <hr class="my-0" />

      <preview :thumbnail="thumbnail" :dataBulletinBoardDetail="dataBulletinBoardDetail"
        @download="downloadFileAttachment" />
    </div>

    <fs-modal id="delete-modal" ref="modal" content-class="content-fsModal" body-class="body-fsModal"
      header-bg-variant="blue" header-close-variant="light" header-text-variant="white" hide-header-close="true"
      v-model="openDeleteConfirmModal" @close="openDeleteConfirmModal = false" @ok="onDelete">
      <template #modal-header="{ cancel }">
        <div class="w-100 d-flex align-items-center justify-content-between">
          <div class="title">Delete Post</div>
          <fs-link class="text-secondary" tag="a" @click="cancel">
            <font-awesome-icon :icon="['fal', 'times']" size="lg" class="text-white" />
          </fs-link>
        </div>
      </template>
      <template #default>
        <div class="p-3">
          <h5 class="lh-base">
            <font-awesome-icon :icon="['fal', 'fa-circle-exclamation']" class="me-2 text-danger" />
            Are you sure you want to delete the following post?
            <br />
            <span class="fw-bold dataTitle">
              {{ dataBulletinBoardDetail?.title }}
            </span>
          </h5>
        </div>
      </template>

      <template #modal-footer="{ ok, cancel }">
        <fs-button @click="cancel" variant="light" class="px-4 py-2 fw-semibold">CANCEL
        </fs-button>
        <fs-button @click="() => {
          currentId = dataBulletinBoardDetail?.postId;
          ok();
        }
          " variant="danger" class="px-4 py-2 fw-semibold">DELETE
        </fs-button>
      </template>
    </fs-modal>
  </div>
</template>
