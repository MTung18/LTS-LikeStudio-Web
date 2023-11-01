<script setup lang="ts">
import { TimeOffPlan } from "@/models/employees/timeOff/TimeOffPlan";
import { VacationTypeList } from "@/models/employees/timeOff/VacationTypeList";
import { VacationPlanList } from "@/models/employees/timeOff/VacationPlanList";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import {
  faExclamationCircle
} from "@fortawesome/pro-solid-svg-icons";
import { cloneDeep } from 'lodash';
import { ref, reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTimeOffPlanStore } from "@/stores/timeOffPlanStore";
import { useRoute } from "vue-router";
import { useAlerts } from "@/composables/useAlerts";
import { isEqual } from 'lodash';
import DarkThemeModal from "@/components/shared/darkThemeModal.vue";
import moment from "moment";
import { useLoadingStore } from "@/stores/loadingStore";

const { setLoading } = useLoadingStore();
library.add(faTimes, faExclamationCircle);
const emit = defineEmits(["editTimeOff", "refreshEmployeesList"]);
const notify = useAlerts();
const timeOffPlanStore = useTimeOffPlanStore();
const route = useRoute();
const { vacationPlanName, vacationType } = storeToRefs(timeOffPlanStore);
const {
  fetchVacationList,
  updateListPlanOfEmployee,
  addListPlanOfEmployee,
} = timeOffPlanStore;
const formPlan = ref(null);

const originalFormData = ref(null);

interface Props {
  showAssignTimeOffPlan: TimeOffPlan;
  isEdit: boolean;
}
const isOpen = ref(false);

defineExpose({
  isOpen,
});

const props = withDefaults(defineProps<Props>(), {
  showAssignTimeOffPlan: null,
  isEdit: null,
});
const employeeId = Number(route.params.id);
const initialState = {
  planTypeOption: null,
  planTypeId: null,
  planNameOption: null,
  startDate: null,
  isActive: true,
  employeeId: employeeId,
  vacationPlanId: null,
};

const dataForm = reactive({ ...initialState });
const planType = ref(new Array<VacationTypeList>());
const planList = ref(new Array<VacationPlanList>());
const filteredPlans = ref(null);


watch([isOpen, props], async () => {
  try {
    setLoading(true);
    if (!isOpen.value)
      return;

    if (!props.isEdit) {
      await fillDataToMultiselect(false);
    }
    else {
      if (props.showAssignTimeOffPlan) {
        await fillDataToMultiselect(true);
        dataForm.planTypeId = planType.value.find(x => x.id == props?.showAssignTimeOffPlan?.planTypeId);
        dataForm.vacationPlanId = planList.value.find(x => x.id == props?.showAssignTimeOffPlan?.vacationPlanId);
        dataForm.startDate = props?.showAssignTimeOffPlan?.startDate;
        dataForm.isActive = props?.showAssignTimeOffPlan?.isActive;
        dataForm.employeeId = props?.showAssignTimeOffPlan?.employeeId;
        originalFormData.value = cloneDeep(dataForm);
      }
    }
  }
  finally {
    setLoading(false);
  }
});

async function fillDataToMultiselect(hasPlanBeenAssigned: boolean) {
  await fetchVacationList(route.params.id, hasPlanBeenAssigned);
  planType.value = vacationType.value.map((vacationType) => ({
    id: vacationType.id,
    name: vacationType.name,
  }));
  planList.value = vacationPlanName.value.map((vacation) => ({
    id: vacation.id,
    name: vacation.planName,
    planTypeId: vacation.planTypeId,
  }));
  filteredPlans.value = planList.value;
}

const submitEditTimeOffPlanForm = async () => {
  const data = {
    isActive: dataForm.isActive,
    startDate: dataForm.startDate,
    employeeAccrualPlanId: props?.showAssignTimeOffPlan?.id,
    employeeId: dataForm.employeeId
  };
  const response = await updateListPlanOfEmployee(data);
  if (response) {
    await resetElement();
    notify.notifySuccess("Plan updated.");
    emit("refreshEmployeesList");
  }
  else {
    notify.notifyError("An error occurred while updating the plan.");
  }
}

async function submitCreateTimeOffPlanForm() {
  const input = {
    isActive: dataForm.isActive,
    startDate: dataForm.startDate,
    employeeId: dataForm.employeeId,
    vacationPlanId: dataForm.vacationPlanId.id,
  };
  const response = await addListPlanOfEmployee(input);

  if (response) {
    await resetElement();
    notify.notifySuccess("Plan assigned.");
  }
  else {
    notify.notifyError("An error occurred while assigning the plan.");
  }
  emit("refreshEmployeesList");
}

const resetElement = () => {
  dataForm.planTypeId = null;
  dataForm.vacationPlanId = null;
  dataForm.startDate = moment('').format('YYYY-MM-DD');
  dataForm.isActive = true;
  setTimeout(() => formPlan.value.resetForm());
};

const resetForm = async () => {
  resetElement();
  isOpen.value = !isOpen.value;
};
const handleSubmitForm = async (event) => {
  event.preventDefault();
  const { valid } = await formPlan.value.validate();
  if (!valid) {
    return;
  }

  if (dataForm.isActive) {
    const hasActivePlanWithTypeAsync = await timeOffPlanStore.hasActivePlanWithType(route.params.id, dataForm.vacationPlanId.id);
    if (hasActivePlanWithTypeAsync) {
      openPopupConfirm.value = true;
      return;
    }
  }

  await handleAssignPlan();
}
const openPopupConfirm = ref(false)
const closeAssignPlanConfirmModal = () => {
  openPopupConfirm.value = false;
}
const handleAssignPlan = async () => {
  if (props.isEdit) {
    await submitEditTimeOffPlanForm();
    emit("refreshEmployeesList");
    closeAssignPlanConfirmModal();
    isOpen.value = false;
    return;
  }
  emit("refreshEmployeesList");
  submitCreateTimeOffPlanForm();
  closeAssignPlanConfirmModal();
  isOpen.value = false;
}

const changePlanType = (item) => {
  planList.value = vacationPlanName.value
    .map(({ id, planName, planTypeId }) => ({ id, name: planName, planTypeId }))
    .filter((plan) => plan.planTypeId === item?.id);

  if (dataForm.vacationPlanId && item?.id !== dataForm.vacationPlanId.planTypeId) {
    dataForm.vacationPlanId = null;
    setTimeout(() => formPlan.value.resetForm());
  }
};

</script>

<template>
  <VeeForm ref="formPlan" id="submitTimeOffPlanForm" v-slot="{ meta }">
    <fs-sidebar :visible="isOpen" id="timeOffPlanForm-right" class="timeOffPlanForm" right z-index="1009"
      sidebar-class="fsi-sidebar help-center" body-class="help-center__body" no-close-on-esc no-close-on-backdrop
      bg-variant="white" width="425px" shadow="sm" header-class="border-bottom" footer-class="border-top" no-header-close>
      <!-- header -->
      <template #title>
        <div class="mr-3 d-flex align-items-center">
          <div class="h5 pl-2 my-auto fw-bold">
            {{ props.isEdit ? "Edit Plan" : "Assign Plan" }}
          </div>
          <div class="ms-auto">
            <fs-link class="text-secondary" tag="a" @click="resetForm">
              <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
            </fs-link>
          </div>
        </div>
      </template>
      <!-- footer -->
      <template #footer>
        <div class="d-flex align-items-center float-right p-2">
          <fs-button variant="outline-secondary" class="btn btn-outline-gray" @click="resetForm">Cancel</fs-button>
          <fs-button variant="btn-primary" class="btn btn-primary ms-auto" type="submit" @click="handleSubmitForm($event)"
            :disabled="!(meta.valid && !isEqual(originalFormData, dataForm))">SAVE</fs-button>
        </div>
      </template>
      <div class="d-flex flex-column h-100 w-100 pt-3">
        <fs-col>
          <fs-container fluid>
            <fs-row>
              <fs-col>
                <fs-input v-model="dataForm.planTypeId" type="fsMultiselectList" id="prefixId" labelId="prefixLabelId"
                  label="Plan Type" typeaheadkey="name" rules="required" typeaheadvalueattribute="id" name="PlanType"
                  :showClear="true" :typeaheaddata="planType" :disabled="props.isEdit ? true : false"
                  autocomplete="donotfill" :required="true" @select="(item) => changePlanType(item)"></fs-input>

                <fs-input v-model="dataForm.vacationPlanId" label="Plan" type="fsMultiselectList" typeaheadkey="name"
                  labelId="lblPlanId" rules="required" typeaheadvalueattribute="id" name="Plan" :showClear="true"
                  :typeaheaddata="planList" :disabled="dataForm.planTypeId === null || props.isEdit ? true : false"
                  autocomplete="donotfill" :required="true"></fs-input>
                <fs-input :required="true" label="Start Date for time-off calculation" rules="required" type="fsDateInput"
                  class="w-75" name="StartDate" v-model="dataForm.startDate"></fs-input>
                <fs-form-checkbox v-model="dataForm.isActive" name="check-button" switch size="lg">
                  {{ dataForm.isActive ? "Active" : "Inactive" }}
                </fs-form-checkbox>
              </fs-col>
            </fs-row>
          </fs-container>
        </fs-col>
      </div>
    </fs-sidebar>
  </VeeForm>
  <DarkThemeModal title="Assign Plan" :show-modal="openPopupConfirm" cancel-btn-variant="light" okText="OK"
    okTextVariant="danger" cancelText="CANCEL" cancelTextVariant="outline" @close="closeAssignPlanConfirmModal"
    @ok="handleAssignPlan">
    <template #content>
      <div class="d-flex my-2">
        <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="text-danger me-2 mt-1" />
        <span class="text-lg">
          There's already an active plan under this plan type. Still assign this plan and inactivate the existing plan?
        </span>
      </div>
    </template>
  </DarkThemeModal>
</template>
