export interface AssignedVacationPlans {
    id: number;
    vacationPlanId: number;
    employeeId: number;
    startDate: string;
    isActive: boolean;
    planType?: string;
    planName?: string;
    planTypeId?: number
}