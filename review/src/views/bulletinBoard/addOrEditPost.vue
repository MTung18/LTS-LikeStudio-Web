<script setup lang="ts">
import froalaEditor from "@/components/global/froalaEditor.vue";
import preview from "@/components/viewComponents/bulletinBoard/preview.vue";
import { useAlerts } from "@/composables/useAlerts";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { useClickOutside } from "@/composables/useClickOutside";
import {
  AlertEvent,
  AlertResourceType,
  AlertApplicationId
} from "@/enums/notifications/NotificationEnum";
import { Bulletin, DocumentCategoryName, IAttachmentPost } from "@/models/Bulletin";
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import { useBulletinBoardStore } from "@/stores/bulletinBoardStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { removeAccents } from "@/utilities/formatUtils";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  Category
} from "@/models/Category";
import {
  faArrowUpFromBracket,
  faAsterisk,
  faBookOpen,
  faCircleExclamation,
  faCity,
  faEllipsisVertical,
  faFileMagnifyingGlass,
  faPaperclip,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import moment from "moment";
import { storeToRefs } from "pinia";
import { Ref, computed, onMounted, reactive, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoadingStore } from "@/stores/loadingStore";
import {
  INotificationObj
} from "@/models/notifications/Notification";
import { toBase64 } from '@/helper/hqSuite/formatHelper';
import { NOTIFICATION_MESSAGES } from '@/constants/notification';

const bulletBoardStore = useBulletinBoardStore();

library.add(
  faCity,
  faBookOpen,
  faAsterisk,
  faArrowUpFromBracket,
  faPenToSquare,
  faTrashCan,
  faPaperclip,
  faEllipsisVertical,
  faFileMagnifyingGlass,
  faCircleExclamation
);

const { responsive } = useBreakpoints();
const { notifySuccess, notifyError } = useAlerts();
const notificationStore = useNotificationStore();
const categoryStore = useCategoryStore();
const bulletinStore = useBulletinBoardStore();
const { categoryList } = storeToRefs(categoryStore);
const { bulletinBoardDetail } = storeToRefs(bulletinStore);
const route = useRoute();
const router = useRouter();
const ddContent = ref(null);
const isOpenDD = ref(false);
const { setLoading } = useLoadingStore();

useClickOutside(ddContent, () => {
  isOpenDD.value = false;
});
const azureB2CAuthStore = useAzureB2CAuthStore();
const hqSuiteStore = useHQSuiteStore();
const clientId = computed(
  () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);

const { listOfBulletinBoards } = storeToRefs(bulletinStore);

const { fetchEmployeeList } = useEmployeeStore();
const { employeeList } = storeToRefs(useEmployeeStore());
const openDeleteConfirmModal = ref(false);
const bulletinId = ref(null);
const MAX_SIZE = 10; // 10mb
const isPreview = ref(false);
const initData = reactive<Bulletin>({
  postId: 0,
  title: null,
  postDescription: null,
  postContent: null,
  thumbnailUrl: null,
  updatedEmployeeFullName: null,
  createdEmployeeFullName: null,
  isPublishedOnESSDashboard: false,
  essDashboardPublishDate: null,
  essDashboardExpirationDate: null,
  categoryName: null,
  categoryColor: null,
  postCategoryId: null,
  postStatusId: null,
  viewsCount: null,
  createdDateUTC: null,
  updatedDateUTC: null,
  documentCategoryName: DocumentCategoryName,
  postDocumentMetadata: [],
});

const thumbnail = ref("") as Ref<string>;
const form = ref(null);

const data = reactive<Bulletin>({
  ...initData,
});

const blur = ref(false);

function onInvalidSubmit() {
  blur.value = true;
}

const DATE_START = "essDashboardPublishDate";
const DATE_END = "essDashboardExpirationDate";

function setValue(dataApi) {
  for (const key in data) {

    if (key === DATE_START || key === DATE_END) {
      data[key] = moment(dataApi[key]).format("YYYY-MM-DD");
    } else {
      data[key] = dataApi[key];
    }
  }

  data.documentCategoryName = 'General';
}

// -- Get user recipients
const mapEmployeeList = computed(() => {
  return employeeList.value.map(employee => ({
    userGuid: employee.aspNetUserId,
    clientId: employee.clientId
  }))
})

onMounted(async () => {
  // get list employee 
  try {
    setLoading(true);
    hqSuiteStore.fetchAllowedExtensions();
    fetchEmployeeList();
    if (route.name === "editPost" || route.name === "editDraftPost") {
      bulletinId.value = +route.params.id;
      await Promise.all([bulletinStore.fetchBulletinBoardDetail(bulletinId.value), categoryStore.fetchCategories()]);
      setValue(bulletinBoardDetail.value);
      if (bulletinBoardDetail.value.postCategoryId) {
        categorySelected.value = categoryList.value.find(category => category.postCategoryId === bulletinBoardDetail.value.postCategoryId)
      }

      if (!data.isPublishedOnESSDashboard) {
        data.essDashboardPublishDate = null;
        data.essDashboardExpirationDate = null;
      }
      //-- Check if edit post convert image to base64 to display
      if (data.thumbnailUrl) {
        const fileGot = await hqSuiteStore.getFile(data.thumbnailUrl);
        const reader = new FileReader();
        reader.readAsDataURL(fileGot.data);
        reader.onloadend = async function () {
          thumbnail.value = reader.result as string;
        };
      }
    } else {
      categoryStore.fetchCategories();
    }
  } finally {
    setLoading(false);
  }
});

function getContentEditor(pContent: string) {
  data.postContent = pContent;
  blur.value = true;
}

async function deleteFile(filePath: string, index: number) {
  await hqSuiteStore.deleteFile(filePath);
  data.postDocumentMetadata.splice(index, 1);
}

function changeFileName(file) {
  const fileName = file.split(".");
  const name = removeAccents(fileName[0])
  return `${name}-${Date.now()}.${fileName[fileName.length - 1]}`;
}
const sourcePath = computed(() => `${clientId.value}/${DocumentCategoryName}/Documents`);

async function previewFiles(event) {
  const files = await event.target.files;
  const file = files[0];
  if (isFileImage(file)) {
    notifyError("Can't upload image file.");
    return;
  }
  if (file.size / 1024 ** 2 > MAX_SIZE) {
    notifyError(`Can't upload file over ${MAX_SIZE}mb.`);
    return;
  }

  // Get extension file
  const fileChangeName = new File([file], changeFileName(file.name));
  const fileDate = {
    file: fileChangeName,
    path: sourcePath.value,
    fileName: fileChangeName.name,
  };

  // Get extension of fileName
  const fileExtension = getFileExtension(fileChangeName.name);

  // Check file extension valid
  if (
    !hqSuiteStore.allowedExtensions
      .map((extension) => extension.extensionType)
      .includes(fileExtension)
  ) {
    notifyError(`Can't upload file type.`);

    return;
  }

  //-- Upload file
  try {
    setLoading(true);
    await hqSuiteStore.uploadDocument(fileDate, true);
  } finally {
    setLoading(false);
  }

  const iAttachmentPost: IAttachmentPost = {};
  iAttachmentPost.description = "";
  iAttachmentPost.name = hqSuiteStore.uploadedDocumentDetails.name;
  iAttachmentPost.filePath = hqSuiteStore.uploadedDocumentDetails.path;

  data.postDocumentMetadata.push(iAttachmentPost);
}

function getFileExtension(filename) {
  // get file extension
  const extension = filename.split(".").pop();
  return extension;
}

async function previewImage(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  const file = files[0];
  const fileChangeName = new File([file], changeFileName(file.name));

  const fileDate = {
    file: fileChangeName,
    path: sourcePath.value,
    fileName: fileChangeName.name,
  };

  // Get extension of fileName
  const fileExtension = getFileExtension(fileChangeName.name);

  // Check file extension valid
  if (
    !hqSuiteStore.allowedExtensions
      .map((extension) => extension.extensionType)
      .includes(fileExtension)
  ) {
    notifyError(`Can't upload file type.`);

    return;
  }

  //-- When edit post delete image and upload new Image
  if (data.thumbnailUrl) {
    await deleteImage(data.thumbnailUrl);
  }

  try {
    setLoading(true);
    await hqSuiteStore.uploadDocument(fileDate, true);
    const fileGot = await hqSuiteStore.getFile(
      hqSuiteStore.uploadedDocumentDetails.path
    );

    data.thumbnailUrl = hqSuiteStore.uploadedDocumentDetails.path;

    const reader = new FileReader();
    reader.readAsDataURL(fileGot.data);
    reader.onloadend = async function () {
      thumbnail.value = reader.result as string;
    };
  } finally {
    setLoading(false);
  }

}

// Delete Images Files Storage
async function deleteImage(filePath: string) {
  await hqSuiteStore.deleteFile(filePath);
  thumbnail.value = "";
  data.thumbnailUrl = "";
}

function previewPost() {
  isPreview.value = true;
}

function closePreview() {
  isPreview.value = false;
}

const mess = ref('');

const statusIdCheck = ref();
const saveBulletin = async (statusIds) => {
  data.postStatusId = statusIds === "draft" ? 2 : 1;
  statusIdCheck.value = statusIds;
};
watch(
  () => data.isPublishedOnESSDashboard,
  (newVal) => {
    if (!newVal) {
      nextTick(() => {
        mess.value = '';
        data.essDashboardPublishDate = null;
        data.essDashboardExpirationDate = null;
      })
    }
  }, {
  immediate: true
}
);

watch(
  () => data.postCategoryId,
  (newVal) => {
    const categoryFound = categoryStore.categoryList.find(
      (category) => category.postCategoryId === newVal
    );
    if (categoryFound) {
      data.categoryName = categoryFound.categoryName;
      data.categoryColor = categoryFound.categoryColor;
    }
  }
);

const MESSAGE_ERROR = 'You can only have 3 posts on ESS Dashboard at a time. Remove posts from ESS Dashboard to add a new one';
async function onSubmit() {
  mess.value = '';
  blur.value = true;
  if (data.postStatusId === 2 && route.name === "addPost") {

    if ((blur.value = true && !data.postContent)) {
      return;
    }
    delete data.postId;
    await bulletBoardStore.addBulletinBoard({ ...data, postContent: toBase64(data.postContent) });
    notifySuccess("Post saved as draft.");
    router.push({ name: "bulletinBoard" });
  } else {

    if (statusIdCheck.value === "post-new") {
      delete data.postId;

      const resAdd = await bulletBoardStore.addBulletinBoard({ ...data, postContent: toBase64(data.postContent) });
      if (resAdd === true) {
        await form.value.resetForm();
        data.isPublishedOnESSDashboard = false;
        data.essDashboardExpirationDate = null;
        data.essDashboardPublishDate = null;
        data.thumbnailUrl = "";
        blur.value = false;
        notifySuccess("Post posted.");
      } else {
        if (resAdd.status == 422) {
          mess.value = MESSAGE_ERROR;
          return;
        }
        notifyError("Post fail.");
        return;
      }
    } else {
      if (route.name === "addPost") {
        blur.value = true;
        if ((blur.value = true && !data.postContent)) {
          return;
        }

        delete data.postId;
        const resAdd = await bulletBoardStore.addBulletinBoard({ ...data, postContent: toBase64(data.postContent) });
        if (resAdd === true) {
          notifySuccess("Post posted.");
          await bulletBoardStore.fetchListOfBulletinBoards();
          let postId = 0;
          if (listOfBulletinBoards.value.length > 0) {
            postId = listOfBulletinBoards.value[0].postId
          }
          const messageToEmployee = NOTIFICATION_MESSAGES.AddBulletinBoard.replace('[postTitle]', `[${data.title}]`)
          const notificationToEmployee: INotificationObj = {
            alertEventId: AlertEvent.Posted,
            alertResourceTypeId: AlertResourceType.BulletinBoardMessage,
            alertApplicationId: AlertApplicationId.Ess,
            messageType: 'create',
            messagePayload: messageToEmployee,
            resourceId: postId,
            userRecipients: mapEmployeeList.value
          }
          await notificationStore.createNotification(notificationToEmployee);
          router.push({ name: "bulletinBoard" });
        } else {
          if (resAdd.status == 422) {
            mess.value = MESSAGE_ERROR;
            return;
          }
          notifyError("Post fail.");
          return;
        }

      } else {
        if (route.name === "editDraftPost" && statusIdCheck.value === "draft") {
          if ((blur.value = true && !data.postContent)) {
            return;
          }
          data.postStatusId = 2;

          const resAdd = await bulletBoardStore.updateBulletinBoardDetail(data.postId, { ...data, postContent: toBase64(data.postContent) });
          if (resAdd === true) {
            notifySuccess("Post updated.");
            router.push({ name: "bulletinBoard" });
          } else {
            if (resAdd.status == 422) {
              mess.value = MESSAGE_ERROR;
              return;
            }
            notifyError("Post fail.");
            return;
          }
        } else {
          if ((blur.value = true && !data.postContent)) {
            return;
          }

          data.postStatusId = 1;
          const resAdd = await bulletBoardStore.updateBulletinBoardDetail(data.postId, { ...data, postContent: toBase64(data.postContent) });
          const messageToEmployee = NOTIFICATION_MESSAGES.AddBulletinBoard.replace('[postTitle]', `[${data.title}]`)
          const notificationToEmployee: INotificationObj = {
            alertEventId: AlertEvent.Posted,
            alertResourceTypeId: AlertResourceType.BulletinBoardMessage,
            alertApplicationId: AlertApplicationId.Ess,
            messageType: 'create',
            messagePayload: messageToEmployee,
            resourceId: data.postId,
            userRecipients: mapEmployeeList.value
          }
          await notificationStore.createNotification(notificationToEmployee);
          if (resAdd === true) {
            notifySuccess("Post updated.");

            router.push({ name: "bulletinBoard" });
          } else {
            if (resAdd.status == 422) {
              mess.value = MESSAGE_ERROR;
              return;
            }
            notifyError("Post fail.");
            return;
          }
        }
      }
    }
  }
}

const onDelete = async () => {
  try {
    await bulletBoardStore.deleteBulletinBoard(bulletinId.value);
    router.push({ name: "bulletinBoard" });
    notifySuccess("Post deleted.");
  } catch (error) {
    notifyError("Post deleted fail.");
  }
};

function isFileImage(file: File) {
  return file && file["type"].split("/")[0] === "image";
}

//-- Auto grow title
function autoGrow(event) {
  event.target.style.height = "5px";
  event.target.style.height = event.target.scrollHeight + "px";
}

function removeExtensionFileAndTime(name: string) {
  const splitExtension = name.split('-');
  if (splitExtension.length <= 1) {
    return splitExtension.join('')
  } else {
    splitExtension.splice(splitExtension.length - 1, 1)
    return splitExtension.join('')
  }
}

const categorySelected = ref<Category>();

watch(() => categorySelected.value, (newVal: Category) => {
  data.postCategoryId = newVal.postCategoryId
})

</script>

<template>
  <div id="formAddAndEdit" v-if="!isPreview">
    <div class="header d-flex justify-content-between align-items-center p-3">
      <h1 class="title" v-if="!(route.name === 'editDraftPost')">
        {{ route.name === "addPost" ? "Add" : "Edit" }} Post
      </h1>
      <h1 class="title" v-else>Edit draft</h1>
      <div class="d-inline-block ms-3">
        <fs-button variant="outline-secondary" @click="
          $router.push({
            name: 'bulletinBoard',
          })
          ">CANCEL</fs-button>
        <fs-button v-if="(route.name === 'addPost' || route.name === 'editDraftPost') &&
          !(responsive.breakpoint === 'sm')
          " variant="outline-secondary" form="form" type="submit" @click="saveBulletin('draft')">
          SAVE DRAFT</fs-button>
        <fs-button @click="previewPost()" variant="outline-info" class="mt-md-0" v-if="!(responsive.breakpoint === 'sm')">
          <font-awesome-icon :icon="['fal', 'file-magnifying-glass']">
          </font-awesome-icon>
          PREVIEW
        </fs-button>
        <fs-button v-if="(route.name === 'editPost' || route.name === 'editDraftPost') &&
          !(responsive.breakpoint === 'sm')
          " variant="outline-danger" @click="openDeleteConfirmModal = true">
          DELETE
        </fs-button>

        <fs-button variant="info" form="form" class="mt-md-0" type="submit" @click="saveBulletin('post')">POST</fs-button>
        <div class="ms-2 d-inline-block dropdown-btn">
          <button class="btn px-1 d-md-none" @click.stop="isOpenDD = !isOpenDD">
            <font-awesome-icon :icon="['fal', 'ellipsis-vertical']">
            </font-awesome-icon>
          </button>
          <div class="dropdown-content shadow" ref="ddContent" v-if="isOpenDD">
            <button class="btn" form="form" type="submit" @click.stop="saveBulletin('draft')">
              Save draft
            </button>
            <button class="btn" @click="previewPost()">Preview</button>
            <button class="btn text-danger" v-if="route.name === 'editPost' || route.name === 'editDraftPost'"
              @click="openDeleteConfirmModal = true">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-0" />
    <div class="overflow">
      <fs-container class="container">
        <VeeForm @submit="onSubmit" class="form" id="form" ref="form" @invalid-submit="onInvalidSubmit">
          <div class="form__group">
            <h3>POST SETTINGS</h3>

            <fs-form-checkbox name="check-button" switch size="lg" v-model="data.isPublishedOnESSDashboard">
              Publish on Employee Dashboard
            </fs-form-checkbox>

            <div v-if="mess" class="text-danger">{{ mess }}</div>

            <fs-row class="mt-3">
              <fs-col lg="6">
                <fs-input :class="{ enable: !data.isPublishedOnESSDashboard }" ref="datePublish" :required="true"
                  label="Employee Dashboard Publish Date" :rules="data.isPublishedOnESSDashboard
                    ? 'required|onOrAfterToday|dateBeforeTarget:end_date,Expiration date' : ''" type="fsDateInput"
                  name="start_date" id="publish-date" v-model="data.essDashboardPublishDate"
                  :disabled="!data.isPublishedOnESSDashboard"></fs-input>
              </fs-col>
              <fs-col lg="6">
                <fs-input :class="{ enable: !data.isPublishedOnESSDashboard }" ref="dateExpiration" :required="true"
                  label="Employee Dashboard Expiration Date"
                  :rules="data.isPublishedOnESSDashboard ? 'required|date|dateAfterTarget:start_date,Publish date' : ''"
                  name="Expiration Date" type="fsDateInput" v-model="data.essDashboardExpirationDate"
                  :disabled="!data.isPublishedOnESSDashboard"></fs-input>
              </fs-col>
            </fs-row>
            <hr class="mt-0" />
          </div>

          <div class="form__group">
            <h3>POST CONTENTS</h3>
            <fs-row>
              <fs-col lg="6">
                <fs-input type="fsMultiselectList" label="Category" :required="true"
                  :typeaheaddata="categoryStore.categoryList" typeaheadkey="categoryName" v-model="categorySelected"
                  typeaheadvalueattribute="postCategoryId" name="category" autocomplete="donotfill"
                  :rules="{ required: true }">
                </fs-input>
              </fs-col>
            </fs-row>
            <fs-row class="mt-3">
              <fs-col>
                <fs-input label="Title" :required="true" id="title" rules="required|max:255" type="fsTextArea" rows="1"
                  name="title" v-model="data.title" role="textbox" class="textarea" contenteditable
                  placeholder="Title here..." @input="autoGrow" />
              </fs-col>
            </fs-row>

            <fs-row class="mt-3">
              <label for="thumbnail">Thumbnail </label>
              <p class="mb-1">
                <small class="text-secondary">Recommended minimum size: 700x400px</small>
              </p>
              <br />
              <fs-col v-if="!data.thumbnailUrl">
                <fs-button variant="outline-secondary position-relative">
                  <font-awesome-icon class="me-2" :icon="['fal', 'arrow-up-from-bracket']">
                  </font-awesome-icon>
                  UPLOAD
                  <input @change="previewImage" accept="image/png, image/jpeg, image/jpg" type="file"
                    class="position-absolute opacity-0 top-0 left-0 right-0 bottom-0 w-100" />
                </fs-button>
              </fs-col>
              <fs-col v-else>
                <div class="post-img position-relative">
                  <div class="handle-image position-absolute d-flex">
                    <div class="w-50 d-flex justify-content-center align-items-center text-white position-relative">
                      <font-awesome-icon :icon="['fal', 'pen-to-square']">
                      </font-awesome-icon>
                      <input @change="previewImage" accept="image/png, image/jpeg, image/jpg" type="file"
                        class="position-absolute opacity-0 top-0 left-0 right-0 bottom-0 w-100" />
                    </div>
                    <div class="w-50 d-flex justify-content-center align-items-center text-white cursor">
                      <font-awesome-icon :icon="['fal', 'trash-can']" @click="deleteImage(data.thumbnailUrl)">
                      </font-awesome-icon>
                    </div>
                  </div>
                  <img :src="thumbnail" alt="" />
                </div>
              </fs-col>
            </fs-row>
            <div :class="[
              'mt-3',
              {
                'editor-error': blur && !data.postContent,
              },
            ]
              ">
              <froalaEditor :id="'bulletin-editor'" @input="getContentEditor" :content="data.postContent" />
            </div>
            <span v-if="blur && !data.postContent" class="message-error">Field is required.</span>
            <fs-row style="margin-bottom: 60px">
              <fs-col>
                <label for="thumbnail">Attachments </label>
                <br />

                <fs-button variant="outline-secondary position-relative mb-2">
                  <font-awesome-icon class="me-2" :icon="['fal', 'arrow-up-from-bracket']">
                  </font-awesome-icon>
                  UPLOAD
                  <input @change="previewFiles" type="file"
                    class="position-absolute opacity-0 top-0 left-0 right-0 bottom-0 w-100" />
                </fs-button>
                <div v-for="( file, index ) in  data.postDocumentMetadata " :key="index">
                  <div>
                    <font-awesome-icon class="me-2 text-light-blue" :icon="['fal', 'paperclip']">
                    </font-awesome-icon>
                    <span class="text-light-blue me-2">
                      {{ removeExtensionFileAndTime(file.name) }}
                    </span>
                    <font-awesome-icon class="me-2 cursor-pointer text-danger" :icon="['fal', 'trash-can']"
                      @click="deleteFile(file.filePath, index)">
                    </font-awesome-icon>
                  </div>
                </div>
              </fs-col>
            </fs-row>
          </div>
        </VeeForm>
        <div class="mt-5"></div>
      </fs-container>
    </div>

  </div>
  <div v-else id="view-bulletinDetail">
    <div class="view-bulletin__header">
      <div class="d-flex justify-content-between">
        <strong>Preview Post</strong>
        <fs-button variant="outline-secondary" @click="closePreview()">
          Close preview
        </fs-button>
      </div>
    </div>

    <hr />
    <preview :dataBulletinBoardDetail="data" :thumbnail="thumbnail" />
  </div>
  <fs-modal id="delete-account" ref="modal" content-class="content-fsModal" body-class="body-fsModal"
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
          <span class="fw-bold"> {{ data.title }} </span>
        </h5>
      </div>
    </template>
    <template #modal-footer="{ ok, cancel }">
      <fs-button @click="cancel" variant="light" class="px-4 py-2 fw-semibold">CANCEL
      </fs-button>
      <fs-button @click="() => {
        bulletinId = data.postId;
        ok();
      }
        " variant="danger" class="px-4 py-2 fw-semibold">DELETE
      </fs-button>
    </template>
  </fs-modal>
</template>

<style scoped lang="scss">
.overflow {
  height: calc(100vh - 110px);
  overflow-y: auto;
}

.dropdown-btn {
  position: relative;

  .dropdown-content {
    background-color: rgb(255, 255, 255);
    text-align: left;
    min-width: 150px;
    position: absolute;
    top: calc(100% + 12px);
    right: 0%;
    z-index: 1000;
    border-radius: 2px;

    button {
      text-align: left;
      width: 100%;
      display: block;
      margin-left: 0px;
    }
  }
}

.container {
  max-width: 700px !important;
}

:deep(#title) {
  resize: none !important;
  overflow: hidden !important;
}

:deep(label + div) {
  margin-top: 8px !important;
}

:deep(.enable button) {
  color: #6c757d;
  border-color: #6c757d;
}
</style>
