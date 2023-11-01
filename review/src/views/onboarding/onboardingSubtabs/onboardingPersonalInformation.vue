<script lang="ts" setup>
import { useOnboardingEmployeeInformationStore } from "@/stores/onboardingEmployeeInformationStore";
import { useEmployeeContactStore as useOnboardingEmployeeContactStore } from "@/stores/onboardingEmployeeContactStore";
import { storeToRefs } from "pinia";
import { Ref, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useAlerts } from "@/composables/useAlerts";
import { STATES } from "@/constants/common";
import { OnboardingEmployeeGender } from "@/models/onboarding/OnboardingEmployeeGender";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye,
  faEyeSlash,
  faFloppyDisk,
} from "@fortawesome/pro-light-svg-icons";
import {
  faAsterisk,
  faExclamationCircle,
  faCircleExclamation
} from "@fortawesome/pro-solid-svg-icons";
import moment from "moment";
import FsInput from '@/components/global/fsInput/fsInput.vue';
import { PersonalInformation, UpdatePersonalInfoRequestModel } from "@/models/onboarding/PersonalInformation";
import { isEqual } from "lodash";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import Honorific from "@/models/employees/Honorific";
import { useHonorificStore } from "@/stores/honorificStore";
import { useBreakpoints } from "@/composables/useBreakpoints";

const SAVE_TYPE = {
  SAVE: "Save",
  SAVENEXT: "Save and Next"
}
library.add(faAsterisk, faEye, faEyeSlash, faExclamationCircle, faFloppyDisk, faCircleExclamation);

const router = useRouter();
const isFinishLoading = ref(false);
const isDisabledSubmit = ref(true);
const { responsive } = useBreakpoints();

const employeeId = router.currentRoute.value.params.id;

const { personalInformation, isSubmittedOnboardFormStatus, maritalStatusListOfEmployeeInformation, personalSSN } = storeToRefs(useOnboardingEmployeeInformationStore());
const { fetchEmployeeInformationById, fetchPersonalInfoFormStatus, fetchPersonalInfoSsn, updateEmployeeInformationById, fetchMaritalStatusList } = useOnboardingEmployeeInformationStore();
const { fetchGenderList } = useOnboardingEmployeeContactStore();
const { genderListOfEmployeeContact } = storeToRefs(useOnboardingEmployeeContactStore());
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems } =
  useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());

const { fetchHonorificDropdownData } = useHonorificStore();
const { honorificDropdownData } = storeToRefs(useHonorificStore())

const { notifyError, notifySuccess } = useAlerts();
const { setLoading } = useLoadingStore();
const prefixList = ref<Honorific[]>([]);
const genderList = ref<OnboardingEmployeeGender[]>([]);
const maritalStatusList = ref([]);

const form = ref(null);
const dataPersonal: Ref<PersonalInformation> = ref({} as PersonalInformation);
const deepCloneData: Ref<PersonalInformation> = ref({} as PersonalInformation);
const currentNavItem = ref(null);

const openSaveChangeModal = ref(false);
const toPath = ref("");
const isLeaveRoute = ref(false);
const checkIconSsn = ref(false);
const checkIconLicense = ref(false);

const employeeStatus: Ref<number> = ref(null);
const isDisableByStatus: Ref<boolean> = ref(true);

const handleDisableInputByStatus = (): boolean => {
  if (isFinishLoading.value) {
    let status = true;
    if (employeeStatus.value === EmployeeStatusEnum.Onboard) {
      status = isSubmittedOnboardFormStatus.value ? false : true;
    } else if (employeeStatus.value === EmployeeStatusEnum.QuickHire) {
      status = false;
    }
    return status;
  }
}

watch(() => dataPersonal.value, () => {
  if (isFinishLoading.value) {
    if (isEqual(dataPersonal.value, deepCloneData.value)) {
      isDisabledSubmit.value = true;
    } else {
      isDisabledSubmit.value = false;
    }
  }
}, {
  deep: true
})

const mapDataToSelectState = () => {
  if (personalInformation.value.honorificId == 0) personalInformation.value.prefixSelectState = null;
  else personalInformation.value.prefixSelectState = prefixList.value.filter(data => data.honorificId === personalInformation.value.honorificId)[0];

  if (personalInformation.value.genderId == null) personalInformation.value.genderSelectState = null;
  else personalInformation.value.genderSelectState = genderList.value.filter(data => data.id === personalInformation.value.genderId)[0];

  if (personalInformation.value.maritalStatus == null) personalInformation.value.maritalSelectState = null;
  else personalInformation.value.maritalSelectState = maritalStatusList.value.filter(data => data.maritalStatusId === personalInformation.value.maritalStatus.maritalStatusId)[0];

  if (personalInformation.value.address.state == null) personalInformation.value.stateSelectState = null;
  else personalInformation.value.stateSelectState = STATES.filter(data => data.value === personalInformation.value.address.state)[0];

  if (personalInformation.value.driversLicenseState == null && personalInformation.value.driversLicenseState == '') personalInformation.value.driversLicenseSelectState = null;
  else personalInformation.value.driversLicenseSelectState = STATES.filter(data => data.value === personalInformation.value.driversLicenseState)[0];

  personalInformation.value.phoneNumber = personalInformation.value.mainPhone?.phoneNumber?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  personalInformation.value.address1 = personalInformation.value.address?.address1;
  personalInformation.value.address2 = personalInformation.value.address?.address2;
  personalInformation.value.city = personalInformation.value.address?.city;
  personalInformation.value.state = personalInformation.value.address?.state;
  personalInformation.value.zip = personalInformation.value.address?.zip;
  personalInformation.value.dateOfBirth = personalInformation.value.dateOfBirth ? moment(personalInformation.value.dateOfBirth).format("YYYY-MM-DD") : null;
  personalInformation.value.driversLicenseExpirationDate = personalInformation.value.driversLicenseExpirationDate ? moment(personalInformation.value.driversLicenseExpirationDate).format("YYYY-MM-DD") : null;
  personalInformation.value.ssn = personalSSN.value;

  dataPersonal.value = { ...personalInformation.value };
  deepCloneData.value = { ...personalInformation.value };
}

const mapData = () => {
  const objRequest: UpdatePersonalInfoRequestModel = {
    employeeId: Number(employeeId),
    general: {
      honorificId: dataPersonal.value.prefixSelectState ? dataPersonal.value.prefixSelectState.honorificId : 0,
      firstName: dataPersonal.value.firstName,
      middleName: dataPersonal.value.middleName,
      lastName: dataPersonal.value.lastName,
      suffix: dataPersonal.value.suffix,
      email: dataPersonal.value.email,
      phoneNumber: dataPersonal.value.phoneNumber.replace(/[^\d]/g, ''),
      address: {
        id: dataPersonal.value.address.id,
        address1: dataPersonal.value.address1,
        address2: dataPersonal.value.address2,
        city: dataPersonal.value.city,
        state: dataPersonal.value.stateSelectState ? dataPersonal.value.stateSelectState.value : null,
        zip: dataPersonal.value.zip,
        country: dataPersonal.value.address.country,
        addressType: dataPersonal.value.address.personAddressType,
        addressTypeId: 1, //main
      },
      genderId: dataPersonal.value.genderSelectState ? dataPersonal.value.genderSelectState.id : null,
      maritalStatusId: dataPersonal.value.maritalSelectState ? dataPersonal.value.maritalSelectState.maritalStatusId : null,
      dateOfBirth: dataPersonal.value.dateOfBirth ? dataPersonal.value.dateOfBirth : null,
      ssn: dataPersonal.value.ssn,
    },
    eeo: {
      isVeteran: dataPersonal.value.isVeteran,
      isNonResidentAlien: dataPersonal.value.isNonResidentAlien,
      isMultiracial: dataPersonal.value.isMultiracial,
      isNonBinaryTransgender: dataPersonal.value.isNonBinaryTransgender,
      minorityCodeId: dataPersonal.value.minorityCodeId,
    },
    sensitive: {
      driversLicenseState: dataPersonal.value.driversLicenseSelectState ? dataPersonal.value.driversLicenseSelectState.value : '',
      driversLicenseNumber: dataPersonal.value.driversLicenseNumber,
      driversLicenseExpirationDate: dataPersonal.value.driversLicenseExpirationDate ? dataPersonal.value.driversLicenseExpirationDate : null,
    }
  };
  return objRequest;
};

const getEmployeeInformation = async () => {
  await Promise.all([fetchEmployeeInformationById(Number(employeeId)), fetchPersonalInfoSsn(Number(employeeId)), fetchPersonalInfoFormStatus(Number(employeeId))]);
  isDisabledSubmit.value = true;
}

const getListDropDownAndPersonalInfo = async () => {
  await Promise.all([fetchHonorificDropdownData(), fetchGenderList(), fetchMaritalStatusList(), getOnboardingSideNavItems(Number(employeeId))]);
  prefixList.value = [...honorificDropdownData.value];
  genderList.value = [...genderListOfEmployeeContact.value];
  maritalStatusList.value = [...maritalStatusListOfEmployeeInformation.value];
}

async function onSubmit(event: Event, saveTypeStr?: string) {
  event.preventDefault();
  const { valid } = await form.value.validate();
  if (!valid) {
    return;
  }
  try {
    setLoading(true);
    const request = mapData();
    const response = await updateEmployeeInformationById(request);
    if (response.success) {
      notifySuccess(response.apiMessage);
      await markOnboardingSidenavItemAsDone(currentNavItem.value?.progressSidebarId, true, Number(employeeId));
    } else {
      notifyError(response.apiMessage);
    }
  } catch (error) {
    notifyError(error);
  } finally {
    await getEmployeeInformation();
    mapDataToSelectState();
    if (saveTypeStr == SAVE_TYPE.SAVENEXT) router.push({ name: "onboardingContacts" });
    setLoading(false);
  }
}

const handleDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
  isLeaveRoute.value = true;
  router.push(toPath.value)
}

const handleCancelDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
  isLeaveRoute.value = false;
}

onBeforeRouteLeave((to, from, next) => {
  const isTheSame = isEqual(deepCloneData.value, dataPersonal.value)
  if (!isTheSame) {
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
  next()
});

onMounted(async () => {
  try {
    await getListDropDownAndPersonalInfo();
    await getEmployeeInformation();
    currentNavItem.value = onboardingSideNavItem.value.find(
      (item) =>
        item.progressSidebarUrl.trim().toLowerCase() ===
        "onboardingPersonalInformation".trim().toLocaleLowerCase()
    );
    employeeStatus.value = Number(personalInformation.value.employeeStatusId);
  } catch (error) {
    setLoading(false);
  } finally {
    isFinishLoading.value = true;
    mapDataToSelectState();
    isDisableByStatus.value = handleDisableInputByStatus();
    setLoading(false);
  }



});
</script>

<template>
  <div ref="container" v-if="isFinishLoading">
    <div id="form-personal-information" :style="{ paddingBottom: '70px' }">
      <VeeForm ref="form">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
          <fs-row align-v="center">
            <fs-col class="text-truncate">
              <h2 class="hq-pg__title font-weight-bold">Personal Information</h2>
            </fs-col>
            <fs-col cols="auto" class="ms-auto d-flex">

              <fs-button class="d-flex align-items-center" type="button" @click="onSubmit($event, SAVE_TYPE.SAVE)"
                variant="outline-primary" :disabled="isDisabledSubmit">
                <font-awesome-icon :icon="['far', 'floppy-disk']" />
                Save</fs-button>
              <fs-button type="button" variant="primary" @click="onSubmit($event, SAVE_TYPE.SAVENEXT)"
                :disabled="isDisabledSubmit">Save
                &#38;
                next</fs-button>              
            </fs-col>
          </fs-row>

        </fs-container>
        <fs-container fluid class="contain py-4">
          <p class="section-title">General Info</p>
          <fs-row>
            <fs-col cols="2">
              <fs-input type="fsMultiselectList" v-model="dataPersonal.prefixSelectState" label="Prefix"
                :typeaheaddata="prefixList" typeaheadkey="honorificName" typeaheadvalueattribute="honorificId"
                name="prefix" :showClear="true" autocomplete="donotfill" :dropdownSearchable="true"
                :disabled="isDisableByStatus">
              </fs-input>
            </fs-col>
            <fs-col>
              <fs-input type="fsTextInput" v-model="dataPersonal.firstName" name="firstName" label="First Name"
                maxlength="20" rules="required" :required="true" :disabled="isDisableByStatus" />
            </fs-col>
            <fs-col>
              <fs-input type="fsTextInput" v-model="dataPersonal.middleName" name="middleName" label="Middle Initial"
                maxlength="1" :disabled="isDisableByStatus" />
            </fs-col>
            <fs-col>
              <fs-input type="fsTextInput" v-model="dataPersonal.lastName" name="lastName" label="Last Name"
                maxlength="20" rules="required" :required="true" :disabled="isDisableByStatus" />
            </fs-col>
            <fs-col cols="2">
              <fs-input type="fsTextInput" v-model="dataPersonal.suffix" name="suffix" label="Suffix" maxlength="4"
                :disabled="isDisableByStatus" />
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col >
              <fs-input type="fsTextInput" :input-type="checkIconSsn ? 'password' : 'text'" v-model="dataPersonal.ssn"
                rules="ssn|required" name="SSN" label="SSN" maxlength="11" maskFormat="###-##-####" :required="true"
                :disabled="isDisableByStatus">
                <template #input-group-content>
                  <fs-button class="fs-input__overlap-button" @click="checkIconSsn = !checkIconSsn"
                    variant="outline-secondary">
                    <font-awesome-icon :icon="checkIconSsn
                      ? 'fa-light fa-eye'
                      : 'fa-light fa-eye-slash'
                      " />
                  </fs-button>
                </template>
              </fs-input>
            </fs-col>
            <fs-col>
              <fs-input type="fsMultiselectList" v-model="dataPersonal.genderSelectState" :typeaheaddata="genderList"
                :showClear="true" autocomplete="donotfill" :dropdownSearchable="true" typeaheadkey="name"
                typeaheadvalueattribute="id" name="Gender" label="Gender" rules="required" :required="true"
                :disabled="isDisableByStatus" />
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col >
              <fs-input type="fsMultiselectList" v-model="dataPersonal.maritalSelectState"
                :typeaheaddata="maritalStatusList" typeaheadkey="maritalStatusName"
                typeaheadvalueattribute="maritalStatusId" name="maritalStatus" label="Marital Status" :showClear="true"
                autocomplete="donotfill" :dropdownSearchable="true" :disabled="isDisableByStatus" />
            </fs-col>
            <fs-col>
              <fs-input type="fsDateInput" v-model="dataPersonal.dateOfBirth" name="dateOfBirth" label="Date of Birth"
                rules="date|beforeToday" :required="true" :disabled="isDisableByStatus" />
            </fs-col>
          </fs-row>
          <p class="section-title">Contact</p>
          <fs-row>
            <fs-col >
              <fs-input type="fsTextInput" v-model="dataPersonal.email" name="email" label="Email Address"
                rules="email|required" maxlength="100" :required="true" :disabled="isDisableByStatus" />
            </fs-col>
            <fs-col>
              <fs-input type="fsTextInput" v-model="dataPersonal.phoneNumber" name="phoneNumber" label="Phone Number"
                rules="required|phoneNumber" :required="true" maskFormat="(###) ###-####" :disabled="isDisableByStatus" />
            </fs-col>
          </fs-row>
          <p class="section-title">Address</p>
          <fs-row>
            <fs-col>
              <fs-input  type="fsTextInput" v-model="dataPersonal.address1" name="address1"
                label="Address Line 1" rules="required" :required="true" maxlength="30" :disabled="isDisableByStatus" />              
            </fs-col>

          </fs-row>
          <fs-row>
            <fs-col>
              <fs-input  type="fsTextInput" v-model="dataPersonal.address2" name="address2"
                label="Address Line 2" maxlength="30" :disabled="isDisableByStatus" />              
            </fs-col>

          </fs-row>
          <fs-row>
            <fs-col >
              <fs-input type="fsTextInput" v-model="dataPersonal.city" name="city" label="City" rules="required"
                :required="true" maxlength="30" :disabled="isDisableByStatus" />
            </fs-col>
            <fs-col>
              <fs-input type="fsMultiselectList" v-model="dataPersonal.stateSelectState" :typeaheaddata="STATES"
                :showClear="true" autocomplete="donotfill" :dropdownSearchable="true" typeaheadkey="value"
                typeaheadvalueattribute="value" name="State" label="State" rules="required" :required="true"
                :disabled="isDisableByStatus" />
            </fs-col>
            <fs-col>
              <fs-input type="fsTextInput" v-model="dataPersonal.zip" name="zip" label="Zip Code" rules="required"
                :required="true" maxlength="10" :disabled="isDisableByStatus" />
            </fs-col>
          </fs-row>
          <p class="section-title">Driver License</p>
          <fs-row>
            <fs-col >
              <fs-input type="fsTextInput" :input-type="checkIconLicense ? 'password' : 'text'"
                v-model="dataPersonal.driversLicenseNumber" name="driversLicenseNumber" label="License Number"
                maxlength="25" :disabled="isDisableByStatus">
                <template #outside-input-group>
                  <fs-button class="fs-input__overlap-button" @click="checkIconLicense = !checkIconLicense"
                    variant="outline-secondary">
                    <font-awesome-icon :icon="checkIconLicense
                      ? 'fa-light fa-eye'
                      : 'fa-light fa-eye-slash'
                      " />
                  </fs-button>
                </template>
              </fs-input>
            </fs-col>
            <fs-col>
              <fs-input type="fsMultiselectList" v-model="dataPersonal.driversLicenseSelectState" :typeaheaddata="STATES"
                :showClear="true" autocomplete="donotfill" :dropdownSearchable="true" typeaheadkey="value"
                typeaheadvalueattribute="value" name="driversLicenseState" label="License State"
                :disabled="isDisableByStatus" />
            </fs-col>
            <fs-col>
              <fs-input type="fsDateInput" v-model="dataPersonal.driversLicenseExpirationDate"
                name="driversLicenseExpirationDate" label="Expiration date" :disabled="isDisableByStatus" />
            </fs-col>
          </fs-row>
        </fs-container>

      </VeeForm>
      <!--  Modal On Leave Route -->
      <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved Changes" okText="YES, LEAVE"
        okTextVariant="danger" cancelText="stay" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
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
      <onboardingFloatingButton />
    </div>
  </div>
</template>

<style scoped lang="scss">
#form-personal-information {
  .sticky-header {
    position: sticky;
    top: 0;
    padding: 24px 0;
    z-index: 100;
    background-color: #FFFFFF;
    transition: all 0.3s ease;

    &.scrolled {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  :deep(.fs-input__button.btn, .fs-input__button.b-chip) {
    top: 17px;
  }
}

.form_header {
  height: 80px;
  border-bottom: 1px solid #e1e4e8;
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 2;

  &-title {
    font-size: 16px;
  }
}

.font-weight-bold {
  font-weight: 700;
}

.section-title {
  color: #03A9F4;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
}
</style>
