import { maxSize10MB } from "@/constants/common";
import { useAlerts } from "../composables/useAlerts"
import { FileInputData } from "@/models/onboarding/W4/W4FormFile";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useLoadingStore } from "@/stores/loadingStore";

const { notifyError } = useAlerts();
const { setLoading } = useLoadingStore();
const hqSuiteStore = useHQSuiteStore();

export function isFileSizeValid(file: File, maxSize = maxSize10MB) {
    let warningMessage = `The maximum upload size is ${Math.floor(maxSize / maxSize10MB * 10)}MB!`
    // file size is smaller than 1MB
    if (maxSize < maxSize10MB / 10) {
        warningMessage = `The maximum upload size is ${maxSize} bytes!`
    }
    if (file.size > maxSize) {
        notifyError(warningMessage)
        return false
    } else {
        return true
    }
}

export async function previewFile(file: FileInputData) {
    setLoading(true);
    try {
        if (!file) return;
        if (file?.fileObject) {
            const newTab = window.open('', '_blank');
            newTab.document.write('<iframe src="' + file?.fileUrl + '" width="100%" height="100%"></iframe>');
        } else {
            // CHECK FILE TYPE
            let fileType = '';
            const parts = file.fileName.split('.');
            if (parts.length > 1) {
                fileType = parts[parts.length - 1].toLowerCase();
            } else {
                fileType = '';
            }
            const filePath = `${file.filePath}/${file.fileName}`;
            // WITH TYPE PDF
            if (fileType === 'pdf') {
                await hqSuiteStore.previewPDFFile(filePath);
            } else if (['png', 'jpg', 'jpeg'].includes(fileType)) {
                //WITH TYPE IMAGE
                await hqSuiteStore.previewImageFile(filePath)
            }
        }
    } catch (error) {
        notifyError('Unable to preview file')
    } finally {
        setLoading(false);
    }

}

export function fileExists(fileList: FileInputData[], fileName: string) {
    if (fileList.length > 0) {
        return fileName === fileList.find((file) => file.fileName === fileName)?.fileName;
    }
}