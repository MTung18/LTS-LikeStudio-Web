interface FieldModel<T extends Record<string, any>> {
    formFieldId: number;
    formFieldValueId?: number;
    fieldKey: keyof T;
    fieldValue: T[keyof T];
  }
  
  export interface UploadPayload<T extends Record<string, any>> {
    fieldModels: FieldModel<T>[];
    uploadFileStateForms?: UploadFileStateFormT[];
    formId: number;
    employeeId?: number;
    versionNo?: number;
    isCompleted?: boolean;
  }
  
  export interface UploadFileStateFormT {
    formFieldValueId?: number;
    fileName: string;
    filePath: string;
    description: string;
    payload: string | Record<string, any> | any;
    uploadDateUTC?: string;
    fileUrl?: string;
    fileObject?: File;
  }

  export interface StateT {
    value: string;
    text: string
  }