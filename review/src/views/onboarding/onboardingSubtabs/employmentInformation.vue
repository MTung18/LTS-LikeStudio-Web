<script lang="ts" setup>
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useAlerts } from "@/composables/useAlerts";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { FormField } from "@/enums/FormField";
import EmploymentInformation, { ManagerT, WorkersCompStateT } from "@/models/EmploymentInformation";
import { UploadPayload } from "@/models/onboarding/WOTC/UploadPayload";
import { useOnboardingEmploymentInformationStore } from "@/stores/employmentInformationStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useEmployeeStore } from "@/stores/employeeStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowUpFromBracket,
  faCircle,
  faPaperclip,
  faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import {
  faAsterisk,
  faCircleExclamation,
  faPenToSquare,
} from "@fortawesome/pro-solid-svg-icons";
import { isEqual } from "lodash";
import moment from "moment";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

library.add(
  faCircle,
  faPenToSquare,
  faAsterisk,
  faArrowUpFromBracket,
  faPaperclip,
  faCircleExclamation,
  faTrashCan
);

const route = useRoute();
const formIdEmploymentInformation = FormField.EmploymentInformation;
const employeeId = computed(() => Number(route.params.id));
const {
  formEmploymentInformation,
  jobTitleOptions,
  departmentOptions,
  costCodeOptions,
  tradeOptions,
  unionOptions,
  generalLiabilityClassOptions,
  generalLiabilityStateOptions,
  workersCompStatesOptions,
  workersCompClassesOptions,
  managerOptions,
  payrollStateTaxCodesOptions
} = storeToRefs(useOnboardingEmploymentInformationStore());
const {
  fetchFormEmploymentInformationData,
  updateFormEmploymentInformationData,
  fetchJobTitleOptions,
  updateJobTitleOptions,
  fetchDepartmentOptions,
  fetchCostCodeOptions,
  fetchTradeOptions,
  fetchUnionOptions,
  fetchGeneralLiabilityClassOptions,
  fetchGeneralLiabilityStateOptions,
  fetchWorkersCompClassesOptions,
  fetchWorkersCompStatesOptions,
  fetchManagerOptions,
  fetchPayrollStateTaxCodes
} = useOnboardingEmploymentInformationStore();

const { responsive } = useBreakpoints();
const { setLoading } = useLoadingStore();
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems } =
  useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());


const { fetchEmployment } = useEmployeeStore();
const { employment } = storeToRefs(useEmployeeStore());

const { notifySuccess } = useAlerts();
const router = useRouter();
const container = ref(null);
const formRef = ref(null);
const openSaveChangeModal = ref(false);
const renderedFormData = ref();
const isFormChanged = ref(false);
const toPath = ref("");
const isForcePush = ref(false);
const isSm = ref(false);
const isMd = ref(false);
const isLg = ref(false);
const isXl = ref(true);
const currentNavItem = ref(null);
const newJobTitleOptionId = ref(0)
const formData = ref<Partial<EmploymentInformation>>({
  isFormDone: false,
  startDate: "",
  hiredDate: "",
  employmentStatus: null,
  jobTitle: null,
  department: null,
  reportingManager: null,
  additionalManager: [],
  stateOfHire: null,
  union: null,
  trade: null,
  acaExempt: false,
  oshaLevel: "",
  oshaCertificationNumber: "",
  oshaTradeLicense: "",
  workerCompState: null,
  workerCompClassNumber: null,
  corporateOfficer: false,
  costCodeNumber: null,
  generalLiabilityState: null,
  generalLiabilityClass: null,
  ownerOperator: false,
});

const uploadFormData = ref<Partial<UploadPayload<EmploymentInformation>>>({
  fieldModels: [],
  uploadFileStateForms: [],
  formId: formIdEmploymentInformation,
  employeeId: employeeId.value,
});

const handleSave = async (isNext: boolean) => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    nextTick(() => {
      const el = container.value.getElementsByClassName("message-error")[0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    });
    return;
  } else {
    handleSubmitForm(isNext);
  }
};

const handleSubmitForm = async (isNext: boolean) => {
  try {
    setLoading(true);
    // upload new option

    if (formData.value.jobTitle?.name && jobTitleOptions.value.every((item) => item.name !== formData.value.jobTitle?.name)) {
      await updateJobTitleOptions(formData.value.jobTitle?.name);
      await fetchJobTitleOptions();
      formData.value.jobTitle.id = jobTitleOptions.value.find((item) => {
        item.name = formData.value.jobTitle?.name;
      })?.id;
    }

    formData.value.isFormDone = true;
    formData.value.startDate = moment(formData.value.startDate).toISOString();
    formData.value.hiredDate = moment(formData.value.hiredDate).toISOString();
    Object.keys(formData.value).forEach((fieldName: string) => {
      const uploadKey = uploadFormData.value.fieldModels.find(
        (item) => item.fieldKey === fieldName
      );
      if (uploadKey) {
        uploadKey.fieldValue = formData.value[fieldName];
      }
    });
    
    await updateFormEmploymentInformationData({ 
      employeeId: employeeId.value,
      formData: uploadFormData.value,
    });

    await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, employeeId.value)
    notifySuccess("Information updated.");
    isForcePush.value = true;
    isNext && router.push({ name: "onboardingPayrollInformation" });
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const formJobTitleOptions = ref([]);

onMounted(async () => {
  setLoading(true);
  await Promise.all([
    fetchFormEmploymentInformationData(
      employeeId.value,
      formIdEmploymentInformation
    ),
    getOnboardingSideNavItems(employeeId.value),
    fetchJobTitleOptions(),
    fetchDepartmentOptions(),
    fetchCostCodeOptions(),
    fetchTradeOptions(),
    fetchUnionOptions(),
    fetchGeneralLiabilityClassOptions(),
    fetchGeneralLiabilityStateOptions(),
    fetchWorkersCompClassesOptions(),
    fetchWorkersCompStatesOptions(),
    fetchManagerOptions(),
    fetchPayrollStateTaxCodes(),
    fetchEmployment(employeeId.value),
  ]).finally(setLoading(false));

  currentNavItem.value = onboardingSideNavItem.value.find(
    (item) =>
      item.progressSidebarUrl.trim().toLocaleLowerCase() ===
      "onboardingEmploymentInformation".trim().toLocaleLowerCase()
  );
  formJobTitleOptions.value = jobTitleOptions.value
  newJobTitleOptionId.value = jobTitleOptions.value.length + 1

  formEmploymentInformation.value.fieldModels.forEach((item) => {
    const newKey = item.fieldKey;
    if (newKey) {
      formData.value[newKey] = item.fieldValue as never;
      uploadFormData.value.fieldModels.push({
        formFieldId: item.formFieldId,
        fieldKey: item.fieldKey,
        fieldValue: item.fieldValue,
      });
    }
  });

  if (formEmploymentInformation.value.versionNo === 0) {
    formData.value.startDate = employment.value.startDate;
    formData.value.hiredDate = employment.value.dateHired;

    if (formData.value.reportingManager == null) {
      formData.value.reportingManager = new ManagerT();
    }
    formData.value.reportingManager = managerOptions.value.find(c => c.id == employment.value.reportingSupervisorId);

    if (formData.value.workerCompState == null) {
      formData.value.workerCompState = new WorkersCompStateT();
    }
    formData.value.workerCompState = workersCompStatesOptions.value.find(c => c.id == employment.value.workersCompStateId);   

    let additionalManager: ManagerT[] = []
    employment.value.additionalSupervisorIds.forEach(additionalSupervisorId => {
      let additionalManagerItem = managerOptions.value.find(c => c.id == additionalSupervisorId);
      additionalManager.push(additionalManagerItem)
    })

    formData.value.additionalManager= [...additionalManager];
    formData.value.employmentStatus =employmentStatusOptions.find(c => c.id ==employment.value.employmentStatusId);
  }

  renderedFormData.value = Object.assign({}, formData.value);
  setTimeout(() => {
    formRef.value.setErrors([]);
  });
  setLoading(false);
});


const handleDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
  isForcePush.value = true;
  router.push(toPath.value);
};

const handleCancelDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
};

onBeforeRouteLeave((to, from, next) => {
  if (isForcePush.value) {
    next();
    return true;
  }
  if (isFormChanged.value) {
    next();
    return true;
  } else {
    toPath.value = to.fullPath;
    next(false);
    openSaveChangeModal.value = true;
    return false;
  }
});

watch(
  () => formData.value,
  () => {
    if (!isEqual(renderedFormData.value, formData.value)) {
      isFormChanged.value = true;
    } else {
      isFormChanged.value = false;
    }
  },
  {
    deep: true,
  }
);

watch(
  () => responsive.breakpoint,
  () => {
    isSm.value = responsive.breakpoint === "sm";
    isMd.value = responsive.breakpoint === "md";
    isLg.value = responsive.breakpoint === "lg";
    isXl.value = responsive.breakpoint === "xl";
  }
);

const employmentStatusOptions = [
  {
    text: "Full Time",
    value: "Full-Time",
    id:1
  },
  {
    text: "Part Time",
    value: "Part-Time",
    id:2
  },
  {
    text: "Variable Hour",
    value: "Variable Hour",
    id:3
  },
  {
    text: "Seasonal",
    value: "Seasonal",
    id:4
  },
];

const handleCreateNewJobTitleOption = async (newTag) => {
  formJobTitleOptions.value.push({
    id: newJobTitleOptionId.value,
    name: newTag,
  });

  formData.value.jobTitle = {
    id: newJobTitleOptionId.value,
    name: newTag,
  }
  newJobTitleOptionId.value++
};
</script>
<template>
  <fs-container class="p-0" ref="container">
    <!-- form header -->
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
      <fs-row align-v="center">
        <fs-col class="truncate-text">
          <h2 class="hq-pg__title">Employment Information</h2>
        </fs-col>
        <fs-col cols="auto">
          <fs-button variant="outline-success" class="text-capitalize" @click="handleSave(false)" :disabled="!isFormChanged">
            <font-awesome-icon :icon="['fal', 'floppy-disk']" class="me-2" /> SAVE
          </fs-button>

          <fs-button :disabled="!isFormChanged" variant="success" class="text-capitalize" @click="handleSave(true)">
            SAVE & NEXT
          </fs-button>          
        </fs-col>
      </fs-row>

    </fs-container>
    <!-- form header -->
    <fs-container class="contain py-4">
      <!-- form body -->
      <VeeForm ref="formRef">
        <h5 class="text-task-cyan border-bottom mb-3 py-2 fw-bold">
          General
        </h5>
        <div class="w-max700">
          <fs-row>
            <fs-col xl="4" md="6" sm="12">
              <fs-input label="Date Hired" name="hiredDate" type="fsDateInput" v-model="formData.hiredDate"
                :required="true" :rules="{ required: true }" />
            </fs-col>
            <fs-col xl="4" md="6" sm="12">
              <fs-input label="Start Date" name="startDate" type="fsDateInput" v-model="formData.startDate"
                :required="true" :rules="{ required: true }" />
            </fs-col>
            <fs-col xl="4" md="6" sm="12">
              <fs-input label="Employment Status" name="employmentStatus" type="fsMultiselectList" placeholder=""
                :typeaheaddata="employmentStatusOptions" typeaheadkey="text" typeaheadvalueattribute="value" showClear
                v-model="formData.employmentStatus" :required="true" :rules="{ required: true }" />
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col md="6" sm="12">
              <div>
                <fs-input type="fsMultiselectList" :taggable="true" name="jobTitle" label="Job Title"
                  :typeaheaddata="formJobTitleOptions" typeaheadkey="name" typeaheadvalueattribute="id" showClear
                  v-model="formData.jobTitle" @createNew="handleCreateNewJobTitleOption" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="Department" name="department" type="fsMultiselectList" placeholder=""
                  :typeaheaddata="departmentOptions" typeaheadkey="departmentName" typeaheadvalueattribute="id" showClear
                  v-model="formData.department" :required="true" :rules="{ required: true }" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="Reporting Supervisor" name="reportingManager" type="fsMultiselectList" placeholder=""
                  :typeaheaddata="managerOptions" typeaheadkey="fullName" typeaheadvalueattribute="id" showClear
                  v-model="formData.reportingManager" :required="true" :rules="{ required: true }" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input :closeOnSelect="false" name="additionalManager" label="Additional Supervisors"
                  type="fsMultiselectList" placeholder="" :typeaheaddata="managerOptions" typeaheadkey="fullName"
                  typeaheadvalueattribute="id" showClear multiple v-model="formData.additionalManager"
                  :style="{ height: 'fit-content' }" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="State of Hire" name="stateOfHire" type="fsMultiselectList" placeholder="" showClear
                  :typeaheaddata="payrollStateTaxCodesOptions" typeaheadkey="payrollStateTaxCodeName"
                  typeaheadvalueattribute="id" v-model="formData.stateOfHire" :required="true"
                  :rules="{ required: true }" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="Union" name="union" type="fsMultiselectList" placeholder="" showClear
                  :typeaheaddata="unionOptions" typeaheadkey="unionName" typeaheadvalueattribute="id"
                  v-model="formData.union" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="Trade" name="trade" type="fsMultiselectList" placeholder="" showClear
                  :typeaheaddata="tradeOptions" typeaheadkey="tradeName" typeaheadvalueattribute="id"
                  v-model="formData.trade" />
              </div>
            </fs-col>
          </fs-row>
          <div class="d-flex">
            <fs-form-checkbox name="acaExempt" id="acaExempt" v-model="formData.acaExempt" />
            <label for="acaExempt">ACA Exempt</label>
          </div>

          <h5 class="text-task-cyan border-bottom mb-3 py-2 fw-bold">
            OSHA
          </h5>
          <fs-row>
            <fs-col md="6" sm="12">
              <div>
                <fs-input type="fsTextInput" mask-format="##########" name="oshaLevel" label="OSHA Level"
                  v-model="formData.oshaLevel" :rules="{ max: 10 }" :maxlength="10" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input type="fsTextInput" name="oshaCertificationNumber" label="OSHA Certification Number"
                  v-model="formData.oshaCertificationNumber" :rules="{ max: 30 }" :maxlength="30" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input type="fsTextInput" label="OSHA Trade License" name="oshaTradeLicense"
                  v-model="formData.oshaTradeLicense" :rules="{ max: 16 }" :maxlength="16" />
              </div>
            </fs-col>
          </fs-row>
          <h5 class="text-task-cyan border-bottom mb-3 py-2 fw-bold">
            Other
          </h5>

          <fs-row>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="Worker’s Comp State" name="workerCompState" type="fsMultiselectList" placeholder=""
                  :typeaheaddata="workersCompStatesOptions" typeaheadkey="workersCompStateName"
                  typeaheadvalueattribute="id" showClear v-model="formData.workerCompState" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="Worker’s Comp Class Number" name="workerCompClassNumber" type="fsMultiselectList"
                  placeholder="" showClear :typeaheaddata="workersCompClassesOptions" typeaheadkey="workersCompClassName"
                  typeaheadvalueattribute="id" v-model="formData.workerCompClassNumber" />
              </div>
            </fs-col>

            <fs-col cols="12">
              <div class="d-flex">
                <fs-form-checkbox name="corporateOfficer" id="corporateOfficer" v-model="formData.corporateOfficer" />
                <label for="corporateOfficer">Corporate Officer</label>
              </div>
            </fs-col>

            <fs-col md="6" sm="12">
              <div>
                <fs-input label="Cost Code Number" name="costCodeNumber" type="fsMultiselectList" placeholder="" showClear
                  :typeaheaddata="costCodeOptions" typeaheadkey="costCodeName" typeaheadvalueattribute="id"
                  v-model="formData.costCodeNumber" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="General Liability State" name="generalLiabilityState" type="fsMultiselectList"
                  placeholder="" showClear :typeaheaddata="generalLiabilityStateOptions"
                  typeaheadkey="generalLiabilityStateName" typeaheadvalueattribute="id"
                  v-model="formData.generalLiabilityState" />
              </div>
            </fs-col>
            <fs-col md="6" sm="12">
              <div>
                <fs-input label="General Liability Class Number" name="generalLiabilityClass" type="fsMultiselectList"
                  placeholder="" showClear :typeaheaddata="generalLiabilityClassOptions" typeaheadkey="displayName"
                  typeaheadvalueattribute="id" v-model="formData.generalLiabilityClass" />
              </div>
            </fs-col>
            <fs-col cols="12">
              <div class="d-flex">
                <fs-form-checkbox name="ownerOperator" id="ownerOperator" v-model="formData.ownerOperator" />
                <label for="ownerOperator">Owner Operator</label>
              </div>
            </fs-col>
          </fs-row>
        </div>
      </VeeForm>
      <!-- form body -->
    </fs-container>
    <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved changes" okText="YES, LEAVE"
      okTextVariant="danger" cancelText="STAY" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
      @ok="handleDiscardOnRouteChange">
      <template #content>
        <span class="d-flex py-3">
          <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
          <div>
            Are you sure you want to leave this page?
            <br />
            You have unsaved changes, your data will be lost.
          </div>
        </span>
      </template>
    </dark-theme-modal>
  </fs-container>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.label {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
}

.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
}

.w-max700 {
  max-width: 700px;
}

.text-justify {
  text-align: justify;
}

:deep(.multiselect__single) {
  margin-bottom: 0;
  font-size: 14px;
}

:deep(button.btn.btn-link.fs-input__button) {
  height: 64% !important;
}

:deep(.form-check-input:checked) {
  background-color: #03a9f4;
  border-color: #03a9f4;
}

:deep(.multiselect__option--selected.multiselect__option--highlight),
:deep(.multiselect__option--selected.multiselect__option--highlight:after) {
  background-color: transparent;
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
</style>
