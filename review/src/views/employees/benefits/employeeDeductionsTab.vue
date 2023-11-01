<script setup lang="ts">
import EmployeeDeduction from '@/models/employees/EmployeeDeduction';
import { faEdit } from "@fortawesome/pro-light-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { ComputedRef, Ref, computed, onMounted, ref } from 'vue';
import benefitsSplash from "@/assets/images/Benefits.svg";
import editBenefitsPanel from "@/components/viewComponents/benefit/editBenefitPanel.vue";
import { formatCurrency } from "@/utilities/formatUtils";
import { DeductionTypeName, DeductionType, DeductionMethod } from "@/enums/DeductionType";
import { BenefitsDeduction } from "@/models/benefitsDeductions/BenefitsDeduction";
import { useBenefitsDeductionStore } from "@/stores/benefitsDeductionStore";
import { useRoute } from "vue-router";
import deductionsSplash from "@/assets/images/Deductions.svg";
import { EmitNames } from '@/enums/EmitName';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from "pinia";
import PendingFoundationApprovalBanner from '@/components/shared/pendingFoundationApprovalBanner.vue';
const { checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync } = useEmployeeStore();
const { employeeHasExistingPendingFoundationApprovals } = storeToRefs(useEmployeeStore());

library.add(faEdit);

const showEditBenefits = ref(false);
const benefitsDeduction: Ref<BenefitsDeduction> = ref<BenefitsDeduction>(null);
const currentTabActive = ref(0);

const route = useRoute();
const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());
const deductionStore = useBenefitsDeductionStore();
const childComponent = ref<InstanceType<typeof editBenefitsPanel>>(null);
const benefitDeductionData: Ref<BenefitsDeduction> = ref();
interface Props {
    deductions?: EmployeeDeduction[];
    title: string;
    showSplashScreen: boolean;
}

const props = withDefaults(defineProps<Props>(), {
});

const splashScreenSvg: Ref<string> = ref('');
const hasPendingFoundationApproval: Ref<boolean> = ref(false);

const emitCloseForm = (isClose: boolean) => {
    showEditBenefits.value = isClose
}

const emit = defineEmits([EmitNames.RELOAD]);
const reloadDataComponent = (reload: boolean) => {
    emit(EmitNames.RELOAD, reload)
}
defineExpose({
    benefitsDeduction,
    currentTabActive    
});
const onEditClick = async (employeeId: string, employeeDeductionId: number) => {
    if (employeeDeductionId != 0) {
        const response = await deductionStore.getBenefitsDetail(employeeId, employeeDeductionId);
        benefitDeductionData.value = response;
    }
    else {
        benefitDeductionData.value.id = employeeDeductionId;
    }
    showEditBenefits.value = true;
}

onMounted(async () => {
    await checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync(+employeeId.value);
    hasPendingFoundationApproval.value = employeeHasExistingPendingFoundationApprovals.value;
    splashScreenSvg.value = props.title === DeductionTypeName.BENEFIT ? benefitsSplash : deductionsSplash;
});

</script>

<template>
    <div class="flex-fill flex-column d-flex align-items-center justify-content-center py-5" v-if="showSplashScreen">
        <div class="text-center">
            <h5 class="fw-bold mb-4">No {{ title }}</h5>
            <img width="120" class="mb-4" :src="splashScreenSvg" :alt="'No ' + title">
            <div class="text-center text-secondary mb-3">
                This employee does not currently have<br />
                any {{ title?.toLocaleLowerCase() }}.
            </div>
        </div>
    </div>
    <fs-container v-else fluid class="contain">
        <pending-foundation-approval-banner v-if="title === DeductionTypeName.BENEFIT" :hasPendingFoundationApproval="hasPendingFoundationApproval"></pending-foundation-approval-banner>
        <fs-row>
            <fs-col v-for="deduction in deductions" :key="deduction.employeeDeductionId" lg="6">
                <fs-card no-body class="rounded-1 mt-4">
                    <fs-card-header class="dashboard-card__header">
                        <div class="text-cyan me-auto">
                            <span>{{ deduction.deductionFsNo }} - {{ deduction.planName }}</span>
                        </div>
                        <div v-if="deduction.isWHQEditable && deduction.deductionTypeId === DeductionType.BENEFIT">
                            <fs-button size="lg" variant="link" :class="`${hasPendingFoundationApproval ? 'disabled' : ''}`"
                                @click="onEditClick(employeeId, deduction.employeeDeductionId)">
                                <font-awesome-icon :icon="['fal', 'edit']" class="text-primary" size="lg"/>
                            </fs-button>
                        </div>
                    </fs-card-header>
                    <fs-card-body>
                        <fs-container fluid class="contain">
                            <fs-row class="py-1">
                                <fs-col cols="4">
                                    <strong>Plan Name</strong>
                                </fs-col>
                                <fs-col>
                                    {{ deduction.customizedName }}
                                </fs-col>
                            </fs-row>
                            <fs-row class="py-1">
                                <fs-col cols="4">
                                    <strong>Deduction Amount</strong>
                                </fs-col>
                                <fs-col>
                                    {{ deduction.fixedDedAmount === 0 && deduction.deductionPercent === 0 ? "0" :
                                        deduction.fixedDedAmount === 0 ? deduction.deductionPercent + '%' :
                                            formatCurrency(deduction.fixedDedAmount) || '0' }}
                                </fs-col>
                            </fs-row>
                        </fs-container>
                    </fs-card-body>
                </fs-card>
            </fs-col>
        </fs-row>
    </fs-container>
    <editBenefitsPanel :showEditBenefits="showEditBenefits" :benefitDeductionData="benefitDeductionData"
        @close-form="emitCloseForm" @reload="reloadDataComponent">
    </editBenefitsPanel>
</template>

<style lang="scss" scoped>
.edit_icon {
    text-align: right;
}
</style>