<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import circleListCheck from '@/assets/images/circle-list-check.svg';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck, faChevronUp, faChevronDown, faCircleXmark } from '@fortawesome/pro-solid-svg-icons'
import { faMemoCircleCheck, faSquareChevronDown, faSquareChevronUp } from '@fortawesome/pro-light-svg-icons';
import hrOnboardingTasks from '@/components/viewComponents/onboarding/hrOnboardingTasks.vue'
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useBreakpoints } from "../../composables/useBreakpoints";
import { useAttrs } from 'vue';
import { useEmployeeStore } from "@/stores/employeeStore";
import { useLoadingStore } from '@/stores/loadingStore';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { useOnboardingDirectDepositStore } from '@/stores/onboardingDirectDepositStore';
import { employeeStatusBadgeRenderer } from '@/components/shared/bryntumGrid/customCells/employeeStatusBadge';
import { useOnboardingEmployeeWithholdingCertificateStore } from '@/stores/onboardingEmployeeWithholdingCertificateStore';
import { FormField } from '@/enums/FormField';
import { useOnboardingHrWOTCStore } from '@/stores/WOTC/onboardingHrWOTCStore';
import { useOnboardingFormINineStore } from '@/stores/onboardingFormI9Store';
import { useOnboardingWOTC8850Store } from '@/stores/WOTC/onboardingHrWOTC8850EssStore';
import { OnboardingSummariesUrl } from '@/enums/OnboardingSummariesUrl';
import { useOnboardingFinalReviewStore } from '@/stores/onboardingReviewInfoStore';

const { hasPressedComplete } = storeToRefs(useOnboardingFinalReviewStore());
const { getOnboardingEmployeeWitholdingCertificate } = useOnboardingEmployeeWithholdingCertificateStore()
const { fetchFormINine } = useOnboardingFormINineStore()
const { dataOnboardingFormINine } = storeToRefs(useOnboardingFormINineStore())
const { onboardingEmployeeWitholdingCertificate } = storeToRefs(useOnboardingEmployeeWithholdingCertificateStore());
const { get8850EssStatus, get9061EssStatus } = useOnboardingHrWOTCStore();
const { isForm9061Available } = storeToRefs(useOnboardingWOTC8850Store());
const { fetchForm8850Data } = useOnboardingWOTC8850Store();
const { is8850EssDone, is9061EssDone } = storeToRefs(useOnboardingHrWOTCStore());
const { fetchEmployeeDetails } = useEmployeeStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const isCompletedEmployee = ref(false);
library.add(faCircleCheck, faChevronUp, faChevronDown, faMemoCircleCheck, faSquareChevronDown, faSquareChevronUp, faCircleXmark);

const linkType = {
    employeeInformation: 0,
    federalReport: 1,
    emloyerInformation: 2,
}
const fullName = ref(<string>'');
const { responsive } = useBreakpoints();
const router = useRouter();
const route = useRoute();
const employeeId = Number(route.params.id);
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { getOnboardingSideNavItems, getEmployeeFormSubmit } = useOnboardingStore();
const { setLoading } = useLoadingStore();
const { getOnboardingPaymentMethodSetting } =
    useOnboardingDirectDepositStore();

const employeeInformationLinks = ref([]);
const federalReportLinks = ref([]);
const emloyerInformationLinks = ref([]);
const doneNavItem = ref(0);
const totalNavItem = ref(0);
const containerRef = ref(null)
const reRenderProcess = ref(0);
const employeeStatusContent: Ref<string> = ref('');
const isEmployeeFormSubmitted = ref(false);
const isShowFullSidenav = ref(false);
const isW4EssCompleted = ref(false);
const isI9EssCompleted = ref(false);
const isWotcEssCompleted = ref(false);
const refresh = async () => {
    employeeInformationLinks.value = onboardingSideNavItem.value?.filter(link => link.progressSidebarType === linkType.employeeInformation);
    const paymentMethodSetting = await getOnboardingPaymentMethodSetting() as { isDirectDeposit: boolean, isPaperCheck: boolean };
    const isDirectDepositEnable = paymentMethodSetting.isDirectDeposit;
    if (!isDirectDepositEnable) {
        employeeInformationLinks.value = employeeInformationLinks.value.filter((item) => item.progressSidebarId !== 3)
    }
    federalReportLinks.value = onboardingSideNavItem.value?.filter(link => link.progressSidebarType === linkType.federalReport);
    emloyerInformationLinks.value = onboardingSideNavItem.value?.filter(link => link.progressSidebarType === linkType.emloyerInformation);
    doneNavItem.value = onboardingSideNavItem.value?.filter(link => link.isHRDone).length;
    totalNavItem.value = onboardingSideNavItem.value.length;
    reRenderProcess.value++
}

onBeforeMount(async () => {
    setLoading(true)
    try {
        if (employeeDetails.value.id === undefined) {
            await fetchEmployeeDetails(employeeId);
        }
        await getOnboardingSideNavItems(employeeId);
        if (onboardingSideNavItem.value.length) {
            await refresh();
        }
        if (employeeDetails.value.employeeStatusId === EmployeeStatusEnum.PendingOnboard || employeeDetails.value.employeeStatusId === EmployeeStatusEnum.PendingQuickhire) {
            isCompletedEmployee.value = true;
        }
        employeeStatusContent.value = EmployeeStatusEnum[employeeDetails.value.employeeStatusId];
        
        isEmployeeFormSubmitted.value = await getEmployeeFormSubmit(Number(employeeId))
        await getOnboardingEmployeeWitholdingCertificate(Number(employeeId), FormField.TaxWithholdingInfoEmployee)
        await get8850EssStatus(Number(employeeId), FormField.WOTC8850Employee)
        await get9061EssStatus(Number(employeeId), FormField.WOTC9061Employee)
        await fetchFormINine(Number(employeeId), FormField.I9Employee)
        await fetchForm8850Data(Number(employeeId), FormField.WOTC8850Employee)
        if (onboardingEmployeeWitholdingCertificate.value.fieldModels.find((field) => field.fieldKey === "isFormDone")?.fieldValue && isEmployeeFormSubmitted.value) {
            isW4EssCompleted.value = true
        }
        if (isForm9061Available.value){
            isWotcEssCompleted.value = is8850EssDone.value && is9061EssDone.value && isEmployeeFormSubmitted.value
        } else {
            isWotcEssCompleted.value = is8850EssDone.value && isEmployeeFormSubmitted.value
        }
        if (dataOnboardingFormINine.value.fieldModels.find((field) => field.fieldKey === "status")?.fieldValue === 1 && isEmployeeFormSubmitted.value) {
            isI9EssCompleted.value = true
        }

    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
})

const hasTwoSubFormList = [
    OnboardingSummariesUrl.onboardingFormI9, OnboardingSummariesUrl.onboardingFormW4, OnboardingSummariesUrl.onboardingWOTC
]

watch(() => onboardingSideNavItem.value, async () => {
    // Re-render sidenav when one child page is marked as done
    refresh();
}, { deep: true, immediate: true });

onBeforeRouteUpdate((to, from, next) => {
    isShowFullSidenav.value = false;
    next();
})

const hrAvailableToEdit = (url: string) => {
    if (employeeDetails.value.employeeStatusId === EmployeeStatusEnum.Onboard){
        if (url === OnboardingSummariesUrl.onboardingFormI9) {
            return isI9EssCompleted
        } else if (url === OnboardingSummariesUrl.onboardingFormW4) {
            return isW4EssCompleted
        } else if (url === OnboardingSummariesUrl.onboardingWOTC) {
            return isWotcEssCompleted
        }
    }
}

</script>
<template>
    <div class="hq-pg pb-0">
        <div class="hq-pg__grid">
            <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain ">
                <fs-row align-v="center">
                    <fs-col cols="auto">
                        <fs-link @click="router.go(-1)">
                            <font-awesome-icon :icon="['fal', 'circle-arrow-left']" class="onboardingDetail__backIcon" />
                        </fs-link>                    
                    </fs-col>
                    <fs-col>
                        <h2 v-if="!responsive.mobile" class="hq-pg__title">
                            <span>
                                Onboarding Progress
                            </span>
                            | {{ employeeDetails.fullName }}
                        </h2>
                        <h2 v-if="responsive.mobile" class="hq-pg__title">
                            {{ employeeDetails.fullName }}
                        </h2>                    
                    </fs-col>


                </fs-row>
            </fs-container>
            <fs-container fluid class="flex-fill d-flex flex-column p-0">
                <fs-row no-gutters>
                    <fs-col lg="12" xl="4" class="d-flex flex-column" :class="{'border-end' : !responsive.mobile }" style="max-width: 450px;">

                        <aside class="onboard__nav overflow-auto" v-if="!isCompletedEmployee"  :class="{ 'h-auto ': !isShowFullSidenav && responsive.mobile,  }">
                                <div class="sticky--top">
                                    <fs-container fluid class="hq-pg__header contain d-none d-xl-flex">
                                        <fs-row align-v="center">
                                            <fs-col class="text-truncate">
                                                <h2 class="hq-pg__title text-truncate">Progress Tracker</h2>
                                            </fs-col>
                                            <fs-col cols="auto" class="ms-auto">
                                                <div v-html="employeeStatusBadgeRenderer(employeeStatusContent)" />
                                            </fs-col>
                                        </fs-row>
                                    </fs-container>
                                    <fs-container fluid class="hq-pg__header contain">
                                        <fs-row align-v="center">
                                            <fs-col>
                                                <div class="d-flex">
                                                    <hr-onboarding-tasks :totalFormAmount="totalNavItem" :key="reRenderProcess"
                                                        :employeeId="Number(useAttrs().id)" :formDoneAmount="doneNavItem" :isData="true"
                                                        :is-right-text="true" height="20px" classes="br-20 flex-fill abc"
                                                        :nrOfCompletedTasksSize="15" />
                                                    <fs-button v-if="responsive.mobile" @click="isShowFullSidenav = !isShowFullSidenav" variant="link" class="text-cyan ms-3 px-0" tag="a">
                                                        <font-awesome-icon 
                                                            
                                                            :icon="['fal', `${!isShowFullSidenav ? 'square-chevron-down': 'square-chevron-up'}`]" 
                                                            size="2x" />
                                                    </fs-button>
                                                </div>
                                            </fs-col>
                                        </fs-row>
                                    </fs-container>                                
                                </div>

                                

                                <div class="nav-list ">
                                    <div v-if="isShowFullSidenav || !responsive.mobile" class="py-2 px-4">
                                        <div class="nav-list__title">employee information</div>
                                        <ul class="nav-list__list">
                                            <router-link v-for="link, index in employeeInformationLinks"
                                                :to="{ name: link.progressSidebarUrl }" :key="link.progressSidebarUrl"
                                                class="nav-list__item" active-class="active">   
                                            <font-awesome-icon size="lg" v-if="link.isHRDone" :icon="['fas', 'circle-check']" class="done-icon"
                                                style="color: #03a9f4;" />
                                            <font-awesome-icon size="lg" v-else-if="hasPressedComplete" :icon="['fas', 'circle-xmark']" class="done-icon"
                                                style="color: #ff282c;" />
                                            <font-awesome-icon size="lg" v-else-if="hasTwoSubFormList.includes(link.progressSidebarUrl) && hrAvailableToEdit(link.progressSidebarUrl)" :icon="['fas', 'circle-check']" class="done-icon"
                                                style="color: #f79f1f;" />
                                            <span v-else class="item-icon">{{ index + 1 }}</span>   
                                            <li>{{ link.progressSidebarName }}</li>
                                            </router-link>
                                        </ul>

                                        <div class="nav-list__title">Federal Reporting</div>
                                        <ul class="nav-list__list">
                                            <router-link v-for="link, index in federalReportLinks" :to="{ name: link.progressSidebarUrl }"
                                                :key="link.progressSidebarUrl" class="nav-list__item" active-class="active">
                                            <font-awesome-icon size="lg" v-if="link.isHRDone" :icon="['fas', 'circle-check']" class="done-icon"
                                                style="color: #03a9f4;" />
                                            <font-awesome-icon size="lg" v-else-if="hasPressedComplete" :icon="['fas', 'circle-xmark']" class="done-icon"
                                                style="color: #ff282c;" />
                                            <font-awesome-icon size="lg" v-else-if="hasTwoSubFormList.includes(link.progressSidebarUrl) && hrAvailableToEdit(link.progressSidebarUrl)" :icon="['fas', 'circle-check']" class="done-icon"
                                                style="color: #f79f1f;" />
                                            <span v-else class="item-icon">{{ index + 1 }}</span>
                                                <li>{{ link.progressSidebarName }}</li>
                                            </router-link>
                                        </ul>
                                        <div v-if="emloyerInformationLinks && emloyerInformationLinks.length > 0" class="nav-list__title">
                                            Employer Information</div>
                                        <ul v-if="emloyerInformationLinks && emloyerInformationLinks.length > 0" class="nav-list__list">
                                            <router-link v-for="link, index in emloyerInformationLinks"
                                                :to="{ name: link.progressSidebarUrl }" :key="link.progressSidebarUrl"
                                                class="nav-list__item" active-class="active">
                                                <font-awesome-icon size="lg" v-if="link.isHRDone" :icon="['fas', 'circle-check']" class="done-icon"
                                                    style="color: #03a9f4;" />
                                                <font-awesome-icon size="lg" v-else-if="hasPressedComplete" :icon="['fas', 'circle-xmark']" class="done-icon"
                                                    style="color: #ff282c;" />
                                                <span v-else class="item-icon">{{ index + 1 }}</span>
                                                <li>{{ link.progressSidebarName }}</li>
                                            </router-link>
                                        </ul>
                                        <div class="nav-list__title">review & Submit</div>
                                        <ul class="nav-list__list">
                                            <router-link class="nav-list__item" :to="{ name: 'onboardingReviewInfo' }"
                                                active-class="active">
                                                <img :src="circleListCheck" alt="circle-list-check">
                                                Final Review</router-link>
                                        </ul>
                                    </div>
                                </div>


                        </aside>                    
                    </fs-col>
                    <fs-col lg="12" xl><router-view/></fs-col>
                </fs-row>
            </fs-container>            
        </div>

    </div>
</template>

