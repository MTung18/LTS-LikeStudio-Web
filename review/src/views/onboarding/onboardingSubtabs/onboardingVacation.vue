<script setup lang="ts">
import { onMounted, ref, watch, Ref } from 'vue';
import { storeToRefs } from "pinia";
import { useTimeOffPlanStore } from "@/stores/timeOffPlanStore";
import { VacationTypeList } from '@/models/employees/timeOff/VacationTypeList';
import { VacationPlanList } from "@/models/employees/timeOff/VacationPlanList";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/pro-light-svg-icons";
import FsInput from '@/components/global/fsInput/fsInput.vue';
import { OnboardingVacation, OnboardingFormVacation } from '@/models/onboarding/OnboardingVacation';
import { useLoadingStore } from '@/stores/loadingStore';
import { isEqual } from "lodash";
import { FormField } from '@/enums/FormField';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useRoute } from "vue-router";
import { AssignedVacationPlans } from "@/models/employees/timeOff/AssignedVacationPlans";
import { useBreakpoints } from "@/composables/useBreakpoints";



library.add(
  faCircleExclamation,
  faFloppyDisk
);
const { responsive } = useBreakpoints();
const store = useTimeOffPlanStore();
const {
  vacationPlanName,
  vacationType,
  dataOnboardingVacation,
  assignedVacationPlans } = storeToRefs(store);
const {
  fetchVacationList,
  fetchFormPayrollInformation,
  updateOnboardingVacation,
  fetchAssignedVacationPlans,
  updateAssignedVacationPlans } = store;
const { setLoading } = useLoadingStore();
const onboardingNavStore = useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const formModel: Ref<OnboardingVacation> = ref({} as OnboardingVacation);
const formModelClone: Ref<OnboardingVacation> = ref({} as OnboardingVacation);
const formFieldVacation = ref<OnboardingFormVacation>();
const planType = ref(new Array<VacationTypeList>());
const planList = ref(new Array<VacationPlanList>());
const filteredPlans = ref(null);
const isDisabledPlan = ref(true)
const openSaveChangeModal = ref(false);
const router = useRouter();
const isFormChanged = ref(false);
const toPath = ref("");
const isLeaveRoute = ref(false)
const isFinishLoading = ref(false);
const employeeId = router.currentRoute.value.params.id;
const formVacation = ref(null);
const currentNavItem = ref(null)
const fetchAllOfPlanTypeList = true;
const route = useRoute();

const handleGetVacation = async () => {
  await fetchVacationList(route.params.id, fetchAllOfPlanTypeList);
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

  await fetchFormPayrollInformation(Number(employeeId), FormField.Vacation)
  formFieldVacation.value = dataOnboardingVacation.value

  mapFieldModelToFormModel();
  isFormChanged.value = false;
}

const mapFieldModelToFormModel = () => {
  const data = formFieldVacation.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModel.value = data;

  formModelClone.value = { ...formModel.value };
}
const mapFormModelToFieldModel = async () => {
  const mappedFieldModels = formFieldVacation.value.fieldModels.map((fieldModel) => {
    const fieldValue = formModel.value[fieldModel.fieldKey] || "";
    return { ...fieldModel, fieldValue };
  });
  formFieldVacation.value.fieldModels = mappedFieldModels;
}
const handleSubmitForm = async (isNext: boolean) => {
  const { valid } = await formVacation.value.validate();
  if (!valid) return
  setLoading(true)
  try {
    await mapFormModelToFieldModel();
    await updateOnboardingVacation(Number(employeeId), formFieldVacation.value);
    await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId));
  } catch (error) {
    console.error(error)
  } finally {
    isFormChanged.value = false;
    if (isNext) {
      router.push({ name: 'onboardingEmploymentInformation' });
    }
    setLoading(false);
  }
}

watch(() => formModel.value.planType, async (val: VacationTypeList) => {
  if (val === null)
    return;

  planList.value = filteredPlans.value.filter(
    (plan: VacationPlanList) => plan.planTypeId === val.id
  );
  isDisabledPlan.value = false;

}, { deep: true })


watch(() => formModel.value, () => {
  if (isFinishLoading.value) {
    if (!isEqual(formModel.value, formModelClone.value)) {
      isFormChanged.value = true
    } else {
      isFormChanged.value = false
    }
  }

}, { deep: true })

onMounted(async () => {
  setLoading(true);  
  await handleGetVacation()
  if (onboardingSideNavItem.value.length == 0) {
    await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
  }
  currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLowerCase()
    === 'onboardingVacation'.trim().toLocaleLowerCase());
  isFinishLoading.value = true;
  setLoading(false)
});

onBeforeRouteLeave((to, _from, next) => {
  if (isFormChanged.value) {
    openSaveChangeModal.value = true
    toPath.value = to.fullPath
    if (!isLeaveRoute.value) {
      next(false)
      return false
    } else {
      next()
      return true
    }
  }
  next();
});
const handleDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
  isLeaveRoute.value = true;
  router.push(toPath.value)
};

const handleCancelDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
  isLeaveRoute.value = false;
};
</script>
<template>
  <div ref="container" v-if="isFinishLoading">
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
      <fs-row align-v="center">
        <fs-col class="truncate-text">
          <div class="hq-pg__title">Vacation Plan</div>
        </fs-col>
        <fs-col cols="auto" class="ms-auto">
          <fs-button :disabled="!isFormChanged" @click="handleSubmitForm(false)" variant="outline-info" form="form"
            type="submit">
            <font-awesome-icon class="mr-8" :icon="['fal', 'floppy-disk']" />SAVE</fs-button>
          <fs-button :disabled="!isFormChanged" @click="handleSubmitForm(true)" variant="info" form="form" type="submit">
            SAVE & NEXT</fs-button>
        </fs-col>

      </fs-row>
      
    </fs-container>
    <VeeForm ref="formVacation" class="onboardingVacation">
      <div class="p-4">
        <fs-row>
          <fs-col>
            <fs-input type="fsMultiselectList" label="Plan Type" v-model="formModel.planType" :typeaheaddata="planType"
              typeaheadkey="name" typeaheadvalueattribute="id" name="Plan Type" :showClear="true"
              :rules="{ required: true }" :required="true">
            </fs-input>
          </fs-col>
          <fs-col>
            <fs-input v-model="formModel.plan" label="Plan" type="fsMultiselectList" typeaheadkey="name"
              rules="required" typeaheadvalueattribute="id" name="Plan" :showClear="true" :typeaheaddata="planList"
              :disabled="isDisabledPlan" :required="true"></fs-input>
          </fs-col>
        </fs-row>
      </div>

    </VeeForm>
    <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved Changes" okText="YES, LEAVE"
      okTextVariant="danger" cancelText="stay" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
      @ok="handleDiscardOnRouteChange">
      <template #content>
        <span class="d-flex">
          <font-awesome-icon :class="['me-2', 'text-danger']" :icon="faCircleExclamation" size="lg" />
          <h5>
            Are you sure you want to leave this page?
            <br />
            You have unsaved changes, your data will be lost.
          </h5>
        </span>
      </template>
    </dark-theme-modal>
  </div>
</template>

<style scoped>
.ml-4 {
  margin-left: 4em;
}

.flex {
  display: flex;
}

.w-full {
  width: 100%;
}

.sub_title {
  font-weight: 700;
  font-size: 16px;
  color: #03a9f4;
}

.hq-pg__title {
  text-transform: capitalize;
  margin-bottom: 0;
  margin-right: 10px;
  font-size: 18px;
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form_header {
  height: 80px;
  border-bottom: 1px solid #e1e4e8;
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 2;
}

.onboardingVacation {
  width: 700px;
}
</style>
