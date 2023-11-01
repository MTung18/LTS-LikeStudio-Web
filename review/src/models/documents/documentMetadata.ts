export class DocumentMetadata {
    id: number | null;
    name: string;
    filePath: string;
    isRestricted: boolean;
    documentCategoryId: number;
    employeeId: number | null;
    description: string;
    updatedOn: Date;
    updatedBy: string;

    public constructor(init?: Partial<DocumentMetadata>) {
        Object.assign(this, init);
    }
}