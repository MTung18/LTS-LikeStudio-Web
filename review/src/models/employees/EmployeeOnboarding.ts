export default class EmployeeOnboarding {
    public employeeId: string;
    public onboardingId: string;
    public dateStarted?: string;
    public dateCompleted?: string;
    public lastAccessed?: string;
    public onboardingProgress: number;

    public constructor(init?: Partial<EmployeeOnboarding>) {
        Object.assign(this, init);
    }
}