<template>
  <div class="hq-pg bg-grey--000">
    <bryntum-search-bar :sticky="true" class="hq-pg__header--sticky" title="Review Employee Changes" :showBackButton="true" :returnRoute="{ name: 'employees' }">
      <template #buttons>
        <fs-form-group class="fs-input__form-group fs-input__form-group--search">
          <fs-form-input type="text" class="fs-input__input mb-0" v-model="searchText"
            placeholder="Search employees..." />

          <fs-button variant="link" class="px-3 fs-input__button fs-input__button--right" :disabled="searchText === ''"
            @click="searchText = ''">
            <transition name="iconSwitch" enter-active-class="animate__animated animate__fadeInDown animate__faster"
              leave-active-class="animate__animated animate__fadeOutDown animate__faster">
              <font-awesome-icon v-if="searchText === ''" key="search" :icon="['fal', 'search']"
                class="fs-input__button-icon fs-input__button-icon--right" />

              <font-awesome-icon v-else key="times" :icon="['fal', 'times']"
                class="fs-input__button-icon fs-input__button-icon--right" />
            </transition>
          </fs-button>
        </fs-form-group>
      </template>
    </bryntum-search-bar>

    <fs-container class="contain" fluid>
      <fs-overlay spinner-variant="primary" :show="isLoading" class="fsi-pg__overlay" no-wrap />

      <review-panel v-for="approval in employeePendingApprovalsFiltered" :key="approval.id" :approval="approval"
        :locked="isLocked(approval.id)" v-model:active-id="activeId" v-model:trigger-reset="triggerReset"
        v-on:submit="submit" v-on:cancel="cancel" v-on:change="change" v-on:prompt="showPrompt" />

      <div v-if="employeePendingApprovals.length === 0 && isLoading === false" class="d-flex justify-content-center m-5">
        <h4>No records to display</h4>
      </div>
    </fs-container>

    <CommonModal :showModal="showCancelModal" title="Cancel Review" ok-text="CONFIRM" cancel-text="CANCEL"
      ok-text-variant="primary" @emit-parent="onCancel" @emit-close-parent="onClose">
      <template #content>
        <p>
          You are about to lose your pending review for
          <span style="font-style: italic;">{{ changedApproval?.fullName }}</span>.
        </p>
        <p>
          Are you sure you want to continue?
        </p>
      </template>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import CommonModal from '@/components/common/commonModal.vue'
import bryntumSearchBar from '@/components/shared/bryntumGrid/bryntumSearchBar.vue'
import ReviewPanel from '@/components/viewComponents/reviews/reviewPanel.vue'
import { useAlerts } from '@/composables/useAlerts'
import EmployeePendingApproval from '@/models/employees/EmployeePendingApproval'
import router from '@/router'
import { useEmployeePendingApprovalStore } from '@/stores/EmployeePendingApprovalStore'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { RouteLocationNormalized, onBeforeRouteLeave } from 'vue-router'
import PendingApprovalResult from '@/models/employees/PendingApprovalResult'
import { storeToRefs } from 'pinia'

const { notifySuccess, notifyError } = useAlerts()

const approvalStore = useEmployeePendingApprovalStore()
const { employeePendingApprovals } = storeToRefs(approvalStore)

const searchText = ref<string>('')
const isLoading = ref<boolean>(false)

const employeePendingApprovalsFiltered = computed<EmployeePendingApproval[]>(() => {
  let result = employeePendingApprovals.value

  if (searchText.value) {
    result = result.filter(f => f.fullName.toLowerCase().includes(searchText.value.toLowerCase()))
  }

  return result
})

const changedApproval = ref<EmployeePendingApproval>(null)

const activeId = ref<number>(0)
const triggerReset = ref<boolean>(false)
const showCancelModal = ref<boolean>(false)

const isLocked = (id: number) => {
  if (!changedApproval.value) return false
  return id !== changedApproval.value.id
}

const change = (args: { hasPendingChange: boolean, approval: EmployeePendingApproval }) => {
  if (args.hasPendingChange) {
    changedApproval.value = args.approval
  } else {
    changedApproval.value = null
  }
}

const submit = async (args: {employeeId: number, result: PendingApprovalResult[] }) => {
  const resp = await approvalStore.submitApprovals(args.employeeId, args.result)
  if (!resp) {
    notifyError("Not implemented yet")
  } else {
    notifySuccess(`Review submitted`)
  }

  changedApproval.value = null
  employeePendingApprovals.value = employeePendingApprovals.value.filter(f => f.id !== args.employeeId)
}

let cancelCallback = () => undefined

const showPrompt = (callback: () => void) => {
  showCancelModal.value = true
  cancelCallback = () => {
    triggerReset.value = true
    callback()
  }
}

const cancel = (callback: () => void) => {
  showCancelModal.value = true
  cancelCallback = callback
}

const onClose = () => {
  showCancelModal.value = false
}

const onCancel = () => {
  cancelCallback()
  showCancelModal.value = false
}

const onBeforeUnload = (e: BeforeUnloadEvent) => {
  if (changedApproval.value) {
    e.returnValue = 'Changes you made may not be saved.'
  } else {
    delete e.returnValue
  }
}

onMounted(async () => {
  isLoading.value = true
  await approvalStore.fetchEmployeePendingApprovals()
  isLoading.value = false

  window.addEventListener('beforeunload', onBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', onBeforeUnload)
})

onBeforeRouteLeave((to: RouteLocationNormalized) => {
  if (changedApproval.value) {
    showPrompt(() => {
      router.push(to)
    })
    return false
  }
})
</script>

<style lang="scss" scoped>
.fs-input__form-group--search {
  max-width: 500px;
}
</style>
