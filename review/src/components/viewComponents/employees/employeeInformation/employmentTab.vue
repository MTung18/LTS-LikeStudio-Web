<script setup lang="ts">
import UpdateEmployeeStatusModal from '@/components/viewComponents/employees/employeeInformation/updateEmployeeStatusModal.vue';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import EmployeeStatus from '@/models/employees/EmployeeStatus';
import { Employment } from '@/models/employees/Employment';
import { useEmployeeStore } from '@/stores/employeeStore';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserTie } from "@fortawesome/pro-light-svg-icons";
import { storeToRefs } from 'pinia';
import { computed, ref, onBeforeMount, defineProps, inject, Ref } from 'vue';
import { useRoute } from 'vue-router';
import loadingWave from '@/assets/images/Loading_Wave.svg';
import { convertEnumKeyToDisplay } from '@/helper/hqSuite/formatHelper';
library.add(faUserTie);

interface Props {
  employmentInfor: Employment;
  hasPendingFoundationApproval: boolean;
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { employmentInfor, hasPendingFoundationApproval } = defineProps<Props>();

const route = useRoute();
const employeeId = computed<number>(() => +route.params?.id);
const employeeStore = useEmployeeStore();
const { fetchEmployeeStatus, updateEmployeeStatus } = employeeStore;
const { employeeStatus } = storeToRefs(employeeStore);
const employeeStatusDisplay = computed<string>(() => convertEnumKeyToDisplay(EmployeeStatusEnum[employeeStatus.value?.employeeStatusId]));
const showUpdateEmployeeStatusModal = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const permissions = inject<Ref<Record<string, boolean>>>('$providePermissions');
const isShowLeftColumn = computed<boolean>(() => permissions?.value['WHQ_251_3142'] || permissions?.value['WHQ_251_3145']);

function openUpdateEmployeeStatusModal() {
  showUpdateEmployeeStatusModal.value = true;
}

function closeUpdateEmployeeStatusModal() {
  showUpdateEmployeeStatusModal.value = false;
}

async function handleUpdateEmployeeStatus(data: EmployeeStatus) {
  isLoading.value = true;
  showUpdateEmployeeStatusModal.value = false;
  await updateEmployeeStatus(data);
  isLoading.value = false;
}

onBeforeMount(async () => {
  isLoading.value = true;
  await fetchEmployeeStatus(employeeId.value);
  isLoading.value = false;
})
</script>

<template>
  <fs-container fluid class="contain">
    <fs-overlay :show="isLoading" class="fsi-pg__overlay" no-wrap>
      <template #overlay>
        <div class="text-center">
          <img :src="loadingWave" />
        </div>
      </template>
    </fs-overlay>

    <fs-row class="mt-4">
      <fs-col v-if="isShowLeftColumn" lg="6">
        <div class="d-flex flex-column h-100">
          <div v-if="permissions['WHQ_251_3142']" class="mb-4">
            <fs-card class="dashboard-card" header="General" header-class="dashboard-card__header"
              body-class="dashboard-card__body">
              <fs-container fluid>
                <fs-row class="py-1">
                  <fs-col cols="6">
                    <p style="margin: 0;">Section 1</p>
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Employee Number</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.employeeNumber">
                    {{ employmentInfor.employeeNumber }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Employment Status</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.employmentStatus">
                    {{ employmentInfor.employmentStatus }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Job Title</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.jobTitle">
                    {{ employmentInfor.jobTitle }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Department</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.department">
                    {{ employmentInfor.department }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>I-9 Verified</strong>
                  </fs-col>
                  <fs-col>
                    {{ employmentInfor.i9Verified ? "Y" : "N" }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <p style="margin: 15px 0 0 0;">Section 2</p>
                  </fs-col>
                </fs-row>
                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>State of Hire</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.stateOfHire">
                    {{ employmentInfor.stateOfHire }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Work Location</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.workLocations">
                    {{ employmentInfor.workLocations.join(', ') }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Union</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.union">
                    {{ employmentInfor.union }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Trade</strong>
                  </fs-col>
                  <fs-col>
                    {{ employmentInfor.trade }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>ACA Exempt</strong>
                  </fs-col>
                  <fs-col>
                    {{ employmentInfor.acaExempt ? "Y" : "N" }}
                  </fs-col>
                </fs-row>
              </fs-container>
            </fs-card>
          </div>

          <div v-if="permissions['WHQ_251_3145']" class="mb-4">
            <fs-card class="dashboard-card " header="Other" header-class="dashboard-card__header"
              body-class="dashboard-card__body">

              <fs-container fluid>
                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Worker's Comp State</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.workerCompState">
                    {{ employmentInfor.workerCompState }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Worker's Comp Class Number</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.workerCompClassNumber">
                    {{ employmentInfor.workerCompClassNumber }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Cost Code Number</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.costCodeNumber">
                    {{ employmentInfor.costCodeNumber }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>General Liability State</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.generalLiabilityState">
                    {{ employmentInfor.generalLiabilityState }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>General Liability Class Number</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.generalLiabilityClassNumber">
                    {{ employmentInfor.generalLiabilityClassNumber }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Corporate Officer</strong>
                  </fs-col>
                  <fs-col>
                    {{ employmentInfor.corporateOfficer ? "Y" : "N" }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Owner Operator</strong>
                  </fs-col>
                  <fs-col>
                    {{ employmentInfor.ownerOperator ? "Y" : "N" }}
                  </fs-col>
                </fs-row>
              </fs-container>
            </fs-card>
          </div>
        </div>
      </fs-col>

      <fs-col :lg="isShowLeftColumn ? 6 : 12">
        <fs-row>
          <fs-col v-if="permissions['WHQ_251_3144']" :lg="isShowLeftColumn ? 12 : 6" class="mb-4">
            <fs-card class="dashboard-card" no-body>
              <fs-card-header class="dashboard-card__header d-flex justify-content-between">
                <strong>Status</strong>
                <fs-link tag="a"
                  :class="`update-employee-status-link fs-6 ${hasPendingFoundationApproval ? 'disabled' : ''}`"
                  @click="openUpdateEmployeeStatusModal">
                  Update Employee Status
                </fs-link>
              </fs-card-header>
              <fs-card-body class="dashboard-card__body" style="margin-left: 10px;">
                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Employee Status</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatusDisplay || '-' }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1" v-if="employeeStatus?.employeeStatusReason?.employeeStatusReasonName">
                  <fs-col cols="6">
                    <strong>Status Reason</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatus?.employeeStatusReason?.employeeStatusReasonName }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Date Hired</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatus.dateHired || '-' }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Start Date</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatus.startDate || '-' }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Date Last Worked</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatus.dateLastWorked || '-' }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1" v-if="employeeStatus.terminationDate">
                  <fs-col cols="6">
                    <strong>Date Terminated</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatus.terminationDate }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1" v-if="employeeStatus.dateRehired">
                  <fs-col cols="6">
                    <strong>Date Rehired</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatus.dateRehired }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1" v-if="employeeStatus.securedAccess !== null">
                  <fs-col cols="6">
                    <strong>Secured Access</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatus.securedAccess ? 'Y' : 'N' }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1" v-if="employeeStatus.deceased !== null && employeeStatus.deceased">
                  <fs-col cols="6">
                    <strong>Deceased</strong>
                  </fs-col>
                  <fs-col>
                    {{ employeeStatus.deceased ? 'Y' : 'N' }}
                  </fs-col>
                </fs-row>
              </fs-card-body>
            </fs-card>
          </fs-col>

          <fs-col v-if="permissions['WHQ_251_3145']" :lg="isShowLeftColumn ? 12 : 6" class="mb-4">
            <fs-card class="dashboard-card mb-4 mb-lg-0" header="Supervisors" header-class="dashboard-card__header"
              body-class="dashboard-card__body">
              <fs-container fluid>
                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Reporting Supervisor</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.reportingSupervisor">
                    <font-awesome-icon :icon="['fal', 'fa-user-tie']" class="icon-supervisor" />
                    {{ employmentInfor.reportingSupervisor }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <template v-if="employmentInfor.additionalSupervisors?.length > 0">
                  <fs-row class="py-1" v-for="additionalSupervisor in employmentInfor.additionalSupervisors"
                    :key="additionalSupervisor">
                    <fs-col cols="6">
                      <strong>Additional Supervisor</strong>
                    </fs-col>
                    <fs-col>
                      <font-awesome-icon :icon="['fal', 'fa-user-tie']" class="icon-supervisor" />
                      {{ additionalSupervisor }}
                    </fs-col>
                  </fs-row>
                </template>
                <template v-else>
                  <fs-row class="py-1">
                    <fs-col cols="4">
                      <strong>Additional Supervisor</strong>
                    </fs-col>
                    <fs-col>
                      -
                    </fs-col>
                  </fs-row>
                </template>
              </fs-container>
            </fs-card>
          </fs-col>

          <fs-col v-if="permissions['WHQ_251_3143']" :lg="isShowLeftColumn ? 12 : 6" class="mb-4">
            <fs-card class="dashboard-card mb-4 mb-lg-0" header="OSHA" header-class="dashboard-card__header"
              body-class="dashboard-card__body">
              <fs-container fluid>
                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>OSHA Level</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.oshaLevel">
                    {{ employmentInfor.oshaLevel }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>OSHA Certification Number</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.oshaCertificateNumber">
                    {{ employmentInfor.oshaCertificateNumber }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>OSHA Trade License</strong>
                  </fs-col>
                  <fs-col v-if="employmentInfor.oshaTradeLicense">
                    {{ employmentInfor.oshaTradeLicense }}
                  </fs-col>
                  <fs-col v-else>
                    -
                  </fs-col>
                </fs-row>
              </fs-container>
            </fs-card>
          </fs-col>
        </fs-row>
      </fs-col>
    </fs-row>
  </fs-container>
  <update-employee-status-modal :visible="showUpdateEmployeeStatusModal" :employee-status="employeeStatus"
    @cancel="closeUpdateEmployeeStatusModal" @update="handleUpdateEmployeeStatus" />
</template>
<style scoped>
:deep(.card-header) {
  color: #03a9f4;
  font-weight: bold;
  font-size: larger;
}

.update-employee-status-link {
  text-decoration: none;
  font-weight: normal;
  cursor: pointer;
}

.icon-supervisor {
  color: #1ABC9C;
  font-size: 20px;
  padding-right: 4px;
}
</style>