import { FailureItem } from "./failureItem";

export class WHQApiError extends Error {

    public statusCode: number;
    public content: any;
    public failureItems: FailureItem[];

    constructor(statusCode?: number, content?: any) {
        super(content?.errorMessage);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.content = content;
        this.failureItems = handleErrors(this.content);
    }
}

export function handleErrors(response: any): FailureItem[] {
    const failureList: FailureItem[] = [];
    if (response && response.data && (response.data.modelErrors || response.data.errors)) {
        const errorEntries: any = Object.entries(response.data.modelErrors || response.data.errors);

        for (const [title, reasons] of errorEntries) {
            for (const reason of reasons) {
                failureList.push({
                    failureTitle: title,
                    failureReason: reason
                })
            }
        }
    }
    return failureList;
}
