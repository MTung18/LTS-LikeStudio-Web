<script setup lang="ts">
import { Ref, ref, watch, onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { BryntumGrid } from '@bryntum/grid-vue-3';
import { Grid, Store } from "@bryntum/grid";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import IconsToolbarItem from "@/models/IconsToolbarItem";
import User from "@/models/settings/PermissionGroupUser";
import { useUserStore } from '@/stores/settings/userStore';
import IconsToolbarWidget from "@/components/shared/iconsToolbarWidget.vue";
import emptyGridLayout from '@/components/shared/emptyGridLayout.vue';
import { stringCaseInsensitiveComparer } from "@/functions/SorterFunctions";
import { employeeStatusBadgeRenderer } from '@/components/shared/bryntumGrid/customCells/employeeStatusBadge';

const { fetchUserList } = useUserStore();
const { userList } = storeToRefs(useUserStore());

const doneLoading = ref(false);

const userSearchText = ref("");

const isTotalFilterId: number = 0;
const isActiveFilterId: number = 1;
const isInactiveFilterId: number = 2;

const currentStatusFilter = ref(0);

const totalCount = ref(0);
const activeCount = ref(0);
const inactiveCount = ref(0);

const userIconsToolbarItems: IconsToolbarItem[] = [
  {
    id: isTotalFilterId,
    icon: ["fal","user"],
    selectedBackground: "#0376F2",
    background: "rgba(3, 118, 242, 0.1)", 
    selectedColor: "#FFFFFF",
    color: "#0376F2",
    title: "Total",
    label: totalCount
  },
  {
    id: isActiveFilterId,
    icon: ["fal","user"],
    selectedBackground: "#1ABC9C",
    background: "rgba(26, 188, 156, 0.1)",
    selectedColor: "#FFFFFF",
    color: "#1ABC9C",
    title: "Active",
    label: activeCount
  },
  {
    id: isInactiveFilterId,
    icon: ["fal","user"],
    selectedBackground: "#6E7C8F",
    background: "rgba(110, 124, 143, 0.1)",
    selectedColor: "#FFFFFF",
    color: "#6E7C8F",
    title: "Inactive",
    label: inactiveCount
  },
];

const gridLocalStorageKey = "userListGrid";
const nonFilteredProps = ["id"];

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
  })
);

function filterBryntumStore() {
  filterStoreDataBySearchText(
    gridStore.value.data,
    nonFilteredProps,
    userSearchText.value,
    gridStore.value
  );
}

function userTypeFilter(user: User): boolean {
  switch (currentStatusFilter.value) {
    case isTotalFilterId: return true
    case isActiveFilterId: return user.isActive === true;
    case isInactiveFilterId: return user.isActive === false;
    default: return true;
  }
}

watch(userSearchText, () => {
  filterBryntumStore()
});

watch(currentStatusFilter, () => {
  gridStore.value.filter({
    filterBy : userTypeFilter
  });
});

const gridConfig = ref({
  autoHeight: true,
  emptyText: "",
  columnLines: false,
  columns: [
    {
        flex: 1,
        text: 'Name',
        id: 'name',
        field: 'name',
        groupable: false,
        sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.lastFirstName, record2.lastFirstName),
        cellCls: 'ps-3',
        cls: 'ps-3'
    },
    {
        flex: 1,
        text: 'Email Address',
        id: 'emailAddress',
        field: 'emailAddress',
        groupable: false,
        sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.emailAddress, record2.emailAddress),
    },
    {
        flex: 1,
        text: 'Permission Group',
        id: 'permissionGroup',
        field: 'permissionGroup',
        groupable: false,
        sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.permissionGroup, record2.permissionGroup),
    },
    {
      flex: 1,
      text: 'Status',
      id: 'status',
      field: 'status',
      htmlEncode: false,
      groupable: false,
      sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.employeeStatusName, record2.employeeStatusName),
      renderer({ record }) {
        return employeeStatusBadgeRenderer(record.employeeStatusName);
      }
    }
  ],
  sortFeature : {
    prioritizeColumns : true
}
});

async function populateBryntumStore() {
  gridStore.value.data = userList.value;
  gridStore.value.sort({field: 'name', ascending: true});

  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

function populateStatusCounts(): void {
  totalCount.value = userList.value.length;
  activeCount.value = userList.value.filter(user => user.isActive).length;
  inactiveCount.value = userList.value.filter(user => !user.isActive).length;
}

onMounted(async () => {
  doneLoading.value = false;

  await fetchUserList();

  populateBryntumStore();
  populateStatusCounts();

  if (userSearchText.value !== "") {
    filterBryntumStore();
  }

  doneLoading.value = true;
});

</script>

<template>

  <fs-overlay
    :show="!doneLoading"
    spinner-variant="primary"
    class="fsi-pg__overlay"
    no-wrap
  />
  <bryntum-search-bar
    title="users"
    :show-footer-search="true"
    :show-title-header="false"
    @search-text-input="userSearchText = $event"
  >
     <template #footer>
      <icons-toolbar-widget
        :status-items="userIconsToolbarItems"
        v-model="currentStatusFilter"
      />
    </template>
  </bryntum-search-bar>

    <div class="list__table b-stripe-vertical b-stripe-horizontal b-grid-header-no-border" style="height: calc(100% - 72px)">
          <bryntum-grid 
            v-show="userList.length > 0"     
            :readOnly="true"
            v-bind="gridConfig"
            :store="gridStore"
          />
          <empty-grid-layout v-if="userList.length === 0" emptyMessage="There are no users for this client." icon="users"/> 
      </div>            
</template>