<script lang="ts" setup>
import { faChevronDown, faXmark, faCircleExclamation, faArrowDownToLine } from "@fortawesome/pro-solid-svg-icons";
import { faCircleExclamation as faCircleExclamationLight, faXmark as faXmarkLight } from '@fortawesome/pro-light-svg-icons';
import { faCircleCheck } from "@fortawesome/pro-regular-svg-icons";
import { faUser, faUserTie, faAddressBook, faHandHoldingDollar, faMoneyBillTransfer, faPiggyBank, faFileSignature, faFileLines, faSun, faEnvelope, faDownload } from "@fortawesome/pro-light-svg-icons";
import { faArrowDown } from '@fortawesome/pro-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { storeToRefs } from "pinia";
import { ref, onMounted, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useLoadingStore } from "@/stores/loadingStore";
import reviewPersonalInfo from "@/components/viewComponents/onboarding/onboardingReview/reviewPersonalInfo.vue";
import reviewContact from "@/components/viewComponents/onboarding/onboardingReview/reviewContact.vue";
import reviewDirectDeposit from "@/components/viewComponents/onboarding/onboardingReview/reviewDirectDeposit.vue";
import reviewTaxWithholding from "@/components/viewComponents/onboarding/onboardingReview/reviewTaxWithholding.vue";
import reviewFormI9 from "@/components/viewComponents/onboarding/onboardingReview/reviewFormI9.vue";
import reviewFormEEO from "@/components/viewComponents/onboarding/onboardingReview/reviewFormEEO.vue";
import reviewFormVEVRAA from "@/components/viewComponents/onboarding/onboardingReview/reviewFormVEVRAA.vue";
import reviewFormWOTC from "@/components/viewComponents/onboarding/onboardingReview/reviewFormWOTC.vue";
import reviewEmploymentInformation from "@/components/viewComponents/onboarding/onboardingReview/reviewEmploymentInformation.vue";
import reviewTaxWithholdingInfoHR from "@/components/viewComponents/onboarding/onboardingReview/reviewTaxWithholdingInfoHR.vue";
import reviewVacationPlan from "@/components/viewComponents/onboarding/onboardingReview/reviewVacationPlan.vue";
import reviewPayrollInformation from "@/components/viewComponents/onboarding/onboardingReview/reviewPayrollInformation.vue";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useEmployeeStore } from '@/stores/employeeStore';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import SuccessConfettiJSON from '@/data/SuccessConfetti.json';
import { OnboardingSummariesUrl } from "@/enums/OnboardingSummariesUrl";
import OnboardingSummary from "@/models/onboarding/OnboardingSummary";
import { useOnboardingFinalReviewStore } from '@/stores/onboardingReviewInfoStore';
import { DownloadReviewPDFPayload } from '@/models/onboarding/OnboardingFinalReview';
import { useAlerts } from '@/composables/useAlerts';
import { useOnboardingDirectDepositStore } from "@/stores/onboardingDirectDepositStore";
import { useOnboardingEmployeeInformationStore } from "@/stores/onboardingEmployeeInformationStore";
import { useBreakpoints } from "@/composables/useBreakpoints";

library.add(faArrowDown, faDownload, faXmarkLight, faCircleExclamationLight, faChevronDown, faUserTie, faCircleCheck, faPiggyBank, faXmark, faUser, faAddressBook, faHandHoldingDollar, faMoneyBillTransfer, faFileSignature, faEnvelope, faArrowDownToLine, faCircleExclamation, faFileLines, faSun);
const { responsive } = useBreakpoints();

const isCompletedEmployee = ref(false);
const { setLoading } = useLoadingStore();
const router = useRouter();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { getOnboardingPaymentMethodSetting } =
  useOnboardingDirectDepositStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const { updateOnboardingInformations, completeOnboarding } = useOnboardingEmployeeInformationStore();
const { fetchEmployeeDetails, updateEmployeeStatusId, } = useEmployeeStore();
const { downloadFinalReview, changePressComplete } = useOnboardingFinalReviewStore();
const employeeId = router.currentRoute.value.params.id;

const openSubmitModal = ref(false);
const openRequiredModal = ref(false);
const requiredModal = ref(null);
const openCongratulationsModal = ref(false);
const downloadReviewType = ref(null);
const showCompleteOnboardingButton = ref(true);

const requiredFormList = [OnboardingSummariesUrl.onboardingPersonalInformation, OnboardingSummariesUrl.onboardingContacts, OnboardingSummariesUrl.onboardingDirectDeposit, OnboardingSummariesUrl.onboardingFormW4, OnboardingSummariesUrl.onboardingFormI9, OnboardingSummariesUrl.onboardingTaxWithHoldingInfoHR, OnboardingSummariesUrl.onboardingVacation, OnboardingSummariesUrl.onboardingEmploymentInformation, OnboardingSummariesUrl.onboardingPayrollInformation];
const optionalFormList = [OnboardingSummariesUrl.onboardingEEOSelfIdentification, OnboardingSummariesUrl.onboardingVEVRAASelfIdentification, OnboardingSummariesUrl.onboardingWOTC];
const incompletedRequiredFormList = ref([]);
const incompletedOptionalFormList = ref([]);
const { notifyError, notifySuccess } = useAlerts();

interface Form {
  id: string,
  name: string,
}

const formList: Form[] = [
  {
    id: OnboardingSummariesUrl.onboardingPersonalInformation,
    name: 'Personal Information'
  },
  {
    id: OnboardingSummariesUrl.onboardingContacts,
    name: 'Contacts'
  },
  {
    id: OnboardingSummariesUrl.onboardingDirectDeposit,
    name: 'Direct Deposit'
  },
  {
    id: OnboardingSummariesUrl.onboardingFormW4,
    name: 'Form W-4'
  },
  {
    id: OnboardingSummariesUrl.onboardingFormI9,
    name: 'Form I-9'
  },
  {
    id: OnboardingSummariesUrl.onboardingEEOSelfIdentification,
    name: 'EEO Self-Identification'
  },
  {
    id: OnboardingSummariesUrl.onboardingVEVRAASelfIdentification,
    name: 'VEVRAA Self-Identification'
  },
  {
    id: OnboardingSummariesUrl.onboardingWOTC,
    name: 'WOTC'
  },
  {
    id: OnboardingSummariesUrl.onboardingTaxWithHoldingInfoHR,
    name: 'Tax Withholding Info'
  },
  {
    id: OnboardingSummariesUrl.onboardingVacation,
    name: 'Vacation Plan'
  },
  {
    id: OnboardingSummariesUrl.onboardingEmploymentInformation,
    name: 'Employment Information'
  },
  {
    id: OnboardingSummariesUrl.onboardingPayrollInformation,
    name: 'Payroll Information'
  }
];

const sectionTypes = {
  employeeInformation: 'employeeInformation',
  federalReporting: 'federalReporting',
  employerInformation: 'employerInformation'
}

const employeeInformationSections = ref([
  {
    id: "personalInformation",
    name: "Personal Information",
    component: reviewPersonalInfo,
    icon: ['fal', 'user'],
    iconColor: '#425AFB',
    type: sectionTypes.employeeInformation
  },
  {
    id: 'contacts',
    name: "Contacts",
    component: reviewContact,
    icon: ['fal', 'address-book'],
    iconColor: '#0376F2',
    type: sectionTypes.employeeInformation
  },
  {
    id: 'directDeposit',
    name: "Direct Deposit",
    component: reviewDirectDeposit,
    icon: ['fal', 'hand-holding-dollar'],
    iconColor: '#A03AFF',
    type: sectionTypes.employeeInformation
  },
  {
    id: 'formW4',
    name: 'Form W-4',
    component: reviewTaxWithholding,
    icon: ['fal', 'money-bill-transfer'],
    iconColor: '#C43D97',
    type: sectionTypes.employeeInformation
  }
]);

const federalReportingSections = ref([
  {
    id: 'formI9',
    name: "Form I-9",
    component: reviewFormI9,
    icon: ['fal', 'file-signature'],
    iconColor: '#FF5094',
    type: sectionTypes.federalReporting
  },
  {
    id: 'eeo',
    name: "EEO Self-Identification",
    component: reviewFormEEO,
    icon: ['fal', 'file-signature'],
    iconColor: '#F63057',
    type: sectionTypes.federalReporting
  },
  {
    id: 'vevraa',
    name: "VEVRAA Self-Identification",
    component: reviewFormVEVRAA,
    icon: ['fal', 'file-signature'],
    iconColor: '#FF6600',
    type: sectionTypes.federalReporting
  },
  {
    id: 'wotc',
    name: "WOTC",
    component: reviewFormWOTC,
    icon: ['fal', 'file-signature'],
    iconColor: '#F79F1F',
    type: sectionTypes.federalReporting
  },
]);

const employerInformationSections = ref([
  {
    id: 'taxWithholdingInfoHR',
    name: "Tax Withholding Info",
    component: reviewTaxWithholdingInfoHR,
    icon: ['fal', 'file-lines'],
    iconColor: '#27CA37',
    type: sectionTypes.employerInformation
  },
  {
    id: 'vacationPlan',
    name: "Vacation Plan",
    component: reviewVacationPlan,
    icon: ['fal', 'sun'],
    iconColor: '#12CBC4',
    type: sectionTypes.employerInformation
  },
  {
    id: 'employmentInformation',
    name: "Employment Information",
    component: reviewEmploymentInformation,
    icon: ['fal', 'user-tie'],
    iconColor: '#039BB1',
    type: sectionTypes.employerInformation
  },
  {
    id: 'payrollInformation',
    name: "Payroll Information",
    component: reviewPayrollInformation,
    icon: ['fal', 'piggy-bank'],
    iconColor: '#582D80',
    type: sectionTypes.employerInformation
  },
]);

const activeTabId = ref('')
const lottieContainer = ref(null);

const handleDownloadFinalReview = async () => {
  setLoading(true);
  try {
    const downloadPayload: DownloadReviewPDFPayload = {
      employeeId: Number(employeeId),
      filename: `${employeeDetails.value.fullName} Onboarding Information`,
      type: downloadReviewType.value as number
    };
    await downloadFinalReview(downloadPayload);
  } catch (error) {
    notifyError('There was an error when download final review PDF');
  } finally {
    setLoading(false);
  }
}

onBeforeMount(async () => {
  const paymentMethodSetting = await getOnboardingPaymentMethodSetting() as { isDirectDeposit: boolean, isPaperCheck: boolean };
  const isDirectDepositEnable = paymentMethodSetting.isDirectDeposit;
  if (!isDirectDepositEnable) {
    employeeInformationSections.value = employeeInformationSections.value.filter((item) => item.id !== 'directDeposit')
  }
})

watch(() => openCongratulationsModal.value, () => {
  if (openCongratulationsModal.value) {
    if (lottieContainer.value) {
      lottieContainer.value.play()
    }
  }
})

onMounted(async () => {
  setLoading(true);
  try {
    await fetchEmployeeDetails(Number(employeeId));
    if (employeeDetails.value.employeeStatusId === EmployeeStatusEnum.Onboard) {
      downloadReviewType.value = 2;
    } else if (employeeDetails.value.employeeStatusId === EmployeeStatusEnum.QuickHire) {
      downloadReviewType.value = 3;
    }

    if (employeeDetails.value.employeeStatusId === EmployeeStatusEnum.PendingOnboard || employeeDetails.value.employeeStatusId === EmployeeStatusEnum.PendingQuickhire) {
      isCompletedEmployee.value = true;
    }
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
    const personalInfoTab = document.getElementById("personalInformation-0")
    personalInfoTab.click();
  }
});

const handleToggleTab = (cardId: string) => {
  if (activeTabId.value === cardId) {
    activeTabId.value = ''
  } else {
    activeTabId.value = cardId
  }
}

const getSections = (data: OnboardingSummary[], urls: string[]): OnboardingSummary[] => {
  return data.filter((section) => {
    return urls.includes(section.progressSidebarUrl) && !section.isHRDone;
  });
}

const getMatchingNames = (arr1: Form[], arr2: OnboardingSummary[]) => {
  const matchingNames = arr1.reduce((result, item1) => {
    const matchingItem = arr2.find(item2 => item1.id === item2.progressSidebarUrl);
    if (matchingItem) {
      result.push({ name: matchingItem.progressSidebarName, url: matchingItem.progressSidebarUrl });
    }
    return result;
  }, []);

  return matchingNames;
}

const handleCompleteOnboarding = () => {
  const incompletedRequiredSections = getSections(onboardingSideNavItem.value, requiredFormList);
  const incompletedOptionalSections = getSections(onboardingSideNavItem.value, optionalFormList);

  incompletedRequiredFormList.value = getMatchingNames(formList, incompletedRequiredSections);
  incompletedOptionalFormList.value = getMatchingNames(formList, incompletedOptionalSections);
  changePressComplete(true);
  if (incompletedRequiredFormList.value.length > 0) {
    openRequiredModal.value = true
  } else {
    openSubmitModal.value = true;
  }
}

const handleSubmitOnboardingConfirmation = async () => {
  setLoading(true);
  try {
    await completeOnboarding(Number(employeeId));

    await updateOnboardingInformations(Number(employeeId), {
      onboardingCompletedUTC: new Date().toISOString()
    });

    openSubmitModal.value = false;
    showCompleteOnboardingButton.value = false;
    // SHOW CONGRATULATIONS MODAL
    openCongratulationsModal.value = true;
  } catch (error) {
    console.error(error);
    notifyError('There was an error submitting new employee data to Foundation');
  } finally {
    setLoading(false);
  }
}

const getPageName = (employeeStatusId: number) => {
  if (employeeStatusId === EmployeeStatusEnum.Onboard) {
    return 'Onboards';
  } else if (employeeStatusId === EmployeeStatusEnum.QuickHire) {
    return 'Quick Hires';
  }
}

const handleBackToPage = () => {
  if (employeeDetails.value.employeeStatusId === EmployeeStatusEnum.Onboard) {
    router.push({ name: 'onboarding' })
  } else if (employeeDetails.value.employeeStatusId === EmployeeStatusEnum.QuickHire) {
    router.push({ name: 'onboarding' })
  }
}
</script>

<template>
  <fs-container fluid ref="container" class="p-0">
    <fs-container  fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
      <fs-row align-v="center">
        <fs-col class="truncate-text">
          <h2 class="hq-pg__title">Final Review</h2>
        </fs-col>
        <fs-col cols="auto" class="ms-auto">
          <fs-button variant="outline-primary" >
          <a style="all: unset" :href="'mailto:' + employeeDetails.email">
            <font-awesome-icon :icon="['fal', 'envelope']" />
            EMAIL {{ employeeDetails.firstName }}
          </a>
        </fs-button>
        <fs-button variant="outline-primary" @click="handleDownloadFinalReview">
          <font-awesome-icon :icon="['fal', 'download']" />
          DOWNLOAD
        </fs-button>
        <fs-button variant="primary" @click="handleCompleteOnboarding" v-if="showCompleteOnboardingButton && !isCompletedEmployee">SUBMIT ONBOARDING</fs-button>
        </fs-col>
      </fs-row>  
    </fs-container>
    <div class="p-4 bg-grey--000">
      <section class="mb-3">
        <div class="list-title">Employee Information</div>
        <div class="accordion" role="tablist">
          <fs-card v-for="card, index in employeeInformationSections" :key="card.id" no-body class="mb-2">
            <fs-card-header header-tag="header" @click="handleToggleTab(card.id)">
              <fs-button v-fs-toggle="card.id" class="p-3 card-title-button d-flex justify-content-between w-100"
                :id="`${card.id}-${index}`">
                <div class="d-flex gap-3 align-items-center">
                  <font-awesome-icon :icon="card.icon" :style="{ color: card.iconColor }" class="fz-20px" />
                  <span class="card-name">
                    {{ card.name }}
                  </span>
                </div>
                <div>
                  <font-awesome-icon v-if="activeTabId !== card.id" :icon="['fas', 'chevron-down']"
                    class="text-success fz-20px" />
                  <font-awesome-icon v-if="activeTabId === card.id" :icon="['fas', 'chevron-up']"
                    class="text-success fz-20px" />
                </div>
              </fs-button>
            </fs-card-header>
            <fs-collapse :id="card.id" :visible="activeTabId === card.id" accordion="my-accordion" role="tabpanel">
              <fs-card-body>
                <component :is="card.component" v-if="activeTabId === card.id" />
              </fs-card-body>
            </fs-collapse>
          </fs-card>
        </div>
      </section>

      <section class="mb-3">
        <div class="list-title">Federal Reporting</div>
        <div class="accordion" role="tablist">
          <fs-card v-for="card in federalReportingSections" :key="card.id" no-body class="mb-2">
            <fs-card-header header-tag="header" class="p-1" role="tab" @click="handleToggleTab(card.id)">
              <fs-button v-fs-toggle="card.id" class="p-3 card-title-button w-100 d-flex justify-content-between">
                <div class="d-flex gap-3 align-items-center">
                  <font-awesome-icon :icon="card.icon" :style="{ color: card.iconColor }" class="fz-20px" />
                  <span class="card-name">
                    {{ card.name }}
                  </span>
                </div>
                <div>
                  <font-awesome-icon v-if="activeTabId !== card.id" :icon="['fas', 'chevron-down']"
                    class="text-success fz-20px" />
                  <font-awesome-icon v-if="activeTabId === card.id" :icon="['fas', 'chevron-up']"
                    class="text-success fz-20px" />
                </div>
              </fs-button>
            </fs-card-header>
            <fs-collapse :id="card.id" :visible="activeTabId === card.id" accordion="my-accordion" role="tabpanel">
              <fs-card-body>
                <component :is="card.component" v-if="activeTabId === card.id" />
              </fs-card-body>
            </fs-collapse>
          </fs-card>
        </div>
      </section>

      <section class="mb-3">
        <div class="list-title">Employer Information</div>
        <div class="accordion" role="tablist">
          <fs-card v-for="card in employerInformationSections" :key="card.id" no-body class="mb-2">
            <fs-card-header header-tag="header" class="p-1" role="tab" @click="handleToggleTab(card.id)">
              <fs-button v-fs-toggle="card.id" class="p-3 card-title-button w-100 d-flex justify-content-between">
                <div class="d-flex gap-3 align-items-center">
                  <font-awesome-icon :icon="card.icon" :style="{ color: card.iconColor }" class="fz-20px" />
                  <span class="card-name">
                    {{ card.name }}
                  </span>
                </div>
                <div>
                  <font-awesome-icon v-if="activeTabId !== card.id" :icon="['fas', 'chevron-down']"
                    class="text-success fz-20px" />
                  <font-awesome-icon v-if="activeTabId === card.id" :icon="['fas', 'chevron-up']"
                    class="text-success fz-20px" />
                </div>
              </fs-button>
            </fs-card-header>
            <fs-collapse :id="card.id" :visible="activeTabId === card.id" accordion="my-accordion" role="tabpanel">
              <fs-card-body>
                <component :is="card.component" v-if="activeTabId === card.id" />
              </fs-card-body>
            </fs-collapse>
          </fs-card>
        </div>
      </section>
    </div>
  </fs-container>
  <dark-theme-modal :show-modal="openSubmitModal" title="Submit Onboarding Confirmation" okText="SUBMIT ONBOARDING"
    okTextVariant="success" cancelText="CANCEL" cancelBtnVariant="light" @close="openSubmitModal = false"
    @ok="handleSubmitOnboardingConfirmation">
    <template #content>
      <span class="d-flex py-3">
        <font-awesome-icon :class="['me-2', 'text-warning']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
        <div v-if="incompletedRequiredFormList.length > 0">
          <strong>{{ employeeDetails.fullName }}</strong>'s Onboarding is missing some <span
            class="text-danger">required</span>
          information:
          <br />
          <ul>
            <li v-for="form in incompletedRequiredFormList" :key="form">
              {{ form }}
            </li>
          </ul>
          Are you sure you want to complete onboarding? Please note that you will no longer be able to make modifications
          to <strong>{{ employeeDetails.fullName }}</strong>'s Onboarding Information, but you will be able to update
          their
          Employee
          Profile in Workforce HQ.
        </div>

        <div v-if="incompletedOptionalFormList.length > 0">
          <strong>{{ employeeDetails.fullName }}</strong>'s Onboarding is missing some optional information:
          <br />
          <ul>
            <li v-for="form in incompletedOptionalFormList" :key="form">
              {{ form.name }}
            </li>
          </ul>
          Are you sure you want to complete onboarding? Please note that you will no longer be able to make modifications
          to <strong>{{ employeeDetails.fullName }}</strong>'s Onboarding Information, but you will be able to update
          their Employee
          Profile in Workforce HQ.
        </div>

        <div v-else>
          <div>Complete Onboarding?</div>
          <div>Please note that you will no longer be able to make modifications to <strong>{{ employeeDetails.fullName
          }}</strong>'s Onboarding Information, but you will be able to update their Employee Profile in WorkforceHQ.
          </div>
        </div>
      </span>
    </template>
  </dark-theme-modal>

  <fs-modal ref="requiredModal" class="require-modal" hide-header hide-footer centered v-model="openRequiredModal">
    <fs-button class="require-modal_closebtn" @click="openRequiredModal = false">
      <font-awesome-icon :icon="['fal', 'xmark']" size="lg" />
    </fs-button>
    <div class="d-flex justify-content-center mb-2">
      <font-awesome-icon :icon="['fal', 'circle-exclamation']" class="text-task-orange" size="3x" />
    </div>

    <div class="require-modal_title">Missing Information</div>
    <div><strong>{{ employeeDetails.fullName }}</strong>'s Onboarding is missing some <span
        class="text-danger">required</span>
      information:</div>
    <ul>
      <fs-link v-for="form in incompletedRequiredFormList" :key="form.name" :to="{ name: form.url }">
        <li>
          {{ form.name }}
        </li>
      </fs-link>
    </ul>
    <div>
      Please finish this information above to complete <strong>{{ employeeDetails.fullName }}</strong>'s Onboarding
      Information.
    </div>
  </fs-modal>

  <fs-modal class="congratulations-modal" hide-header hide-footer centered v-model="openCongratulationsModal" size="lg">
    <vue3-lottie :animation-data="SuccessConfettiJSON" class="congratulations-modal_confetti" ref="lottieContainer" :loop="false" :autoPlay="false">
      
    </vue3-lottie>
      <fs-button class="congratulations-modal_closebtn" @click="openCongratulationsModal = false">
        <font-awesome-icon :icon="['fal', 'xmark']" size="lg" />
    </fs-button>
    <div class="p-4">
      <div class="d-flex justify-content-center mb-2">
        <font-awesome-icon :icon="['fal', 'circle-check']" class="text-success" size="4x" />
      </div>
      
      <div class="congratulations-modal_title my-4" style="font-size: 20px">CONGRATULATIONS!</div>
      <div class="text-center mb-4" style="font-size: 16px">
        <span>
          {{ employeeDetails.fullName }}'s onboarding information has been submitted successfully.
        </span>
        <span>
            If there are any issues you will receive a notification from Foundation.
          </span>
      </div>
      <div class="d-flex gap-2 align-items-center justify-content-center">
        <fs-button variant="outline-primary" @click="router.push({ name: 'onboardingDetail' })">Back to Summary</fs-button>
        <fs-button variant="primary" @click="handleBackToPage()">Back to {{ getPageName(employeeDetails.employeeStatusId)
        }}</fs-button>
      </div>
    </div>
  </fs-modal>
</template>

<style lang="scss" scoped>
.list-title {
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: #6E7C8F;
}

:deep(.card-header) {
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0 !important;

  &:hover {
    background-color: #eeeeee;
  }
}

:deep(.card-title) {
  margin-bottom: 0;
}

.card-title-button {
  background-color: transparent;
  border: none;
  color: inherit;
  padding: 0;
  margin: 0;

  &:focus,
  &:active,
  &:hover &:focus-visible {
    outline: none;
    border: none;
    box-shadow: none;
  }
}

.card-name {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  margin-left: 0;
  text-transform: capitalize;
}

.require-modal,
.congratulations-modal {
  position: relative;
  padding: 20px;

  &_title {
    text-align: center;
    margin-bottom: 12px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 16px;
  }

  &_closebtn {
    position: absolute;
    right: 10px;
    top: 10px;
    background: none;
    border: none;
    color: #15181C;
    cursor: pointer;
  }

  &_confetti {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
  }
}

.download-btn {
  a:hover {
    color: unset
  }
}

.header {
  height: 80px;
  border-bottom: 1px solid #e1e4e8;
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 10;
}

.fz-20px {
  font-size: 20px;
}
</style>