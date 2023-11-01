export class ReportCriteria {
    public name: string;
    public id: number;
    public guid: string;
    public default: boolean = false;
    public referenceInformation: string;
    public sortByField: string;
    public reportingSupervisorPhqId?: number;

    public constructor(init?: Partial<ReportCriteria>) {
        Object.assign(this, init);
    }
}