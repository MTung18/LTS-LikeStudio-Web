<template>
  <div class="hq-pg d-flex flex-column" :class="{ 'pb-0': tabIndex === 2 }">
    <employee-header :employeeId="employeeId" class="position-relative" />

    <fs-tabs
      pills
      active-nav-item-class="bg-index-color-0 hq-pg__tab--active"
      v-model="tabIndex"
      nav-wrapper-class="hq-pg__header hq-pg__header--sticky justify-content-center contain"
      :content-class="tabIndex === 2 ? 'd-flex flex-column flex-fill' : 'flex-fill'"
      :class="{ 'd-flex flex-column flex-fill': tabIndex === 2 }"
    >
      <fs-tab
        v-if="permissions['WHQ_251_3137']"
        title="Personal"
        active
        @click="setActiveTab(tabTitles.Personal)"
        title-item-class="mx-1"
        title-link-class="hq-pg__tab"
      >
        <pending-foundation-approval-banner
          :hasPendingFoundationApproval="hasPendingFoundationApproval"
        ></pending-foundation-approval-banner>
        <personal-tab
          :personalData="personalData"
          :hasPendingFoundationApproval="hasPendingFoundationApproval"
        />
      </fs-tab>

      <fs-tab
        v-if="permissions['WHQ_251_3141']"
        title="Employment"
        @click="setActiveTab(tabTitles.Employment)"
        title-item-class="mx-1"
        title-link-class="hq-pg__tab"
      >
        <pending-foundation-approval-banner
          :hasPendingFoundationApproval="hasPendingFoundationApproval"
        ></pending-foundation-approval-banner>
        <employment-tab
          :employmentInfor="employmentInfor"
          :hasPendingFoundationApproval="hasPendingFoundationApproval"
        />
      </fs-tab>

      <fs-tab
        v-if="permissions['WHQ_251_3146']"
        title="Contacts"
        @click="setActiveTab(tabTitles.Contacts)"
        title-item-class="mx-1"
        title-link-class="hq-pg__tab"
        class="bg-grey--000"
      >
        <contact-list
          @create-contact="onCreateContact"
          @edit-contact="onEditContact"
          @view-contact="onViewContact"
        />
        <view-contact-panel
          :is-open="isViewContactPanelOpen"
          :employee-contact-id="activeContact.id"
          v-model="activeContact"
          @close="onContactPanelClose"
          @edit-contact="onContactPanelEdit"
        />
      </fs-tab>
      <template #tabs-end>
        <template v-if="isPersonalTabActive && permissions['WHQ_251_3137']">
          <fs-button
            variant="outline-primary"
            class="ms-auto rounded-pill p-2"
            style="height: 38px"
            v-fs-tooltip.hover
            title="Sync With Foundation"
            @click="onSyncClick"
          >
            <font-awesome-icon :icon="['fal', 'fa-sync']" size="lg" />
          </fs-button>

          <fs-button
            variant="outline-primary"
            :class="`${hasPendingFoundationApproval ? 'disabled' : ''}`"
            @click="onPersonalInformationEdit"
          >
            <font-awesome-icon :icon="['fal', 'pen-to-square']" />
            <span>EDIT</span>
          </fs-button>
        </template>

        <template v-if="isEmploymentActive && permissions['WHQ_251_3141']">
          <fs-button
            variant="outline-primary"
            :class="`ms-auto ${hasPendingFoundationApproval ? 'disabled' : ''}`"
            @click="editEmployment"
          >
            <font-awesome-icon :icon="['fal', 'pen-to-square']" />
            <span>EDIT</span>
          </fs-button>
        </template>

        <template v-if="isContactsActive && permissions['WHQ_251_3141']">
          <fs-button variant="primary" class="ms-auto" @click="onCreateContact">
            <span>Add Contact</span>
          </fs-button>
        </template>
      </template>
    </fs-tabs>
  </div>
</template>

<script setup lang="ts">
import EmployeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';
import ContactList from '@/components/viewComponents/employees/employeeInformation/contactList.vue';
import EmploymentTab from '@/components/viewComponents/employees/employeeInformation/employmentTab.vue';
import PersonalTab from '@/components/viewComponents/employees/employeeInformation/personalTab.vue';
import ViewContactPanel from '@/components/viewComponents/employees/employeeInformation/viewContactPanel.vue';
import Contact from '@/models/employees/Contact';
import EmployeeDetails from '@/models/employees/EmployeeDetails';
import { Employment } from '@/models/employees/Employment';
import { useEmployeeStore } from '@/stores/employeeStore';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenToSquare, faSync } from '@fortawesome/pro-light-svg-icons';
import { storeToRefs } from 'pinia';
import { Ref, computed, inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlerts } from '@/composables/useAlerts';
import { useFoundationCompanyCasConnectionStore } from '@/stores/integration/foundation/foundationCompanyCasConnectionStore';
import { FoundationCompanyCasConnection } from '@/models/foundationIntegration/FoundationCompanyCasConnection';
import { EmployeeInformationTab } from '@/enums/EmployeeInformationTab';
import PendingFoundationApprovalBanner from '@/components/shared/pendingFoundationApprovalBanner.vue';

library.add(faSync, faPenToSquare);

const tabTitles = {
  Personal: 'Personal',
  Employment: 'Employment',
  Contacts: 'Contacts',
};

const router = useRouter();
const permissions = inject('$providePermissions');
const activeTab = ref<string>(tabTitles.Personal);
const isPersonalTabActive = computed<boolean>(
  () => activeTab.value === tabTitles.Personal
);
const isEmploymentActive = computed<boolean>(
  () => activeTab.value === tabTitles.Employment
);
const isContactsActive = computed<boolean>(
  () => activeTab.value === tabTitles.Contacts
);

const route = useRoute();

const employeeId = computed<number>(() => +route.params?.id);
const tabToSet = computed<string>(() => route.params?.tab?.toString());

const {
  fetchEmployeeSsn,
  fetchEmployeeDetails,
  fetchEmployment,
  checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync,
} = useEmployeeStore();
const {
  employeeDetails,
  employment,
  employeeHasExistingPendingFoundationApprovals,
} = storeToRefs(useEmployeeStore());
const personalData = ref(new EmployeeDetails());
const employmentInfor = ref(new Employment());
const { notifyError } = useAlerts();
const activeContact = ref(new Contact());
const isViewContactPanelOpen = ref(false);
const companyCasConnection: Ref<FoundationCompanyCasConnection | null> =
  ref(null);
const hasPendingFoundationApproval: Ref<boolean> = ref(false);

const setActiveTab = (tabTitle: string) => {
  activeTab.value = tabTitle;
};

function onCreateContact() {
  router.push({ name: 'createContact', params: { id: employeeId.value } });
}

function onEditContact(contact: Contact) {
  router.push({
    name: 'editContact',
    params: { id: employeeId.value, contactId: contact.id },
  });
}

function onViewContact(contact: Contact) {
  activeContact.value = contact;
  isViewContactPanelOpen.value = true;
}

function onContactPanelClose() {
  isViewContactPanelOpen.value = false;
}

function onContactPanelEdit(contact: Contact) {
  isViewContactPanelOpen.value = false;
  router.push({
    name: 'editContact',
    params: { id: employeeId.value, contactId: contact.id },
  });
}

function onPersonalInformationEdit() {
  router.push({
    name: 'editPersonalInformation',
    params: { employeeId: employeeId.value },
  });
}

function editEmployment() {
  router.push({ name: 'editEmployment', params: { id: employeeId.value } });
}
const onSyncClick = () => {
  if (companyCasConnection.value) {
    router.push({ name: 'settingsFoundation' });
  }
};

async function setCompanyCasConnection(): Promise<void> {
  const foundationCompanyCasConnectionStore =
    useFoundationCompanyCasConnectionStore();
  await foundationCompanyCasConnectionStore.fetchCompanyCasConnection();
  companyCasConnection.value =
    foundationCompanyCasConnectionStore.companyCasConnection;
}

watch(route, async (newRoute, oldRoute) => {
  if (
    newRoute.name === oldRoute.name &&
    newRoute.params.id !== undefined &&
    newRoute.params.id !== oldRoute.params.id
  ) {
    await fetchEmployeeDetails(Number(newRoute.params.id));
    personalData.value = employeeDetails.value;
  }
});

const tabIndex = ref(0);

const setTab = () => {
  switch (EmployeeInformationTab[tabToSet.value]) {
    case EmployeeInformationTab.Employment:
      setActiveTab(EmployeeInformationTab.Employment);
      tabIndex.value = 1;
      break;
    case EmployeeInformationTab.Contacts:
      setActiveTab(EmployeeInformationTab.Contacts);
      tabIndex.value = 2;
      break;
    case EmployeeInformationTab.Personal:
    default:
      setActiveTab(EmployeeInformationTab.Personal);
      tabIndex.value = 0;
      break;
  }
};

onMounted(async () => {
  setTab();
  await Promise.all([
    fetchEmployeeSsn(employeeId.value),
    fetchEmployeeDetails(employeeId.value),
    checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync(
      employeeId.value
    ),
  ]);
  personalData.value = employeeDetails.value;
  hasPendingFoundationApproval.value =
    employeeHasExistingPendingFoundationApprovals.value;
  setCompanyCasConnection();
  try {
    await fetchEmployment(employeeId.value);
    employmentInfor.value = employment.value;
  } catch (error) {
    notifyError('Employment load failed.');
  }
});
</script>
