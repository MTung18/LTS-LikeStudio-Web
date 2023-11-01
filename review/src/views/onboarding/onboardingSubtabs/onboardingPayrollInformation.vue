<script setup lang="ts">
import { Ref, computed, nextTick, onMounted, watch } from 'vue';
import { ref } from 'vue';
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowUpFromBracket,
  faCircle,
  faPaperclip,
  faTrashCan,
  faArrowUpRightFromSquare,
  faPenToSquare,
  faUser,
  faCity,
  faFloppyDisk
} from "@fortawesome/pro-light-svg-icons";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { PAY_TYPE } from '@/constants/common';
import { OnboardingPayrollInformation, OnboardingPayrollInformationModel } from '@/models/onboarding/OnboardingPayrollInformation';
import { useLoadingStore } from '@/stores/loadingStore';
import { useOnboardingEmployerPayrollInformationStore } from '@/stores/onboardingEmployerPayrollInformationStore';
import { storeToRefs } from 'pinia';
import { FormField } from '@/enums/FormField';
import { isEqual } from "lodash";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import FsInput from '@/components/global/fsInput/fsInput.vue';
import { Form as VeeForm } from 'vee-validate';
import { EarnCodes, PayPeriods } from "@/models/onboarding/OnboardingEmployerPayrollInformation";
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useBreakpoints } from "@/composables/useBreakpoints";

const { responsive } = useBreakpoints();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const onboardingNavStore = useOnboardingStore();

const currentNavItem = ref(null)
const router = useRouter();
const { setLoading } = useLoadingStore();
const container = ref(null);
const formData = ref(null);
const isFormChanged = ref(false);
const isFinishLoading = ref(false);
const toPath = ref("");
const openSaveChangeModal = ref(false);
const isLeaveRoute = ref(false)

const formModel: Ref<OnboardingPayrollInformation> = ref({} as OnboardingPayrollInformation);
const formModelClone: Ref<OnboardingPayrollInformation> = ref();
const formFieldPayrollInformation = ref();
const payPeriods: Ref<PayPeriods[]> = ref([]);
const earnCodes: Ref<EarnCodes[]> = ref([]);

const employeeId = router.currentRoute.value.params.id;
const onboardingEmployerPayrollInformationStore = useOnboardingEmployerPayrollInformationStore();
const { dataOnboardingEmployerPayrollInformation, dataPayPeriods, dataEarnCodes } = storeToRefs(useOnboardingEmployerPayrollInformationStore());

const SAVE_TYPE = {
  SAVE: "Save",
  SAVENEXT: "Save and Next"
}

const formHasValidated = ref(false);

watch(() => !isEqual(formModel.value, formModelClone.value), () => {
  if (isFinishLoading.value) {
    if (!isEqual(formModel.value, formModelClone.value)) {
      isFormChanged.value = true
    } else {
      isFormChanged.value = false
    }
  }
})

library.add(
  faCircle,
  faArrowUpFromBracket,
  faPaperclip,
  faTrashCan,
  faCircleExclamation,
  faArrowUpRightFromSquare,
  faPenToSquare,
  faUser,
  faCity,
  faFloppyDisk
);

const handleSubmitForm = async (event: Event, saveTypeStr?: string) => {
  event.preventDefault();
  const { valid } = await formData.value.validate();
  if (!valid) {
    nextTick(() => {
      const el = container.value?.getElementsByClassName('message-error')[0]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    })
    return
  }
  formHasValidated.value = true;
  setLoading(true)

  mapFormModelToFieldModel();
  await saveForm();
  await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId));

  if (saveTypeStr === SAVE_TYPE.SAVENEXT) {
    router.push({ name: "onboardingReviewInfo" });
  }
  setLoading(false);
}

const saveForm = async () => {
  await onboardingEmployerPayrollInformationStore.editFormPayrollInformation(formFieldPayrollInformation.value, FormField.PayrollInformation);
  await handleGetPayrollInformation();
}

onBeforeRouteLeave((to, from, next) => {
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

const handleGetPayrollInformation = async () => {
  await onboardingEmployerPayrollInformationStore.fetchEarnCodes();
  earnCodes.value = [...dataEarnCodes.value.filter(data => data.isActive == true && data.isDeleted == false)];
  await onboardingEmployerPayrollInformationStore.fetchPayPeriods();
  payPeriods.value = [...dataPayPeriods.value.filter(data => data.isActive == true && data.isDeleted == false)];
  await onboardingEmployerPayrollInformationStore.fetchFormPayrollInformation(Number(employeeId), FormField.PayrollInformation)
  formFieldPayrollInformation.value = dataOnboardingEmployerPayrollInformation.value

  mapFieldModelToFormModel();
  isFormChanged.value = false;
}

const mapFieldModelToFormModel = () => {
  const data = formFieldPayrollInformation.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModel.value = data;

  if (formModel.value.hoursRequiredForSalary == "") formModel.value.hoursRequiredForSalary = false;
  if (formModel.value.certifiedPayroll == "") formModel.value.certifiedPayroll = false;
  if (formModel.value.futaFusaExempt == "") formModel.value.futaFusaExempt = false;

  formModelClone.value = { ...formModel.value };
}

const mapFormModelToFieldModel = () => {
  const mappedFieldModels = formFieldPayrollInformation.value.fieldModels.map((fieldModel) => {
    const fieldValue = formModel.value[fieldModel.fieldKey] || ""; // Set fieldValue to an empty string if fieldKey does not exist in data
    return { ...fieldModel, fieldValue };
  });
  formFieldPayrollInformation.value.fieldModels = mappedFieldModels;
}

onMounted(async () => {
  setLoading(true)
  await handleGetPayrollInformation();
  if (onboardingSideNavItem.value.length == 0) {
    await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
  }
  currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLowerCase() === 'onboardingPayrollInformation'.trim().toLocaleLowerCase());
  isFinishLoading.value = true;
  setLoading(false)
})

const payRateLabel = computed(() => {
  const label = formModel.value.payType.text === "Hourly" ? 'Pay Rate per Hour' : 'Pay Rate per Period'
  return label
})

</script>

<template>
  <div ref="container" v-if="isFinishLoading">
      <VeeForm ref="formData" v-slot="{ meta }">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
          <fs-row align-v="center">
            <fs-col class="text-truncate">
              <h2 class="hq-pg__title">Payroll Information</h2>
            </fs-col>
            <fs-col cols="auto" class="ms-auto">
              <fs-button type="button" variant="outline-primary"
              :disabled="!isFormChanged" @click="handleSubmitForm($event, SAVE_TYPE.SAVE)">
              <font-awesome-icon :icon="['fal', 'floppy-disk']" />
              Save</fs-button>
              <fs-button type="button" variant="primary" :disabled="!isFormChanged"
                @click="handleSubmitForm($event, SAVE_TYPE.SAVENEXT)">Save
                &#38;
                next</fs-button>
            </fs-col>
          </fs-row>

        </fs-container>
        <fs-col md="12" class="p-4" :style="{ maxWidth: '700px' }">
          <div class="d-flex">
            <fs-col class="me-4">
              <fs-input type="fsMultiselectList" label="Pay Type" id="payType" labelId="payTypeId"
                v-model="formModel.payType" :typeaheaddata="PAY_TYPE" typeaheadkey="text" typeaheadvalueattribute="value"
                name="payType" :showClear="true" autocomplete="donotfill" :dropdownSearchable="true"
                :rules="{ required: true }" :required="true" :formMeta="{ ...meta, validated: formHasValidated }">
              </fs-input>
            </fs-col>
            <fs-col>
              <fs-input type="fsMultiselectList" label="Earn Code" id="earnCode" labelId="earnCodeId"
                v-model="formModel.earnCode" :typeaheaddata="earnCodes" typeaheadkey="earnCodeName"
                typeaheadvalueattribute="id" name="earnCode" :showClear="true" autocomplete="donotfill"
                :dropdownSearchable="true" :rules="{ required: true }" :required="true"
                :formMeta="{ ...meta, validated: formHasValidated }">
              </fs-input>
            </fs-col>
          </div>
          <div class="d-flex pt-2">
            <fs-col class="me-4">
              <fs-input type="fsMultiselectList" label="Pay Period" id="payPeriod" labelId="payPeriodId"
                v-model="formModel.payPeriod" :typeaheaddata="payPeriods" typeaheadkey="payPeriodName"
                typeaheadvalueattribute="id" name="payPeriod" :showClear="true" autocomplete="donotfill"
                :dropdownSearchable="true" :rules="{ required: true }" :required="true"
                :formMeta="{ ...meta, validated: formHasValidated }">
              </fs-input>
            </fs-col>
            <fs-col>
              <fs-input type="fsNumber" :label="payRateLabel" :name="payRateLabel"
                :rules="{ required: true,                                             
                          precisionAndScale: {
                              precision: 12,
                              scale: 5,
                              message: 'Can only contain 5 decimals',
                              precisionMesage: 'Allowed format is (12,5)XXXXXXX.XXXXX'
                          } }"
                :formMeta="{ ...meta, validated: formHasValidated }" prepend="$"
                v-model="formModel.payRatePerPayPeriod" :required="true"></fs-input>
            </fs-col>
          </div>
          <div class="pt-2">
            <fs-col>
              <fs-input type="fsTextInput" input-type="number" label="Pay Periods per Year" rules="integer|required" name="Pay Periods per Year"
                :formMeta="{ ...meta, validated: formHasValidated }" :maxlength="6" v-model="formModel.payPeriodsPerYear" mask-format="######"
                :required="true"></fs-input>
            </fs-col>
          </div>
          <div class="pt-4">
            <fs-form-checkbox v-model="formModel.hoursRequiredForSalary">
              <span class="ms-1">Hours Required for Salary</span>
            </fs-form-checkbox>
          </div>
          <div class="pt-4">
            <fs-form-checkbox v-model="formModel.certifiedPayroll">
              <span class="ms-1">Certified Payroll</span>
            </fs-form-checkbox>
          </div>
          <div class="pt-4">
            <fs-form-checkbox v-model="formModel.futaFusaExempt">
              <span class="ms-1">FUTA/FUSA Exempt</span>
            </fs-form-checkbox>
          </div>
        </fs-col>
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

<style scoped lang="scss">
.form_header {
  height: 80px;
  border-bottom: 1px solid #e1e4e8;
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 2;
}
</style>
