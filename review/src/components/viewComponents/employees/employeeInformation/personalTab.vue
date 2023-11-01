<script setup lang="ts">
import EmployeeDetails from '@/models/employees/EmployeeDetails';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye } from "@fortawesome/pro-light-svg-icons";
import { computed, ref, defineProps, inject } from 'vue';
import { FormatDate, FormatPhoneNumberUs, FormatDateWithMask } from "@/utilities/formatUtils";
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from 'pinia';

library.add(faEye);
interface Props {
  personalData: EmployeeDetails,
}
const props = withDefaults(defineProps<Props>(), {
  personalData: null,
});
const permissions = inject('$providePermissions');

const { fetchEmployeeSsn } = useEmployeeStore();
const { employeeSsn } = storeToRefs(useEmployeeStore());

async function onSsnToggle() {
  if (!hasSocialSN.value) {
    await fetchEmployeeSsn(props.personalData.id.toString());
  }
  showSocialSN.value = !showSocialSN.value
}

async function onBirthDateToggle() {
  showBirthdate.value = !showBirthdate.value
}

const hasSocialSN = computed(() => {
  return employeeSsn.value !== null;
});

const formattedAddress = computed(() => {
  return `${props.personalData.address?.city}, ${props.personalData.address?.state} ${props.personalData.address?.zip}`; 
})

const showSocialSN = ref<boolean>(false);
const showBirthdate = ref<boolean>(false);
const showDriversLicenseNumber = ref<boolean>(false);
</script>

<template>
  <fs-container fluid class="contain">
    <fs-row class="mt-4">
      <fs-col v-if="permissions['WHQ_251_3138']" lg="6">
        <div class="d-flex flex-column h-100">
          <fs-card class="dashboard-card mb-4" no-body>
            <fs-card-header class="dashboard-card__header">
              <h2 class="hq-pg__title text-cyan">General</h2>
            </fs-card-header>

            <fs-card-body class=" my-2">
              <fs-container fluid>
                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Full Name</strong>
                  </fs-col>
                  <fs-col>
                    {{ personalData.fullName }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Gender</strong>
                  </fs-col>
                  <fs-col>
                    {{ personalData.gender?.name }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Social Security Number</strong>
                  </fs-col>
                  <fs-col>
                    {{ showSocialSN ? employeeSsn : "XXX-XX-XXXX" }}
                    <fs-button pill variant="outline-green" class="px-2" style="height: 19px; width: 30px"
                      @click="onSsnToggle">
                      <font-awesome-icon :icon="['fal', 'eye']" size="sm" />
                    </fs-button>
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Birthdate</strong>
                  </fs-col>
                  <fs-col>
                    {{ showBirthdate ? FormatDate(personalData.dateOfBirth) : FormatDateWithMask(personalData.dateOfBirth) }}
                    <fs-button pill variant="outline-green" class="px-2" style="height: 19px; width: 30px"
                      @click="onBirthDateToggle">
                      <font-awesome-icon :icon="['fal', 'eye']" size="sm" />
                    </fs-button>
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Marital Status</strong>
                  </fs-col>
                  <fs-col>
                    {{ personalData.maritalStatus?.maritalStatusName }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Main Phone</strong>
                  </fs-col>
                  <fs-col>
                    {{ personalData.mainPhone?.phoneNumber ? FormatPhoneNumberUs(personalData.mainPhone?.phoneNumber) :
                      '' }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Email Address</strong>
                  </fs-col>
                  <fs-col>
                    {{ personalData.email }}
                  </fs-col>
                </fs-row>

                <fs-row class="py-1">
                  <fs-col cols="6">
                    <strong>Home Address</strong>
                  </fs-col>
                  <fs-col class="details__data">
                    <fs-row>{{ personalData.address?.address1 }}</fs-row>
                    <fs-row v-if="personalData.address?.address2">{{ personalData.address?.address2 }}</fs-row>
                    <fs-row>{{ formattedAddress }}</fs-row>
                  </fs-col>
                </fs-row>
              </fs-container>
            </fs-card-body>
          </fs-card>
        </div>
      </fs-col>

      <fs-col :lg="permissions['WHQ_251_3138'] ? 6 : 12">
        <fs-row>
          <fs-col v-if="permissions['WHQ_251_3139']" :lg="permissions['WHQ_251_3138'] ? 12 : 6">
            <fs-card class="mb-4" no-body>
              <fs-card-header class="dashboard-card__header">
                <h2 class="hq-pg__title text-cyan">EEO</h2>
              </fs-card-header>

              <fs-card-body class=" my-2">
                <fs-container fluid>
                  <fs-row class="py-1">
                    <fs-col cols="6">
                      <strong>Veteran</strong>
                    </fs-col>
                    <fs-col>
                      {{ personalData.isVeteran ? 'Yes' : 'No' }}
                    </fs-col>
                  </fs-row>

                  <fs-row class="py-1">
                    <fs-col cols="6">
                      <strong>Nonresident Alien</strong>
                    </fs-col>
                    <fs-col>
                      {{ personalData.isNonResidentAlien ? 'Yes' : 'No' }}
                    </fs-col>
                  </fs-row>

                  <fs-row class="py-1">
                    <fs-col cols="6">
                      <strong>Multiracial</strong>
                    </fs-col>
                    <fs-col>
                      {{ personalData.isMultiracial ? 'Yes' : 'No' }}
                    </fs-col>
                  </fs-row>

                  <fs-row class="py-1">
                    <fs-col cols="6">
                      <strong>Minority Code</strong>
                    </fs-col>
                    <fs-col>
                      {{ personalData.minorityCode?.minorityCodeName }}
                    </fs-col>
                  </fs-row>

                  <fs-row class="py-1">
                    <fs-col cols="6">
                      <strong>Non-Binary/Transgender</strong>
                    </fs-col>
                    <fs-col>
                      {{ personalData.isNonBinaryTransgender ? 'Yes' : 'No' }}
                    </fs-col>
                  </fs-row>

                </fs-container>
              </fs-card-body>

            </fs-card>
          </fs-col>

          <fs-col v-if="permissions['WHQ_251_3140']" :lg="permissions['WHQ_251_3138'] ? 12 : 6">
            <fs-card no-body>
              <fs-card-header class="dashboard-card__header">
                <h2 class="hq-pg__title text-cyan">Sensitive</h2>
              </fs-card-header>

              <fs-card-body class=" my-2">
                <fs-container fluid>
                  <fs-row class="py-1">
                    <fs-col cols="6">
                      <strong>Driver's License State</strong>
                    </fs-col>
                    <fs-col>
                      {{ personalData.driversLicenseState }}
                    </fs-col>
                  </fs-row>

                  <fs-row class="py-1">
                    <fs-col cols="6">
                      <strong>Driver's License Number</strong>
                    </fs-col>
                    <fs-col>
                      {{ showDriversLicenseNumber ? personalData.driversLicenseNumber : 'XXXXXXX' }}
                      <fs-button pill variant="outline-green" class="px-2" style="height: 19px; width: 30px"
                        @click="showDriversLicenseNumber = !showDriversLicenseNumber">
                        <font-awesome-icon :icon="['fal', 'eye']" size="sm" />
                      </fs-button>
                    </fs-col>
                  </fs-row>

                  <fs-row class="py-1">
                    <fs-col cols="6">
                      <strong>Driver's License Expiration</strong>
                    </fs-col>
                    <fs-col>
                      {{ personalData.driversLicenseExpirationDate ? FormatDate(personalData.driversLicenseExpirationDate)
                        : '' }}
                    </fs-col>
                  </fs-row>
                </fs-container>
              </fs-card-body>
            </fs-card>
          </fs-col>
        </fs-row>
      </fs-col>
    </fs-row>
  </fs-container>
</template>

<style lang="scss" scoped>
  .details__data .row {
    padding-left: 10px;
    padding-right: 10px;
  }
</style>