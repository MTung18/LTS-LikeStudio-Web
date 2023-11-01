<script lang="ts" setup>
import { Ref, computed, nextTick, ref, watch } from 'vue';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { isEqual, omit, isEmpty } from "lodash";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { OnboardingFormINineModel, OnboardingI9Employee, OnboardingI9Employer } from '@/models/onboarding/OnboardingFormINine';
import { STATES, CITIZENSHIP_STATUS } from '@/constants/common';
import SignaturePad from "@/components/common/SignaturePad.vue";
import { onMounted } from 'vue';
import { FormField } from '@/enums/FormField';
import { useOnboardingFormINineStore } from "@/stores/onboardingFormI9Store";
import { storeToRefs } from 'pinia';
import { useLoadingStore } from "@/stores/loadingStore";
import { dataUrlToFile } from '@/helper/hqSuite/formatHelper';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import moment from 'moment';
import FsInput from '@/components/global/fsInput/fsInput.vue';
import { Form as VeeForm, ErrorMessage } from 'vee-validate'
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { useAlerts } from '@/composables/useAlerts';
import { useBreakpoints } from '@/composables/useBreakpoints';
import { StaticFiles } from '@/enums/StaticFiles';

const { responsive } = useBreakpoints();
const router = useRouter();
const { setLoading } = useLoadingStore();
const LIST_SELECTED_TYPE = {
  "A": 1,
  "BC": 2
}
const LIST_SELECTED_TYPE_RESPONSIVE = [
  { text: "List A", value: 1 },
  { text: "List B & List C", value: 2 }
]
const azureB2CAuthStore = useAzureB2CAuthStore();
const clientId = computed(
  () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
const employeeId = router.currentRoute.value.params.id;
const onboardingFormINineStore = useOnboardingFormINineStore();
const { dataOnboardingFormINine } = storeToRefs(useOnboardingFormINineStore());
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const onboardingNavStore = useOnboardingStore();

library.add(faCircleExclamation);
const container = ref(null);
const formData = ref(null);
const openSaveChangeModal = ref(false);
const toPath = ref('');
const isLeaveRoute = ref(false);
const isFinishLoading = ref(false);
const isFormChanged = ref(false);

const formFieldI9Employer: Ref<OnboardingFormINineModel> = ref();
const formModel: Ref<OnboardingI9Employer> = ref();
const formModelClone: Ref<OnboardingI9Employer> = ref();

const formFieldI9Employee: Ref<OnboardingFormINineModel> = ref();
const formModelI9Employee: Ref<OnboardingI9Employee> = ref();

const hqSuiteStore = useHQSuiteStore();
const signatureObjectEmp = ref({
  path: '',
  fileObject: null,
  name: ''
})
const signatureObjectReverificationRehires = ref({
  path: '',
  fileObject: null,
  name: ''
});
const signatureEmpFilePath = ref('');
const reverificationRehiresFilePath = ref('');

const employerSignatureDateFormat: Ref<string> = ref(null)
const employerSignatureTimeFormat: Ref<string> = ref(null)
const reverificationRehiresSignatureDate: Ref<string> = ref(null)
const reverificationRehiresSignatureTime: Ref<string> = ref(null)
const formatDateSigned = () => {
  employerSignatureDateFormat.value = null;
  employerSignatureTimeFormat.value = null;
  reverificationRehiresSignatureDate.value = null;
  reverificationRehiresSignatureTime.value = null;
  if (formModel.value.employerSignatureDate) {
    employerSignatureDateFormat.value = moment(formModel.value.employerSignatureDate).format("MM/DD/YYYY");
    employerSignatureTimeFormat.value = moment(formModel.value.employerSignatureDate).format("hh:mm A");
  }
  if (formModel.value.reverificationRehiresSignatureDate) {
    reverificationRehiresSignatureDate.value = moment(formModel.value.reverificationRehiresSignatureDate).format("MM/DD/YYYY");
    reverificationRehiresSignatureTime.value = moment(formModel.value.reverificationRehiresSignatureDate).format("hh:mm A");
  }
}

const onChangeList = (listType: number) => {
  formModel.value.listSelected = listType
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

const handleChangeState = (event) => {
  const targetValue = event.target.value;
  const currentCounty = STATES.find(item => item.value === targetValue);
  formModel.value.employerState = currentCounty.value;
}

const handleChangeListSelect = (event) => {
  const targetValue = event.target.value;
  const currentListSelected = LIST_SELECTED_TYPE_RESPONSIVE.find(item => item.value === Number(targetValue));
  formModel.value.listSelected = currentListSelected.value;
}

const handleChangeCitizenStatus = (event) => {
  const targetValue = event.target.value;
  const currentStatus = CITIZENSHIP_STATUS.find(item => item.value.toString() === targetValue);
  formModel.value.employeeCitizenStatus = currentStatus.value;
}

const handleClearEmpSignature = () => {
  formModel.value.employerSignaturePath = "";
}

const handleUpdatePathEmp = (path: string) => {
  formModel.value.employerSignaturePath = path;
}

const handleUpdatePathSignatureEmp = async (value: string) => {
  const name = `FormINine-SignatureEmployer-${new Date().getTime()}.png`
  const File = await dataUrlToFile(value, name)
  signatureObjectEmp.value.path = signatureEmpFilePath.value
  signatureObjectEmp.value.name = name
  signatureObjectEmp.value.fileObject = File
  formModel.value.employerSignaturePath = `${signatureEmpFilePath.value}/${name}`
  formModel.value.employerSignature = value
}

const handleClearReverificationRehiresSignature = () => {
  formModel.value.reverificationRehiresSignaturePath = "";
}

const handleUpdatePathReverificationRehires = (path: string) => {
  formModel.value.reverificationRehiresSignaturePath = path;
}

const handleUpdatePathSignatureReverificationRehires = async (value: string) => {
  const name = `FormINine-SignatureReverificationRehires-${new Date().getTime()}.png`
  const File = await dataUrlToFile(value, name)
  signatureObjectReverificationRehires.value.path = reverificationRehiresFilePath.value
  signatureObjectReverificationRehires.value.name = name
  signatureObjectReverificationRehires.value.fileObject = File
  formModel.value.reverificationRehiresSignaturePath = `${reverificationRehiresFilePath.value}/${name}`
  formModel.value.reverificationRehiresSignature = value
}

const currentNavItem = ref(null)
const handleCheckSideBar = async () => {
  if (onboardingSideNavItem.value.length == 0) {
    await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
  }
  currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLowerCase() === 'onboardingFormI9'.trim().toLocaleLowerCase());
  await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId))
}

onBeforeRouteLeave(async (to, from, next) => {
  if (isFormChanged.value) {
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
  next();
})

const listValidate = computed(() => checkListSelectValidate());
const checkListSelectValidate = (): boolean => {
  let status = false;
  if (formModel.value.listSelected == LIST_SELECTED_TYPE.A) {
    const listAFirst = [formModel.value.listAFirstDocumentTitle,
    formModel.value.listAFirstIssuingAuthority,
    formModel.value.listAFirstDocumentNumber];
    // Check if document have any data
    if (listAFirst.filter(x => !isEmpty(x)).length > 0) {
      status = listAFirst.every(x => !isEmpty(x)) ? true : false
    } else {
      status = false
    }
    if (status) return status

    const listASecond = [formModel.value.listASecondDocumentTitle,
    formModel.value.listASecondIssuingAuthority,
    formModel.value.listASecondDocumentNumber];
    // Check if document have any data
    if (listASecond.filter(x => !isEmpty(x)).length > 0) {
      status = listASecond.every(x => !isEmpty(x)) ? true : false
    } else {
      status = false
    }
    if (status) return status

    const listAThird = [formModel.value.listAThirdDocumentTitle,
    formModel.value.listAThirdIssuingAuthority,
    formModel.value.listAThirdDocumentNumber];
    // Check if document have any data
    if (listAThird.filter(x => !isEmpty(x)).length > 0) {
      status = listAThird.every(x => !isEmpty(x)) ? true : false
    } else {
      status = false
    }
    if (status) return status
  } else if (formModel.value.listSelected == LIST_SELECTED_TYPE.BC) {
    const listB = [
      formModel.value.listBDocumentTitle,
      formModel.value.listBIssuingAuthority,
      formModel.value.listBDocumentNumber,
    ]
    // Check if document have any data
    if (listB.filter(x => !isEmpty(x)).length > 0) {
      status = listB.every(x => !isEmpty(x)) ? true : false
    } else {
      status = false
    }
    if (status) return status

    const listC = [
      formModel.value.listCDocumentTitle,
      formModel.value.listCIssuingAuthority,
      formModel.value.listCDocumentNumber,
    ]
    // Check if document have any data
    if (listC.filter(x => !isEmpty(x)).length > 0) {
      status = listB.every(x => !isEmpty(x)) ? true : false
    } else {
      status = false
    }
    if (status) return status
  }
  return status;
}

watch(() => !isEqual(omit(formModelClone.value, ['employerSignaturePath', 'employerSignature']),
  omit(formModel.value, ['employerSignaturePath', 'employerSignature'])), () => {
    if (isFinishLoading.value) {
      if (isEqual(omit(formModel.value, ['employerSignaturePath']),
        omit(formModelClone.value, ['employerSignaturePath']))) {
        isFormChanged.value = false
        formModel.value.employerSignaturePath = formModelClone.value.employerSignaturePath;
      } else {
        isFormChanged.value = true
        formModel.value.employerSignaturePath = "";
      }
    }
  })

const mapFieldModelToFormModel = () => {
  const data = formFieldI9Employer.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModel.value = data;
  if (formModel.value.listSelected == null || formModel.value.listSelected == "") {
    formModel.value.listSelected = 0;
  }

  const dataEmployee = formFieldI9Employee.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModelI9Employee.value = dataEmployee;
  if (formModelI9Employee.value.middleName == "N/A") {
    formModelI9Employee.value.middleName = ""
  }

  if (formModel.value.employeeFirstName == "") {
    formModel.value.employeeFirstName = formModelI9Employee.value.firstName;
    formModel.value.employeeMiddleName = formModelI9Employee.value.middleName;
    formModel.value.employeeLastName = formModelI9Employee.value.lastName;
    formModel.value.employeeCitizenStatus = formModelI9Employee.value.attestCitizenshipStatusId;
  }

  formModelClone.value = { ...formModel.value };
}

const mapFormModelToFieldModel = () => {
  const mappedFieldModels = formFieldI9Employer.value.fieldModels.map((fieldModel) => {
    const fieldValue = formModel.value[fieldModel.fieldKey] || ""; // Set fieldValue to an empty string if fieldKey does not exist in data
    return { ...fieldModel, fieldValue };
  });
  formFieldI9Employer.value.fieldModels = mappedFieldModels;
}

const handleGetFormI9 = async () => {
  await onboardingFormINineStore.fetchFormINine(Number(employeeId), FormField.I9Employer)
  formFieldI9Employer.value = dataOnboardingFormINine.value

  await onboardingFormINineStore.fetchFormINine(Number(employeeId), FormField.I9Employee)
  formFieldI9Employee.value = dataOnboardingFormINine.value

  mapFieldModelToFormModel();
  formatDateSigned();
  isFormChanged.value = false;
}

const saveFormI9Data = async () => {
  //upload Signature
  if (formModel.value.employerSignaturePath && signatureObjectEmp.value.fileObject) {
    await hqSuiteStore.uploadDocument({ path: signatureObjectEmp.value.path, file: signatureObjectEmp.value.fileObject, fileName: signatureObjectEmp.value.name }, true)
  }
  if (formModel.value.reverificationRehiresSignaturePath && signatureObjectReverificationRehires.value.fileObject) {
    await hqSuiteStore.uploadDocument({ path: signatureObjectReverificationRehires.value.path, file: signatureObjectReverificationRehires.value.fileObject, fileName: signatureObjectReverificationRehires.value.name }, true)
  }
  await handleCheckSideBar();
  await onboardingFormINineStore.editFormINine(formFieldI9Employer.value, FormField.I9Employer);
  await handleGetFormI9();
}

const handleSubmitFormI9 = async () => {
  const { valid } = await formData.value.validate();
  if (!valid) {
    nextTick(() => {
      const el = container.value?.getElementsByClassName('message-error')[0]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    })
    return
  }
  if (!listValidate.value) {
    nextTick(() => {
      const el = container.value?.getElementsByClassName('message-error')[0]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    })
    return
  }
  setLoading(true)

  handleDataOnSelectedList();
  formModel.value.employerSignatureDate = moment().format();
  formModel.value.status = 3;
  if (formModel.value.reverificationRehiresSignaturePath) {
    formModel.value.reverificationRehiresSignatureDate = moment().format();
  }
  mapFormModelToFieldModel();
  await saveFormI9Data();

  setLoading(false)
  router.push({ name: "onboardingFormI9Process" })
}

const handleCancelForm = () => {
  router.push({ name: "onboardingFormI9Process" });
}

const handleDataOnSelectedList = () => {
  if (formModel.value.listSelected == LIST_SELECTED_TYPE.A) {
    formModel.value.listBDocumentTitle = "";
    formModel.value.listBIssuingAuthority = "";
    formModel.value.listBDocumentNumber = "";
    formModel.value.listBExpirationDate = null;
    formModel.value.listBAdditionalInformation = "";
    formModel.value.listCDocumentTitle = "";
    formModel.value.listCIssuingAuthority = "";
    formModel.value.listCDocumentNumber = "";
    formModel.value.listCExpirationDate = null;
  } else if (formModel.value.listSelected == LIST_SELECTED_TYPE.BC) {
    formModel.value.listAFirstDocumentTitle = "";
    formModel.value.listAFirstIssuingAuthority = "";
    formModel.value.listAFirstDocumentNumber = "";
    formModel.value.listAFirstExpirationDate = null;
    formModel.value.listASecondDocumentTitle = "";
    formModel.value.listASecondIssuingAuthority = "";
    formModel.value.listASecondDocumentNumber = "";
    formModel.value.listASecondExpirationDate = null;
    formModel.value.listAThirdDocumentTitle = "";
    formModel.value.listAThirdIssuingAuthority = "";
    formModel.value.listAThirdDocumentNumber = "";
    formModel.value.listAThirdExpirationDate = null;
  }
}

onMounted(async () => {
  try {
    setLoading(true)
    signatureEmpFilePath.value = await makeDocumentPath(DocumentTypes.SignatureEmployeeDocument, `${clientId.value}`, employeeId as string);
    reverificationRehiresFilePath.value = await makeDocumentPath(DocumentTypes.SignatureEmployeeDocument, `${clientId.value}`, employeeId as string);
    await handleGetFormI9();
    if (onboardingSideNavItem.value.length == 0) {
      await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
    }
    isFinishLoading.value = true;
    setLoading(false);
  } catch (error) {
    notifyError('There was an error fetching Form I9 Employer');
    console.error(error);
  } finally {
    isFinishLoading.value = true;
    setLoading(false);
  }

})

const { notifyError } = useAlerts();
const { getDocumentTemplate } = useReportTemplate();
const handleDownloadStaticFile = async (filename: string, isDownload: boolean) => {
  setLoading(true);
  try {
    await getDocumentTemplate(filename, isDownload);
  } catch (error) {
    notifyError(`${filename} is missing`)
  } finally {
    setLoading(false);
  }
}
</script>
<template>
  <div ref="container" v-if="isFinishLoading">
      <VeeForm ref="formData">
        <!-- Action - Start -->
        <fs-container  fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain mb-4" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
          <fs-row align-v="center">
            <fs-col><h2 class="hq-pg__title">Employee Eligibility Verification</h2></fs-col>
            <fs-col cols="auto" class="ms-atuo">
              <fs-button  variant="outline-secondary" @click="handleCancelForm">
              Cancel</fs-button>
            <fs-button type="button" variant="cyan" :disabled="!isFormChanged"
              @click="handleSubmitFormI9">Save</fs-button></fs-col>
          </fs-row>
          

        </fs-container>
        <fs-container class="contain mb-5">
          <div class="mb-3">
            Read instructions carefully before completing this form. See the Form I-9 filling instructions
            <fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_I9, false)" class="desc-link">here.</fs-link>
          </div>
          <!-- PERSONAL INFORMATION -->
          <div>
            <div class="section-text fw-bold">
              Section 2. Employer or Authorized Representative Review and Verification
            </div>
          </div>
          <div class="mb-3">
            <small>Employers or their authorized representative must complete and sign Section 2 within 3 business days
              of the employee's first day of employment. You must physically examine one document from List A OR a
              combination of one document from List B and one document from List C as listed on the "Lists of Acceptable
              Documents."</small>
          </div>
            <fs-card no-body class="rounded-0 mb-4">
              <fs-card-header class="fw-bold">
                Employee Info from Section 1
              </fs-card-header>
              <fs-card-body class="p-0">
                <fs-container class="p-0">
                  <fs-row>
                    <fs-col class="border-end pt-3">
                      <fs-input type="fsTextInput" label="First Name" :rules="{ required: true }" :required="true"
                    name="employeeFirstName" v-model="formModel.employeeFirstName"></fs-input>
                    </fs-col>
                    <fs-col class="border-end pt-3">
                      <fs-input type="fsTextInput" label="M.I" :maxlength="1" name="employeeMiddleName"
                    v-model="formModel.employeeMiddleName"></fs-input>
                    </fs-col>
                    <fs-col class="border-end pt-3">
                      <fs-input type="fsTextInput" label="Last Name" :rules="{ required: true }" :required="true"
                    name="employeeLastName" v-model="formModel.employeeLastName"></fs-input>
                    </fs-col>
                    <fs-col class="pt-3">
                      <fs-input @change="handleChangeCitizenStatus" type="fsSelect" label="Citizenship/Immigration Status"
                    id="employeeCitizenStatus" labelId="employeeCitizenStatusId" v-model="formModel.employeeCitizenStatus"
                    :options="CITIZENSHIP_STATUS" textField="value" name="employeeCitizenStatus" :required="true">
                  </fs-input>
                    </fs-col>
                  </fs-row>
                </fs-container>
              </fs-card-body>
            </fs-card>

          <div v-if="responsive.breakpoint !== 'sm'">
            <fs-table-simple responsive bordered>
              <fs-thead>
                <fs-tr>
                  <fs-th>
                    <div class="d-flex">
                      <fs-col class="text-center">
                        <div class="fw-bold">List A</div>
                        <div><small class="fw-normal">Identity and Employment Authorization</small></div>
                      </fs-col>
                      <fs-col cols="1" class="text-center">
                        <div class="fw-bold table-option-text">OR</div>
                      </fs-col>
                      <fs-col class="text-center">
                        <div class="fw-bold">List B</div>
                        <div><small class="fw-normal">Identity</small></div>
                      </fs-col>
                      <fs-col cols="1" class="text-center">
                        <div class="fw-bold table-option-text">AND</div>
                      </fs-col>
                      <fs-col class="text-center">
                        <div class="fw-bold">List C</div>
                        <div><small class="fw-normal">Employment Authorization</small></div>
                      </fs-col>
                    </div>
                  </fs-th>
                </fs-tr>
              </fs-thead>
              <fs-tbody>
                <fs-tr>
                  <fs-td class="p-0">
                    <div class="d-flex">
                      <!-- List A Start -->
                      <fs-col @click="onChangeList(LIST_SELECTED_TYPE.A)" style="border-right: 1px solid #A7B0BC;"
                        :class="formModel.listSelected === LIST_SELECTED_TYPE.A ? 'list-selected' : ''">
                        <div class="my-2 me-2"
                          style="margin-left:10px; border-bottom: 1px solid #A7B0BC;padding-bottom: 10px;">
                          <div>
                            <fs-input type="fsTextInput" label="Document Title" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.A &&
                              !isEmpty(formModel.listAFirstDocumentTitle) ||
                              !isEmpty(formModel.listAFirstIssuingAuthority) ||
                              !isEmpty(formModel.listAFirstDocumentNumber)
                            ) ? 'required' : ''" name="listAFirstDocumentTitle"
                              v-model="formModel.listAFirstDocumentTitle"></fs-input>
                          </div>
                          <div>
                            <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.A &&
                              !isEmpty(formModel.listAFirstDocumentTitle) ||
                              !isEmpty(formModel.listAFirstIssuingAuthority) ||
                              !isEmpty(formModel.listAFirstDocumentNumber)
                            ) ? 'required' : ''" name="listAFirstIssuingAuthority"
                              v-model="formModel.listAFirstIssuingAuthority"></fs-input>
                          </div>
                          <div class="d-flex">
                            <fs-col class="me-2">
                              <fs-input type="fsTextInput" label="Document Number" :rules="(
                                formModel.listSelected === LIST_SELECTED_TYPE.A &&
                                !isEmpty(formModel.listAFirstDocumentTitle) ||
                                !isEmpty(formModel.listAFirstIssuingAuthority) ||
                                !isEmpty(formModel.listAFirstDocumentNumber)
                              ) ? 'required' : ''" name="listAFirstDocumentNumber"
                                v-model="formModel.listAFirstDocumentNumber"></fs-input>
                            </fs-col>
                            <fs-col>
                              <fs-input type="fsDateInput" v-model="formModel.listAFirstExpirationDate"
                                name="listAFirstExpirationDate" label="Expiration Date (if any)" />
                            </fs-col>
                          </div>
                        </div>
                        <div class="my-2 me-2"
                          style="margin-left:10px; border-bottom: 1px solid #A7B0BC;padding-bottom: 10px;">
                          <div>
                            <fs-input type="fsTextInput" label="Document Title" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.A &&
                              !isEmpty(formModel.listASecondDocumentTitle) ||
                              !isEmpty(formModel.listASecondIssuingAuthority) ||
                              !isEmpty(formModel.listASecondDocumentNumber)
                            ) ? 'required' : ''" name="listASecondDocumentTitle"
                              v-model="formModel.listASecondDocumentTitle"></fs-input>
                          </div>
                          <div>
                            <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.A &&
                              !isEmpty(formModel.listASecondDocumentTitle) ||
                              !isEmpty(formModel.listASecondIssuingAuthority) ||
                              !isEmpty(formModel.listASecondDocumentNumber)
                            ) ? 'required' : ''" name="listASecondIssuingAuthority"
                              v-model="formModel.listASecondIssuingAuthority"></fs-input>
                          </div>
                          <div class="d-flex">
                            <fs-col class="me-2">
                              <fs-input type="fsTextInput" label="Document Number" :rules="(
                                formModel.listSelected === LIST_SELECTED_TYPE.A &&
                                !isEmpty(formModel.listASecondDocumentTitle) ||
                                !isEmpty(formModel.listASecondIssuingAuthority) ||
                                !isEmpty(formModel.listASecondDocumentNumber)
                              ) ? 'required' : ''" name="listASecondDocumentNumber"
                                v-model="formModel.listASecondDocumentNumber"></fs-input>
                            </fs-col>
                            <fs-col>
                              <fs-input type="fsDateInput" v-model="formModel.listASecondExpirationDate"
                                name="listASecondExpirationDate" label="Expiration Date (if any)" />
                            </fs-col>
                          </div>
                        </div>
                        <div class="my-2 me-2" style="margin-left:10px">
                          <div>
                            <fs-input type="fsTextInput" label="Document Title" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.A &&
                              !isEmpty(formModel.listAThirdDocumentTitle) ||
                              !isEmpty(formModel.listAThirdIssuingAuthority) ||
                              !isEmpty(formModel.listAThirdDocumentNumber)
                            ) ? 'required' : ''" name="listAThirdDocumentTitle"
                              v-model="formModel.listAThirdDocumentTitle"></fs-input>
                          </div>
                          <div>
                            <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.A &&
                              !isEmpty(formModel.listAThirdDocumentTitle) ||
                              !isEmpty(formModel.listAThirdIssuingAuthority) ||
                              !isEmpty(formModel.listAThirdDocumentNumber)
                            ) ? 'required' : ''" name="listAThirdIssuingAuthority"
                              v-model="formModel.listAThirdIssuingAuthority"></fs-input>
                          </div>
                          <div class="d-flex">
                            <fs-col class="me-2">
                              <fs-input type="fsTextInput" label="Document Number" :rules="(
                                formModel.listSelected === LIST_SELECTED_TYPE.A &&
                                !isEmpty(formModel.listAThirdDocumentTitle) ||
                                !isEmpty(formModel.listAThirdIssuingAuthority) ||
                                !isEmpty(formModel.listAThirdDocumentNumber)
                              ) ? 'required' : ''" name="listAThirdDocumentNumber"
                                v-model="formModel.listAThirdDocumentNumber"></fs-input>
                            </fs-col>
                            <fs-col>
                              <fs-input type="fsDateInput" v-model="formModel.listAThirdExpirationDate"
                                name="listAThirdExpirationDate" label="Expiration Date (if any)" />
                            </fs-col>
                          </div>
                        </div>
                      </fs-col>
                      <!-- List A End -->
                      <!-- List BC Start -->
                      <fs-col @click="onChangeList(LIST_SELECTED_TYPE.BC)" style="border-right: 1px solid #A7B0BC;"
                        :class="formModel.listSelected === LIST_SELECTED_TYPE.BC ? 'list-selected' : ''">
                        <div class="my-2 me-2"
                          style="margin-left:10px; border-bottom: 1px solid #A7B0BC;padding-bottom: 10px;">
                          <div>
                            <fs-input type="fsTextInput" label="Document Title" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                              !isEmpty(formModel.listBDocumentTitle) ||
                              !isEmpty(formModel.listBIssuingAuthority) ||
                              !isEmpty(formModel.listBDocumentNumber)
                            ) ? 'required' : ''" name="listBDocumentTitle"
                              v-model="formModel.listBDocumentTitle"></fs-input>
                          </div>
                          <div>
                            <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                              !isEmpty(formModel.listBDocumentTitle) ||
                              !isEmpty(formModel.listBIssuingAuthority) ||
                              !isEmpty(formModel.listBDocumentNumber)
                            ) ? 'required' : ''" name="listBIssuingAuthority"
                              v-model="formModel.listBIssuingAuthority"></fs-input>
                          </div>
                          <div class="d-flex">
                            <fs-col class="me-2">
                              <fs-input type="fsTextInput" label="Document Number" :rules="(
                                formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                                !isEmpty(formModel.listBDocumentTitle) ||
                                !isEmpty(formModel.listBIssuingAuthority) ||
                                !isEmpty(formModel.listBDocumentNumber)
                              ) ? 'required' : ''" name="listBDocumentNumber"
                                v-model="formModel.listBDocumentNumber"></fs-input>
                            </fs-col>
                            <fs-col>
                              <fs-input type="fsDateInput" v-model="formModel.listBExpirationDate"
                                name="listBExpirationDate" label="Expiration Date (if any)" />
                            </fs-col>
                          </div>
                        </div>
                        <div class="my-2 me-2 d-flex flex-column" style="margin-left:10px">
                          <fs-input type="fsTextArea" v-model="formModel.listBAdditionalInformation"
                            name="listBAdditionalInformation" label="Additional information" rows="20" />
                        </div>
                      </fs-col>
                      <fs-col @click="onChangeList(LIST_SELECTED_TYPE.BC)"
                        :class="formModel.listSelected === LIST_SELECTED_TYPE.BC ? 'list-selected' : ''">
                        <div class="my-2 me-2"
                          style="margin-left:10px; border-bottom: 1px solid #A7B0BC;padding-bottom: 10px;">
                          <div>
                            <fs-input type="fsTextInput" label="Document Title" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                              !isEmpty(formModel.listCDocumentTitle) ||
                              !isEmpty(formModel.listCIssuingAuthority) ||
                              !isEmpty(formModel.listCDocumentNumber)
                            ) ? 'required' : ''" name="listCDocumentTitle"
                              v-model="formModel.listCDocumentTitle"></fs-input>
                          </div>
                          <div>
                            <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                              formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                              !isEmpty(formModel.listCDocumentTitle) ||
                              !isEmpty(formModel.listCIssuingAuthority) ||
                              !isEmpty(formModel.listCDocumentNumber)
                            ) ? 'required' : ''" name="listCIssuingAuthority"
                              v-model="formModel.listCIssuingAuthority"></fs-input>
                          </div>
                          <div class="d-flex">
                            <fs-col class="me-2">
                              <fs-input type="fsTextInput" label="Document Number" :rules="(
                                formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                                !isEmpty(formModel.listCDocumentTitle) ||
                                !isEmpty(formModel.listCIssuingAuthority) ||
                                !isEmpty(formModel.listCDocumentNumber)
                              ) ? 'required' : ''" name="listCDocumentNumber"
                                v-model="formModel.listCDocumentNumber"></fs-input>
                            </fs-col>
                            <fs-col>
                              <fs-input type="fsDateInput" v-model="formModel.listCExpirationDate"
                                name="listCExpirationDate" label="Expiration Date (if any)" />
                            </fs-col>
                          </div>
                        </div>
                      </fs-col>
                      <!-- List BC End -->
                    </div>
                  </fs-td>
                </fs-tr>
              </fs-tbody>
            </fs-table-simple>
          </div>
          <div id="listDocumentResponsive" v-else>
            <div class="selectHeader p-2">
              <div class="fw-bold">
                Select Document List
              </div>
              <div>
                <fs-input @change="handleChangeListSelect" type="fsSelect" v-model="formModel.listSelected"
                  :options="LIST_SELECTED_TYPE_RESPONSIVE" name="documentSelect" class="mb-1">
                </fs-input>
              </div>
              <div>
                <span class="fw-bold">List A</span> - Identity & Employment Authorization, or
              </div>
              <div>
                <span class="fw-bold">List B</span> - Identity and <span class="fw-bold">List C</span> - Employment
                Authorization
              </div>
            </div>
            <div v-if="formModel.listSelected == LIST_SELECTED_TYPE.A">
              <!-- List A Start -->
              <fs-col>
                <div class="my-2 me-2" style="margin-left:10px; border-bottom: 1px solid #A7B0BC;padding-bottom: 10px;">
                  <div>
                    <fs-input type="fsTextInput" label="Document Title" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.A &&
                      !isEmpty(formModel.listAFirstDocumentTitle) ||
                      !isEmpty(formModel.listAFirstIssuingAuthority) ||
                      !isEmpty(formModel.listAFirstDocumentNumber)
                    ) ? 'required' : ''" name="listAFirstDocumentTitle"
                      v-model="formModel.listAFirstDocumentTitle"></fs-input>
                  </div>
                  <div>
                    <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.A &&
                      !isEmpty(formModel.listAFirstDocumentTitle) ||
                      !isEmpty(formModel.listAFirstIssuingAuthority) ||
                      !isEmpty(formModel.listAFirstDocumentNumber)
                    ) ? 'required' : ''" name="listAFirstIssuingAuthority"
                      v-model="formModel.listAFirstIssuingAuthority"></fs-input>
                  </div>
                  <div class="d-flex">
                    <fs-col class="me-2">
                      <fs-input type="fsTextInput" label="Document Number" :rules="(
                        formModel.listSelected === LIST_SELECTED_TYPE.A &&
                        !isEmpty(formModel.listAFirstDocumentTitle) ||
                        !isEmpty(formModel.listAFirstIssuingAuthority) ||
                        !isEmpty(formModel.listAFirstDocumentNumber)
                      ) ? 'required' : ''" name="listAFirstDocumentNumber"
                        v-model="formModel.listAFirstDocumentNumber"></fs-input>
                    </fs-col>
                    <fs-col>
                      <fs-input type="fsDateInput" v-model="formModel.listAFirstExpirationDate"
                        name="listAFirstExpirationDate" label="Expiration Date (if any)" />
                    </fs-col>
                  </div>
                </div>
                <div class="my-2 me-2" style="margin-left:10px; border-bottom: 1px solid #A7B0BC;padding-bottom: 10px;">
                  <div>
                    <fs-input type="fsTextInput" label="Document Title" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.A &&
                      !isEmpty(formModel.listASecondDocumentTitle) ||
                      !isEmpty(formModel.listASecondIssuingAuthority) ||
                      !isEmpty(formModel.listASecondDocumentNumber)
                    ) ? 'required' : ''" name="listASecondDocumentTitle"
                      v-model="formModel.listASecondDocumentTitle"></fs-input>
                  </div>
                  <div>
                    <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.A &&
                      !isEmpty(formModel.listASecondDocumentTitle) ||
                      !isEmpty(formModel.listASecondIssuingAuthority) ||
                      !isEmpty(formModel.listASecondDocumentNumber)
                    ) ? 'required' : ''" name="listASecondIssuingAuthority"
                      v-model="formModel.listASecondIssuingAuthority"></fs-input>
                  </div>
                  <div class="d-flex">
                    <fs-col class="me-2">
                      <fs-input type="fsTextInput" label="Document Number" :rules="(
                        formModel.listSelected === LIST_SELECTED_TYPE.A &&
                        !isEmpty(formModel.listASecondDocumentTitle) ||
                        !isEmpty(formModel.listASecondIssuingAuthority) ||
                        !isEmpty(formModel.listASecondDocumentNumber)
                      ) ? 'required' : ''" name="listASecondDocumentNumber"
                        v-model="formModel.listASecondDocumentNumber"></fs-input>
                    </fs-col>
                    <fs-col>
                      <fs-input type="fsDateInput" v-model="formModel.listASecondExpirationDate"
                        name="listASecondExpirationDate" label="Expiration Date (if any)" />
                    </fs-col>
                  </div>
                </div>
                <div class="my-2 me-2" style="margin-left:10px">
                  <div>
                    <fs-input type="fsTextInput" label="Document Title" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.A &&
                      !isEmpty(formModel.listAThirdDocumentTitle) ||
                      !isEmpty(formModel.listAThirdIssuingAuthority) ||
                      !isEmpty(formModel.listAThirdDocumentNumber)
                    ) ? 'required' : ''" name="listAThirdDocumentTitle"
                      v-model="formModel.listAThirdDocumentTitle"></fs-input>
                  </div>
                  <div>
                    <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.A &&
                      !isEmpty(formModel.listAThirdDocumentTitle) ||
                      !isEmpty(formModel.listAThirdIssuingAuthority) ||
                      !isEmpty(formModel.listAThirdDocumentNumber)
                    ) ? 'required' : ''" name="listAThirdIssuingAuthority"
                      v-model="formModel.listAThirdIssuingAuthority"></fs-input>
                  </div>
                  <div class="d-flex">
                    <fs-col class="me-2">
                      <fs-input type="fsTextInput" label="Document Number" :rules="(
                        formModel.listSelected === LIST_SELECTED_TYPE.A &&
                        !isEmpty(formModel.listAThirdDocumentTitle) ||
                        !isEmpty(formModel.listAThirdIssuingAuthority) ||
                        !isEmpty(formModel.listAThirdDocumentNumber)
                      ) ? 'required' : ''" name="listAThirdDocumentNumber"
                        v-model="formModel.listAThirdDocumentNumber"></fs-input>
                    </fs-col>
                    <fs-col>
                      <fs-input type="fsDateInput" v-model="formModel.listAThirdExpirationDate"
                        name="listAThirdExpirationDate" label="Expiration Date (if any)" />
                    </fs-col>
                  </div>
                </div>
              </fs-col>
              <!-- List A End -->
            </div>
            <div v-if="formModel.listSelected == LIST_SELECTED_TYPE.BC">
              <!-- List BC Start -->
              <fs-col style="border-bottom: 1px solid #A7B0BC;">
                <div class="my-2 me-2" style="margin-left:10px; padding-bottom: 10px;">
                  <div class="fw-bold">List B - Identity</div>
                  <div class="pt-2">
                    <fs-input type="fsTextInput" label="Document Title" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                      !isEmpty(formModel.listBDocumentTitle) ||
                      !isEmpty(formModel.listBIssuingAuthority) ||
                      !isEmpty(formModel.listBDocumentNumber)
                    ) ? 'required' : ''" name="listBDocumentTitle" v-model="formModel.listBDocumentTitle"></fs-input>
                  </div>
                  <div>
                    <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                      !isEmpty(formModel.listBDocumentTitle) ||
                      !isEmpty(formModel.listBIssuingAuthority) ||
                      !isEmpty(formModel.listBDocumentNumber)
                    ) ? 'required' : ''" name="listBIssuingAuthority"
                      v-model="formModel.listBIssuingAuthority"></fs-input>
                  </div>
                  <div class="d-flex">
                    <fs-col class="me-2">
                      <fs-input type="fsTextInput" label="Document Number" :rules="(
                        formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                        !isEmpty(formModel.listBDocumentTitle) ||
                        !isEmpty(formModel.listBIssuingAuthority) ||
                        !isEmpty(formModel.listBDocumentNumber)
                      ) ? 'required' : ''" name="listBDocumentNumber" v-model="formModel.listBDocumentNumber"></fs-input>
                    </fs-col>
                    <fs-col>
                      <fs-input type="fsDateInput" v-model="formModel.listBExpirationDate" name="listBExpirationDate"
                        label="Expiration Date (if any)" />
                    </fs-col>
                  </div>
                </div>
                <div class="my-2 me-2 d-flex flex-column" style="margin-left:10px">
                  <fs-input type="fsTextArea" v-model="formModel.listBAdditionalInformation"
                    name="listBAdditionalInformation" label="Additional information" rows="5" />
                </div>
              </fs-col>
              <fs-col>
                <div class="my-2 me-2" style="margin-left:10px ;padding-bottom: 10px;">
                  <div class="fw-bold">
                    List C - Employment Authorization
                  </div>
                  <div class="pt-2">
                    <fs-input type="fsTextInput" label="Document Title" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                      !isEmpty(formModel.listCDocumentTitle) ||
                      !isEmpty(formModel.listCIssuingAuthority) ||
                      !isEmpty(formModel.listCDocumentNumber)
                    ) ? 'required' : ''" name="listCDocumentTitle" v-model="formModel.listCDocumentTitle"></fs-input>
                  </div>
                  <div>
                    <fs-input type="fsTextInput" label="Issuing Authority" :rules="(
                      formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                      !isEmpty(formModel.listCDocumentTitle) ||
                      !isEmpty(formModel.listCIssuingAuthority) ||
                      !isEmpty(formModel.listCDocumentNumber)
                    ) ? 'required' : ''" name="listCIssuingAuthority"
                      v-model="formModel.listCIssuingAuthority"></fs-input>
                  </div>
                  <div class="d-flex">
                    <fs-col class="me-2">
                      <fs-input type="fsTextInput" label="Document Number" :rules="(
                        formModel.listSelected === LIST_SELECTED_TYPE.BC &&
                        !isEmpty(formModel.listCDocumentTitle) ||
                        !isEmpty(formModel.listCIssuingAuthority) ||
                        !isEmpty(formModel.listCDocumentNumber)
                      ) ? 'required' : ''" name="listCDocumentNumber" v-model="formModel.listCDocumentNumber"></fs-input>
                    </fs-col>
                    <fs-col>
                      <fs-input type="fsDateInput" v-model="formModel.listCExpirationDate" name="listCExpirationDate"
                        label="Expiration Date (if any)" />
                    </fs-col>
                  </div>
                </div>
              </fs-col>
              <!-- List BC End -->
            </div>
          </div>
          <div v-if="!listValidate" class="message-error"><span class="text-danger">Field is required</span>
          </div>
          <fs-table-simple responsive bordered :class="responsive.breakpoint === 'sm' ? 'pt-3' : ''">
            <fs-thead>
              <fs-tr>
                <fs-th>Certification</fs-th>
              </fs-tr>
            </fs-thead>
            <fs-tbody>
              <fs-tr>
                <fs-td>
                  <div>
                    I attest, under penalty of perjury, that (1) I have examined the document(s) presented by the
                    above-named
                    employee, (2) the above-listed document(s) appear to be genuine and to relate to the employee named, and
                    (3) to the best of my knowledge the employee is authorized to work in the United States.
                  </div>
                  <div>
                    <div :class="responsive.breakpoint === 'sm' ? 'd-flex flex-column pt-2' : 'd-flex'"
                      style="border-bottom: 1px solid #A7B0BC; padding-bottom: 10px;">
                      <div :class="responsive.breakpoint === 'sm' ? 'd-contents' : 'align-self-center'">The employee’s first
                        day of employment <small>(mm/dd/yyyy)</small>
                      </div>
                      <div :class="responsive.breakpoint === 'sm' ? '' : 'p-4 py-0'">
                        <fs-input type="fsDateInput" v-model="formModel.employerDayOfEmployment"
                          name="employerDayOfEmployment" rules="required|date"
                          :class="responsive.breakpoint === 'sm' ? 'mb-0' : ''" />
                      </div>
                      <div :class="responsive.breakpoint === 'sm' ? '' : 'align-self-center'"><small>(see instructions for
                          exemptions)</small></div>
                    </div>
                  </div>
                  <div class="d-flex pt-2">
                    <fs-col :class="responsive.breakpoint === 'sm' ? '' : 'me-2'">
                      <label class="tax-holding-form__label">
                        <div class="label-required">
                          <div>Signature of Employer or Authorized Representative</div>
                          <div class="required">*</div>
                        </div>
                      </label>
                      <VeeField rules="required" name="employerSignature" v-model="formModel.employerSignaturePath">
                        <SignaturePad v-if="isFinishLoading" ref="signaturePad" :isNotShowTitle="true"
                          :path="formModel?.employerSignaturePath" :isUpdate="isFormChanged" :isEdit="!isEqual(omit(formModelClone, ['employerSignaturePath', 'employerSignature']),
                            omit(formModel, ['employerSignaturePath', 'employerSignature']))"
                          @clear-signature="handleClearEmpSignature" @update-path-signature="handleUpdatePathEmp"
                          @submit-signature="handleUpdatePathSignatureEmp" />
                      </VeeField>
                      <ErrorMessage class="message-error" name="employerSignature" />
                    </fs-col>
                  </div>
                  <div :class="responsive.breakpoint === 'sm' ? 'd-flex flex-column' : 'd-flex'">
                    <fs-col :cols="responsive.breakpoint === 'sm' ? '' : 3"
                      :class="responsive.breakpoint === 'sm' ? '' : 'me-2'">
                      <fs-input label="Today’s Date" type="fsTextInput" name="employerSignatureDateFormat"
                        v-model="employerSignatureDateFormat" disabled />
                    </fs-col>
                    <fs-col :cols="responsive.breakpoint === 'sm' ? '' : 3"
                      :class="responsive.breakpoint === 'sm' ? '' : 'me-2'">
                      <fs-input type="fsTextInput" name="employerSignatureTimeFormat" v-model="employerSignatureTimeFormat"
                        disabled />
                    </fs-col>
                    <fs-col>
                      <fs-input type="fsTextInput" v-model="formModel.employerTitle" name="employerTitle"
                        label="Title of Employer or Authorized Representative" rules="required" :required="true" />
                    </fs-col>
                  </div>
                  <div :class="responsive.breakpoint === 'sm' ? 'd-flex flex-column' : 'd-flex'">
                    <fs-col :class="responsive.breakpoint === 'sm' ? '' : 'me-2'">
                      <fs-input type="fsTextInput" v-model="formModel.employerLastName" name="employerLastName"
                        label="Last Name of Employer or Authorized Representative" rules="required" :required="true" />
                    </fs-col>
                    <fs-col>
                      <fs-input type="fsTextInput" v-model="formModel.employerFirstName" name="employerFirstName"
                        label="First Name of Employer or Authorized Representative" rules="required" :required="true" />
                    </fs-col>
                  </div>
                  <div>
                    <fs-input type="fsTextInput" v-model="formModel.employerBusinessOrganizeName"
                      name="employerBusinessOrganizeName" label="Employer’s Business or Organization Name" rules="required"
                      :required="true" />
                  </div>
                  <div :class="responsive.breakpoint === 'sm' ? 'd-flex flex-column' : 'd-flex'">
                    <fs-col :class="responsive.breakpoint === 'sm' ? '' : 'me-2'"
                      :cols="responsive.breakpoint === 'sm' ? '' : 7">
                      <fs-input type="fsTextInput" v-model="formModel.employerBusinessOrganizeAddress"
                        name="employerBusinessOrganizeAddress"
                        label="Employer’s Business or Organization Address (Street Number and Name)" rules="required"
                        :required="true" />
                    </fs-col>
                    <fs-col :class="responsive.breakpoint === 'sm' ? '' : 'me-2'"
                      :cols="responsive.breakpoint === 'sm' ? '' : 2">
                      <fs-input type="fsTextInput" v-model="formModel.employerCityOrTown" name="employerCityOrTown"
                        label="City or Town" rules="required" :required="true" />
                    </fs-col>
                    <fs-col :class="responsive.breakpoint === 'sm' ? '' : 'me-2'">
                      <fs-input @change="handleChangeState" type="fsSelect" label="State" id="employerState"
                        labelId="employerStateId" v-model="formModel.employerState" :options="STATES"
                        name="employeeCitizenStatus" textField="value" :required="true">
                      </fs-input>
                    </fs-col>
                    <fs-col>
                      <fs-input type="fsTextInput" v-model="formModel.employerZipCode" name="employerZipCode"
                        label="Zip Code" rules="required" :maxlength="5" :required="true" />
                    </fs-col>
                  </div>
                </fs-td>
              </fs-tr>
            </fs-tbody>
          </fs-table-simple>
          <div>
            <div class="section-text fw-bold">
              Section 3. Reverification and Rehires
            </div>
          </div>
          <div v-if="responsive.breakpoint !== 'sm'">
            <fs-table-simple responsive bordered class="thead-gray">
              <fs-thead>
                <fs-tr>
                  <fs-th>A. New Name (if applicable)</fs-th>
                  <fs-th>B. Date of Rehire (if applicable)</fs-th>
                </fs-tr>
              </fs-thead>
              <fs-tbody>
                <fs-tr>
                  <fs-td>
                    <div class="d-flex">
                      <fs-col class="me-2">
                        <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresFirstName"
                          name="reverificationRehiresFirstName" label="First Name" />
                      </fs-col>
                      <fs-col cols="1" class="me-2">
                        <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresMI"
                          name="reverificationRehiresMI" label="M.I" :maxlength="1" />
                      </fs-col>
                      <fs-col>
                        <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresLastName"
                          name="reverificationRehiresLastName" label="Last Name" />
                      </fs-col>
                    </div>
                  </fs-td>
                  <fs-td>
                    <fs-col>
                      <fs-input type="fsDateInput" v-model="formModel.reverificationRehiresDateHire"
                        name="reverificationRehiresDateHire" label="Date" />
                    </fs-col>
                  </fs-td>
                </fs-tr>
              </fs-tbody>
            </fs-table-simple>
            <fs-table-simple responsive bordered class="thead-gray">
              <fs-thead>
                <fs-tr>
                  <fs-th>
                    C. If the employee's previous grant of employment authorization has expired, provide the information for
                    the
                    document or receipt that establishes continuing employment authorization in the space provided below.
                  </fs-th>
                </fs-tr>
              </fs-thead>
              <fs-tbody>
                <fs-tr>
                  <fs-td>
                    <div class="d-flex">
                      <fs-col class="me-2">
                        <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresDocumentTitle"
                          name="reverificationRehiresDocumentTitle" label="Document Title" />
                      </fs-col>
                      <fs-col cols="3" class="me-2">
                        <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresDocumentNumber"
                          name="reverificationRehiresDocumentNumber" label="Document Number" />
                      </fs-col>
                      <fs-col>
                        <fs-input type="fsDateInput" v-model="formModel.reverificationRehiresExpDate"
                          name="reverificationRehiresExpDate" label="Expiration Date (if any)" />
                      </fs-col>
                    </div>
                  </fs-td>
                </fs-tr>
              </fs-tbody>
            </fs-table-simple>
            <fs-table-simple responsive bordered>
              <fs-thead>
                <fs-tr>
                  <fs-th>I attest, under penalty of perjury, that to the best of my knowledge, this employee is authorized
                    to
                    work in the United States, and if the employee presented document(s), the document(s) I have examined
                    appear to be genuine and to relate to the individual.</fs-th>
                </fs-tr>
              </fs-thead>
              <fs-tbody>
                <fs-tr>
                  <fs-td>
                    <div>
                      <fs-col class="me-2">
                        <label class="tax-holding-form__label">
                          <div class="label-required">
                            <div>Signature of Employer or Authorized Representative</div>
                          </div>
                        </label>
                        <VeeField class="form-control fancy__input mb-0 w-100" name="reverificationRehiresSignature"
                          disabled placeholder="Click here to sign" v-model="formModel.reverificationRehiresSignaturePath">
                          <SignaturePad v-if="isFinishLoading" :path="formModel?.reverificationRehiresSignaturePath"
                            :isNotShowTitle="true" @clear-signature="handleClearReverificationRehiresSignature"
                            @update-path-signature="handleUpdatePathReverificationRehires"
                            @submit-signature="handleUpdatePathSignatureReverificationRehires" />
                        </VeeField>
                      </fs-col>
                    </div>
                    <div class="d-flex">
                      <fs-col cols="3" class="me-2">
                        <fs-input label="Today’s Date" type="fsTextInput" name="reverificationRehiresSignatureDate"
                          v-model="reverificationRehiresSignatureDate" disabled />
                      </fs-col>
                      <fs-col cols="3" class="me-2">
                        <fs-input type="fsTextInput" name="reverificationRehiresSignatureTime"
                          v-model="reverificationRehiresSignatureTime" disabled />
                      </fs-col>
                      <fs-col>
                        <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresName"
                          name="reverificationRehiresName" label="Name of Employer or Authorized Representative" />
                      </fs-col>
                    </div>
                  </fs-td>
                </fs-tr>
              </fs-tbody>
            </fs-table-simple>
          </div>
          <div v-else>
            <fs-table-simple responsive bordered class="thead-gray">
              <fs-thead>
                <fs-tr>
                  <fs-th>A. New Name (if applicable)</fs-th>
                </fs-tr>
              </fs-thead>
              <fs-tbody>
                <fs-tr class="d-grid">
                  <fs-td>
                    <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresFirstName"
                      name="reverificationRehiresFirstName" label="First Name" />
                  </fs-td>
                  <fs-td>
                    <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresMI" name="reverificationRehiresMI"
                      label="M.I" :maxlength="1" />
                  </fs-td>
                  <fs-td>
                    <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresLastName"
                      name="reverificationRehiresLastName" label="Last Name" />
                  </fs-td>
                </fs-tr>
              </fs-tbody>
            </fs-table-simple>
            <fs-table-simple responsive bordered class="thead-gray">
              <fs-thead>
                <fs-tr>
                  <fs-th>B. Date of Rehire (if applicable)</fs-th>
                </fs-tr>
              </fs-thead>
              <fs-tbody>
                <fs-tr>
                  <fs-td>
                    <fs-col>
                      <fs-input type="fsDateInput" v-model="formModel.reverificationRehiresDateHire"
                        name="reverificationRehiresDateHire" label="Date" />
                    </fs-col>
                  </fs-td>
                </fs-tr>
              </fs-tbody>
            </fs-table-simple>
            <fs-table-simple responsive bordered class="thead-gray">
              <fs-thead>
                <fs-tr>
                  <fs-th>
                    C. If the employee's previous grant of employment authorization has expired, provide the information for
                    the
                    document or receipt that establishes continuing employment authorization in the space provided below.
                  </fs-th>
                </fs-tr>
              </fs-thead>
              <fs-tbody>
                <fs-tr class="d-grid">
                  <fs-td>
                    <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresDocumentTitle"
                      name="reverificationRehiresDocumentTitle" label="Document Title" />
                  </fs-td>
                  <fs-td>
                    <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresDocumentNumber"
                      name="reverificationRehiresDocumentNumber" label="Document Number" />
                  </fs-td>
                  <fs-td>
                    <fs-input type="fsDateInput" v-model="formModel.reverificationRehiresExpDate"
                      name="reverificationRehiresExpDate" label="Expiration Date (if any)" />
                  </fs-td>
                </fs-tr>
              </fs-tbody>
            </fs-table-simple>
            <fs-table-simple responsive bordered>
              <fs-thead>
                <fs-tr>
                  <fs-th class="fw-normal">I attest, under penalty of perjury, that to the best of my knowledge, this
                    employee is authorized
                    to
                    work in the United States, and if the employee presented document(s), the document(s) I have examined
                    appear to be genuine and to relate to the individual.</fs-th>
                </fs-tr>
              </fs-thead>
              <fs-tbody>
                <fs-tr>
                  <fs-td>
                    <div>
                      <fs-col>
                        <label class="tax-holding-form__label">
                          <div class="label-required">
                            <div>Signature of Employer or Authorized Representative</div>
                          </div>
                        </label>
                        <VeeField class="form-control fancy__input mb-0 w-100" name="reverificationRehiresSignature"
                          disabled placeholder="Click here to sign" v-model="formModel.reverificationRehiresSignaturePath">
                          <SignaturePad v-if="isFinishLoading" :path="formModel?.reverificationRehiresSignaturePath"
                            :isNotShowTitle="true" @clear-signature="handleClearReverificationRehiresSignature"
                            @update-path-signature="handleUpdatePathReverificationRehires"
                            @submit-signature="handleUpdatePathSignatureReverificationRehires" />
                        </VeeField>
                      </fs-col>
                    </div>
                    <div class="d-flex flex-column">
                      <fs-col class="d-flex gap-3">
                        <fs-input label="Today’s Date" type="fsTextInput" name="reverificationRehiresSignatureDate"
                          v-model="reverificationRehiresSignatureDate" disabled />
                        <fs-input type="fsTextInput" name="reverificationRehiresSignatureTime"
                          v-model="reverificationRehiresSignatureTime" disabled />
                      </fs-col>
                      <fs-col>
                        <fs-input type="fsTextInput" v-model="formModel.reverificationRehiresName"
                          name="reverificationRehiresName" label="Name of Employer or Authorized Representative" />
                      </fs-col>
                    </div>
                  </fs-td>
                </fs-tr>
              </fs-tbody>
            </fs-table-simple>
          </div>          
        </fs-container>

      </VeeForm>
      <!--  Modal On Leave Route -->
      <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved Changes" okText="YES, LEAVE"
        okTextVariant="danger" cancelText="stay" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
        @ok="handleDiscardOnRouteChange">
        <template #content>
          <span class="d-flex">
            <font-awesome-icon :class="['me-2', 'text-danger']" :icon="faCircleExclamation" size="lg" />
            <h5>
              Are you sure you want to leave this page?
              <br />
              You have unsaved changes, your data will be lost.
            </h5>
          </span>
        </template>
      </dark-theme-modal>
  </div>
</template>
<style scoped lang="scss">
#form-i9-employer {
  .d-contents {
    display: contents;
  }

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

  .section-text {
    color: #03A9F4;
    font-size: 16px;
    border-bottom: 0.1px solid #EDF0F4;
  }

  :deep(table) {
    tbody {
      .fs-input__form-group {
        padding: 20px 0px 12px 0px;
      }
    }
  }

  .thead-gray {
    thead {
      background: #EDF0F4;
    }
  }

  .list-selected {
    background-color: #E9ECEF;
  }

  :deep(select#employeeCitizenStatus) {
    min-height: 40px;
  }

  :deep(select#employerState) {
    min-height: 40px;
  }

  #listDocumentResponsive {
    border: 1px solid #dee2e6;

    .selectHeader {
      background: #E9ECEF
    }
  }
}
</style>
