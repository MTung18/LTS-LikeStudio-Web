export class FoundationCompanyCasConnection {
    crmClientId: string;
    companyName: string;
    cloudClientId: number;
    databaseName: string;
    casConnectionGuid: string;

    public constructor(init?: Partial<FoundationCompanyCasConnection>) {
        Object.assign(this, init);
    }
}