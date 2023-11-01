<script setup lang="ts">
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { convertEnumKeyToDisplay } from '@/helper/hqSuite/formatHelper';
import EmployeeStatus, { EmployeeStatusReason } from '@/models/employees/EmployeeStatus';
import { useEmployeeStore } from '@/stores/employeeStore';
import { computedAsync } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { FormContext } from 'vee-validate';
import { onMounted, ref, computed, watch } from 'vue';

const STATUS_REASON_MAX_LENGTH = 50;

interface Props {
  visible: boolean;
  employeeStatus: EmployeeStatus
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  employeeStatus: null
});
const emit = defineEmits(['cancel', 'update']);

const employeeStore = useEmployeeStore();
const { fetchEmployeeStatusReasons } = employeeStore;
const { employeeStatusReasons } = storeToRefs(employeeStore);

const form = ref<FormContext>(null);
const formData = ref<EmployeeStatus>(new EmployeeStatus());
const isFormValid = computedAsync<boolean>(
  async () => {
    const formValidation = await form.value.validate();
    return formValidation.valid;
  },
  false,
)

const disableStatusSelected = computed<boolean>(() => {
  return formData.value.employeeStatusId == EmployeeStatusEnum.Onboard || formData.value.employeeStatusId == EmployeeStatusEnum.QuickHire ||
    formData.value.employeeStatusId == EmployeeStatusEnum.PendingOnboard || formData.value.employeeStatusId == EmployeeStatusEnum.PendingQuickhire
});

const saveButtonDisabled = computed<boolean>(() => {
  return formData.value.statusDropdown.id == EmployeeStatusEnum.PendingOnboard || formData.value.statusDropdown.id == EmployeeStatusEnum.PendingQuickhire
})

const statusOptions = [];
for (const key in EmployeeStatusEnum) {
  if (Number.isInteger(parseInt(key)) && parseInt(key) != EmployeeStatusEnum.PendingOnboard && parseInt(key) != EmployeeStatusEnum.PendingQuickhire) {
    statusOptions.push({
      id: +key,
      name: convertEnumKeyToDisplay(EmployeeStatusEnum[key])
    })
  }
}
const statusReasonOptions = ref<EmployeeStatusReason[]>([]);

async function createStatusReason(newTag: string) {
  if (newTag.length > STATUS_REASON_MAX_LENGTH) {
    return;
  }

  const newReason = {
    employeeStatusReasonId: (new Date).getTime(), // Temporarily id for the dropdown, not use on the API
    employeeStatusReasonName: newTag,
    isNewReason: true
  }
  formData.value.employeeStatusReason = newReason;

  // Add the new reason to the list and sort it in alphabetical order
  statusReasonOptions.value.push(newReason);
  statusReasonOptions.value.sort((a, b) => a.employeeStatusReasonName.localeCompare(b.employeeStatusReasonName));
}

function onCancel() {
  emit('cancel');
  formData.value = { ...props.employeeStatus };
  formData.value.statusDropdown = {
    id: formData.value.employeeStatusId,
    name: EmployeeStatusEnum[formData.value.employeeStatusId]
  }
}

async function onUpdate() {
  const data = { ...formData.value };
  data.employeeStatusId = +data.statusDropdown.id;

  // Update date fields
  delete data.dateHired;
  delete data.startDate;
  delete data.dateLastWorked;

  // Update id of new reasons and remove new reasons are not selected
  const currentReasonId = data.employeeStatusReason?.employeeStatusReasonId;
  if (data.employeeStatusReason?.isNewReason) {
    data.employeeStatusReason.employeeStatusReasonId = 0;
  }
  statusReasonOptions.value = statusReasonOptions.value.filter(reason => !reason.isNewReason || reason?.employeeStatusReasonId === currentReasonId);

  emit('update', data);
}

watch(() => props.employeeStatus, (newValue) => {
  formData.value = { ...newValue };
  formData.value.statusDropdown = {
    id: formData.value.employeeStatusId,
    name: EmployeeStatusEnum[formData.value.employeeStatusId]
  }
});

onMounted(async () => {
  await fetchEmployeeStatusReasons();
  statusReasonOptions.value = employeeStatusReasons.value;
  formData.value = { ...props.employeeStatus };
  formData.value.statusDropdown = {
    id: formData.value.employeeStatusId,
    name: EmployeeStatusEnum[formData.value.employeeStatusId]
  }
});
</script>

<template>
  <fs-sidebar :visible="props.visible" sidebar-class="fsi-sidebar" no-header-close right no-close-on-esc
    no-close-on-backdrop bg-variant="white" width="425px" shadow="sm"
    header-class="border-bottom bg-grey--000 details_panel_header" footer-class="border-top">
    <template #title>
      <div class="mr-3 d-flex align-items-center">
        <div class="h5 pl-2 my-auto fw-bold">Update Employee Status</div>
        <div class="ms-auto">
          <fs-link class="text-secondary" tag="a" @click="onCancel()">
            <font-awesome-icon :icon="['fal', 'times']" size="lg"></font-awesome-icon>
          </fs-link>
        </div>
      </div>
    </template>

    <VeeForm ref="form">
      <fs-container fluid class="contain mt-4">
        <fs-row>
          <fs-col>
            <fs-input type="fsMultiselectList" name="status" label="Status" v-model="formData.statusDropdown"
              :typeaheaddata="statusOptions" typeaheadvalueattribute="id" :disabled="disableStatusSelected"
              typeaheadkey="name" :rules="{ required: true }" required />
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col>
            <fs-input type="fsMultiselectList" taggable name="employeeStatusReason" label="Status Reason"
              v-model="formData.employeeStatusReason" :typeaheaddata="statusReasonOptions"
              typeaheadvalueattribute="employeeStatusReasonId" typeaheadkey="employeeStatusReasonName" showClear
              :rules="{ max: STATUS_REASON_MAX_LENGTH }" @createNew="createStatusReason" />
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col>
            <fs-input type="fsDateInput" name="terminationDate" label="Termination Date"
              v-model="formData.terminationDate" />
          </fs-col>

          <fs-col>
            <fs-input type="fsDateInput" name="dateRehired" label="Date Rehired" v-model="formData.dateRehired" />
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col>
            <fs-input type="fsTextInput" name="dateHired" label="Date Hired" v-model="formData.dateHired" disabled />
          </fs-col>

          <fs-col>
            <fs-input type="fsTextInput" name="startDate" label="Start Date" v-model="formData.startDate" disabled />
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col md="6">
            <fs-input type="fsTextInput" name="dateLastWorked" label="Date Last Worked" v-model="formData.dateLastWorked"
              disabled />
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col>
            <fs-form-checkbox v-model="formData.securedAccess">Secured Access</fs-form-checkbox>
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col>
            <fs-form-checkbox v-model="formData.deceased">Deceased</fs-form-checkbox>
          </fs-col>
        </fs-row>
      </fs-container>
    </VeeForm>

    <template #footer>
      <fs-container contain class="d-flex justify-content-between p-3 sidebar-footer">
        <fs-button variant="outline-secondary" @click="onCancel()">CANCEL</fs-button>
        <fs-button variant="primary" @click="onUpdate()" :disabled="!isFormValid || saveButtonDisabled">
          UPDATE STATUS
        </fs-button>
      </fs-container>
    </template>
  </fs-sidebar>
</template>

<style scoped>
/* :deep(.fs-sidebar) {
  width: 420px;
  max-width: 100%;
  margin-top: 44px;
  height: calc(100vh - 44px);

  @media (max-width: 1024.98px) {
    margin-top: 36px;
    height: calc(100vh - 36px);
  }
}

:deep(.fs-sidebar-body) {
  background-color: #ffffff;
}

.sidebar-footer {
  background-color: #ffffff;
  border-top: 1px solid #dddddd;
}

@media (max-width: 768px) {
  .sidebar-footer {
    background-color: #ffffff;
    border-top: 1px solid #dddddd;
  }
} */
</style>