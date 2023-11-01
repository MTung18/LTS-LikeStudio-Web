export class EmployeeOnboardingCountStatuses {
 public notStarted: number = 0;
 public inProgressLessThan7Days: number = 0;
 public inProgressGreaterOrEqualThan7Days: number = 0;
 public submitted: number = 0;

 public constructor(init?: Partial<EmployeeOnboardingCountStatuses>) {
    Object.assign(this, init);
  }
}