
export enum BatchDownloadStatus {
    Idle = '',
    Ready = 'Downloading',
    InProgress = 'Downloading',
    Zipping = 'Zipping the files',
    Finished = 'Zip Downloaded',
    Error = 'Error in downloading batch'
}

export enum BatchFileStatus {
    InProgress,
    Downloaded,
    Error
}

export class BatchFile {
    status: BatchFileStatus = BatchFileStatus.InProgress;
    name: string;
    path: string;
    public constructor(init?: Partial<BatchFile>) {
        Object.assign(this, init);
    }
}

export class BatchDownload {
    totalNumberOfFilesDownloaded: number = 0;
    totalNumberOfFilesToDownload: number = 0;
    status: string = BatchDownloadStatus.Idle;
    files: BatchFile[] = [];
    percentageCompleted: number = 0;

    public constructor(init?: Partial<BatchDownload>) {
        Object.assign(this, init);
    }

    public updateStatusWhenDownloadCompleteForEachFile(file: BatchFile) {
        this.totalNumberOfFilesDownloaded += 1;
        if (this.totalNumberOfFilesToDownload !== 0)
            this.percentageCompleted = Math.round((this.totalNumberOfFilesDownloaded / this.totalNumberOfFilesToDownload) * 100);
        file.status = BatchFileStatus.Downloaded;
    }
}