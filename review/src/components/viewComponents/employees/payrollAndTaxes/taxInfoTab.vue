<script lang="ts" setup>
import { useEmployeeTaxInformationStore } from '@/stores/employeeTaxInformationStore';
import { formatCurrency } from "@/utilities/formatUtils";
import { storeToRefs } from 'pinia';
import { onMounted, ref } from "vue";
interface Props {
  employeeId: number,
}
const props = withDefaults(defineProps<Props>(), {
  employeeId: null,
});

const is2020OrLater = ref<boolean>(false);
const employeeTaxInformationStore = useEmployeeTaxInformationStore();
const { fetchEmployeeTaxInformation } = employeeTaxInformationStore;
const { employeeTaxInformation } = storeToRefs(employeeTaxInformationStore);

onMounted(async () => {
  await fetchEmployeeTaxInformation(props.employeeId);
  is2020OrLater.value = employeeTaxInformation?.value.employeePayrollFederalTaxDetail?.useXxxxOrLaterW4Version;
});
</script>

<template>
  <fs-container fluid class="contain">
    <fs-row>
      <fs-col lg="6">
        <fs-card class="my-4" header-tag="header" no-body>
          <fs-card-header class="with-pill d-flex justify-content-between align-items-center">
            <strong>Federal Withholding Info</strong>
            <span class="badge-pill" :class="{ is2020OrLater: is2020OrLater }">
              {{ is2020OrLater ? '2020 Or Later' : 'Pre-2020' }}
            </span>
          </fs-card-header>

          <fs-card-body class="dashboard-card__body">
            <table>
              <tbody>
                <tr>
                  <th>Filing Status</th>
                  <td>
                    {{
                      employeeTaxInformation?.employeePayrollFederalTaxDetail?.federalFilingStatus?.federalFilingStatusDescription
                      || '-'
                    }}
                  </td>
                </tr>
                <template v-if="is2020OrLater">
                  <tr>
                    <th>Multiple Jobs or Spouse Works</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.hasCheckboxWithholding !== null ?
                        (employeeTaxInformation?.employeePayrollFederalTaxDetail?.hasCheckboxWithholding ? 'Yes' : 'No') :
                        '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Claim Dependent and Other Credits</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.claimDependents ?
                        formatCurrency(employeeTaxInformation?.employeePayrollFederalTaxDetail?.claimDependents) :
                        '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Other Income</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.otherIncome ?
                        formatCurrency(employeeTaxInformation?.employeePayrollFederalTaxDetail?.otherIncome) :
                        '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Deductions</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.deductions ?
                        formatCurrency(employeeTaxInformation?.employeePayrollFederalTaxDetail?.deductions) :
                        '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Extra Withholding</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.extraWithholding ?
                        formatCurrency(employeeTaxInformation?.employeePayrollFederalTaxDetail?.extraWithholding) :
                        '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Override</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.payrollTaxOverride?.payrollTaxOverrideDescription
                        || '-'
                      }}
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <th>Exemptions</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.exemptions ?
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.exemptions :
                        '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Extra Federal Withholding Amount</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.amount ?
                        formatCurrency(employeeTaxInformation?.employeePayrollFederalTaxDetail?.amount) :
                        '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Extra Federal Withholding Percent</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.percent ?
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.percent + '%' :
                        '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Override</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.payrollTaxOverride?.payrollTaxOverrideDescription
                        || '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Add On</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.payrollTaxAddOn.payrollTaxAddOnDescription
                        || '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Residence</th>
                    <td>
                      {{
                        employeeTaxInformation?.employeePayrollFederalTaxDetail?.isResident !== null ?
                        (employeeTaxInformation?.employeePayrollFederalTaxDetail?.isResident ? 'Yes' : 'No') :
                        '-'
                      }}
                    </td>
                  </tr>
                </template>
                
              </tbody>
            </table>
          </fs-card-body>
        </fs-card>

        <fs-card class="my-4" header="Local Withholding Info" header-tag="header" header-class="card__header"
          v-for="(localWithholdingInfo, index) in employeeTaxInformation?.employeePayrollLocalTaxCodeDetails"
          :key="index">
          <table>
            <tbody>
              <tr>
                <th>State</th>
                <td>{{ localWithholdingInfo?.payrollLocalTaxCode?.payrollStateTaxCode?.payrollStateTaxCodeName || '-' }}
                </td>
              </tr>
              <tr>
                <th>Locality</th>
                <td>{{ localWithholdingInfo?.payrollLocalTaxCode?.displayName || '-' }}</td>
              </tr>
              <tr>
                <th>Exemptions</th>
                <td>{{ localWithholdingInfo?.exemptions ? localWithholdingInfo?.exemptions : '-' }}</td>
              </tr>
              <tr>
                <th>Extra Local Withholding Amount</th>
                <td>
                  {{
                    localWithholdingInfo?.amount ?
                    formatCurrency(localWithholdingInfo?.amount) :
                    '-'
                  }}
                </td>
              </tr>
              <tr>
                <th>Extra Local Withholding Percent</th>
                <td>
                  {{
                    localWithholdingInfo ?
                    localWithholdingInfo.percent + '%' :
                    '-'
                  }}
                </td>
              </tr>
              <tr>
                <th>Override</th>
                <td>{{ localWithholdingInfo?.payrollTaxOverride?.payrollTaxOverrideDescription || '-' }}</td>
              </tr>
              <tr>
                <th>Add On</th>
                <td>{{ localWithholdingInfo?.payrollTaxAddOn?.payrollTaxAddOnDescription || '-' }}</td>
              </tr>
              <tr>
                <th>Residence</th>
                <td>
                  {{
                    localWithholdingInfo?.isResident !== null ? (localWithholdingInfo?.isResident ? 'Yes' : 'No') : '-'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </fs-card>
      </fs-col>

      <fs-col lg="6">
        <fs-card class="my-4" header="State Withholding Info" header-tag="header" header-class="card__header"
          v-for="(stateWithholdingInfo, index) in employeeTaxInformation?.employeePayrollStateTaxCodeDetails"
          :key="index">
          <table>
            <tbody>
              <tr>
                <th>State</th>
                <td>{{ stateWithholdingInfo?.payrollStateTaxCode?.payrollStateTaxCodeName || '-' }}</td>
              </tr>
              <tr>
                <th>Filing Status</th>
                <td>{{ stateWithholdingInfo?.stateFilingStatus?.stateFilingStatusDescription || '-' }}</td>
              </tr>
              <tr>
                <th>Exemptions</th>
                <td>{{ stateWithholdingInfo?.exemptions ? stateWithholdingInfo?.exemptions : '-' }}</td>
              </tr>
              <tr>
                <th>Extra State Withholding Amount</th>
                <td>{{ stateWithholdingInfo?.amount ? formatCurrency(stateWithholdingInfo?.amount) : '-' }}</td>
              </tr>
              <tr>
                <th>Extra State Withholding Percent</th>
                <td>{{ stateWithholdingInfo?.percent ? stateWithholdingInfo?.percent + '%' : '-' }}</td>
              </tr>
              <tr>
                <th>Override</th>
                <td>{{ stateWithholdingInfo?.payrollTaxOverride?.payrollTaxOverrideDescription || '-' }}</td>
              </tr>
              <tr>
                <th>Add On</th>
                <td>{{ stateWithholdingInfo?.payrollTaxAddOn?.payrollTaxAddOnDescription || '-' }}</td>
              </tr>
              <tr>
                <th>Residence</th>
                <td>
                  {{
                    stateWithholdingInfo?.isResident !== null ? (stateWithholdingInfo?.isResident ? 'Yes' : 'No') : '-'
                  }}
                </td>
              </tr>
              <tr>
                <th>St-Loc Makeup</th>
                <td>
                  {{
                    stateWithholdingInfo?.isStateLocalMakeup !== null ?
                    (stateWithholdingInfo?.isStateLocalMakeup ? 'Yes' : 'No') :
                    '-'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </fs-card>

        <fs-card class="my-4" header="Other" header-tag="header" header-class="card__header">
          <table>
            <tbody>
              <tr>
                <th>Payroll Tax Group</th>
                <td>{{ employeeTaxInformation?.payrollLocalTaxGroup?.payrollLocalTaxGroupName || '-' }}</td>
              </tr>
              <tr>
                <th>Residence</th>
                <td>
                  {{
                    employeeTaxInformation?.isResidenceTax !== null ?
                    (employeeTaxInformation?.isResidenceTax ? 'Yes' : 'No') :
                    '-'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </fs-card>
      </fs-col>
    </fs-row>
  </fs-container>
</template>

<style scoped>
:deep(.card-header) {
  padding: 10px 12px;
  color: #03a9f4;
  background-color: #ffffff;
  font-weight: bold;

  &.with-pill {
    padding: 6px 12px;
  }
}

:deep(.card-body) {
  padding: 8px 12px;
}

th {
  padding: 5px 15px 5px 0;
  min-width: 200px;
}

.badge-pill {
  padding: 4px 10px;
  border-radius: 20px;
  color: #039BB1;
  background-color: rgba(3, 118, 242, 0.1);

  &.is2020OrLater {
    color: #0376F2;
    background-color: rgba(3, 155, 177, 0.1);
  }
}
</style>
