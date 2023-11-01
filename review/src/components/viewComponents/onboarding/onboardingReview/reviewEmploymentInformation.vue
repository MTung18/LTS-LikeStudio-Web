<script setup lang="ts">
import { FormField } from "@/enums/FormField";
import EmployerInformation from "@/models/EmploymentInformation";
import { useOnboardingEmploymentInformationStore } from "@/stores/employmentInformationStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const { setLoading } = useLoadingStore();
const { 
  formEmploymentInformation,
  jobTitleOptions, 
} = storeToRefs(
  useOnboardingEmploymentInformationStore()
);
const {
  fetchFormEmploymentInformationData,
  fetchJobTitleOptions, 
  fetchDepartmentOptions,
  fetchCostCodeOptions,
  fetchTradeOptions,
  fetchUnionOptions,
  fetchGeneralLiabilityClassOptions,
  fetchGeneralLiabilityStateOptions
} = useOnboardingEmploymentInformationStore();
const route = useRoute();

const formIdEmploymentInformation = FormField.EmploymentInformation;
const employeeId = computed(() => Number(route.params.id));
const formData = ref<Partial<EmployerInformation>>({
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

const formJobTitleOptions = ref([]);

onMounted(async () => {
  setLoading(true);
  await Promise.all([
    fetchFormEmploymentInformationData(
      employeeId.value,
      formIdEmploymentInformation
    ),
    fetchJobTitleOptions(),
    fetchDepartmentOptions(),
    fetchCostCodeOptions(),
    fetchTradeOptions(),
    fetchUnionOptions(),
    fetchGeneralLiabilityClassOptions(),
    fetchGeneralLiabilityStateOptions()
    
  ]);

  jobTitleOptions.value.forEach((item) => {
    formJobTitleOptions.value.push({
      value: item.id,
      text: item.name,
    });
  });

  formEmploymentInformation.value.fieldModels.forEach((item) => {
    const newKey = item.fieldKey;
    if (newKey) {
      formData.value[newKey] = item.fieldValue as never;
    }
  });

  setLoading(false);
});

const yesOrNo = (conditionStatement) => {
  return conditionStatement ? 'Yes' : 'No';
}
</script>

<template>
  <div>
    <section class="mb-4">
      <div class="text-task-cyan title">
        Federal
      </div>
      <hr />
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Date Hired
        </fs-col>
        <fs-col cols="8">
          {{ formData.hiredDate || '-' }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Start Date
        </fs-col>
        <fs-col cols="8">
          {{ formData.startDate || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Employment Status
        </fs-col>
        <fs-col cols="8">
          {{ formData.employmentStatus?.text || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Job Title
        </fs-col>
        <fs-col cols="8">
          {{ formData.jobTitle?.name || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Department
        </fs-col>
        <fs-col cols="8">
          {{ formData.department?.departmentName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Reporting Supervisor
        </fs-col>
        <fs-col cols="8">
          {{ formData.reportingManager?.fullName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Additional Supervisors
        </fs-col>
        <fs-col cols="8">
          <span v-for="supervisor in formData.additionalManager" :key="supervisor.id">
            {{ supervisor?.fullName || '-'}}
          </span>
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          State of Hire
        </fs-col>
        <fs-col cols="8">
          {{ formData.stateOfHire?.payrollStateTaxCodeName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Union
        </fs-col>
        <fs-col cols="8">
          {{ formData.union?.unionName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Trade
        </fs-col>
        <fs-col cols="8">
          {{ formData.trade?.tradeName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          ACA Exempt
        </fs-col>
        <fs-col cols="8">
          {{ yesOrNo(formData.acaExempt)}}
        </fs-col>
      </fs-row>
    </section>

    <section class="mb-4">
      <div class="text-task-cyan title">
        OSHA
      </div>
      <hr />
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          OSHA Level
        </fs-col>
        <fs-col cols="8">
          {{ formData.oshaLevel || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          OSHA Certification Number
        </fs-col>
        <fs-col cols="8">
          {{ formData.oshaCertificationNumber || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          OSHA Trade License
        </fs-col>
        <fs-col cols="8">
          {{ formData.oshaTradeLicense || '-'}}
        </fs-col>
      </fs-row>
      </section>

      <section class="mb-4">
      <div class="text-task-cyan title">
        Other
      </div>
      <hr />
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Worker’s Comp State
        </fs-col>
        <fs-col cols="8">
          {{ formData.workerCompState?.workersCompStateName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Worker’s Comp Class Number
        </fs-col>
        <fs-col cols="8">
          {{ formData.workerCompClassNumber?.displayName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Corporate Officer
        </fs-col>
        <fs-col cols="8">
          {{ yesOrNo(formData.corporateOfficer) }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Cost Code Number
        </fs-col>
        <fs-col cols="8">
          {{ formData.costCodeNumber?.costCodeName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          General Liability State
        </fs-col>
        <fs-col cols="8">
          {{ formData.generalLiabilityState?.generalLiabilityStateName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          General Liability Class Number
        </fs-col>
        <fs-col cols="8">
          {{ formData.generalLiabilityClass?.displayName || '-'}}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="4" class="text-bold ">
          Owner Operator
        </fs-col>
        <fs-col cols="8">
          {{ yesOrNo(formData.ownerOperator)}}
        </fs-col>
      </fs-row>
      </section>
    
    </div>
</template>

<style scoped lang="scss">
.title {
  font-weight: bold;
  font-size: 16px;
}

.text-bold {
  font-weight: bold;
}
</style>
