export interface TimeOffPlan {
    id: number,
    vacationPlanId: number,
    planTypeId: number,
    employeeId: number,
    planType: string,
    planName: string,
    startDate: string,
    isActive: boolean
}

export interface TimeOffPlanTree {
    id: number,
    vacationPlanId: number,
    planTypeId: number,
    employeeId: number,
    planType: string,
    planName: string,
    startDate: string,
    isActive: boolean,
    expanded?: boolean,
    parentId?: number,
    children?: TimeOffPlanTree[]
}