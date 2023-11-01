<script setup lang="ts">

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faTimes, faUser, faPlusCircle, faMinusCircle, faInfoCircle, faUsers, faTriangleExclamation, faCirclePlus, faCircleMinus, faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import _ from 'lodash';
import  PermissionGroupUser  from '@/models/settings/PermissionGroupUser';
import { computed, onMounted, Ref, ref, watch } from 'vue';
import { useAlerts } from '@/composables/useAlerts';
import PermissionGroupDetails from '@/models/settings/PermissionGroupDetails';
import { useUserStore } from "@/stores/settings/userStore";
import { usePermissionGroupStore } from "@/stores/settings/permissionGroupStore";
import { storeToRefs } from 'pinia';
import emptyGridLayout from '@/components/shared/emptyGridLayout.vue';
import { stringCaseInsensitiveComparer } from '@/functions/SorterFunctions';

const { fetchUsersNotPartOfPermissionGroup } = useUserStore();
const { usersNotPartOfPermissionGroup } = storeToRefs(useUserStore());
const { moveUsersToPermissionGroup } = usePermissionGroupStore();

library.add(
  faSearch,
  faTimes,
  faUser,
  faPlusCircle,
  faMinusCircle,
  faInfoCircle,
  faUsers,
  faTriangleExclamation,
  faCirclePlus,
  faCircleMinus,
  faCircleInfo
);

interface UsersPanelProps {
  showUsersPanel: boolean,
  currentPermissionGroupId: number,
};

const props = defineProps<UsersPanelProps>();
const emit = defineEmits<{
  (e: "loadData", value: PermissionGroupDetails): void,
  (e: "update:showUsersPanel", value: boolean): void
}>();

const { notifyError, notifySuccess } = useAlerts();

const isOpen = ref(false);
const tabOptions: Ref<Array<{ text: string, value: string, disabled?: boolean }>> = ref(
  [
    { text: 'Available', value: 'available' },
    { text: 'Selected', value: 'selected' }
  ]);
const selectedTab = ref('available');

const filterText = ref('');
const searchUser = ref('');
const doneLoading = ref(false);

const filteredUsers = computed<PermissionGroupUser[]>(() => {
  const data = selectedTab.value === "available" ? availableUsers.value : selectedUsers.value;
  const searchText: string = filterText.value.toLowerCase();

  if(searchText) 
    return data.filter(user => user.name.toLocaleLowerCase().includes(searchText));
  else 
    return data;
});

const users: Ref<PermissionGroupUser[]> = ref([]);
const errorEncountered = ref(false);
const errorMessage = ref('Failed to process your request');

const selectedUsers = computed(() => {
  return users.value.filter(user => user.selected === true);
});

const availableUsers = computed(() => {
  return users.value.filter(user => user.selected !== true);
});

const numberOfSelectedUsers = computed(() => {
  return selectedUsers.value.length;
});

onMounted(async () => {
  loadData();
});

watch( () => props.showUsersPanel, async() => {
  isOpen.value = props.showUsersPanel;
});

watch( isOpen, () => {
  emit('update:showUsersPanel', isOpen.value);
});

watch(() => props.currentPermissionGroupId, async ()=> {
  loadData();
});

watch(numberOfSelectedUsers, async (newValue, oldValue) => {
  if (newValue === 0) {
    tabOptions.value[1].text = 'Selected';
  }
  else {
    tabOptions.value[1].text = 'Selected (' + newValue + ')';
  }
});

const filterDebounce = _.debounce( () => {
  filterText.value = searchUser.value;
});

const loadData = async(permissionGroupWithUpdatedUsers?: PermissionGroupDetails) => {
  doneLoading.value = false;

  if (props.currentPermissionGroupId !== 0) {
    try {
      let data: PermissionGroupUser[];

      if(permissionGroupWithUpdatedUsers)
      {
        //Remove newly moved users from the data
        data = usersNotPartOfPermissionGroup.value
          .filter(user => !permissionGroupWithUpdatedUsers.users.find(x => x.employeeId === user.employeeId));
      }
      else
      {
        await fetchUsersNotPartOfPermissionGroup(props.currentPermissionGroupId);
        data = usersNotPartOfPermissionGroup.value;
      }
      
      users.value = data
        .sort((record1: any, record2: any) => stringCaseInsensitiveComparer(record1.lastFirstName, record2.lastFirstName))
        .map(user => ({
          ...user,
          selected : false
        }));
    }
    catch (error) {
      errorEncountered.value = true;

      if ((error as any).statusCode == 403) {
        errorMessage.value = 'You do not have access to this functionality';
      }
      else {
        errorMessage.value = 'Failed to process your request';
      }
    }

    selectedTab.value = 'available';
  }

  doneLoading.value = true;
};

const onClearFilterBtnClicked = () => {
  searchUser.value = '';
  filterText.value = '';
};

const updateUser = (idToUpdate: number) => {
  if (selectedTab.value === 'available') {
    selectUser(idToUpdate);
  }
  else {
    unselectUser(idToUpdate);
  }

  onClearFilterBtnClicked();
};

const selectUser = (userId: number) => {
  users.value[findUserIndex(userId, users.value)].selected = true;
};

const unselectUser = (userId: number) => {
  users.value[findUserIndex(userId, users.value)].selected = false;
};

const findUserIndex = (id: number, arrayToSearch: PermissionGroupUser[]): number => {
  return arrayToSearch.indexOf(users.value.find(user => user.employeeId === id));
};

const updateSelectedUsers = async () => {
  doneLoading.value = false;

  let selectedUserIds = users.value.filter(user => user.selected === true).map(user => { return user.employeeId });
  
  try {
    const permissionGroupWithUpdatedUsers = await moveUsersToPermissionGroup(selectedUserIds, props.currentPermissionGroupId);

    notifySuccess('User have been moved to this permission group.');

    emit('loadData', permissionGroupWithUpdatedUsers);
    loadData(permissionGroupWithUpdatedUsers);
  }
  catch (error) {
    notifyError('Failed to process your request.')
  }

  doneLoading.value = true;
  isOpen.value = false;
}

function closePanel() {
  isOpen.value = false;

  users.value.filter(user => user.selected === true).forEach(user => user.selected = false);
  selectedTab.value = 'available';
}

</script>

<template>
  <fs-sidebar
    sidebar-class="fsi-sidebar help-center"
    body-class="help-center__body"
    right
    no-close-on-esc
    no-close-on-backdrop
    bg-variant="white"
    width="425px"
    shadow="sm"
    header-class="border-bottom"
    footer-class="border-top"
    aria-label="help center"
    no-header-close
    v-model="isOpen"
  >
    <!-- header -->
    <template #title="{ hide }">
      <div class="me-3 d-flex align-items-center">
        <div class="h5 ps-2 my-auto fw-bold"
        v-fs-tooltip.hover.leftbottom
        title="Moving users to this permission group will remove them from their current permission group."
        >
          Move Users To This Permission Group
          <font-awesome-icon
            :icon="['fal', 'info-circle']"
            size="sm"
            id="move-user-info"
          ></font-awesome-icon>
        </div>
        <fs-link class="ms-auto text-secondary" tag="a" @click="closePanel()">
          <font-awesome-icon
            :icon="['fal', 'times']"
            size="sm"
          ></font-awesome-icon>
        </fs-link>
      </div>
    </template>
    <!-- footer -->
    <template #footer="{ hide }">
      <div class="d-flex align-items-center float-end p-2">
        <fs-button @click="closePanel()">Cancel</fs-button>
        <fs-button
          variant="primary"
          @click="updateSelectedUsers"
          v-bind:disabled="numberOfSelectedUsers === 0"
          >Move Users</fs-button
        >
      </div>
    </template>

    <fs-overlay
      :show="!doneLoading"
      spinner-variant="primary"
      class="fsi-pg__overlay"
      no-wrap
    />
    <div v-if="doneLoading" class="d-flex flex-column h-100">
      <!-- Toggle buttons Available/Selected(#) -->
      <fs-form-group class="border-bottom m-0 px-1">
        <fs-form-radio-group
          class="d-flex p-2"
          id="btn-radios-users"
          v-model="selectedTab"
          :options="tabOptions"
          button-variant="outline-cyan"
          name="radio-btn-outline"
          buttons
        ></fs-form-radio-group>
      </fs-form-group>

      <!-- Users search bar -->
      <div class="p-2 border-bottom">
        <fs-form-group class="fs-input__form-group fs-input__form-group--search">
          <fs-form-input
            type="text"
            class="fs-input__input mb-0"
            v-model="searchUser"
            @input="filterDebounce"
            placeholder="Search Users..."
          >
          </fs-form-input>
          <fs-button
            variant="link"
            class="fs-input__button fs-input__button--right"
            :disabled="filterText === ''"
            @click="onClearFilterBtnClicked"
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
      </div>

      <!-- Users list -->

      <fs-container class="flex-grow-1">
        <fs-row
          align-v="center"
          v-for="user in filteredUsers"
          :key="user.employeeId"
          class="py-1 border-bottom position-relative"
        >
          <fs-col cols="auto" class="d-flex justify-content-center">
            <font-awesome-icon
              :icon="['fal', 'user']"
              class="h3 mt-1 text-primary"
            />
          </fs-col>
          <fs-col cols="auto">
            <fs-row class="fw-bold"> {{ user.name }}</fs-row>
            <fs-row> {{ user.permissionGroup }}</fs-row>
          </fs-col>
          <fs-col cols="auto"  class="ms-auto">
            <fs-button
              variant="link"
              @click="updateUser(user.employeeId)"
            >
              <font-awesome-icon
                :icon="['fal', 'plus-circle']"
                v-if="selectedTab === 'available'"
                class="fs-input__button fs-input__button--right"
                size="lg"
              />
              <font-awesome-icon
                :icon="['fal', 'minus-circle']"
                v-else
                class="
                fs-input__button-icon fs-input__button-icon--right
                  text-charming-coral
                "
                size="lg"
              />
            </fs-button>
          </fs-col>
        </fs-row>
        <empty-grid-layout
          v-if="numberOfSelectedUsers === 0 && selectedTab === 'selected' && errorEncountered === false "
          emptyMessage="There are no users selected to move to this permission group." 
          icon="users"
        />
      </fs-container>
    </div>
  </fs-sidebar>
</template>