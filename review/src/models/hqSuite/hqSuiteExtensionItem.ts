export class HQSuiteExtensionItem {
    fileUploadExtensionId: number;
    extensionType: string;
    extensionMimeType: string;

    public constructor(init?: Partial<HQSuiteExtensionItem>) {
        Object.assign(this, init);
    }
}