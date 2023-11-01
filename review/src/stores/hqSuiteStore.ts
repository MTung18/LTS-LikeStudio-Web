import { hqSuiteApi } from "@/axios/instances/fsiDocumentStorageApi";
import { useAlerts } from "@/composables/useAlerts";
import { getFileType } from "@/helper/hqSuite/fileHelper";
import { formatPath, getFileName, getSourcePath } from "@/helper/hqSuite/formatHelper";
import { HQSuiteExtensionItem } from "@/models/hqSuite/hqSuiteExtensionItem";
import { HQSuiteRecordItem } from "@/models/hqSuite/HQSuiteRecordItem";
import { CreateFolderModel, UploadFileModel } from "@/models/hqSuite/hqUploadFile";
import JSZip from "jszip";
import moment from "moment";
import { saveAs } from "file-saver";
import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import {
  BatchDownload,
  BatchDownloadStatus,
  BatchFile,
  BatchFileStatus,
} from "@/models/hqSuite/batchDownload";

const folderPathDelimeter = "/";

export const useHQSuiteStore = defineStore("hqSuite", () => {
  const { notifySuccess, notifyError } = useAlerts();
  const allowedExtensions: Ref<HQSuiteExtensionItem[]> = ref(
    new Array<HQSuiteExtensionItem>()
  );
  const uploadedDocumentDetails: Ref<any> = ref(null);
  const recordItems: Ref<HQSuiteRecordItem[]> = ref(
    new Array<HQSuiteRecordItem>()
  );
  const isDeleted: Ref<boolean> = ref(false);
  const batchDownload: Ref<BatchDownload> = ref(new BatchDownload());

  async function fetchAllowedExtensions(): Promise<void> {
    allowedExtensions.value = await hqSuiteApi.getAllowedExtensions();
  }

  async function uploadDocument(
    fileData: UploadFileModel,
    createRootFolderIfNotExists: boolean = false
  ): Promise<void> {
    let isValid = true;
    if (createRootFolderIfNotExists) {
      isValid = await checkAndCreateFullRootFolder(fileData.path);
    }
    if (isValid)
      uploadedDocumentDetails.value = await hqSuiteApi.uploadFile(fileData);
  }

  async function uploadBatchDocuments(
    fileList: UploadFileModel[],
    createRootFolderIfNotExists: boolean = false
  ): Promise<any[]> {
    let isValid = true;
    if (createRootFolderIfNotExists) {
      isValid = await checkAndCreateFullRootFolder(fileList[0].path);
    }
    if (isValid) {
      const promises: Array<Promise<void>> = [];
      for (let index = 0; index < fileList.length; index++) {
        const currentfile = fileList[index];
        promises.push(hqSuiteApi.uploadFile(currentfile, true));
      }
      let uploadPromises = await Promise.all(promises);
      return uploadPromises;
    }
  }


  async function fetchRecordItems(
    folderPath: string,
    createIfNotExists: boolean = false
  ): Promise<HQSuiteRecordItem[]> {
    recordItems.value = await hqSuiteApi.getRecordItems(folderPath);
    if (
      !recordItems.value ||
      (recordItems.value.length == 0 && createIfNotExists)
    ) {
      if (!folderPath) {
        // If root folder is not exists then creating a root folder
        recordItems.value = await this.createFolder({
          path: "",
          name: "WorkforceHQ",
        });
      } else if (createIfNotExists) {
        recordItems.value = await this.createFolder({
          path: folderPath,
          name: formatPath(folderPath),
        });
      }
    }
    return recordItems.value;
  }

  async function createFolder(filePath: CreateFolderModel): Promise<void> {
    recordItems.value = await hqSuiteApi.createFolder(filePath);
  }

  async function downloadFile(filePath: string, isDownloadAble = true) {
    await hqSuiteApi.downloadFile(filePath, isDownloadAble);
  }

  async function checkAndCreateFullRootFolder(
    fullPath: string
  ): Promise<boolean> {
    if (await checkFolderExists(formatPath(fullPath))) {
      return true;
    }

    const pathArray: any = formatPath(fullPath).split(folderPathDelimeter);
    let sourcePath = "";
    for (let index = 0; index < pathArray.length; index++) {
      const path: string = pathArray[index];
      try {
        if (!(await checkFolderExists(formatPath(`${sourcePath}${path}`)))) {
          const newPath = new CreateFolderModel(formatPath(sourcePath), path);
          try {
            await hqSuiteApi.createFolder(newPath, true);
          } catch {
            notifyError(`Failed to create Folder: ${path}.`);
            return false;
          }
        }
        sourcePath += `${path}/`;
      } catch {
        notifyError(`Failed to create Folder:${path}.`);
        return false;
      }
    }
    return true;
  }

  async function checkFolderExists(path: string): Promise<boolean> {
    const requestedSourcePath: string = getSourcePath(path);
    const hQSuiteRecordItem = await hqSuiteApi.getRecordItems(
      requestedSourcePath,
      true
    );
    // Check the path exists in parent folder files/folders results
    const selectedPath: HQSuiteRecordItem = hQSuiteRecordItem?.find(
      (item: HQSuiteRecordItem) =>
        formatPath(item.path.toLowerCase()) === formatPath(path.toLowerCase())
    );
    const isExists = !!(selectedPath && selectedPath?.path !== "");
    return isExists;
  }

  async function deleteFile(filePath: string) {
    isDeleted.value = await hqSuiteApi.deleteFile(filePath);
    return isDeleted.value;
  }

  //#region Batch Download
  async function downloadFilesAsZip(filePaths: string[]): Promise<void> {
    if (
      batchDownload.value.status === BatchDownloadStatus.Idle ||
      batchDownload.value.status === BatchDownloadStatus.Finished ||
      batchDownload.value.status === BatchDownloadStatus.Error
    ) {
      try {
        clearBatchDownload();
        batchDownload.value.status = BatchDownloadStatus.Ready;
        batchDownload.value.totalNumberOfFilesToDownload = filePaths.length;
        batchDownload.value.files = filePaths.map(
          (path) => new BatchFile({ name: getFileName(path, true), path })
        );
        const promises: Array<Promise<void>> = [];
        const zip = new JSZip();
        batchDownload.value.files.forEach((file) => {
          batchDownload.value.status = BatchDownloadStatus.InProgress;
          promises.push(
            hqSuiteApi
              .getFile(file.path)
              .then((data: any) => {
                if (data) {
                  const fileType: string = getFileType(file.name);
                  zip.file(
                    file.name,
                    new Blob([data.data], { type: fileType }),
                    { base64: true }
                  );
                  batchDownload.value.updateStatusWhenDownloadCompleteForEachFile(
                    file
                  );
                } else {
                  file.status = BatchFileStatus.Error;
                }
              })
              .catch(() => {
                file.status = BatchFileStatus.Error;
              })
          );
        });

        await Promise.all(promises);

        const numberOfFiles = Object.keys(zip.files).length;
        if (numberOfFiles > 0) {
          batchDownload.value.status = BatchDownloadStatus.Zipping;
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, `${moment().unix()}.zip`);
            batchDownload.value.status = BatchDownloadStatus.Finished;
          });
        } else {
          batchDownload.value.status = BatchDownloadStatus.Error;
        }
      } catch (error: any) {
        batchDownload.value.status = BatchDownloadStatus.Error;
        console.error(error);
      }
    } else {
      notifyError(
        `The batch download is currently underway. Please try again later.`
      );
    }
  }

  async function clearBatchDownload(): Promise<void> {
    batchDownload.value = new BatchDownload();
  }
  //#endregion  Batch Download
  async function getFile(filePath: string) {
    return await hqSuiteApi.getFile(filePath);
  }

  async function getAllImageInListPost(filePathArr: Array<string>) {
    // return all promise to get image
    return await Promise.allSettled(
      filePathArr.map((path) => {
        if (path) {
          return hqSuiteApi.getFile(path)
        } else {
          return Promise.resolve('')
        }
      })
    );
  }

  async function previewPDFFile(filePath: string) {
    const fileData = await hqSuiteApi.getFile(filePath);
    const blob = new Blob([fileData.data], { type: 'application/pdf' });
    const dataUrl = URL.createObjectURL(blob);
    window.open(dataUrl, '_blank');
  }

  async function previewImageFile(filePath: string) {
    const fileData = await hqSuiteApi.getFile(filePath);
    const fileType = getFileType(filePath?.split('.')?.pop() ?? '');
    const blobData = new Blob([fileData.data], { type: fileType });
    const imageUrl = URL.createObjectURL(blobData);
    const image = new Image();
    image.src = imageUrl;
    const newTab = window.open();
    newTab.document.write('<html><head><title>Image Preview</title></head><body>');
    newTab.document.body.appendChild(image);
    newTab.document.write('</body></html>');
  }

  return {
    allowedExtensions,
    uploadedDocumentDetails,
    recordItems,
    batchDownload,
    isDeleted,
    fetchAllowedExtensions,
    uploadDocument,
    uploadBatchDocuments,
    fetchRecordItems,
    createFolder,
    downloadFile,
    downloadFilesAsZip,
    clearBatchDownload,
    deleteFile,
    getFile,
    previewImageFile,
    previewPDFFile,
    getAllImageInListPost,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHQSuiteStore, import.meta.hot));
}
