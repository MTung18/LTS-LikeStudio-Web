<script setup lang="ts">
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { Grid, Store } from "@bryntum/grid";
import { Ref, ref, onMounted, computed } from "vue";
import Contact from "@/models/employees/Contact";
import { useRoute } from "vue-router";
import { useEmployeeStore } from "@/stores/employeeStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBadgeDollar,
  faFamily,
  faPhone,
} from "@fortawesome/pro-light-svg-icons";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAlerts } from "@/composables/useAlerts";
import emptyGridLayout from '@/components/shared/emptyGridLayout.vue';

library.add(faBadgeDollar, faFamily, faPhone, faStar);

const enum EmitNames {
  CREATE = "createContact",
  EDIT = "editContact",
  VIEW = "viewContact"
}

const showEmergencyContacts = computed<boolean>(() => {
  if(emergencyContactsStore.value.data)
  {
    return emergencyContactsStore.value.data.length > 0;
  }
  else 
  {
    return false;
  }
});

const showDependents = computed<boolean>(() => {
  if(dependentsStore.value.data)
  {
    return dependentsStore.value.data.length > 0;
  }
  else 
  {
    return false;
  }
});

const showBeneficiaries = computed<boolean>(() => {
  if(beneficiariesStore.value.data)
  {
    return beneficiariesStore.value.data.length > 0;
  }
  else 
  {
    return false;
  }
});

const emits = defineEmits<{
  (e: EmitNames.CREATE): void;
  (e: EmitNames.EDIT, value: Contact): void;
  (e: EmitNames.VIEW, value: Contact): void;
}>();

const defaultSorter = {
  field: "name",
  ascending: true,
};

const { notifyError, notifySuccess } = useAlerts();

const starIcon = `<svg class="svg-inline--fa fa-star text-magenta mx-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path class="" fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
    </svg>`;
const grid: Ref<Grid> = ref(null);
const getBaseGridConfig = (isEmergencyContactList: boolean) => {
  return {
    ...fsBryntumGridConfig.gridConfig,
    minHeight: "100%",
    emptyText: "", 
    columns: [
      {
        flex: 1,
        text: "Name",
        id: "lastName",
        field: "name",
        htmlEncode: false,
        sortable(a, b) {
          if (a.lastName === b.firstName) {
            return a.firstName > b.firstName ? 1 : -1;
          } else {
            return a.lastName > b.lastName ? 1 : -1;
          }
        },
        renderer: ({ record }) =>
          `${record.data.isPrimaryContact && isEmergencyContactList
            ? starIcon
            : ""
          }<span">${record.data.firstName} ${record.data.lastName}</span>`,
      },
      {
        flex: 1,
        text: "Relationship",
        id: "relation",
        field: "relation",
      },
    ],
  };
};

const getGridConfig = (isEmergencyContactList: boolean) => {
  const actionCol = {
    flex: 1,
    type: "action",
    id: "action",
    columnDragToolbar: false,
    enableHeaderContextMenu: false,
    enableCellContextMenu: false,
    cellCls: "b-action-cell--hover",
    actions: [
      {
        visible: true,
        renderer: () => {
          return '<i class="b-action-item b-fa b-fa-external-link btn btn-link text-success no-underline"><span>View</span></i>';
        },
        onClick: onViewContactClick,
      },
      {
        visible: true,
        renderer: () => {
          return '<i class="b-action-item b-fa b-fa-edit btn btn-link text-success no-underline"><span>Edit</span></i>';
        },
        onClick: onEditContactClick,
      },
    ],
  };

  let extraCols;
  if (isEmergencyContactList) {
    extraCols = [
      {
        flex: 1,
        text: "Phone Number",
        id: "phoneNumber",
        field: "phoneNumber",
      },
      {
        flex: 1,
        text: "Email",
        id: "email",
        field: "email",
      },
      {
        ...actionCol,
        actions: [
          {
            visible: ({ record }) => !record.data.isPrimaryContact,
            renderer: () => {
              return '<i class="b-action-item b-fa b-fa-star btn btn-link text-success no-underline"><span>Primary</span></i>';
            },
            onClick: onSetPrimaryContactClick,
          },
          ...actionCol.actions,
        ],
      },
    ];
  } else {
    extraCols = [
      {
        flex: 1,
        text: "Gender",
        id: "gender",
        field: "gender",
      },
      {
        flex: 1,
        text: "Date of Birth",
        id: "birthDate",
        field: "birthDate",
        groupable: false,
        htmlEncode: false,
        vue: true,
        renderer: ({ row }) => {
          return {
            is: "sensitive-text",
            text: row.cellContext._record.data.birthDate.toLocaleDateString(
              {},
              {
                // timeZone: "UTC",
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            ),
            mask: "XX-XX-XXXX",
            modelValue: false,
          };
        },
      },
      actionCol,
    ];
  }
  const baseGridConfig = getBaseGridConfig(isEmergencyContactList);
  return {
    ...baseGridConfig,
    columns: [...baseGridConfig.columns, ...extraCols],
  };
};

const filteredContactList: Ref<Array<Contact>> = ref(new Array<Contact>());

const emergencyContactsStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  })
);

const dependentsStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  })
);

const beneficiariesStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  })
);

async function populateEmergencyContactStore() {
  emergencyContactsStore.value.data = filteredContactList.value.filter(
    (contact: Contact) => contact.isEmergencyContact
  );
}

async function populateDependentsStore() {
  dependentsStore.value.data = filteredContactList.value.filter(
    (contact: Contact) => contact.isDependent
  );
}

async function populateBeneficiariesStore() {
  beneficiariesStore.value.data = filteredContactList.value.filter(
    (contact: Contact) => contact.isBeneficiary
  );
}

function onAddContactClick(event: any): void {
  emits(EmitNames.CREATE);
}

function onEditContactClick(event: any): void {
  emits(EmitNames.EDIT, event.record.data);
}

function onViewContactClick(event: any): void {
  emits(EmitNames.VIEW, event.record.data);
}

async function onSetPrimaryContactClick(event: any): Promise<void> {
  await employeeStore.updatePrimaryContactAsync((event.record.data as Contact).id);
  if (employeeStore.primaryContactedUpdated) {
    notifySuccess('Primary contact updated.');
    const employeeId = route.params.id.toString();
    await refreshEmployeeContactList(parseInt(employeeId));
  } else {
    notifyError('Primary contact failed to update')
  }
}

const route = useRoute();
const employeeStore = useEmployeeStore();

async function refreshEmployeeContactList(employeeId: number) {
  await employeeStore.fetchEmployeeContactList(employeeId);
  filteredContactList.value = employeeStore.contactList;
  populateEmergencyContactStore();
  populateDependentsStore();
  populateBeneficiariesStore();
}

onMounted(async () => {
  const employeeId = route.params.id;
  if (typeof employeeId === "string" && !Number.isNaN(Number(employeeId))) {
    await refreshEmployeeContactList(parseInt(employeeId));
  }
  
});
</script>
<template>
  <fs-container fluid class="py-4 contain">

    <fs-row class="dashboard__row mt-4">
      <fs-col>
        <fs-card class="dashboard-card" no-body>
          <fs-card-header class="dashboard-card__header">
            <h2 class="hq-pg__title">
              <font-awesome-icon :icon="['fal', 'phone']" class="text-magenta me-2"/>Emergency Contacts
            </h2>
          </fs-card-header>
          <fs-card-body class="dashboard-card__content ">
            <div  class="action-grid list__table list__table--onpage list__b-grid--hover">
              <bryntum-grid v-if="showEmergencyContacts" v-bind="getGridConfig(true)" :store="emergencyContactsStore" ref="grid" />
              <empty-grid-layout v-else emptyMessage="No Emergency Contacts" icon="phone" iconClass="empty-grid__icon__sm"/> 
            </div>               
          </fs-card-body>
        </fs-card>
      </fs-col>
    </fs-row>
    <fs-row class="dashboard__row mt-4">
      <fs-col>
        <fs-card class="dashboard-card" no-body>
          <fs-card-header class="dashboard-card__header">
            <h2 class="hq-pg__title">
              <font-awesome-icon :icon="['fal', 'family']" class="text-cyan me-2"/>Dependents
            </h2>
          </fs-card-header>
          <fs-card-body class="dashboard-card__content ">
            <div  class="action-grid list__table list__table--onpage list__b-grid--hover">
              <bryntum-grid v-if="showDependents" v-bind="getGridConfig(false)" :store="dependentsStore" ref="grid" />
              <empty-grid-layout v-else emptyMessage="No Dependents" icon="family" iconClass="empty-grid__icon__sm"/> 
            </div>
          </fs-card-body>
        </fs-card>
      </fs-col>
    </fs-row>
    <fs-row class="dashboard__row mt-4">
      <fs-col>
        <fs-card class="dashboard-card" no-body>
          <fs-card-header class="dashboard-card__header">
            <h2 class="hq-pg__title">
              <font-awesome-icon :icon="['fal', 'badge-dollar']" class="text-green me-2"/>Beneficiaries
            </h2>
          </fs-card-header>
          <fs-card-body class="dashboard-card__content ">
            <div class="action-grid list__table list__table--onpage list__b-grid--hover">
              <bryntum-grid v-if="showBeneficiaries" v-bind="getGridConfig(false)" :store="beneficiariesStore" ref="grid" />
              <empty-grid-layout v-else emptyMessage="No Beneficiaries" icon="badge-dollar" iconClass="empty-grid__icon__sm"/> 
            </div>
          </fs-card-body>
        </fs-card>
      </fs-col>
    </fs-row>
  </fs-container>
</template>
