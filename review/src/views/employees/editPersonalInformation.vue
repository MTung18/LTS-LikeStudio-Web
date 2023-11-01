<script setup lang="ts">
import { inject, onBeforeMount, Ref, ref, watch } from 'vue';
import loadingWave from '@/assets/images/Loading_Wave.svg';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useHonorificStore } from '@/stores/honorificStore';
import { storeToRefs } from 'pinia';
import { RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import { useOnboardingEmployeeInformationStore } from '@/stores/onboardingEmployeeInformationStore';
import { FormValidationResult } from 'vee-validate';
import { focusOnFirstError } from '@/functions/ValidationUtilityFunctions';
import { useAlerts } from '@/composables/useAlerts';
import _ from 'lodash';
import ScrollToTop from '@/components/shared/scrollToTop.vue';
import EmployeeDetails from '@/models/employees/EmployeeDetails';
import { EmployeePersonalInfoFormData } from '@/models/employees/EmployeePersonalInfoInput';
import { EmployeeInformationTab } from '@/enums/EmployeeInformationTab';

const {
  fetchEmployeeDetails,
  fetchContactMasterData,
  fetchEmployeeSsn,
  updateEmployeeDetails,
  fetchEmployeeMinorityCodelist,
} = useEmployeeStore();
const { employeeDetails, contactMasterData, employeeSsn, minorityCodeList } =
  storeToRefs(useEmployeeStore());

const { fetchHonorificDropdownData } = useHonorificStore();
const { honorificDropdownData } = storeToRefs(useHonorificStore());

const { fetchMaritalStatusList } = useOnboardingEmployeeInformationStore();
const { maritalStatusListOfEmployeeInformation } = storeToRefs(
  useOnboardingEmployeeInformationStore()
);

const { notifySuccess, notifyError } = useAlerts();

const permissions = inject<Ref<Record<string, boolean>>>('$providePermissions');

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const formHasValidated = ref(false);
const observer = ref();

let initialData: EmployeePersonalInfoFormData;
const updatedData = ref<EmployeePersonalInfoFormData>();

const formDataChanged = ref(false);

const checkForChanges = _.debounce(() => {
  formDataChanged.value =
    JSON.stringify(initialData) !== JSON.stringify(updatedData.value);
}, 500);

watch(() => updatedData.value, checkForChanges, {
  deep: true,
});

const showCancelModal = ref(false);
const skipRouteGuard = ref(false);
const nextRoute: Ref<RouteLocationNormalized> = ref();

const proceedCancel = () => {
  skipRouteGuard.value = true;
  router.push(nextRoute.value);
};

const onCancel = () => {
  goBack();
};

function goBack() {
  router.push({
    name: 'employeeInformation',
    params: {
      id: route.params?.id?.toString(),
      tab: EmployeeInformationTab.Personal,
    },
  });
}

router.beforeEach((to, from, next) => {
  if (formDataChanged.value === true && skipRouteGuard.value === false) {
    nextRoute.value = to;
    showCancelModal.value = true;
    next(false);
  } else next();
});

onBeforeMount(async () => {
  isLoading.value = true;

  await Promise.allSettled([
    //0
    fetchHonorificDropdownData(),
    //1
    fetchContactMasterData(),
    //2
    fetchMaritalStatusList(),
    //3
    fetchEmployeeMinorityCodelist(),
    //4
    fetchEmployeeSsn(Number(route.params.id)),
    //5
    fetchEmployeeDetails(Number(route.params.id)),
  ])
    .then((promiseResult) => {
      updatedData.value = new EmployeePersonalInfoFormData(
        new EmployeeDetails(employeeDetails.value)
      );

      if (
        employeeDetails.value.honorificId !== 0 &&
        promiseResult[0].status === 'fulfilled'
      ) {
        updatedData.value.honorific = honorificDropdownData.value.find(
          (x) => x.honorificId === employeeDetails.value.honorificId
        );
      }

      if (
        employeeDetails.value.genderId !== 0 &&
        promiseResult[1].status === 'fulfilled'
      ) {
        updatedData.value.gender = contactMasterData.value.genders.find(
          (x) => x.id === employeeDetails.value.genderId
        );
      }

      if (employeeSsn.value !== '' && promiseResult[3].status === 'fulfilled') {
        updatedData.value.ssn = employeeSsn.value;
      }

      initialData = new EmployeePersonalInfoFormData(
        JSON.parse(JSON.stringify(updatedData.value))
      );
    })
    .catch(() => {
      notifyError('Employee personal information could not be loaded.');
    })
    .finally(() => {
      isLoading.value = false;
    });
});

async function onSave() {
  const validationResult: FormValidationResult<any> =
    await observer.value.validate();

  if (validationResult.valid) {
    isLoading.value = true;

    try {
      await updateEmployeeDetails(
        updatedData.value.toEmployeePersonalInfoInput(permissions.value)
      );

      notifySuccess('Employee personal information was updated.');
      skipRouteGuard.value = true;
      goBack();
    } catch (error) {
      console.error(error);
      notifyError('Employee personal information could not be updated.');
    } finally {
      isLoading.value = false;
    }
  } else {
    focusOnFirstError('observer');

    let error = Object.values(validationResult.errors)[0];
    let errorMessage = error.includes('Field is required')
      ? 'Please fill the required fields'
      : error;

    notifyError(errorMessage);
  }
}

function formatSSN() {
  if (!updatedData.value.ssn || updatedData.value.ssn === '') return false;

  var v = updatedData.value.ssn;

  var r = v.replace(/\D/g, '');

  r = r.substring(0, 9);

  if (r.length > 5) {
    r = r.replace(/^(\d\d\d)(\d{2})(\d{0,4}).*/, '$1-$2-$3');
  } else if (r.length > 3) {
    r = r.replace(/^(\d\d\d)(\d{0,3})/, '$1-$2');
  } else {
    r = r.replace(/^(\d*)/, '$1');
  }

  updatedData.value.ssn = r;
}

function formatZipCode() {
  if (!updatedData.value.address.zip || updatedData.value.address.zip === '')
    return false;

  var v = updatedData.value.address.zip;

  var r = v.replace(/[A-Za-z-]/g, '');

  if (r.length > 5) {
    r = r.replace(/^(\d{5})(\d{0,4})$/, '$1-$2');
  }

  updatedData.value.address.zip = r;
}
</script>

<template>
  <fs-overlay :show="isLoading" class="fsi-pg__overlay" no-wrap>
    <template #overlay>
      <div class="text-center">
        <img :src="loadingWave" />
      </div>
    </template>
  </fs-overlay>
  <div ref="topDiv" class="hq-pg form-edit">
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
      <fs-row align-v="center">
        <fs-col>
          <h2 class="hq-pg__title">Edit Personal Information</h2>
        </fs-col>
        <fs-col cols="auto">
          <fs-button variant="outline-secondary" @click="onCancel"
            >Cancel</fs-button
          >
          <fs-button
            variant="primary"
            :disabled="!formDataChanged"
            @click="onSave"
            >Save</fs-button
          >
        </fs-col>
      </fs-row>
    </fs-container>
    <fs-container fluid class="contain hq-pg__container" v-if="!isLoading">
      <VeeForm ref="observer" id="observer" v-slot="{ meta }">
        <fs-row>
          <fs-col lg="8">
            <section class="mb-3" v-if="permissions['WHQ_251_3138']">
              <h3 class="hq-pg__section-head">General</h3>

              <fs-row>
                <fs-col md="3" lg="2">
                  <fs-input
                    type="fsMultiselectList"
                    label="Prefix"
                    id="hrRepresentativeId"
                    v-model="updatedData.honorific"
                    :typeaheaddata="honorificDropdownData"
                    typeaheadkey="honorificName"
                    typeaheadvalueattribute="honorificId"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    name="prefix"
                  >
                  </fs-input>
                </fs-col>
                <fs-col lg="3" md="6">
                  <fs-input
                    type="fsTextInput"
                    :required="true"
                    v-model="updatedData.firstName"
                    label="First Name"
                    :rules="{ required: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="20"
                    name="firstName"
                  >
                  </fs-input>
                </fs-col>
                <fs-col md="3" lg="2">
                  <fs-input
                    type="fsTextInput"
                    v-model="updatedData.middleName"
                    label="Middle Name"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="20"
                    name="middleName"
                  >
                  </fs-input>
                </fs-col>
                <fs-col md="9" lg="3">
                  <fs-input
                    type="fsTextInput"
                    :required="true"
                    v-model="updatedData.lastName"
                    label="Last Name"
                    :rules="{ required: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="20"
                    name="lastName"
                  >
                  </fs-input>
                </fs-col>
                <fs-col md="3" lg="2">
                  <fs-input
                    type="fsTextInput"
                    v-model="updatedData.suffix"
                    label="Suffix"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="4"
                    name="suffix"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col>
                  <fs-input
                    type="fsMultiselectList"
                    label="Gender"
                    id="gender"
                    v-model="updatedData.gender"
                    :typeaheaddata="contactMasterData.genders"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    :required="true"
                    :rules="{ required: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    name="Gender"
                  >
                  </fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsMultiselectList"
                    label="Marital Status"
                    id="maritalStatusId"
                    v-model="updatedData.maritalStatus"
                    :typeaheaddata="maritalStatusListOfEmployeeInformation"
                    typeaheadkey="maritalStatusName"
                    typeaheadvalueattribute="maritalStatusId"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    name="Marital Status"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col>
                  <fs-input
                    type="fsDateInput"
                    label="Date of Birth"
                    id="dateOfBirth"
                    :required="true"
                    :rules="{ required: true }"
                    v-model="updatedData.dateOfBirth"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    name="dateOfBirth"
                  >
                  </fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    id="ssn"
                    type="fsTextInput"
                    v-model="updatedData.ssn"
                    label="SSN"
                    :required="true"
                    :rules="{
                      required: true,
                      ssnWithMask: true
                    }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :validate-on-input="false"
                    :validate-on-change="true"
                    name="ssn"
                    sensitiveContent
                    sensitiveMask="XXX-XX-XXXX"
                    @input="formatSSN"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    :required="true"
                    v-model="updatedData.phoneNumber"
                    label="Phone Number"
                    data-vv-name="phoneNumber"
                    :rules="{
                      required: true,
                      phoneNumber: true
                    }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :validate-on-input="false"
                    :validate-on-change="true"
                    name="phoneNumber"
                    mask-format="(###) ###-####"
                  >
                  </fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    :required="true"
                    v-model="updatedData.email"
                    label="Email"
                    :rules="{ 
                      required: true, 
                      email: true
                    }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="100"
                    :validate-on-input="false"
                    :validate-on-change="true"
                    name="email"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    :required="true"
                    v-model="updatedData.address.address1"
                    label="Address"
                    :rules="{ required: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="30"
                    name="address"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    v-model="updatedData.address.address2"
                    label="Address 2"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="30"
                    name="address2"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col md="6">
                  <fs-input
                    type="fsTextInput"
                    :required="true"
                    v-model="updatedData.address.city"
                    label="City"
                    :rules="{ required: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="30"
                    name="city"
                  >
                  </fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    :required="true"
                    v-model="updatedData.address.state"
                    label="State"
                    :rules="{ required: true, usState: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="2"
                    name="state"
                  >
                  </fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    :required="true"
                    v-model="updatedData.address.zip"
                    label="Zip Code"
                    :rules="{ 
                      required: true, 
                      zipCode: {
                        country: 'US'
                      }
                    }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :validate-on-input="false"
                    :validate-on-change="true"
                    :maxlength="10"
                    @input="formatZipCode"
                    name="zipCode"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
            </section>

            <section class="mb-3" v-if="permissions['WHQ_251_3139']">
              <h3 class="hq-pg__section-head">EEO</h3>

              <fs-row>
                <fs-col md="3">
                  <fs-form-checkbox v-model="updatedData.isVeteran">
                    Veteran
                  </fs-form-checkbox>
                  <fs-form-checkbox v-model="updatedData.isMultiracial">
                    Multiracial
                  </fs-form-checkbox>
                </fs-col>
                <fs-col md="3">
                  <fs-form-checkbox v-model="updatedData.isNonResidentAlien">
                    Nonresident Alien
                  </fs-form-checkbox>
                  <fs-form-checkbox
                    v-model="updatedData.isNonBinaryTransgender"
                  >
                    Non-Binary/Transgender
                  </fs-form-checkbox>
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col lg="6">
                  <fs-input
                    type="fsMultiselectList"
                    label="Minority Code"
                    id="minorityCode"
                    v-model="updatedData.minorityCode"
                    :typeaheaddata="minorityCodeList"
                    typeaheadkey="minorityCodeName"
                    typeaheadvalueattribute="id"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    name="Minority Code"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
            </section>

            <section class="mb-3" v-if="permissions['WHQ_251_3140']">
              <h3 class="hq-pg__section-head">Driver's License</h3>

              <fs-row>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    v-model="updatedData.driversLicenseState"
                    label="Driver's License State"
                    :rules="{ required: false, usState: true }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="2"
                    name="driverLicenseState"
                  >
                  </fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    v-model="updatedData.driversLicenseNumber"
                    label="Driver's License Number"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :maxlength="20"
                    name="driverLicenseNumber"
                  >
                  </fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsDateInput"
                    label="Driver's License Expiration"
                    id="startDate"
                    :rules="{ required: false }"
                    v-model="updatedData.driversLicenseExpirationDate"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    name="driverLicenseExpiration"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
            </section>
          </fs-col>
        </fs-row>
      </VeeForm>
      <ScrollToTop></ScrollToTop>
    </fs-container>

    <fs-modal
      v-model="showCancelModal"
      centered
      content-class="phq-modal"
      header-class="phq-modal__header"
      title-class="phq-modal__title"
      body-class="phq-modal__body"
      footer-class="phq-modal__footer"
      header-text-variant="light"
      header-bg-variant="blue--dk"
      :lazy="true"
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
      @ok="proceedCancel"
      @cancel="showCancelModal = false"
      title="Cancel Confirmation"
    >
      Would you like to Save or Discard your changes?

      <template v-slot:modal-footer="slotProps">
        <fs-button
          variant="outline-secondary"
          class="me-auto"
          @click="slotProps.cancel"
          >Cancel</fs-button
        >
        <fs-button variant="secondary" @click="slotProps.ok">Discard</fs-button>
        <fs-button
          variant="primary"
          @click="
            showCancelModal = false;
            onSave();
          "
          >Save</fs-button
        >
      </template>
    </fs-modal>
  </div>
</template>
<style scoped lang="scss">
.form-edit {
  padding-bottom: 20px;
}
</style>
