<script setup lang="ts">
import { computed } from "vue";
import moment from 'moment';
import { Bulletin } from "@/models/Bulletin";
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDownToLine,
} from "@fortawesome/pro-light-svg-icons";


interface Props {
  dataBulletinBoardDetail: Bulletin;
  thumbnail: string;
}


library.add(faArrowDownToLine)

const azureB2CAuthStore = useAzureB2CAuthStore();
// eslint-disable-next-line vue/no-setup-props-destructure
const { dataBulletinBoardDetail } = defineProps<Props>();
const color = computed(() => (categoryColor: string) => categoryColor);

const fullName = computed(() => azureB2CAuthStore?.activeUserAccount?.name);

const THUMBNAIL_DEFAULT = "/images/default-thumbnail.png";

function removeExtensionFileAndTime(name: string) {
  const splitExtension = name.split('-');
  if (splitExtension.length <= 1) {
    return splitExtension.join('')
  } else {
    splitExtension.splice(splitExtension.length - 1, 1)
    return splitExtension.join('')
  }
}
</script>

<template>
  <div class="view-bulletin__body">
    <div class="container-item">
      <div class="mx-24px">
        <label class="container-item-category mt-3" :style="`background-color:${color(
          dataBulletinBoardDetail?.categoryColor
        )}`">
          {{ dataBulletinBoardDetail?.categoryName }}
        </label>

        <div class="container-item-title">
          <strong>{{ dataBulletinBoardDetail?.title }}</strong>
        </div>

        <div class="d-flex justify-content-between infor-post">
          <div class="name-icon">
            <img class="thumbnail" :src="thumbnail ? thumbnail : THUMBNAIL_DEFAULT" alt="" />
            <span class="name ms-1">
              {{ dataBulletinBoardDetail?.createdEmployeeFullName || fullName }}
            </span>
          </div>
          <span class="date">{{
            moment(dataBulletinBoardDetail?.createdDateUTC ? dataBulletinBoardDetail?.createdDateUTC : new
              Date()).format("MM/DD/YYYY")
          }}</span>
        </div>

        <div class="image overflow-hidden">
          <img class="img-fluid" :src="thumbnail ? thumbnail : THUMBNAIL_DEFAULT" alt="Image post" />
        </div>

        <div class="description fr-view trim-text">
          <div v-html="dataBulletinBoardDetail?.postContent"></div>
        </div>

        <div class="attachment"
          v-if="dataBulletinBoardDetail?.postDocumentMetadata && dataBulletinBoardDetail?.postDocumentMetadata.length > 0">
          <strong>Attached Files</strong>
          <div v-for="(file, index) in dataBulletinBoardDetail?.postDocumentMetadata" :key="index"
            class=" file d-flex justify-content-between p-2">
            <div class="down-file">
              <font-awesome-icon :icon="['fal', 'fa-paperclip']" class="icon-file" />
              <a :href="file.filePath" :download="file.filePath" @click.prevent="$emit('download', file)">
                <span class="mx-2 link-file">
                  {{ removeExtensionFileAndTime(file?.name) }}</span>
              </a>
            </div>

            <a class="btn btn-outline-success px-2" :href="file?.filePath" :download="file?.filePath"
              @click.prevent="$emit('download', file)" style="width: 40px">
              <font-awesome-icon :icon="['fal', 'fa-arrow-down-to-line']" />

            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
