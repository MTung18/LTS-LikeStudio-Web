export class UploadFileModel {
    path: string;
    file: any;
    fileName: string;
    public constructor(init?: Partial<UploadFileModel>) {
        Object.assign(this, init);
    }
}
export class ExtendedUploadFileModel extends UploadFileModel {
    uniqueFileName: string;
    public constructor(init?: Partial<ExtendedUploadFileModel>) {
        super()
        Object.assign(this, init);
    }
}
export class CreateFolderModel {
    path: string;
    name: string;

    public constructor(sourcePath: string, newFolderName: string) {
        this.path = sourcePath;
        this.name = newFolderName;
    }
}

