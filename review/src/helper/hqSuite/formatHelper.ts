import moment from 'moment';

export function formateBytes(bytes: any): string {
  if (bytes == 0) return '0 Bytes'

  const k: number = 1024;
  const sizes: Array<string> = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i: number = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function formatDate(item: any): string {
  const date: any = item.split("T")[0];
  const [year, month, day] = date.split('-');
  const result: string = [month, day, year].join('/');
  return result;
}

export function getUtcDate(isoDate: string): string {
  if (!isoDate) return '';

  return moment(isoDate).utc().format();
}

export function getCurrentTimezoneDate(utcDate: string): string {
  if (!utcDate) return '';

  return new Date(utcDate).toLocaleDateString(undefined, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatPath(path: string): string {
  return path.replace(/^\/|\/$/g, '');
}

export function removeFileFromPath(path: string) {
  return path.substring(0, path.lastIndexOf("/"));
}

export function getFileName(path: string, withExtension: boolean = false): string {
  const pathArr: any = path.split('/');
  if (withExtension) {
    return pathArr[pathArr.length - 1];
  }
  const splitedPathArr: any = pathArr[pathArr.length - 1].split('.');
  return splitedPathArr[0]
}

export const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
}

export function getSelectedFilePath(selectedPath: string): string {
  return selectedPath.replace(/^.*[\\\/]/, '');
}

export function getSourcePath(path: string): string {
  // Return the root directory
  if (path.indexOf('/') <= - 1) {
    return "";
  }
  // Return the parent directory 
  if (path.lastIndexOf('/') > - 1) {
    return path.substring(0, path.lastIndexOf('/'));
  }
  // Check for path have file name only
  if (path.lastIndexOf('.') > - 1) {
    return '';
  }
  return path;
}
export function toBase64(path: string): string {
  return window.btoa(path);
}

export function maskify(value: string, maskcharacter: string = '*', characterCountToUnmask: number = 4): string {
  const regexToReplace = new RegExp('.(?=.{' + characterCountToUnmask + ',}$)', 'g');
  if (!value) return value;
  return value.toString().replace(regexToReplace, maskcharacter);
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const base64String = reader.result as string;
      if (blob.type.includes('image/png')) {
        resolve(`data:image/png;base64,${base64String.split(',')[1]}`);
      } else {
        resolve(base64String);
      }
    };
    reader.readAsDataURL(blob);
  });
}

export function uniqueFileName(fileName: string) {
  const extensionIndex = fileName.lastIndexOf('.');
  const fileNameOnly = fileName.substring(0, extensionIndex);
  const extension = fileName.substring(extensionIndex + 1);
  return `${fileNameOnly}_${Math.floor(Math.random() * Date.now()).toString(16)}.${extension}`
}

// Reuse enum keys instead of defining additional constants. Suitable for keys that are simple words. 
// For example, "QuickHire" => "Quick Hire"
export function convertEnumKeyToDisplay(key: string): string {
  return key ? key.toString().replace(/([A-Z])/g, ' $1').trim() : '';
}
