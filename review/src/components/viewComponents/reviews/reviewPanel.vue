<template>
  <fs-card no-body class="shadow my-3 overflow-hidden">
    <fs-card-header class="bg-white" header-tag="header" role="tab" :style="{ zIndex: loading ? '11' : '1' }">
      <div class="d-flex justify-content-between p-1">
        <div class="d-flex">
          <div class="employee-avatar rounded-circle bg-grey--000 d-flex align-items-center justify-content-center me-3">
            <span class="text-grey--500">{{ approval.avatar }}</span>
          </div>

          <div class="d-flex flex-column justify-content-center">
            <div class="fw-bold">
              {{ approval.fullName }} <span v-if="hasPendingChange">*</span>
            </div>
            <div>{{ approval.jobTitle }}</div>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <fs-button v-if="isOpen" variant="outline-secondary" class="btn-review" @click="togglePanel(approval)">
            Close
          </fs-button>
          <fs-button v-else variant="outline-primary" class="btn-review" @click="togglePanel(approval)">
            Review
          </fs-button>
        </div>
      </div>
    </fs-card-header>

    <fs-overlay spinner-variant="primary" :show="loading" class="fsi-pg__overlay" no-wrap opacity="1" />

    <fs-collapse v-model="isOpen" role="tabpanel">
      <fs-card-body>
        <div v-if="pendingApprovals.length === 0" class="no-changes-found">
          No changes found
        </div>

        <fs-tabs v-else v-model="tabIndex"
          active-tab-class="d-flex flex-column justify-content-between border-start h-100" pills vertical>
          <template #tabs-start>
            <div class="border-bottom p-3">
              <strong class="mx-1"> Category </strong>
            </div>
          </template>

          <fs-tab v-if="form.some(f => f.hrApprovalCategory === HrApprovalCategory.PersonalInfo)">
            <template #title>
              <div class="tab-container">
                <span v-if="personalInfoStatus === null"
                  :class="['circle-text', 'border', isCurrentTab(HrApprovalCategory.PersonalInfo) ? 'text-cyan border-cyan bg-white' : 'text-secondary']">
                  {{ getTabIndex(HrApprovalCategory.PersonalInfo) }}
                </span>

                <span v-else-if="personalInfoStatus" class="circle-text bg-cyan text-white">
                  <font-awesome-icon icon="fa-solid fa-check" size="sm" />
                </span>

                <span v-else class="circle-text bg-red text-white">
                  <font-awesome-icon :icon="['fas', 'times']" />
                </span>

                <span class="flex-grow-1 text-black text-start"> Personal Information </span>

                <div class="fill-space">
                  <span v-if="personalInfoStatus !== null && isCurrentTab(HrApprovalCategory.PersonalInfo)"
                    @click="personalInfoStatus = null" class="text-secondary">
                    <font-awesome-icon icon="fa fa-rotate-left" size="sm" />
                  </span>
                </div>
              </div>
            </template>

            <review-panel-content v-model="personalInfoStatus" title="Personal Information"
              :date-changed="getDateChanged(HrApprovalCategory.PersonalInfo)" :submit-disabled="submitDisabled"
              :cancel-disabled="!hasPendingChange" v-on:submit="submit" v-on:cancel="cancel"
              v-on:update-comment="updateComment($event, HrApprovalCategory.PersonalInfo)">

              <review-field
                v-for="change in pendingApprovals.find(f => f.hrApprovalCategory === HrApprovalCategory.PersonalInfo).changes"
                :key="change.name" :title="change.name" :initial-value="change.initialValue"
                :final-value="change.finalValue" />

            </review-panel-content>
          </fs-tab>

          <fs-tab v-if="form.some(f => f.hrApprovalCategory === HrApprovalCategory.DirectDeposit)">
            <template #title>
              <div class="tab-container">
                <span v-if="directDepositStatus === null"
                  :class="['circle-text', 'border', isCurrentTab(HrApprovalCategory.DirectDeposit) ? 'text-cyan border-cyan bg-white' : 'text-secondary']">
                  {{ getTabIndex(HrApprovalCategory.DirectDeposit) }}
                </span>

                <span v-else-if="directDepositStatus" class="circle-text bg-cyan text-white">
                  <font-awesome-icon icon="fa-solid fa-check" size="sm" />
                </span>

                <span v-else class="circle-text bg-red text-white">
                  <font-awesome-icon :icon="['fas', 'times']" />
                </span>

                <span class="flex-grow-1 text-black text-start"> Direct Deposit </span>

                <div class="fill-space">
                  <span v-if="directDepositStatus !== null && isCurrentTab(HrApprovalCategory.DirectDeposit)"
                    @click="directDepositStatus = null" class="text-secondary">
                    <font-awesome-icon icon="fa fa-rotate-left" size="sm" />
                  </span>
                </div>
              </div>
            </template>

            <review-panel-content v-model="directDepositStatus" title="Direct Deposit" :submit-disabled="submitDisabled"
              :date-changed="getDateChanged(HrApprovalCategory.DirectDeposit)" :cancel-disabled="!hasPendingChange"
              v-on:submit="submit" v-on:cancel="cancel"
              v-on:update-comment="updateComment($event, HrApprovalCategory.DirectDeposit)">

              <div v-for="(group, idx) in getGroupedChanges(HrApprovalCategory.DirectDeposit)" :key="idx" class="pb-4">
                <div class="d-flex border-bottom pb-2 text-cyan">
                  <strong>{{ group[0]?.groupName || 'General' }}</strong>
                </div>
                <review-field v-for="change in group" :key="change.name" :title="change.name"
                  :initial-value="change.initialValue" :final-value="change.finalValue" />
              </div>

            </review-panel-content>
          </fs-tab>

          <fs-tab v-if="form.some(f => f.hrApprovalCategory === HrApprovalCategory.Benefits)">
            <template #title>
              <div class="tab-container">
                <span v-if="benefitsStatus === null"
                  :class="['circle-text', 'border', isCurrentTab(HrApprovalCategory.Benefits) ? 'text-cyan border-cyan bg-white' : 'text-secondary']">
                  {{ getTabIndex(HrApprovalCategory.Benefits) }}
                </span>

                <span v-else-if="benefitsStatus" class="circle-text bg-cyan text-white">
                  <font-awesome-icon icon="fa-solid fa-check" size="sm" />
                </span>

                <span v-else class="circle-text bg-red text-white">
                  <font-awesome-icon :icon="['fas', 'times']" />
                </span>

                <span class="flex-grow-1 text-black text-start"> Benefits </span>

                <div class="fill-space">
                  <span v-if="benefitsStatus !== null && isCurrentTab(HrApprovalCategory.Benefits)"
                    @click="benefitsStatus = null" class="text-secondary">
                    <font-awesome-icon icon="fa fa-rotate-left" size="sm" />
                  </span>
                </div>
              </div>
            </template>

            <review-panel-content v-model="benefitsStatus" title="Benefits" :submit-disabled="submitDisabled"
              :date-changed="getDateChanged(HrApprovalCategory.Benefits)" :cancel-disabled="!hasPendingChange"
              v-on:submit="submit" v-on:cancel="cancel"
              v-on:update-comment="updateComment($event, HrApprovalCategory.Benefits)">

              <review-field
                v-for="change in pendingApprovals.find(f => f.hrApprovalCategory === HrApprovalCategory.Benefits).changes"
                :key="change.name" :title="change.name" :initial-value="change.initialValue"
                :final-value="change.finalValue" />

            </review-panel-content>
          </fs-tab>

          <fs-tab v-if="form.some(f => f.hrApprovalCategory === HrApprovalCategory.TaxWithholding)">
            <template #title>
              <div class="tab-container">
                <span v-if="taxWithHoldingStatus === null"
                  :class="['circle-text', 'border', isCurrentTab(HrApprovalCategory.TaxWithholding) ? 'text-cyan border-cyan bg-white' : 'text-secondary']">
                  {{ getTabIndex(HrApprovalCategory.TaxWithholding) }}
                </span>

                <span v-else-if="taxWithHoldingStatus" class="circle-text bg-cyan text-white">
                  <font-awesome-icon icon="fa-solid fa-check" size="sm" />
                </span>

                <span v-else class="circle-text bg-red text-white">
                  <font-awesome-icon :icon="['fas', 'times']" />
                </span>

                <span class="flex-grow-1 text-black text-start"> Tax Withholding </span>

                <div class="fill-space">
                  <span v-if="taxWithHoldingStatus !== null && isCurrentTab(HrApprovalCategory.TaxWithholding)"
                    @click="taxWithHoldingStatus = null" class="text-secondary">
                    <font-awesome-icon icon="fa fa-rotate-left" size="sm" />
                  </span>
                </div>
              </div>
            </template>

            <review-panel-content v-model="taxWithHoldingStatus" title="Tax Withholding" :submit-disabled="submitDisabled"
              :date-changed="getDateChanged(HrApprovalCategory.TaxWithholding)" :cancel-disabled="!hasPendingChange"
              v-on:submit="submit" v-on:cancel="cancel"
              v-on:update-comment="updateComment($event, HrApprovalCategory.TaxWithholding)">

              <review-field
                v-for="change in pendingApprovals.find(f => f.hrApprovalCategory === HrApprovalCategory.TaxWithholding).changes"
                :key="change.name" :title="change.name" :initial-value="change.initialValue"
                :final-value="change.finalValue" />

            </review-panel-content>
          </fs-tab>

          <fs-tab v-if="form.some(f => f.hrApprovalCategory === HrApprovalCategory.W2Form)">
            <template #title>
              <div class="tab-container">
                <span v-if="w2Status === null"
                  :class="['circle-text', 'border', isCurrentTab(HrApprovalCategory.W2Form) ? 'text-cyan border-cyan bg-white' : 'text-secondary']">
                  {{ getTabIndex(HrApprovalCategory.W2Form) }}
                </span>

                <span v-else-if="w2Status" class="circle-text bg-cyan text-white">
                  <font-awesome-icon icon="fa-solid fa-check" size="sm" />
                </span>

                <span v-else class="circle-text bg-red text-white">
                  <font-awesome-icon :icon="['fas', 'times']" />
                </span>

                <span class="flex-grow-1 text-black text-start"> W-2 </span>

                <div class="fill-space">
                  <span v-if="w2Status !== null && isCurrentTab(HrApprovalCategory.W2Form)" @click="w2Status = null"
                    class="text-secondary">
                    <font-awesome-icon icon="fa fa-rotate-left" size="sm" />
                  </span>
                </div>
              </div>
            </template>

            <review-panel-content v-model="w2Status" title="W-2" :submit-disabled="submitDisabled"
              :date-changed="getDateChanged(HrApprovalCategory.W2Form)" :cancel-disabled="!hasPendingChange"
              v-on:submit="submit" v-on:cancel="cancel"
              v-on:update-comment="updateComment($event, HrApprovalCategory.W2Form)">

              <review-field
                v-for="change in pendingApprovals.find(f => f.hrApprovalCategory === HrApprovalCategory.W2Form).changes"
                :key="change.name" :title="change.name" :initial-value="change.initialValue"
                :final-value="change.finalValue" />

            </review-panel-content>
          </fs-tab>
        </fs-tabs>
      </fs-card-body>
    </fs-collapse>
  </fs-card>
</template>

<script setup lang="ts">
import EmployeePendingApproval from '@/models/employees/EmployeePendingApproval'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faRotateLeft } from '@fortawesome/pro-solid-svg-icons'
import { PropType, computed, ref, watch } from 'vue'
import ReviewField from './reviewField.vue'
import ReviewPanelContent from './reviewPanelContent.vue'
import { useEmployeePendingApprovalStore } from '@/stores/EmployeePendingApprovalStore'
import PendingApproval from '@/models/employees/PendingApproval'
import PendingApprovalResult from '@/models/employees/PendingApprovalResult'
import { HrApprovalCategory } from '@/enums/HrApprovalCategory'
import PendingApprovalChange from '@/models/employees/PendingApprovalChange'

const props = defineProps({
  activeId: { type: Number, required: true },
  locked: { type: Boolean, required: true },
  triggerReset: { type: Boolean, required: true },
  approval: { type: Object as PropType<EmployeePendingApproval>, required: true },
})

const emit = defineEmits<{
  (e: 'prompt', val: () => void): void
  (e: 'update:activeId', val: number): void
  (e: 'update:triggerReset', val: boolean): void
  (e: 'cancel', val: () => void): void
  (e: 'submit', val: { employeeId: number, result: PendingApprovalResult[] }): void
  (e: 'change', val: { hasPendingChange: boolean, approval: EmployeePendingApproval }): void
}>()

library.add(faArrowRight, faRotateLeft)
const approvalStore = useEmployeePendingApprovalStore()

const searched = ref<boolean>(false)
const loading = ref<boolean>(false)
const pendingApprovals = ref<PendingApproval[]>([])

const tabIndex = ref<number>(0)
const tabs = ref<HrApprovalCategory[]>([])
const isOpen = ref<boolean | null>(null)

const createComputed = (category: HrApprovalCategory) => {
  return computed<boolean | null>({
    get() {
      return form.value.find(f => f.hrApprovalCategory === category).status
    },
    set(val) {
      const index = form.value.findIndex(f => f.hrApprovalCategory === category)
      if (index > -1) {
        form.value[index].status = val
        if (val !== null) {
          nextTab()
        }
      }
    }
  })
}

const personalInfoStatus = createComputed(HrApprovalCategory.PersonalInfo)
const directDepositStatus = createComputed(HrApprovalCategory.DirectDeposit)
const benefitsStatus = createComputed(HrApprovalCategory.Benefits)
const taxWithHoldingStatus = createComputed(HrApprovalCategory.TaxWithholding)
const w2Status = createComputed(HrApprovalCategory.W2Form)

const submitDisabled = computed<boolean>(() => {
  return (form.value.some(f => f.status === null))
})

const form = ref<PendingApprovalResult[]>([])
const buildForm = () => {
  tabs.value = pendingApprovals.value
    .map(f => f.hrApprovalCategory)
    .sort((a, b) => a - b)

  pendingApprovals.value.forEach(f => {
    form.value.push(new PendingApprovalResult(f.hrApprovalCategory))
  })
}

const getApprovals = async (id: number) => {
  loading.value = true
  pendingApprovals.value = await approvalStore.getPendingApprovals(id)
  buildForm()
  loading.value = false
}

const getGroupedChanges = (category: HrApprovalCategory) => {
  const changes = pendingApprovals.value.find(f => f.hrApprovalCategory === category).changes
  const key = 'groupName'

  const result = changes.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})

  return result as Record<string, PendingApprovalChange[]>
}

const getDateChanged = (category: HrApprovalCategory): string => {
  const dates = pendingApprovals.value.find(f => f.hrApprovalCategory === category)?.changes?.map(f => new Date(f.timeOfChange).getTime())
  if (!dates) return 'N/A'
  return new Date(Math.max(...dates)).toDateString()
}

const togglePanel = async (approval: EmployeePendingApproval) => {
  if (!isOpen.value) {
    if (props.locked) {
      emit('prompt', () => {
        isOpen.value = !isOpen.value
        emit('update:activeId', approval.id)
        
        if (searched.value) return
        searched.value = true
        getApprovals(approval.id)
      })
      return
    } else {
      emit('update:activeId', approval.id)
    }
  }

  isOpen.value = !isOpen.value

  if (!isOpen.value || searched.value) return

  searched.value = true
  getApprovals(approval.id)
}

const isCurrentTab = (category: HrApprovalCategory): boolean => {
  return tabIndex.value === tabs.value.indexOf(category)
}

const getTabIndex = (category: HrApprovalCategory) => {
  return tabs.value.findIndex(f => f === category) + 1
}

const nextTab = () => {
  if (tabIndex.value === form.value.length - 1) return
  tabIndex.value += 1
}

const hasPendingChange = computed<boolean>(() => {
  return form.value.some(f => f.status !== null)
})

const submit = () => {
  emit('submit', { employeeId: props.approval.id, result: form.value })
}

const reset = () => {
  form.value.forEach(f => {
    f.status = null
    f.rejectionComment = ''
  })
}

const cancel = () => {
  emit('cancel', () => {
    reset()
  })
}

const updateComment = (comment: string, category: HrApprovalCategory) => {
  const index = form.value.findIndex(f => f.hrApprovalCategory === category)
  if (index > -1) {
    form.value[index].rejectionComment = comment
  }
}

watch(hasPendingChange, (val) => {
  emit('change', { hasPendingChange: val, approval: props.approval })
})

watch(() => props.triggerReset, () => {
  if (props.triggerReset && !props.locked) {
    isOpen.value = false
    console.log(`Review for ${props.approval.fullName} has been reset`)
    reset()
    emit('update:triggerReset', false)
  }
})

watch(() => props.activeId, (val) => {
  if (props.approval.id !== val) {
    isOpen.value = false
  }
})
</script>

<style lang="scss" scoped>
:deep(.card-body) {
  padding: 0;
}

:deep(.nav-pills) {
  --bs-nav-pills-link-active-bg: #f3f4f6;
  --bs-nav-pills-border-radius: 2rem;
}

:deep(.nav-item) {
  padding: 0.4rem;
}

.employee-avatar {
  width: 50px;
  height: 50px;

  span {
    font-size: 18px;
  }
}

.circle-text {
  width: 25px;
  height: 25px;
  line-height: 25px;
  -moz-border-radius: 50%;
  border-radius: 50%;
  text-align: center;
  display: block;
}

.tab-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.fill-space {
  min-width: 15px;
}

.no-changes-found {
  font-size: 1.2rem;
  font-weight: bold;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
