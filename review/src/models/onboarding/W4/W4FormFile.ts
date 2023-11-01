export interface W4FormFile {
    fileInstructName: string,
    fileName: string,
    filePath: string,
    filePathInstruct: string,
    filePathWorkSheet: string,
    fileWorkSheetName: string,
    stateName: string,
    stateEnum: string
}

export interface W4FormFileInput {
    stateId: string | number,
    fileData: FileInputData[];
}

export interface FileInputData {
    fileName: string;
    fileObject?: File;
    filePath: string;
    fileUrl?: string;
}
