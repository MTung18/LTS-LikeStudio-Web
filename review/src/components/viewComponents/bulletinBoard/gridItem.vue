<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, Ref } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Bulletin } from "@/models/Bulletin";
import router from "@/router";
import {
  faEllipsisVertical,
  faTimes,
  faBullhorn,
  faCircleExclamation,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import moment from 'moment';

library.add(faEllipsisVertical, faTimes, faBullhorn, faCircleExclamation);

enum routeType {
  EditPost = 1,
  EditDraftPost = 2,
}

interface Props {
  post: Bulletin;
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { post } = defineProps<Props>();

const THUMBNAIL_DEFAULT = "/images/default-thumbnail.png";

const toggle = ref(false);
const color = computed(() => (categoriesColor) => categoriesColor);

//-- Close when click outside element
const componentRef = ref(null);
const listener = (event) => {
  if (!componentRef.value) return;

  if (
    event.target !== componentRef.value &&
    event.composedPath().includes(componentRef.value)
  ) {
    return;
  }
  toggle.value = false;
};

onMounted(() => {
  window.addEventListener("click", listener);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", listener);
});

const currentId: Ref<number | null> = ref(null);
const openDeleteConfirmModal = ref(false);

const viewBulletin = (post: Bulletin) => {
  router.push({ name: "viewBulletinDetail", params: { id: post.postId } });
};

const fncRouterTo = (data: Bulletin) => {
  if (data.postStatusId === routeType.EditDraftPost) {
    router.push({
      name: "editDraftPost",
      params: {
        id: data.postId,
      },
    });
  } else if (data.postStatusId === routeType.EditPost) {
    router.push({
      name: "editPost",
      params: {
        id: data.postId,
      },
    });
  }
};

function isImageBase64(str) {
  const checkString = Boolean(str?.startsWith('data:application/octet-stream;base64,'));
  return checkString;
}

</script>

<template>
  <div id="grid-item">
    <fs-card img-top class="post overflow-hidden" @click="viewBulletin(post)" no-body>
      <div class="post__image">
        <fs-card-img :src="isImageBase64(post.thumbnailUrl) ? post.thumbnailUrl : THUMBNAIL_DEFAULT" alt="Image" class="img-fluid rounded-0"/>
      </div>


      <fs-card-body class="post__body">
        <div class="d-flex justify-content-between align-items-center">
          <div class="name-icon">
            <img class="thumbnail" :src="isImageBase64(post.thumbnailUrl) ? post.thumbnailUrl : THUMBNAIL_DEFAULT" />
            <span class="name ms-1">
              {{ post?.createdEmployeeFullName }}
            </span>
          </div>
          <span class="date">{{ moment(post?.createdDateUTC).format("MM/DD/YYYY") }}</span>
        </div>
        <div class="post__body--title d-flex justify-content-between align-items-center">
          <span class="title-post"><font-awesome-icon class="me-2 icon-bullhorn" v-if="post?.isPublishedOnESSDashboard"
              :icon="['fal', 'bullhorn']" />{{ post?.title }}</span>
          <div class="position-relative" ref="componentRef">
            <span @click.stop="toggle = !toggle" :class="[
              'icon px-2',
              {
                visible: toggle,
              },
            ]">
              <font-awesome-icon :icon="['fal', 'ellipsis-vertical']" size="sm" /></span>
            <div v-if="toggle" :class="['position-absolute shadow  dropdown-btn']">
              <div class="block" @click.stop="fncRouterTo(post)">Edit...</div>
              <div class="text-danger" @click.stop="openDeleteConfirmModal = true">
                Delete
              </div>
            </div>
          </div>
        </div>
        <p class="post__body--description trim-text"> {{ post?.postContent }}</p>
        <span class="category1" :style="`background-color: ${color(post?.categoryColor)}`">{{ post?.categoryName
        }}</span>
      </fs-card-body>
    </fs-card>

    <!-- Modal -->
    <fs-modal id="delete-modal" ref="modal" content-class="content-fsModal" body-class="body-fsModal"
      header-bg-variant="blue" header-close-variant="light" header-text-variant="white" hide-header-close="true"
      v-model="openDeleteConfirmModal" @close="openDeleteConfirmModal = false">
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
            <span class="fw-bold dataTitle"> {{ post?.title }} </span>
          </h5>
        </div>
      </template>
      <template #modal-footer="{ ok, cancel }">
        <fs-button @click="cancel" variant="light" class="px-4 py-2 fw-semibold">CANCEL
        </fs-button>
        <fs-button @click="() => {
          currentId = post?.postId;
          $emit('delete', currentId);
          ok();
        }
          " variant="danger" class="px-4 py-2 fw-semibold">DELETE
        </fs-button>
      </template>
    </fs-modal>
  </div>
</template>
