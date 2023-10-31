import { FailureItem } from "./failureItem";

class ApiError extends Error {
    constructor(statusCode, content) {
        super(content && content.errorMessage);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.content = content;
        FailureItem = handleErrors(this.content);
    }
}

function handleErrors(response) {
    const failureList = [];
    if (response && response.data && (response.data.modelErrors || response.data.errors)) {
        const errorEntries = Object.entries(response.data.modelErrors || response.data.errors);

        for (const [title, reasons] of errorEntries) {
            for (const reason of reasons) {
                failureList.push({
                    failureTitle: title,
                    failureReason: reason,
                });
            }
        }
    }
    return failureList;
}

module.exports = {
    ApiError,
    handleErrors,
};