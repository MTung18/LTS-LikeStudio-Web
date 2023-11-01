import mimetypes from 'mime-types';

function getIconClassFromFileName(fileName: string): string {
    const mimeType: string = mimetypes.lookup(fileName);
    return _getIconClassFromMimeType(mimeType);
}

function _getIconClassFromMimeType(mimeType: string): string {
    if (mimeType) {
        if (mimeType === 'application/pdf') {
            return 'file-pdf';
        }

        if (mimeType === 'application/msword' ||
            mimeType === 'application/vnd.ms-word.document.macroenabled.12' ||
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return 'file-word';
        }

        if (mimeType === 'application/vnd.ms-excel' ||
            mimeType === 'application/vnd.ms-excel.sheet.macroenabled.12' ||
            mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return 'file-excel';
        }

        if (mimeType === 'application/vnd.ms-powerpoint' ||
            mimeType === 'application/vnd.ms-powerpoint.presentation.macroenabled.12' ||
            mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            return 'file-powerpoint';
        }

        if (mimeType.startsWith('audio/')) {
            return 'file-audio';
        }

        if (mimeType.startsWith('image/')) {
            return 'image';
        }

        if (mimeType.startsWith('video/')) {
            return 'file-video';
        }

        if (mimeType.startsWith('text/')) {
            return 'file-alt';
        }
    }

    return 'file';
}

export {
    getIconClassFromFileName
}
