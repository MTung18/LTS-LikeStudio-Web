export class HQSuiteRecordItem {
    id: number;
    name: string;
    contentType: string;
    fileSize: number;
    path: string;
    isFolder: boolean;
    isDefault: boolean;
    lastEdited: string;

    public constructor(init?: Partial<HQSuiteRecordItem>) {
        Object.assign(this, init);
    }
}