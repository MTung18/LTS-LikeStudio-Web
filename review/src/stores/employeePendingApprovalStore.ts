import { whqEmployeesApi } from '@/axios/instances/whqEmployeesApi'
import Employee from '@/models/employees/Employee'
import PendingApprovalResult from '@/models/employees/PendingApprovalResult'
import { setEmployeeInitials } from '@/utilities/formatUtils'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import EmployeePendingApproval from '../models/employees/EmployeePendingApproval'
import PendingApproval from '../models/employees/PendingApproval'

export const useEmployeePendingApprovalStore = defineStore('employeePendingApproval', () => {
  const employeePendingApprovals = ref<EmployeePendingApproval[]>([])

  async function fetchEmployeePendingApprovals(): Promise<void> {
    const resp = await whqEmployeesApi.getEmployeesPendingApproval()

    employeePendingApprovals.value = resp.map((employee: Employee) => {
      const avatar = setEmployeeInitials(employee.fullName)
      return new EmployeePendingApproval({ ...employee, avatar})
    })
  }

  async function getPendingApprovals(employeeId: number): Promise<PendingApproval[]> {
    return await whqEmployeesApi.getPendingApprovals(employeeId)
  }

  async function submitApprovals(employeeId: number, changes: PendingApprovalResult[]): Promise<boolean> {
    return await whqEmployeesApi.submitApprovals(employeeId, changes)
  }

  return {
    employeePendingApprovals,
    fetchEmployeePendingApprovals,
    getPendingApprovals,
    submitApprovals
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployeePendingApprovalStore, import.meta.hot))
}
