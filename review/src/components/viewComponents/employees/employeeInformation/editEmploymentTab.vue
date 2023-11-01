<script setup lang="ts">
import { ref, ComputedRef, onBeforeMount, computed, watch } from 'vue';
import loadingWave from '@/assets/images/Loading_Wave.svg';
import FsInput from '@/components/global/fsInput/fsInput.vue';
import EmployeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { Employment, DropdownOption } from '@/models/employees/Employment';
import { useEmployeeStore } from '@/stores/employeeStore';
import { usePayrollStateTaxCodesStore } from '@/stores/payrollStateTaxCodesStore';
import { useJobTitleStore } from '@/stores/jobTitleStore';
import { storeToRefs } from 'pinia';
import { Form as VeeForm, FormValidationResult } from 'vee-validate';
import CommonModal from '@/components/common/commonModal.vue';
import { useFoundationIntegrationFactory } from '@/factories/foundationIntegrationFactory';
import { IntegrationFunction } from '@/enums/IntegrationFunction';
import { Department } from '@/models/foundationIntegration/Department';
import { Union } from '@/models/foundationIntegration/Union';
import { Trade } from '@/models/foundationIntegration/Trade';
import { WorkersCompState } from '@/models/foundationIntegration/WorkersCompState';
import { WorkersCompClass } from '@/models/foundationIntegration/WorkersCompClass';
import { CostCode } from '@/models/foundationIntegration/CostCode';
import { GeneralLiabilityState } from '@/models/foundationIntegration/GeneralLiabilityState';
import { GeneralLiabilityClass } from '@/models/foundationIntegration/GeneralLiabilityClass';
import { EmploymentStatus } from '@/enums/EmploymentStatus';
import { useAlerts } from '@/composables/useAlerts';
import { focusOnFirstError } from '@/functions/ValidationUtilityFunctions';
import { cloneDeep, isEqual } from 'lodash';
import { EmployeeInformationTab } from '@/enums/EmployeeInformationTab';
import ScrollToTop from '@/components/shared/scrollToTop.vue';

const notify = useAlerts();
const route = useRoute();
const router = useRouter();
const observer = ref();
const formHasValidated = ref(false);
const isLoading = ref(false);
const { fetchEmployment, fetchEmployeeList, editEmployment } =
  useEmployeeStore();
const { fetchJobTitle, addJobTitle } = useJobTitleStore();
const { employment, employeeList } = storeToRefs(useEmployeeStore());
const { jobTitles } = storeToRefs(useJobTitleStore());
const { fetchPayrollStateTaxCodes } = usePayrollStateTaxCodesStore();
const { payrollStateTaxCode } = storeToRefs(usePayrollStateTaxCodesStore());
const form = ref<Employment>(new Employment());
const originalForm = ref<Employment>(new Employment());
const employeeId: ComputedRef<string> = computed(() =>
  route.params?.id?.toString()
);
const showConfirmationModal = ref<boolean>(false);
const needConfirmBeforeNavigate = ref<boolean>(true);
const routeRequestedPath = ref<string>('');
const departmentService = useFoundationIntegrationFactory(
  IntegrationFunction.Department
)();
const unionService = useFoundationIntegrationFactory(
  IntegrationFunction.Union
)();
const tradeService = useFoundationIntegrationFactory(
  IntegrationFunction.Trade
)();
const WorkersCompStateService = useFoundationIntegrationFactory(
  IntegrationFunction.WorkersCompState
)();
const WorkersCompClassService = useFoundationIntegrationFactory(
  IntegrationFunction.WorkersCompClass
)();
const costCodeService = useFoundationIntegrationFactory(
  IntegrationFunction.CostCode
)();
const generalLiabilityStateService = useFoundationIntegrationFactory(
  IntegrationFunction.GeneralLiabilityState
)();
const generalLiabilityClassService = useFoundationIntegrationFactory(
  IntegrationFunction.GeneralLiabilityClass
)();

const JOB_TITLE_MAX_LENGTH = 50;

const employmentStatus = [
  { text: 'Full Time', value: EmploymentStatus.FullTime },
  { text: 'Part Time', value: EmploymentStatus.PartTime },
  { text: 'Variable Hour', value: EmploymentStatus.VariableHour },
  { text: 'Seasonal', value: EmploymentStatus.Seasonal },
];

const employmentStatusOptions = employmentStatus
  .filter((x) => typeof x !== 'string')
  .map((key) => {
    return {
      id: key.value,
      name: key.text,
    };
  });

const departmentOptions = ref<DropdownOption[]>([]);
const unionOptions = ref<DropdownOption[]>([]);
const tradeOptions = ref<DropdownOption[]>([]);
const WorkersCompStateOptions = ref<DropdownOption[]>([]);
const WorkersCompClassOptions = ref<DropdownOption[]>([]);
const costCodeOptions = ref<DropdownOption[]>([]);
const generalLiabilityStateOptions = ref<DropdownOption[]>([]);
const generalLiabilityClassOptions = ref<DropdownOption[]>([]);
const employeeOptions = ref<DropdownOption[]>([]);
const payrollStateTaxCodeOptions = ref<DropdownOption[]>([]);
const jobTitleOptions = ref<DropdownOption[]>([]);
const stateOfHireOptions = ref<DropdownOption[]>([]);
const departmentSelected = ref<DropdownOption>();
const unionSelected = ref<DropdownOption>();
const tradeSelected = ref<DropdownOption>();
const workersCompStateSelected = ref<DropdownOption>();
const workersCompClassSelected = ref<DropdownOption>();
const costCodeSelected = ref<DropdownOption>();
const generalLiabilityStateSelected = ref<DropdownOption>();
const generalLiabilityClassSelected = ref<DropdownOption>();
const employmentStatusSelected = ref<DropdownOption>();
const reportingSelected = ref<DropdownOption>();
const additionalSelecteds = ref<DropdownOption[]>();
const workLocationSelecteds = ref<DropdownOption[]>();
const jobTitleSelected = ref<DropdownOption>();
const stateOfHireSelected = ref<DropdownOption>();

async function fetchData() {
  const factoryData = await Promise.all([
    departmentService.getData(true),
    unionService.getData(true),
    tradeService.getData(true),
    WorkersCompStateService.getData(true),
    WorkersCompClassService.getData(true),
    costCodeService.getData(true),
    generalLiabilityStateService.getData(true),
    generalLiabilityClassService.getData(true),
    fetchJobTitle(),
    fetchPayrollStateTaxCodes(),
    fetchEmployeeList(),
    fetchEmployment(employeeId.value),
  ]);

  employeeOptions.value = employeeList.value.map((x) => ({
    id: x.id,
    name: x.fullName,
  }));

  payrollStateTaxCodeOptions.value = payrollStateTaxCode.value.map((x) => ({
    id: x.id,
    name: x.payrollStateTaxCodeFsNo,
  }));

  jobTitleOptions.value = jobTitles.value.map((x) => ({
    id: x.id,
    name: x.name,
  }));
  jobTitleOptions.value.sort((a, b) => a.name.localeCompare(b.name));

  stateOfHireOptions.value = payrollStateTaxCode.value.map((x) => ({
    id: x.id,
    name: x.payrollStateTaxCodeFsNo,
  }));

  departmentOptions.value = factoryData[0].map((department: Department) => ({
    id: department.id,
    name: department.departmentName,
  }));
  unionOptions.value = factoryData[1].map((union: Union) => ({
    id: union.id,
    name: union.unionName,
  }));
  tradeOptions.value = factoryData[2].map((trade: Trade) => ({
    id: trade.id,
    name: trade.tradeName,
  }));
  WorkersCompStateOptions.value = factoryData[3].map(
    (WorkersCompStates: WorkersCompState) => ({
      id: WorkersCompStates.id,
      name: WorkersCompStates.workersCompStateName,
    })
  );
  WorkersCompClassOptions.value = factoryData[4].map(
    (WorkersCompClass: WorkersCompClass) => ({
      id: WorkersCompClass.id,
      name: WorkersCompClass.workersCompClassName,
    })
  );
  costCodeOptions.value = factoryData[5].map((costCode: CostCode) => ({
    id: costCode.id,
    name: costCode.costCodeFsNo,
  }));
  generalLiabilityStateOptions.value = factoryData[6].map(
    (generalLiabilityState: GeneralLiabilityState) => ({
      id: generalLiabilityState.id,
      name: generalLiabilityState.generalLiabilityStateName,
    })
  );
  generalLiabilityClassOptions.value = factoryData[7].map(
    (generalLiabilityClass: GeneralLiabilityClass) => ({
      id: generalLiabilityClass.id,
      name: generalLiabilityClass.generalLiabilityClassFsNo,
    })
  );
}

async function createJobTitle(newTag: string) {
  if (newTag.length > JOB_TITLE_MAX_LENGTH) {
    return;
  }

  await addJobTitle(newTag);
  await fetchJobTitle();
  const newJobitle = jobTitles.value.find((x) => x.name === newTag);

  jobTitleSelected.value = newJobitle;
  jobTitleOptions.value.push(newJobitle);
}

function populateData() {
  if (employment.value.additionalSupervisorIds !== null) {
    additionalSelecteds.value = employment.value.additionalSupervisorIds.map(
      (x, index) => {
        return {
          id: x,
          name: employment.value.additionalSupervisors[index],
        } as DropdownOption;
      }
    );
  } else additionalSelecteds.value = null;

  if (employment.value.workLocationIds !== null) {
    workLocationSelecteds.value = employment.value.workLocationIds.map(
      (x, index) => {
        return {
          id: x,
          name: employment.value.workLocations[index],
        } as DropdownOption;
      }
    );
  } else workLocationSelecteds.value = null;

  jobTitleSelected.value = employment.value.jobTitleId
    ? {
        id: employment.value.jobTitleId,
        name: jobTitleOptions.value.find(
          (x) => x.id == employment.value.jobTitleId
        )?.name,
      }
    : null;

  stateOfHireSelected.value = employment.value.stateOfHire
    ? {
        id: stateOfHireOptions.value.find(
          (x) => x.name == employment.value.stateOfHire
        )?.id,
        name: stateOfHireOptions.value.find(
          (x) => x.name == employment.value.stateOfHire
        )?.name,
      }
    : null;

  departmentSelected.value = employment.value.departmentId
    ? {
        id: employment.value.departmentId,
        name: departmentOptions.value.find(
          (x) => x.id == employment.value.departmentId
        )?.name,
      }
    : null;

  unionSelected.value = employment.value.unionId
    ? {
        id: employment.value.unionId,
        name: unionOptions.value.find((x) => x.id == employment.value.unionId)
          ?.name,
      }
    : null;

  tradeSelected.value = employment.value.tradeId
    ? {
        id: employment.value.tradeId,
        name: tradeOptions.value.find((x) => x.id == employment.value.tradeId)
          ?.name,
      }
    : null;

  costCodeSelected.value = employment.value.costCodeId
    ? {
        id: employment.value.costCodeId,
        name: costCodeOptions.value.find(
          (x) => x.id == employment.value.costCodeId
        )?.name,
      }
    : null;

  workersCompStateSelected.value = employment.value.workersCompStateId
    ? {
        id: employment.value.workersCompStateId,
        name: WorkersCompStateOptions.value.find(
          (x) => x.id == employment.value.workersCompStateId
        )?.name,
      }
    : null;

  workersCompClassSelected.value = employment.value.workersCompClassId
    ? {
        id: employment.value.workersCompClassId,
        name: WorkersCompClassOptions.value.find(
          (x) => x.id == employment.value.workersCompClassId
        )?.name,
      }
    : null;

  generalLiabilityClassSelected.value = employment.value.generalLiabilityClassId
    ? {
        id: employment.value.generalLiabilityClassId,
        name: generalLiabilityClassOptions.value.find(
          (x) => x.id == employment.value.generalLiabilityClassId
        )?.name,
      }
    : null;

  generalLiabilityStateSelected.value = employment.value.generalLiabilityStateId
    ? {
        id: employment.value.generalLiabilityStateId,
        name: generalLiabilityStateOptions.value.find(
          (x) => x.id == employment.value.generalLiabilityStateId
        )?.name,
      }
    : null;

  employmentStatusSelected.value =
    employment.value.employmentStatusId > 0
      ? {
          id: employment.value.employmentStatusId,
          name: employmentStatusOptions.find(
            (x) => x.id == employment.value.employmentStatusId
          )?.name,
        }
      : null;

  reportingSelected.value = employment.value.reportingSupervisorId
    ? {
        id: employment.value.reportingSupervisorId,
        name: employeeOptions.value.find(
          (x) => x.id == employment.value.reportingSupervisorId
        )?.name,
      }
    : null;

  form.value = {
    ...employment.value,
  };

  originalForm.value = cloneDeep(form.value);
}

onBeforeMount(async () => {
  isLoading.value = true;
  await fetchData();
  populateData();
  isLoading.value = false;
});

watch(
  [
    () => employeeId.value,
    () => employmentStatusSelected.value,
    () => jobTitleSelected.value,
    () => departmentSelected.value,
    () => stateOfHireSelected.value,
    () => workLocationSelecteds.value,
    () => unionSelected.value,
    () => tradeSelected.value,
    () => reportingSelected.value,
    () => additionalSelecteds.value,
    () => workersCompStateSelected.value,
    () => workersCompClassSelected.value,
    () => costCodeSelected.value,
    () => generalLiabilityStateSelected.value,
    () => generalLiabilityClassSelected.value,
  ],
  () => {
    form.value.employeeId = Number(employeeId.value);
    form.value.employmentStatusId = employmentStatusSelected.value
      ? employmentStatusSelected.value.id
      : 0;
    form.value.jobTitleId = jobTitleSelected.value
      ? jobTitleSelected.value.id
      : null;
    form.value.departmentId = departmentSelected.value
      ? departmentSelected.value.id
      : null;
    form.value.stateOfHire = stateOfHireSelected.value
      ? stateOfHireSelected.value.name
      : null;
    form.value.workLocationIds = workLocationSelecteds.value
      ? workLocationSelecteds.value.map((x) => x.id)
      : null;
    form.value.unionId = unionSelected.value ? unionSelected.value.id : null;
    form.value.tradeId = tradeSelected.value ? tradeSelected.value.id : null;
    form.value.reportingSupervisorId = reportingSelected.value
      ? reportingSelected.value.id
      : 0;
    form.value.additionalSupervisorIds = additionalSelecteds.value
      ? additionalSelecteds.value.map((x) => x.id)
      : null;
    form.value.workersCompStateId = workersCompStateSelected.value
      ? workersCompStateSelected.value.id
      : null;
    form.value.workersCompClassId = workersCompClassSelected.value
      ? workersCompClassSelected.value.id
      : null;
    form.value.costCodeId = costCodeSelected.value
      ? costCodeSelected.value.id
      : null;
    form.value.generalLiabilityStateId = generalLiabilityStateSelected.value
      ? generalLiabilityStateSelected.value.id
      : null;
    form.value.generalLiabilityClassId = generalLiabilityClassSelected.value
      ? generalLiabilityClassSelected.value.id
      : null;
  },
  {
    deep: true,
  }
);

async function updateEmployment() {
  try {
    const validator: FormValidationResult<any> =
      await observer.value.validate();
    formHasValidated.value = true;
    if (validator.valid) {
      const result = await editEmployment(form.value);
      if (result) {
        needConfirmBeforeNavigate.value = false;
        goback();
        notify.notifySuccess('Edit Successful! Your changes have been saved.');
      } else {
        notify.notifyError(
          'Employment failed to save changes. Please try again later.'
        );
      }
    } else {
      focusOnFirstError('observer');
    }
  } catch (error) {
    console.log(error);
    notify.notifyError(
      'Employment failed to save changes. Please try again later.'
    );
  }
}

const isFormChanged = computed(() => !isEqual(form.value, originalForm.value));

function openConfirmModal() {
  if (isFormChanged.value === true) {
    showConfirmationModal.value = true;
  } else {
    goback();
  }
}

function onCancelClick() {
  showConfirmationModal.value = false;
}

function onCloseClick() {
  needConfirmBeforeNavigate.value = false;

  if (routeRequestedPath.value) {
    router.push(routeRequestedPath.value);
  } else {
    goback();
  }
}

function goback() {
  router.push({
    name: 'employeeInformation',
    params: { id: employeeId.value, tab: EmployeeInformationTab.Employment },
  });
}

function preventInputCharacterInOshaLevel() {
  if (!form.value.oshaLevel || form.value.oshaLevel === '')
    return false;

  var v = form.value.oshaLevel;
  var r = v.replace(/[A-Za-z-]/g, '');
  form.value.oshaLevel = r;
}

onBeforeRouteLeave(async (to) => {
  if (!needConfirmBeforeNavigate.value) {
    return true;
  }

  routeRequestedPath.value = to.fullPath;
  if (isFormChanged.value === true) {
    showConfirmationModal.value = true;
    return false;
  }
});
</script>
<template>
  <fs-overlay :show="isLoading" class="fsi-pg__overlay" no-wrap>
    <template #overlay>
      <div class="text-center">
        <img :src="loadingWave" />
      </div>
    </template>
  </fs-overlay>
  <div class="hq-pg d-flex flex-column form-edit" v-if="!isLoading">
    <VeeForm ref="observer" id="observer" v-slot="{ meta }">
      <employee-header :employeeId="employeeId" class="position-relative" />
      <fs-container fluid class="contain hq-pg__header">
        <fs-row align-v="center">
          <fs-col>
            <h2 class="hq-pg__title">Edit Employment Information</h2>
          </fs-col>
          <fs-col cols="auto" class="ms-auto">
            <fs-button variant="outline-secondary" @click="openConfirmModal()"
              >Cancel</fs-button
            >
            <fs-button
              variant="primary"
              @click="updateEmployment()"
              :disabled="!isFormChanged"
              >Save</fs-button
            >
          </fs-col>
        </fs-row>

        <common-modal
          :showModal="showConfirmationModal"
          title="CLOSE EMPLOYMENT FORM"
          okText="CLOSE"
          cancelText="CANCEL"
          okTextVariant="primary"
          @emitParent="onCloseClick()"
          @emitCloseParent="onCancelClick()"
        >
          <template #content>
            <div class="message-content">
              Are you sure you want to close this employment form? Any unsaved
              changes will be lost.
            </div>
          </template>
        </common-modal>
      </fs-container>
      <fs-container fluid class="contain mt-4">
        <fs-row>
          <fs-col lg="8">
            <section>
              <h3 class="hq-pg__section-head">General</h3>
              <p style="color: #6e7c8f">Section 1</p>
              <fs-row>
                <fs-col lg="6">
                  <fs-input
                    type="fsTextInput"
                    v-model="form.employeeNumber"
                    name="Employee Number"
                    label="Employee Number"
                    :disabled="true"
                  >
                  </fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="employmentStatusSelected"
                    :typeaheaddata="employmentStatusOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Employment Status"
                    label="Employment Status"
                    autocomplete="donotfill"
                    :required="true"
                    :dropdownSearchable="true"
                    :rules="{ required: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="jobTitleSelected"
                    :typeaheaddata="jobTitleOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Job Title"
                    label="Job Title"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false, max: JOB_TITLE_MAX_LENGTH }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    @createNew="createJobTitle"
                    taggable
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="departmentSelected"
                    :typeaheaddata="departmentOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Department"
                    label="Department"
                    autocomplete="donotfill"
                    :required="true"
                    :dropdownSearchable="true"
                    :rules="{ required: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-form-checkbox
                    name="I-9 Verified"
                    v-model="form.i9Verified"
                  >
                    I-9 Verified
                  </fs-form-checkbox>
                </fs-col>
              </fs-row>
              <p style="color: #6e7c8f; margin-top: 30px">Section 2</p>
              <fs-row>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="stateOfHireSelected"
                    :typeaheaddata="stateOfHireOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="State of Hire"
                    label="State of Hire"
                    autocomplete="donotfill"
                    :required="true"
                    :dropdownSearchable="true"
                    :rules="{ required: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="workLocationSelecteds"
                    :typeaheaddata="payrollStateTaxCodeOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Work Location"
                    label="Work Location"
                    :multiple="true"
                    :closeOnSelect="false"
                    :isTagError="() => false"
                    :isTagErrorAlt="() => false"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :showClear="true"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="unionSelected"
                    :typeaheaddata="unionOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Union"
                    label="Union"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="tradeSelected"
                    :typeaheaddata="tradeOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Trade"
                    label="Trade"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-form-checkbox name="ACA Exempt" v-model="form.acaExempt">
                    ACA Exempt
                  </fs-form-checkbox>
                </fs-col>
              </fs-row>
            </section>

            <section>
              <h3 class="hq-pg__section-head" style="margin-top: 30px">
                Supervisor
              </h3>

              <fs-row>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="reportingSelected"
                    :typeaheaddata="employeeOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Reporting Supervisor"
                    label="Reporting Supervisor"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="12">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="additionalSelecteds"
                    :typeaheaddata="employeeOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Additional Supervisors"
                    label="Additional Supervisors"
                    :multiple="true"
                    :closeOnSelect="false"
                    :isTagError="() => false"
                    :isTagErrorAlt="() => false"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :showClear="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
              </fs-row>
            </section>

            <section>
              <h3 class="hq-pg__section-head" style="margin-top: 30px">OSHA</h3>
              <fs-row>
                <fs-col lg="6">
                  <fs-input
                    type="fsTextInput"
                    v-model="form.oshaLevel"
                    name="OSHA Level"
                    label="OSHA Level"
                    :rules="{ required: false, regex: /^\d{1,10}$/ }"
                    :maxlength="10"
                    @input="preventInputCharacterInOshaLevel"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsTextInput"
                    v-model="form.oshaCertificateNumber"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="OSHA Certification Number"
                    label="OSHA Certification Number"
                    :rules="{ required: false }"
                    :maxlength="30"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsTextInput"
                    v-model="form.oshaTradeLicense"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="OSHA Trade License"
                    label="OSHA Trade License"
                    :rules="{ required: false }"
                    :maxlength="16"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
              </fs-row>
            </section>

            <section>
              <h3 class="hq-pg__section-head" style="margin-top: 30px">
                OTHER
              </h3>
              <fs-row>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="workersCompStateSelected"
                    :typeaheaddata="WorkersCompStateOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Worker’s Comp State"
                    label="Worker’s Comp State"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="workersCompClassSelected"
                    :typeaheaddata="WorkersCompClassOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Worker’s Comp Class Number"
                    label="Worker’s Comp Class Number"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="costCodeSelected"
                    :typeaheaddata="costCodeOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="Cost Code Number"
                    label="Cost Code Number"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="generalLiabilityStateSelected"
                    :typeaheaddata="generalLiabilityStateOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="General Liability State"
                    label="General Liability State"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    v-model="generalLiabilityClassSelected"
                    :typeaheaddata="generalLiabilityClassOptions"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="General Liability Class Number"
                    label="General Liability Class Number"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col lg="12">
                  <fs-form-checkbox
                    name="Corporate Officer"
                    v-model="form.corporateOfficer"
                  >
                    Corporate Officer
                  </fs-form-checkbox>
                </fs-col>
                <fs-col lg="12" style="margin-top: 10px">
                  <fs-form-checkbox
                    name="Owner Operator"
                    v-model="form.ownerOperator"
                  >
                    Owner Operator
                  </fs-form-checkbox>
                </fs-col>
              </fs-row>
            </section>
          </fs-col>
        </fs-row>
      </fs-container>
    </VeeForm>
    <ScrollToTop></ScrollToTop>
  </div>
</template>

<style scoped lang="scss">
:deep(.form-check-input:checked) {
  background-color: #03a9f4;
  border-color: #03a9f4;
}

.form-edit {
  padding-bottom: 20px;
}
</style>
