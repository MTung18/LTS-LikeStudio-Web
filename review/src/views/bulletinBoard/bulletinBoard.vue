<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import type { Ref } from "vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Grid, Store, Popup } from "@bryntum/grid";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { Bulletin } from "@/models/Bulletin";
import { useBulletinBoardStore } from "@/stores/bulletinBoardStore";
import { storeToRefs } from "pinia";
import router from "@/router";
import publishBulletinPanel from "@/components/viewComponents/bulletinBoard/publishBulletinPanel.vue";
import gridList from "@/components/viewComponents/bulletinBoard/gridList.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useLoadingStore } from "@/stores/loadingStore";
import {
  faListUl,
  faGrid2,
  faBullhorn,
  faMagnifyingGlass,
  faCircleEllipsisVertical,
  faFileMagnifyingGlass
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAlerts } from "@/composables/useAlerts";
import { debounce } from "lodash-es";

library.add(
  faListUl,
  faGrid2,
  faBullhorn,
  faMagnifyingGlass,
  faCircleEllipsisVertical,
  faFileMagnifyingGlass
);
const { responsive } = useBreakpoints();
const tableKey = ref(null);
const publishBulletin = ref<InstanceType<typeof publishBulletinPanel>>(null);

interface Props {
  modelValue?: Bulletin;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
});

const { setLoading } = useLoadingStore();
const { notifySuccess } = useAlerts();
const store = useBulletinBoardStore();
const hqSuiteStore = useHQSuiteStore();
const { listOfBulletinBoards, listOfBulletinBoardsWithImage } = storeToRefs(store);
const gridLocalStorageKey = "BulletinBoardList";
const POST_TYPE = "postType";
const BULLETIN_TYPE = "bulletinBoardType";
const defaultSorter = {
  field: "date",
  ascending: true,
};

const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);
const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  height: '100%',
  emptyText: "",
  features: {
    search: true,
    regionResize: false,
    columnPicker: {
      groupByRegion: true,
    },
  },
  columns: [
    {
      text: "Title",
      field: "title",
      htmlEncode: false,
      cellCls: 'ps-4',
      cls: 'ps-4',
      renderer: ({ record }) =>
        `<div class="title">${getTitle(record.isPublishedOnESSDashboard)} ${record.title}</div>`,
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      },
    },
    {
      text: "Category",
      field: "categoryName",
      htmlEncode: false,
      renderer: ({ record }) => `${getCategory(record)}`,
      small: {
        autoWidth: true,
      },
      large: {
        flex: 1,
      }
    },
    {
      text: "Description",
      field: "postContent",
      htmlEncode: false,
      renderer: ({ record }) => {
        return `<div class="description">${record.postContent}</div>`;
      },
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      }
    },
    {
      text: "Date",
      field: "createdDateUTC",
      sortable: true,
      cellCls: "ellipsis-text",
      renderer: ({ record }) => {
        return record.data.createdDateUTC
      },
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      }
    },
    {
      text: "Posted By",
      field: "createdEmployeeFullName",
      htmlEncode: false,
      renderer: ({ record }) => {
        return record.data.createdEmployeeFullName;
      },
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      }
    },
    {
      text: "Actions",
      id: "action",
      type: "action",
      minWidth: 150,
      cellCls: "b-action-cell--hover",
      cls: "d-block",
      region: 'right',
      locked: false,
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      },
      actions: [
        {
          visible: true,
          renderer: () => {
            if (typePostActive.value === TypePost.Post)
              return '<i class="b-action-item b-fa b-fa-external-link btn btn-link text-success no-underline"><span>View</span></i>';
            else return "";
          },
          onClick: ({ record }) => viewBulletin(record),
        },
        {
          visible: true,
          renderer: () => '<i class="b-action-item b-fa b-fa-edit btn btn-link text-success no-underline"><span>edit</span></i>',
          onClick: ({ record }) => updateBulletin(record),
        },
        {
          visible: true,
          renderer: () => '<i class="b-action-item b-fa b-fa-trash-alt btn btn-link text-red no-underline"><span>Delete</span></i>',
          onClick: ({ record }) => deleteBulletin(record),
        },
      ],
    },
  ],
});

function routeToPost(data: Bulletin) {
  if (data.postStatusId === TypePost.Draft) {
    router.push({
      name: "editDraftPost",
      params: {
        id: data.postId,
      },
    });
  } else if (data.postStatusId === TypePost.Post) {
    router.push({
      name: "editPost",
      params: {
        id: data.postId,
      },
    });
  }
}

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
    onFilter: () => {
      // Ensures that store is always set correctly based on search text
      if (
        searchText.value &&
        gridStore.value.filters.count < filterCount.value
      ) {
        filterBryntumStore();
      }
      filterCount.value = gridStore.value.filters.count;
    },
  })
);

function cutStr(str: string): string {
  const element = document.createElement("div");
  element.innerHTML = str;
  const strChange = element.innerText.substring(0, 200);

  return strChange;
}

const showTypeData = ref(null);
const typePostActive: Ref<TypePost> = ref(1);

enum TypePost {
  Post = 1,
  Draft = 2,
}
const filterTable = async (postType: TypePost) => {
  localStorage.setItem(POST_TYPE, JSON.stringify(postType));
  typePostActive.value = postType;
  gridStore.value.data = showTypeData.value;
  query.value = ''
};

onMounted(async () => {
  try {
    setLoading(true);
    typePostActive.value = +localStorage.getItem(POST_TYPE) || TypePost.Post;
    await store.fetchListOfBulletinBoards();
    const imageList = await hqSuiteStore.getAllImageInListPost(
      store.listOfBulletinBoards.map((post: Bulletin) => post.thumbnailUrl)
    );
    await store.mapListBulletinWithImage(imageList)
  } finally {
    setLoading(false);
  }
  gridStore.value.data = showTypeData.value
});

const getTitle = (isPublishedOnESSDashboard: boolean) => {

  switch (isPublishedOnESSDashboard) {
    case true:
      return `<i class="b-fa b-fa-bullhorn bullhorn"></i>&nbsp`;
    default:
      return ``;
  }
};

const getCategory = (record) => {
  return `<div class="category" style="background-color:${record.categoryColor};">${record.categoryName}</div>`;
};

const filterCount = ref(0);
const nonFilteredProps = ["id"];
const filteredBulletinList = ref(new Array<Bulletin>());
function filterBryntumStore() {
  filterStoreDataBySearchText(
    filteredBulletinList.value,
    nonFilteredProps,
    searchText.value,
    gridStore.value
  );
}

const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);

const saveGridSettings = () => {
  localStorage.setItem(
    `${gridLocalStorageKey}State`,
    JSON.stringify((gridStore.value as any).state)
  );
  localStorage.setItem(`${gridLocalStorageKey}SearchText`, searchText.value);
};

function clearGridSettings() {
  gridStore.value.clearFilters();
  gridStore.value.clearSorters();
  localStorage.removeItem(`${gridLocalStorageKey}State`);
  localStorage.removeItem(`${gridLocalStorageKey}SearchText`);
}

function hideFilterBar() {
  gridStore.value.clearFilters();
  gridFeatures.value.filterBar.hideFilterBar();
}

const viewBulletin = (record: any) => {
  router.push({ name: "viewBulletinDetail", params: { id: record.postId } });
};

const updateBulletin = async (record: any) => {
  routeToPost(record);
};

const deleteBulletin = async (record: any) => {
  const popup = new Popup({
    header: "Delete Post",
    autoShow: false,
    centered: true,
    closeAction: "destroy",
    closable: true,
    autoClose: false,
    width: "500px",
    cls: "popup-delete",
    modal: true,
    bbar: {
      items: {
        cancel: {
          text: "CANCEL",
          minWidth: 100,
          onAction: () => {
            popup.close();
          },
        },
        delete: {
          text: "DELETE",
          minWidth: 100,
          cls: "b-raised b-red",
          onAction: async () => {
            try {
              store.deletePost(record.postId);
              notifySuccess("Post deleted.");
              gridStore.value.remove(record);
            } catch (error) {
              console.log(error);
            }
            popup.close();
          },
        },
      },
    },
    html: `<i class="b-fa b-fa-exclamation-circle icon-exclamation-circle"></i>
            <div class="item-text">
              <p>Are you sure you want to delete the following post?</p>
              <strong>${record.title}</strong>
            </div>`,
  });
  popup.show();
};

const showPublishBulletin = ref([]);

async function openSidePanelForPublish() {
  showPublishBulletin.value = listOfBulletinBoards.value.filter(
    (item: Bulletin) => item.isPublishedOnESSDashboard === true && item.postStatusId === TypePost.Post
  );
  publishBulletin.value.isOpen = true;
}

const checkList = ref(false);
const bulletinBoardType = ref<string | Storage>(
  localStorage.getItem(BULLETIN_TYPE) || "list"
);
function showGrid(viewType: string) {
  localStorage.setItem(BULLETIN_TYPE, viewType);
  bulletinBoardType.value = viewType;

  if (viewType) {
    checkList.value = false;
  } else checkList.value = true;
  query.value = '';
  gridStore.value.clearFilters();
}

async function handleDeletePost(data: number) {
  try {
    setLoading(true);
    await store.deletePost(data);
    showTypeData.value = showTypeData.value.filter((item: Bulletin) => item.postId !== data)
    gridStore.value.data = showTypeData.value;
    notifySuccess('Post deleted.')

  } finally {
    setLoading(false);
  }
}

//search title
const query = ref("");

const search = async () => {
  showTypeData.value = filterDataAsType(listOfBulletinBoardsWithImage?.value)
    .filter((post: Bulletin) => post.title.toLocaleLowerCase().includes(query.value.toLocaleLowerCase()));
};

//-- Watch input change
watch(() => query.value, debounce(async () => {
  showTypeData.value = filterDataAsType(listOfBulletinBoardsWithImage?.value)
    .filter((post: Bulletin) => post.title.toLocaleLowerCase().includes(query.value.toLocaleLowerCase()));
}, 500))




//- Type post or type draft
function filterDataAsType(postData: Bulletin[]) {
  return postData.map((item: Bulletin) => ({
    ...item,
    postContent: cutStr(item.postContent),
  }))
    .filter(
      (item: Bulletin) => item.postStatusId === typePostActive.value
    ) || [];
}

watch(
  () => listOfBulletinBoardsWithImage?.value,
  (newVal) => {

    showTypeData.value = filterDataAsType(newVal)
  },
  {
    deep: true
  }
);

watch(() => typePostActive.value, () => {
  gridStore.value.clearFilters();
  showTypeData.value = filterDataAsType(listOfBulletinBoardsWithImage?.value)
  gridStore.value.data = showTypeData.value
})


const handleChangeStatus = (postId) => {
  const postFound = showTypeData.value.find((post: Bulletin) => post.postId === postId)
  if (postFound) {
    postFound.isPublishedOnESSDashboard = false;
  }
  gridStore.value.data = showTypeData.value;
}

</script>

<template>
  <div class="hq-pg pb-0">
    <div class="hq-pg__grid">
      <div>
        <bryntum-search-bar title="Bulletin Board" :local-storage-key="gridLocalStorageKey"
          :show-settings-button="bulletinBoardType == 'list'" :show-filter-button="bulletinBoardType == 'list'"
          @save-settings="saveGridSettings()" @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
          @show-filter-bar="gridFeatures.filterBar.showFilterBar()" :show-search-button="bulletinBoardType == 'grid'"
          @search-text-input="query = $event">
          <template #buttons>
            <div class="d-flex">
              <fs-popper v-if="bulletinBoardType == 'list'" hover tooltip content="Grid Display" class="me-2">
                <fs-button variant="outline-cyan" @click="showGrid('grid')" class="px-2">
                  <font-awesome-icon :icon="['fal', 'grid-2']" class="icons" />
                </fs-button>
              </fs-popper>
              <fs-popper v-else hover tooltip content="List Display" class="me-2">
                <fs-button variant="outline-cyan" @click="showGrid('list')" class="px-2">
                  <font-awesome-icon :icon="['fal', 'fa-list-ul']" class="icons" />
                </fs-button>
              </fs-popper>
              <fs-popper hover tooltip content="Manage Published Posts" class="me-2">
                <fs-button variant="outline-magenta" @click="openSidePanelForPublish()" class="px-2">
                  <font-awesome-icon :icon="['fal', 'bullhorn']" class="text-violet" />
                </fs-button>
              </fs-popper>

              <fs-button :to="{ name: 'addPost' }" variant="primary">NEW {{
                responsive.mobile ? "" : "POST" }}
              </fs-button>
            </div>
          </template>
        </bryntum-search-bar>
        <fs-container fluid class="hq-pg__header contain">
          <fs-row align-v="center">
            <fs-col>
              <fs-button :class="typePostActive === TypePost.Post ? 'rounded-pill' : 'hq-pg__tab text-decoration-none'"
                :variant="typePostActive === TypePost.Post ? 'cyan ' : 'link'" @click="filterTable(TypePost.Post)">
                Posted
              </fs-button>
              <fs-button :class="typePostActive === TypePost.Draft ? 'rounded-pill' : 'hq-pg__tab text-decoration-none'"
                :variant="typePostActive === TypePost.Draft ? 'cyan ' : 'link'" @click="filterTable(TypePost.Draft)">
                Drafts
              </fs-button>
            </fs-col>
          </fs-row>

        </fs-container>
      </div>

      <div v-if="bulletinBoardType == 'list'" id="bulletin-board"
        class="action-grid list__table list__table--onpage list__b-grid--hover">
        <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
      </div>
      <div v-else>
        <gridList :posts="showTypeData" @delete="handleDeletePost" />
      </div>
    </div>
  </div>

  <publishBulletinPanel ref="publishBulletin" @changePublishStatus="handleChangeStatus"
    :showPublishBulletin="showPublishBulletin" />
</template>


<style scoped lang="scss">
:deep(#custom-button) {
  display: initial !important;
}

:deep(#custom-button > div) {
  justify-content: flex-end !important;

  @media screen and (max-width: 767px) {
    justify-content: space-between !important;
  }
}

:deep(.bullhorn) {
  color: #C43D97;
  font-size: 18px;
  transform: scaleX(0.9);
}

:deep(.list__table--onpage) {
  overflow: hidden !important;
}

:deep(.b-grid-splitter) {
  border: none;
}
</style>