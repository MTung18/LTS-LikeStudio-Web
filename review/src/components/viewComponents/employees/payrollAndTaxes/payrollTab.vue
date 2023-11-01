<script lang="ts" setup>
import { PayType } from '@/enums/PayType';
import { useEmployeePayrollInformationStore } from '@/stores/employeePayrollInformationStore';
import { formatCurrency } from "@/utilities/formatUtils";
import { storeToRefs } from 'pinia';
import { onMounted } from "vue";

interface Props {
  employeeId: number,
}

const props = withDefaults(defineProps<Props>(), {
  employeeId: null,
});

const employeePayrollInformationStore = useEmployeePayrollInformationStore();
const { payrollInformation } = storeToRefs(employeePayrollInformationStore);
const { fetchPayrollInformation, } = employeePayrollInformationStore;

onMounted(async () => {
  fetchPayrollInformation(props.employeeId);
});
</script>

<template>
  <fs-container fluid class="contain">
    <fs-row>
      <fs-col lg="6">
        <div class="d-flex flex-column h-100">
          <fs-card class="my-4 dashboard-card" header-tag="header" header-class="dashboard-card__header" no-body>
            <fs-card-header class="dashboard-card__header">
                <h2 class="hq-pg__title text-cyan">
                  Payroll Information
                </h2>
              </fs-card-header>
            <fs-card-body class="my-2">
              <fs-container fluid>

                <fs-row class="py-1">
                    <fs-col class="fw-bold" cols="6">Pay Type</fs-col>
                    <fs-col cols="6">{{ PayType[payrollInformation?.payTypeId] }}</fs-col>
                  </fs-row>
                  <fs-row class="py-1">
                    <fs-col class="fw-bold" cols="6">Earn Code</fs-col>
                    <fs-col cols="6">{{ payrollInformation?.earnCode?.earnCodeName || '' }}</fs-col>
                  </fs-row>
                  <fs-row class="py-1">
                    <fs-col class="fw-bold" cols="6">Pay Period</fs-col>
                    <fs-col cols="6">{{ payrollInformation?.payPeriod?.payPeriodName || '' }}</fs-col>
                  </fs-row>
                  <fs-row class="py-1">
                    <fs-col class="fw-bold" cols="6">Pay Rate Per Pay Period</fs-col>
                    <fs-col cols="6">{{ formatCurrency(payrollInformation?.payRate || 0) }}</fs-col>
                  </fs-row>
                  <fs-row class="py-1">
                    <fs-col class="fw-bold" cols="6">Pay Periods Per Year</fs-col>
                    <fs-col cols="6">{{ payrollInformation?.payPeriodsPerYear || '' }}</fs-col>
                  </fs-row>
                  <fs-row class="py-1">
                    <fs-col class="fw-bold" cols="6">Hours Required for Salary</fs-col>
                    <fs-col cols="6">{{ payrollInformation?.isHoursRequiredForSalary ? "Yes" : "No" }}</fs-col>
                  </fs-row>
                  <fs-row class="py-1">
                    <fs-col class="fw-bold" cols="6">Certified Payroll</fs-col>
                    <fs-col cols="6">{{ payrollInformation?.isCertifiedPayroll ? "Yes" : "No" }}</fs-col>
                  </fs-row>
                  <fs-row class="py-1">
                    <fs-col class="fw-bold" cols="6">FUTA/SUTA Exempt</fs-col>
                    <fs-col cols="6">{{ payrollInformation?.isFutaSutaExempt ? "Yes" : "No" }}</fs-col>
                  </fs-row>

              </fs-container>
            </fs-card-body>



          </fs-card>          
        </div>

      </fs-col>
    </fs-row>
  </fs-container>
</template>
