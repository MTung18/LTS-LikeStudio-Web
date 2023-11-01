<script setup lang="ts">  

import { inject, onMounted, Ref, ref, watch } from 'vue';
import { useRoute, useRouter, RouteLocationRaw } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleLeft, faFileChartLine, faInfoCircle, faPlus, faEdit, faUsers, faSearch} from '@fortawesome/pro-light-svg-icons';
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { usePermissionGroupStore } from "@/stores/settings/permissionGroupStore";
import { storeToRefs } from 'pinia';
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Grid, Store } from "@bryntum/grid";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import PermissionGroupDetails from '@/models/settings/PermissionGroupDetails';
import PermissionItemEditor from '@/components/shared/permissionItemEditor/permissionItemEditor.vue';
import usersPanel from '@/components/viewComponents/settings/usersAndPermissions/usersPanel.vue';
import { debounce } from "lodash-es";
import emptyGridLayout from '@/components/shared/emptyGridLayout.vue';
import { stringCaseInsensitiveComparer } from "@/functions/SorterFunctions";
import { filterStoreDataBySearchText } from '@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { employeeStatusBadgeRenderer } from '@/components/shared/bryntumGrid/customCells/employeeStatusBadge';

const { fetchPermissionGroupLookup, fetchPermissionGroupDetails} = usePermissionGroupStore();
const { permissionGroupLookup, permissionGroupDetails } = storeToRefs(usePermissionGroupStore());
const router = useRouter();
const route = useRoute();  

const currentPermissionGroup: Ref<PermissionGroupDetails> = ref(new PermissionGroupDetails());
const componentMounted = ref(false);
const isLoading = ref(false);
const permissions = inject('$providePermissions');

const gridStore: Ref<Store> = ref(new Store());

let returnToPermissionGroupsRoute = { name: 'userAndPermissions' } as RouteLocationRaw;

let totalUsersCount = ref(0);
let activeUsersCount = ref(0);
let inactiveUsersCount = ref(0);

let showUsersPanel = ref(false);
let selectedTabIndex = ref(0);
let filterText = ref("");

onMounted(async () => {
  componentMounted.value = false;
  isLoading.value = true;

  await fetchPermissionGroupLookup();

  permissionGroupLookup.value.sort((record1: any, record2: any) => stringCaseInsensitiveComparer(record1.name, record2.name));

  await loadData();

  if(route.hash.toLocaleLowerCase() === "#users")
  {
    selectedTabIndex.value = 0;
  } 
  else if(route.hash.toLocaleLowerCase() === "#pg")
  {
    selectedTabIndex.value = 1;
  } 

  isLoading.value = false;  
  componentMounted.value = true;
});

library.add(
    faArrowCircleLeft,
    faPlus,
    faFileChartLine,
    faEdit,
    faInfoCircle,
    faUsers,
    faSearch,
    faCheck,
);

watch(() => route.params.permissionGroupId, async (newPermissionGroupId, oldPermissionGroupId) => {
  if(newPermissionGroupId !== undefined && newPermissionGroupId !== oldPermissionGroupId)
  {
    await loadData();
  }
}, 
{flush: 'pre', immediate: false, deep: true});

const onPermissionGroupChange = async function(permissionGroupId): Promise<void> {
  if (permissionGroupId === currentPermissionGroup.value.id) return;

  let permissionGroupDetailsRoute: RouteLocationRaw = {
    name: 'permissionGroupDetails', 
    params: { permissionGroupId: permissionGroupId }
  };

  if(selectedTabIndex.value === 1) 
  {
    permissionGroupDetailsRoute.hash = "#pg";
  }
  
  router.push(permissionGroupDetailsRoute);
}

const onEditPermissionGroupClick = function(): void {  
  router.push({
      name: 'permissionGroupForm',
      query: { id: currentPermissionGroup.value.id }
  });
}

const gridConfig = ref({
  autoHeight: true,
  emptyText: "",
  columnLines: false,
  columns: [
    {
        flex: 1,
        id: 'name',
        field: 'name',
        text: 'Name',
        editor: false,
        htmlEncode: false,
        cellCls: 'ps-3',
        cls: 'ps-3',
        sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.lastFirstName, record2.lastFirstName),
    },
    {
        flex: 1,
        id: 'emailAddress',
        field: 'emailAddress',
        text: 'Email',
        sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.emailAddress, record2.emailAddress),
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
        },
    },
  ],
  sortFeature : {
      prioritizeColumns : true
  }
});

async function loadData(updatedPermissionGroup?: PermissionGroupDetails) {
  isLoading.value = true;

  if (updatedPermissionGroup) {
    currentPermissionGroup.value = updatedPermissionGroup;
  }
  else {
    await fetchPermissionGroupDetails(Number(route.params.permissionGroupId));
    currentPermissionGroup.value = permissionGroupDetails.value;
  }

  let users = currentPermissionGroup.value.users

  gridStore.value.data = users;
  gridStore.value.sort({field: 'name', ascending: true});

  totalUsersCount.value = users.length;
  activeUsersCount.value = users.filter(user => user.employeeStatusId == EmployeeStatusEnum.Active).length;
  inactiveUsersCount.value = users.filter(user => user.employeeStatusId == EmployeeStatusEnum.Inactive).length;
  
  selectedTabIndex.value = 0;
  filterText.value = "";

  isLoading.value = false;
};

const searchTextDebounce = debounce(() => {
  filterBryntumStore()
}, 500, { maxWait: 1000 });
watch(filterText, searchTextDebounce);

function clearFilter(): void {
    filterText.value = '';
    filterBryntumStore();
};

function filterBryntumStore() {
  filterStoreDataBySearchText(
    currentPermissionGroup.value.users,
    ['status'],
    filterText.value,
    gridStore.value
  );
}

</script>

<template>
  <div class="hq-pg d-flex flex-column">
    <fs-overlay
      :show="isLoading"
      spinner-variant="primary"
      class="fsi-pg__overlay"
      no-wrap
    />
    <fs-container fluid class="hq-pg__header contain border-bottom">
      <fs-row align-v="center" class="py-3">
        <fs-col cols="auto">
          <fs-link variant="link" :to="returnToPermissionGroupsRoute">
            <font-awesome-icon :icon="['fal', 'arrow-circle-left']" size="2x" />
          </fs-link>
        </fs-col>
        <fs-col col lg="auto">
          <section class="d-flex flex-wrap align-items-center">
            <fs-dropdown
              id="dropdown-offset"
              variant="outline-secondary"
              toggle-class="text-decoration-none"
              offset="25"
            >
              <template #button-content>
                <h2 class="hq-pg__title">
                  {{ currentPermissionGroup.name }}
                </h2>
              </template>
              <fs-dropdown-item                
                v-for="item in permissionGroupLookup"
                :key="item.id"
                @click="onPermissionGroupChange(item.id)"
              >
                <font-awesome-icon
                  size="lg"
                  :icon="['fas', 'check']"
                  v-if="
                    item.name ==
                    currentPermissionGroup.name
                  "
                  class="text-primary"
                />
                {{ item.name }}
              </fs-dropdown-item>
            </fs-dropdown>
          </section>
        </fs-col>

        <fs-col cols="auto" class="ms-auto d-flex" v-if="!isLoading">
          <div id="edit-permission-group" class="ms-auto me-2">
            <fs-button
              variant="outline-primary"
              @click="onEditPermissionGroupClick"
              :disabled="currentPermissionGroup.isDefaultPermissionGroup"
              ><font-awesome-icon :icon="['fal', 'edit']" /><span
                class="d-none d-lg-inline"
                >Edit</span
              >
            </fs-button>
            <fs-tooltip v-if="currentPermissionGroup.isDefaultPermissionGroup"
              target="edit-permission-group" v-fs-tooltip.hover.bottom>
              The Admin permission group is not editable.
            </fs-tooltip>
          </div>
          <div id="move-users" class="ms-auto">
            <fs-button 
                variant="primary" 
                @click="showUsersPanel = true"
                :disabled="currentPermissionGroup.isAdminGroup ? !permissions['WHQ_247_3115'] : false"
              >
              Add Users
            </fs-button>
            <fs-tooltip v-if="currentPermissionGroup.isAdminGroup ? !permissions['WHQ_247_3115'] : false"
              target="move-users" v-fs-tooltip.hover.bottom>
              You do not have permission to add users to this group.
            </fs-tooltip>
          </div>
        </fs-col>
      </fs-row>
    </fs-container>

    <fs-container fluid class="contain">
      <fs-row class="mt-4">
        <fs-col xl="6" class="mb-3">
          <fs-card class="dashboard-card dashboard-card--no-min-height" no-body>
            <fs-card-header class="dashboard-card__header">
              <font-awesome-icon
                :icon="['fal', 'info-circle']"
                class="fa-2x details-card__info-circle-icon"
              />
              <span class="ms-2">Details</span>
            </fs-card-header>
            <fs-card-body class="mb-3 mt-2">
              <fs-row class="mb-2">
                <fs-col md="2">
                  <strong>Name</strong>
                </fs-col>
                <fs-col xl="6">
                  <span>
                    {{ currentPermissionGroup.name }}
                  </span>
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col md="2">
                  <strong>Description</strong>
                </fs-col>
                <fs-col xl="10">
                  <span>
                    {{ currentPermissionGroup.description }}
                  </span>
                </fs-col>
              </fs-row>
            </fs-card-body>
          </fs-card>
        </fs-col>
        <fs-col xl="6" class="mb-3">
          <fs-card class="dashboard-card dashboard-card--no-min-height" no-body>
            <fs-card-header class="dashboard-card__header">
              <font-awesome-icon
                :icon="['fal', 'users']"
                class="fa-2x user-count-card__users-icon"
              />
              <span class="ms-2">User Count By Status</span>
            </fs-card-header>
            <fs-card-body class="mb-3 mt-2">
              <fs-row>
                <fs-col>
                  <div class="text-center"><strong>Total</strong></div>
                  <fs-aspect
                    aspect="1:1"
                    class="user-count-card__category-circle"
                  >
                    <fs-button
                      pill
                      variant="outline-cat-open"
                      class="h-100 w-100"
                      >{{ totalUsersCount }}</fs-button
                    >
                  </fs-aspect>
                </fs-col>
                <fs-col>
                  <div class="text-center"><strong>Active</strong></div>
                  <fs-aspect
                    aspect="1:1"
                    class="user-count-card__category-circle"
                  >
                    <fs-button
                      pill
                      variant="outline-cat-all"
                      class="h-100 w-100"
                      >{{ activeUsersCount }}</fs-button
                    >
                  </fs-aspect>
                </fs-col>
                <fs-col>
                  <div class="text-center"><strong>Inactive</strong></div>
                  <fs-aspect
                    aspect="1:1"
                    class="user-count-card__category-circle"
                  >
                    <fs-button
                      pill
                      variant="outline-grey--400"
                      class="h-100 w-100"
                      >{{ inactiveUsersCount }}</fs-button
                    >
                  </fs-aspect>
                </fs-col>
              </fs-row>
            </fs-card-body>
          </fs-card>
        </fs-col>
      </fs-row>
    </fs-container>
    <fs-container fluid class="p-0 flex-fill d-flex flex-column overflow-hidden">
      <fs-tabs pills
        v-model="selectedTabIndex"
        content-class="d-flex flex-column flex-fill overflow-hidden" nav-class="contain filter-tabs">
            <template #tabs-end v-if="selectedTabIndex == 0">
              <fs-form-group
              class="
              input__search-users
              fs-input__form-group fs-input__form-group--search
              ms-3
              py-1
              ">
                <fs-form-input
                    type="text"
                    class="fs-input__input"                    
                    v-model.trim="filterText"
                    :showClear="true"
                    placeholder="Search Users..."
                  ></fs-form-input>
                  <fs-button
                    variant="link"
                    class="fs-input__button fs-input__button--right"
                    :disabled="filterText === ''"
                    @click="clearFilter"
                    style="top: 5px;"
                  >
                    <transition
                      name="iconSwitch"
                      enter-active-class="animate__animated animate__fadeInDown animate__faster"
                      leave-active-class="animate__animated animate__fadeOutDown animate__faster"
                    >
                      <font-awesome-icon
                        :icon="['fal', 'search']"
                        v-if="filterText === ''"
                        class="fs-input__button-icon fs-input__button-icon--right"
                        key="search"
                      />
                      <font-awesome-icon
                        :icon="['fal', 'times']"
                        v-else
                        class="fs-input__button-icon fs-input__button-icon--right"
                        key="times"
                      />
                    </transition>
                  </fs-button>

                </fs-form-group>

            </template>
            <fs-tab title-link-class="btn" title="Users" class="position-relative flex-fill overflow-hidden">
              <div class="h-100 list">
                <div class="list__table m-3 border rounded">
                  <bryntum-grid
                    v-show="totalUsersCount > 0"
                    ref="grid"
                    :readOnly="true"
                    v-bind="gridConfig"
                    :store="gridStore"
                  />    
                  <empty-grid-layout v-if="totalUsersCount === 0" emptyMessage="There are no users for this permission group." icon="users"/>    
                </div>         
              </div>
            </fs-tab>
            <fs-tab
              title-link-class="btn"
              title="Permissions"
                class="position-relative flex-fill overflow-hidden"
            >
              <div class="h-100 list">
                <div class="list__table overflow-auto" 
                  v-if="componentMounted" v-show="!isLoading">
                  <permissionItemEditor 
                    :currentPermissionGroup="currentPermissionGroup"
                    :isReadOnly="true"
                  />                      
                </div>        
              </div>
            </fs-tab>
      </fs-tabs>
    </fs-container>
    <usersPanel
      v-model:showUsersPanel="showUsersPanel"
      :currentPermissionGroupId="Number(route.params.permissionGroupId)"
      @loadData="loadData"
    />
  </div>
</template>

<style scoped>
  .input__search-users {
    max-width: 500px;
    float: right
  }

  .details-card__info-circle-icon {
      color:#425AFB;
  }

  .user-count-card__users-icon {
      color: #0198DC
  }

  .user-count-card__category-circle
  {
      width: 50px;
      margin-left: auto;
      margin-right: auto;
  }

  .user-count-card__category-circle .btn
  {
      font-size: 150%;
      font-weight: bold;
  }
  :deep(.filter-tabs) {
    min-height: 50px;
  }
</style>