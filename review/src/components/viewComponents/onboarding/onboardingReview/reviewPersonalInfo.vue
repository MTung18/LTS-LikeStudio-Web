<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { FormatDate } from '@/utilities/formatUtils';
import { faEye, faEyeSlash } from '@fortawesome/pro-light-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { watch } from 'vue';
import { useLoadingStore } from "@/stores/loadingStore";

library.add(faEye, faEyeSlash)

const initialData = {
  fullName: null,
  ssn: null,
  gender: null,
  maritalStatus: null,
  dateOfBirth: null,
  email: null,
  phoneNumber: null,
  address: null,
  licenseNumber: null,
  licenseState: null,
  expirationDate: null,
}
const formData = ref(initialData);
const isShowDateOfBirth = ref(false);

const route = useRoute();
const employeeId = computed(() => route.params.id);
const { fetchEmployeeDetails } = useEmployeeStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const { setLoading } = useLoadingStore();

watch(isShowDateOfBirth, () => {
  if (!isShowDateOfBirth.value) {
    formData.value.dateOfBirth = FormatDate(employeeDetails.value.dateOfBirth).replace(/\/\d{4}$/, "/XXXX");
  } else {
    formData.value.dateOfBirth = FormatDate(employeeDetails.value.dateOfBirth);
  }
})

onMounted(async () => {
  setLoading(true);
  try {
    if (!employeeDetails.value) {
      await fetchEmployeeDetails(employeeId.value as string);
    }

    formData.value.fullName = `${employeeDetails.value.firstName} ${employeeDetails.value.middleName || ''} ${employeeDetails.value.lastName || ''} ${employeeDetails.value.suffix || ''}`
    formData.value.gender = employeeDetails.value.gender ? employeeDetails.value.gender : '-';
    formData.value.maritalStatus = employeeDetails.value.maritalStatus ? employeeDetails.value.maritalStatus : '-';
    formData.value.dateOfBirth = employeeDetails.value.dateOfBirth ? FormatDate(employeeDetails.value.dateOfBirth).replace(/\/\d{4}$/, "/XXXX") : '-';
    formData.value.email = employeeDetails.value.email ? employeeDetails.value.email : '-';
    formData.value.phoneNumber = employeeDetails.value.mainPhone ? employeeDetails.value.mainPhone : '-';
    formData.value.address = employeeDetails.value.address ? employeeDetails.value.address : '-';
    formData.value.licenseNumber = employeeDetails.value.driversLicenseNumber ? employeeDetails.value.driversLicenseNumber : '-';
    formData.value.licenseState = employeeDetails.value.driversLicenseState ? employeeDetails.value.driversLicenseState : '-';
    formData.value.expirationDate = employeeDetails.value.driversLicenseExpirationDate;
    formData.value.ssn = employeeDetails.value.ssn ? employeeDetails.value.ssn : '-';
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
})
</script>


<template>
  <fs-container fluid class="px-3 py-2">
    <section class="mb-4">
      <div class="section_title">General</div>
      <hr />
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          Full Name
        </fs-col>
        <fs-col cols="10">
          {{ formData?.fullName }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          SSN
        </fs-col>
        <fs-col cols="10">
          {{ formData?.ssn }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          Gender
        </fs-col>
        <fs-col cols="10">
          {{ formData?.gender?.name }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          Marital Status
        </fs-col>
        <fs-col cols="10">
          {{ formData?.maritalStatus?.maritalStatusName }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          Date of Birth
        </fs-col>
        <fs-col cols="10" class="d-flex gap-2 align-items-center">
          {{ formData?.dateOfBirth }}
          <fs-button v-if="isShowDateOfBirth" class="eye-button">
            <font-awesome-icon :icon="['fal', 'eye']" class="text-primary eye-icon"
              @click="isShowDateOfBirth = !isShowDateOfBirth" />
          </fs-button>
          <fs-button v-else class="eye-button">
            <font-awesome-icon :icon="['fal', 'eye-slash']" class="text-primary eye-icon"
              @click="isShowDateOfBirth = !isShowDateOfBirth" />
          </fs-button>
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          Email
        </fs-col>
        <fs-col cols="10">
          {{ formData?.email }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          Phone number
        </fs-col>
        <fs-col cols="10">
          {{ formData?.phoneNumber?.phoneNumber }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          Address
        </fs-col>
        <fs-col cols="10">
          <div>{{ formData?.address?.address1 }}</div>
          <div>{{ formData?.address?.address2 }}</div>
          <div>{{ formData?.address?.city }}, {{ formData?.address?.state }} {{ formData?.address?.zip }}</div>
        </fs-col>
      </fs-row>
    </section>
    <section>
      <div class="section_title">Driver's license</div>
      <hr />
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          License Number
        </fs-col>
        <fs-col cols="10">
          {{ formData?.licenseNumber }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          License State
        </fs-col>
        <fs-col cols="10">
          {{ formData?.licenseState }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="2" class="section_key">
          Expiration Date
        </fs-col>
        <fs-col cols="10">
          {{ FormatDate(formData?.expirationDate) }}
        </fs-col>
      </fs-row>
    </section>
  </fs-container>
</template>

<style lang="scss" scoped>
$task-cyan: #03A9F4;


.section_title {
  font-weight: bold;
  font-size: 16px;
  color: $task-cyan;
}

.section_key {
  font-weight: bold;
}

.eye-icon {
  cursor: pointer;
}

.eye-button {
  all: unset;

  &:active {
    background: none;
  }
}
</style>
