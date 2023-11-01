export default class OnboardingSummary {
    public progressSidebarId: string;
    public employeeId: string;
    public planDescription: string;
    public progressSidebarSequence: number;
    public progressSidebarType: number;
    public isDone: boolean;
    public isHRDone: boolean;
    public updatedDateUTC: string;
    public progressSidebarName?: string;
    public progressSidebarUrl: string;

    public constructor(init?: Partial<OnboardingSummary>) {
        Object.assign(this, init);
    }
}
