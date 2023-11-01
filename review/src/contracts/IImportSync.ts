
export interface IImportSync {
    fetch(isSynced: boolean): Promise<any>;
    import(data: any): Promise<boolean>;
    sync(data: any): Promise<boolean>;
}
