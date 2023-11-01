<script lang="ts" setup>
import { ref, onMounted, Ref, watch } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileCircleExclamation, faFilePdf, faTrashCan, faArrowUpFromBracket, faEye, faEyeSlash, faPaperclip } from "@fortawesome/pro-light-svg-icons";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { storeToRefs } from 'pinia';
import { COUNTRY_LIST, STATES } from '@/constants/common';
//For Uploading Documents , Folder, etc....
import { useLoadingStore } from "@/stores/loadingStore";
import { CitizenStatus, CitizenChildStatus } from '@/enums/citizenStatus'
import SignaturePad from "@/components/common/SignaturePad.vue";
import { faFloppyDisk } from '@fortawesome/pro-regular-svg-icons';
import { useOnboardingFormINineStore } from "@/stores/onboardingFormI9Store";
import moment from 'moment';
import { OnboardingFormINineModel, OnboardingI9Employee } from "@/models/onboarding/OnboardingFormINine";
import { useRouter } from "vue-router";
import FsInput from '@/components/global/fsInput/fsInput.vue';
import { useBreakpoints } from '@/composables/useBreakpoints';
import { truncateFileName } from "@/utilities/formatUtils";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";

const { responsive } = useBreakpoints();

const inputWidth = ref("185px");
watch(() => responsive.breakpoint, () => {
  if (responsive.breakpoint === 'xl' || responsive.breakpoint === 'lg') {
    inputWidth.value = "185px"
  } else if (responsive.breakpoint === 'md') {
    inputWidth.value = "175px"
  } else if (responsive.breakpoint === 'sm') {
    inputWidth.value = "160px"
  }
})

library.add(faFileCircleExclamation, faCircleExclamation, faFilePdf, faTrashCan, faArrowUpFromBracket, faFloppyDisk, faEye, faEyeSlash, faPaperclip);
const container = ref(null);
const router = useRouter();
const isFinishLoading = ref(false)
const formFieldI9Employee: Ref<OnboardingFormINineModel> = ref({} as OnboardingFormINineModel);
const formModelI9Employee: Ref<OnboardingI9Employee> = ref();

const hqSuiteStore = useHQSuiteStore();
const handleDownloadFile = async (filePath: string) => {
  await hqSuiteStore.downloadFile(filePath);
}

// Upload Store
const onboardingFormINineStore = useOnboardingFormINineStore();

const { dataOnboardingFormINine } = storeToRefs(useOnboardingFormINineStore());
const { setLoading } = useLoadingStore();

const employeeIdFieldModel = router.currentRoute.value.params.id;

const handleGetFormI9 = async () => {
  await onboardingFormINineStore.fetchFormINine(Number(employeeIdFieldModel), 8);
  formFieldI9Employee.value = dataOnboardingFormINine.value;
  mapFieldModelToFormModel();
}

const mapFieldModelToFormModel = () => {
  const data = formFieldI9Employee.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc;
  }, {});
  formModelI9Employee.value = data as OnboardingI9Employee;
  formModelI9Employee.value.uploadFile = formFieldI9Employee.value.uploadFileStateForms;
  if (formModelI9Employee.value.isTranslator == "" || formModelI9Employee.value.isTranslator == false) {
    formModelI9Employee.value.isTranslator = false;
  }
  if (formModelI9Employee.value.middleName == "N/A") {
    formModelI9Employee.value.middleName = ""
  }
  if (formModelI9Employee.value.lastNameUsed == "N/A") {
    formModelI9Employee.value.lastNameUsed = ""
  }
  if (formModelI9Employee.value.aptNumber == "N/A") {
    formModelI9Employee.value.aptNumber = ""
  }
  if (formModelI9Employee.value.emailAddress == "N/A") {
    formModelI9Employee.value.emailAddress = ""
  }
  if (formModelI9Employee.value.telePhone == "N/A") {
    formModelI9Employee.value.telePhone = ""
  }
}

const dateSigned = ref(null)
const hourSigned = ref(null)
const dateTranslatorSigned = ref(null)
const hourTranslatorSigned = ref(null)

const formatDateSigned = () => {
  dateSigned.value = null;
  hourSigned.value = null;
  dateTranslatorSigned.value = null;
  hourTranslatorSigned.value = null;
  if (formModelI9Employee.value.dateSignatureUTC) {
    dateSigned.value = moment(formModelI9Employee.value.dateSignatureUTC).format("MM/DD/YYYY");
    hourSigned.value = moment(formModelI9Employee.value.dateSignatureUTC).format("hh:mm A");
  }
  if (formModelI9Employee.value.translatorSignatureDate) {
    dateTranslatorSigned.value = moment(formModelI9Employee.value.translatorSignatureDate).format("MM/DD/YYYY");
    hourTranslatorSigned.value = moment(formModelI9Employee.value.translatorSignatureDate).format("hh:mm A");
  }
}

onMounted(async () => {
  try {
    setLoading(true)
    await handleGetFormI9();
    formatDateSigned();
    isFinishLoading.value = true
    setLoading(false)
  } catch (error) {
    setLoading(false)
  } finally {
    isFinishLoading.value = true
    setLoading(false)
  }
});
</script>
<template>
  <div ref="container" v-if="isFinishLoading">

    <fs-container  fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain mb-4" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
            <div class="d-flex align-items-center h-100">
              <fs-link @click="router.go(-1)" class="me-2">
                <font-awesome-icon :icon="['fal', 'circle-arrow-left']" class="onboardingDetail__backIcon" size="lg" />
              </fs-link>
              <h2 class="hq-pg__title">
                <h4 class="fw-bold mb-0">Employee Information and Attestation</h4>
              </h2>
            </div>
          </fs-container>
    <fs-container fluid class="contain" id="form-i9" :style="{ paddingBottom: '100px' }">
      <fs-row>
        <fs-col class="p-0">

          <!-- NOTICE -->
          <div class="notice mb-3">
            <div>
              <div class="text-bold">
                Anti-discrimination notice
              </div>
              <div class="pt-2">
                It is illegal to discriminate against work-authorized individuals. Employers CANNOT specify which
                document(s) an employee may present to establish employment authorization and identity. The refusal to
                hire or continue to employ an individual because the documentation presented has a future expiration date
                may also constitute illegal discrimination.
              </div>
            </div>
          </div>
          <!-- FORM -->
          <div :style="{ fontWeight: 700, fontSize: '14px', lineHeight: '22px', textTransform: 'uppercase' }"
            class="mb-2">
            Employee Information and Attestation</div>
          <!-- PERSONAL INFORMATION -->
          <fs-row>
            <fs-col class="p-0">
              <fs-input type="fsTextInput" label="Last Name (Family Name)" :rules="{ required: true }" :required="true"
                name="employeeLastName" v-model="formModelI9Employee.lastName" :disabled=true></fs-input>
            </fs-col>
            <fs-col>
              <fs-input type="fsTextInput" label="First Name (Given Name)" :rules="{ required: true }" :required="true"
                name="employeeFirstName" v-model="formModelI9Employee.firstName" :disabled=true></fs-input>
            </fs-col>
            <fs-col cols="2">
              <fs-input type="fsTextInput" label="Middle Initial" :rules="{ required: true }" :required="true"
                name="employeeMiddleName" v-model="formModelI9Employee.middleName" :disabled=true></fs-input>
            </fs-col>
            <fs-col class="pr-0">
              <fs-input type="fsTextInput" label="Other Last Name Used" :rules="{ required: true }" :required="true"
                name="employeeOtherLastName" v-model="formModelI9Employee.lastNameUsed" :disabled=true></fs-input>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="12" class="p-0">
              <fs-input type="fsTextInput" label="Address (Street Number and Name)" :rules="{ required: true }"
                :required="true" name="employeeAddress" v-model="formModelI9Employee.address" :disabled=true></fs-input>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="12" class="p-0">
              <fs-input type="fsTextInput" label="Apt Number" :rules="{ required: true }" :required="true"
                name="aptNumber" v-model="formModelI9Employee.aptNumber" :disabled=true></fs-input>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="6" class="p-0">
              <fs-input type="fsTextInput" label="City or Town" :rules="{ required: true }" :required="true" name="city"
                v-model="formModelI9Employee.city" :disabled=true></fs-input>
            </fs-col>
            <fs-col cols="3">
              <fs-input type="fsMultiselectList" label="State" id="stateEmp" v-model="formModelI9Employee.state"
                :typeaheaddata="STATES" typeaheadkey="value" typeaheadvalueattribute="value" name="stateEmp"
                :showClear="false" autocomplete="donotfill" :dropdownSearchable="true" :rules="{ required: true }"
                :required="true" disabled>
              </fs-input>
            </fs-col>
            <fs-col cols="3" class="p-0">
              <fs-input type="fsTextInput" label="Zip Code" :rules="{ required: true }" :required="true" name="zipcode"
                v-model="formModelI9Employee.zipCode" :disabled="true"></fs-input>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="6" class="p-0">
              <fs-input type="FsDateInput" label="Date of Birth" :rules="{ required: true }" :required="true"
                name="dateOfBirth" v-model="formModelI9Employee.dateOfBirth" :disabled="true"></fs-input>
            </fs-col>
            <fs-col cols="6" class="pr-0">
              <fs-input type="fsTextInput" label="U.S. Social Security Number" :rules="{ required: true }"
                :required="true" name="ssn" v-model="formModelI9Employee.socialSecurityNumber"
                :disabled="true"></fs-input>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="6" class="p-0">
              <fs-input type="fsTextInput" label="Employee’s E-mail Address" :rules="{ required: true }" :required="true"
                name="emailAddress" v-model="formModelI9Employee.emailAddress" :disabled="true"></fs-input>
            </fs-col>
            <fs-col cols="6" class="pr-0">
              <fs-input type="fsTextInput" label="Employee’s Telephone" :rules="{ required: true }" :required="true"
                name="telePhone" v-model="formModelI9Employee.telePhone" :disabled="true"></fs-input>
            </fs-col>
          </fs-row>
          <fs-row>
            I am aware that federal law provides for imprisonment and/or fines for false
            statements
            or use of false documents in connection with the completion of this form.
          </fs-row>
          <fs-row class="pt-2">
            I attest, under penalty of perjury, that I am (check one of the following boxes):
          </fs-row>
          <fs-row>
            <VeeField v-model="formModelI9Employee.attestCitizenshipStatusId" name="maritalStatus"
              :rules="{ required: true }">
              <fs-form-group name="unit-options" class="pl-0 pr-0">
                <fs-form-radio class="pt-2" name="unit-options" :value="CitizenStatus.CITIZEN_OF_US"
                  v-model="formModelI9Employee.attestCitizenshipStatusId" disabled><b>1.
                    A citizen of the United
                    States</b></fs-form-radio>
                <fs-form-radio class="pt-2" name="unit-options" :value="CitizenStatus.NON_CITIZEN_OF_US"
                  v-model="formModelI9Employee.attestCitizenshipStatusId" disabled><b>2.
                    A noncitizen national of
                    the United States </b> <span><small>See
                      instructions.</small></span>
                </fs-form-radio>
                <fs-form-radio class="pt-2 custom-group-radio" name="unit-options"
                  :value="CitizenStatus.LAWFUL_PERMANENT_CITIZEN" v-model="formModelI9Employee.attestCitizenshipStatusId"
                  disabled>
                  <div><b>3. A lawful permanent resident </b></div>
                  <div class="vertical-line"></div>
                  <div>
                    <p>Alien Registration Number/USCIS Number</p>
                  </div>
                  <div>
                    <fs-input type="fsTextInput" name="alienRegistrationUSCISNumber" class="p-0"
                      v-model="formModelI9Employee.alienRegistrationUSCISNumber" :disabled="true"></fs-input>
                  </div>
                </fs-form-radio>
                <small class="pl-15em d-block">Some aliens may write “N/A” in the date
                  field. See instructions.</small>
                <div class="d-flex justify-content-between">
                  <fs-form-radio class="pt-2 custom-group-radio" name="unit-options"
                    :value="CitizenStatus.ALIEN_AUTHORIZE_TO_WORK_UNTIL"
                    v-model="formModelI9Employee.attestCitizenshipStatusId" disabled>
                    <div><b>4. An alien authorized to work until </b></div>
                  </fs-form-radio>
                  <div class="vertical-line"></div>
                  <div class="p-1">
                    Expiration Date
                  </div>
                  <div>
                    <fs-input type="FsDateInput" name="authorizedExpirationDate" class="p-0"
                      v-model="formModelI9Employee.authorizedExpirationDate" :disabled="true"></fs-input>
                  </div>
                </div>
                <small class="pl-15em d-block">Aliens authorized to work must provide only one of
                  the
                  following
                  document numbers to complete Form I-9: An Alien Registration
                  Number/USCIS Number or Form I-9 Admission Number or Foreign Passport
                  Number.</small>
                <VeeField name="alienAuthorizedToWork" v-model="formModelI9Employee.attestCitizenshipFourId">
                  <fs-form-radio class="radio-child pt-2" :value="CitizenChildStatus.ALIEN_REGISTRATION_NUMBER"
                    v-model="formModelI9Employee.attestCitizenshipFourId" disabled>
                    <div>4.1. Alien Registration Number/USCIS Number</div>
                    <div>
                      <fs-input class="p-0 m-0" type="fsTextInput" v-model="formModelI9Employee.alienRegistrationNumber"
                        name="alienRegistrationNumber" disabled></fs-input>
                    </div>
                  </fs-form-radio>
                  <fs-form-radio class="radio-child pt-2" :value="CitizenChildStatus.FORM_ADMISSION_NUMBER" disabled
                    v-model="formModelI9Employee.attestCitizenshipFourId">
                    <div>4.2. Form I-94 Admission Number</div>
                    <div>
                      <fs-input class="p-0 m-0" type="fsTextInput" v-model="formModelI9Employee.formAdmissionNumber"
                        name="formAdmissionNumber" disabled></fs-input>
                    </div>
                  </fs-form-radio>
                  <fs-form-radio class="radio-child pt-2" :value="CitizenChildStatus.FOREIGN_PASSPORT_NUMBER"
                    v-model="formModelI9Employee.attestCitizenshipFourId" disabled>
                    <div>4.3. Foreign Passport Number</div>
                    <div>
                      <fs-input class="p-0 m-0" type="fsTextInput" v-model="formModelI9Employee.foreignPassportNumber"
                        name="foreignPassportNumber" disabled></fs-input>
                    </div>
                  </fs-form-radio>
                  <div class="radio-child pt-2">
                    <div class="d-flex justify-content-between">
                      <div>Country of Issuance</div>
                      <div id="countryOfIssuanceDropdownHolder">
                        <fs-input type="fsMultiselectList" id="countryOfIssuance" class="p-0"
                          v-model="formModelI9Employee.countryOfIssuance" :typeaheaddata="COUNTRY_LIST"
                          typeaheadkey="name" typeaheadvalueattribute="code" name="countryOfIssuance" :showClear="false"
                          autocomplete="donotfill" :dropdownSearchable="true" disabled>
                        </fs-input>
                      </div>
                    </div>
                  </div>
                </VeeField>
              </fs-form-group>
            </VeeField>
          </fs-row>
          <fs-row>
            <fs-col cols="5">
              <div class="label-required">
                <div>Supporting Document(s)</div>
              </div>
              <div class="mb-3">
                <span>
                  <input type="file" multiple id="upload_file" ref="fileInput" hidden />
                </span>
                <a v-for="document in formModelI9Employee?.uploadFile" :key="document.filePath"
                  class="text-success d-block my-2">
                  <font-awesome-icon :icon="['fal', 'paperclip']" style="color: rgba(0, 0, 0, 0.45);" /><span class="ms-2"
                    @click="handleDownloadFile(document.filePath)">{{
                      truncateFileName(document.fileName)
                    }}</span>
                  &nbsp;
                </a>
              </div>
            </fs-col>
          </fs-row>
          <!-- SIGNATURE -->
          <fs-row>
            <VeeField name="EmployeeSignature" v-model="formModelI9Employee.employeeSignaturePath" disabled>
              <SignaturePad v-if="isFinishLoading" :path="formModelI9Employee?.employeeSignaturePath"
                :isViewOnly="true" />
            </VeeField>
          </fs-row>
          <fs-row class="mb-3">
            <fs-col md="6" sx="12" class="p-0">
              <label class="tax-holding-form__label">
                <div class="label-required">
                  <div>Today’s Date</div>
                </div>
              </label>
              <div class="d-flex">
                <fs-input type="fsTextInput" name="dateSigned" class="p-0 me-3" v-model="dateSigned" disabled></fs-input>
                <fs-input type="fsTextInput" name="hourSigned" class="p-0" v-model="hourSigned" disabled></fs-input>
              </div>
            </fs-col>
          </fs-row>
          <hr />
          <fs-row>
            <div class="tax-withholding-header__title text-uppercase pt-2 pl-0">Preparer and/or Translator
              Certification</div>
            <fs-form-group name="translator-options" class="pl-0 pr-0">
              <fs-form-radio name="translator-options" class="pt-2" :value="false"
                v-model="formModelI9Employee.isTranslator" disabled>
                <div>
                  I did not use a preparer of translator.
                </div>
              </fs-form-radio>
              <fs-form-radio name="translator-options" class="pt-2" :value="true"
                v-model="formModelI9Employee.isTranslator" disabled>
                <div>
                  A preparer(s) and/or translator(s) assisted the employee in completing Section 1.
                </div>
              </fs-form-radio>
            </fs-form-group>
          </fs-row>
          <div v-if="formModelI9Employee?.isTranslator">
            <fs-row>
              <small class="p-0">
                (Fields below must be completed and signed when preparers and/or translators assist an
                employee in completing Section 1.)
              </small>
              <div class="pt-2 pl-0">
                I attest, under penalty of perjury, that I have assisted in the completion of Section 1
                of this form and that to the best of my knowledge the information is true and correct.
              </div>
              <div class="p-0">
                <VeeField name="TranslatorSignature" v-model="formModelI9Employee.translatorSignaturePath" disabled>
                  <SignaturePad v-if="isFinishLoading" :isTranslator="true"
                    :path="formModelI9Employee?.translatorSignaturePath" :isViewOnly="true" />
                </VeeField>
              </div>
            </fs-row>
            <fs-row>
              <fs-col md="6" sx="12" class="p-0">
                <label class="tax-holding-form__label">
                  <div class="label-required">
                    <div>Today’s Date</div>
                  </div>
                </label>
                <div class="d-flex">
                  <fs-input type="fsTextInput" name="dateTranslatorSigned" class="p-0 me-3" v-model="dateTranslatorSigned"
                    :disabled="true"></fs-input>
                  <fs-input type="fsTextInput" name="hourTranslatorSigned" class="p-0" v-model="hourTranslatorSigned"
                    :disabled="true"></fs-input>
                </div>
              </fs-col>
            </fs-row>
            <fs-row>
              <fs-col cols="6" class="p-0">
                <fs-input type="fsTextInput" label="Last Name (Family Name)" name="translatorLastName"
                  v-model="formModelI9Employee.translatorLastName" :disabled="true" :required="true"></fs-input>
              </fs-col>
              <fs-col cols="6" class="pr-0">
                <fs-input type="fsTextInput" label="First Name (Given Name)" name="translatorFirstName"
                  v-model="formModelI9Employee.translatorFirstName" :disabled="true" :required="true"></fs-input>
              </fs-col>
            </fs-row>
            <fs-row>
              <fs-col cols="12" class="p-0">
                <fs-input type="fsTextInput" label="Address (Street Number and Name)" name="translatorAddress"
                  v-model="formModelI9Employee.translatorAddress" :disabled="true" :required="true"></fs-input>
              </fs-col>
            </fs-row>
            <fs-row>
              <fs-col cols="5" class="p-0">
                <fs-input type="fsTextInput" label="City or Town" name="translatorCity"
                  v-model="formModelI9Employee.translatorCity" :disabled="true" :required="true"></fs-input>
              </fs-col>
              <fs-col>
                <fs-input type="fsMultiselectList" label="State" id="translatorState"
                  v-model="formModelI9Employee.translatorState" :typeaheaddata="STATES" typeaheadkey="value"
                  typeaheadvalueattribute="value" name="translatorState" :showClear="false" autocomplete="donotfill"
                  :dropdownSearchable="true" :rules="{ required: true }" :required="true" disabled>
                </fs-input>
              </fs-col>
              <fs-col class="pr-0">
                <fs-input type="fsTextInput" :required="true" label="Zip Code" name="translatorZipCode"
                  v-model="formModelI9Employee.translatorZipCode" :disabled="true"></fs-input>
              </fs-col>
            </fs-row>
          </div>
        </fs-col>
      </fs-row>
    </fs-container>
  </div>
</template>
<style scoped lang="scss">
#form-i9 {
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

  :deep(.fa-eye-slash) {
    float: right;
    margin-top: -24px;
    margin-right: 10px;
  }

  :deep(.fa-eye) {
    float: right;
    margin-top: -24px;
    margin-right: 10px;
  }

  #countryOfIssuance {
    padding-left: 16px;
  }

  .header-title {
    padding-left: 10px;
  }

  :deep(#countryOfIssuanceDropdownHolder) {
    min-width: v-bind(inputWidth)
  }
}
</style>
