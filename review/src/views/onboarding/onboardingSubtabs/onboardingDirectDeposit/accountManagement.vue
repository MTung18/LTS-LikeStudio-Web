<script setup lang="ts">
import DarkThemeModal from "@/components/viewComponents/onboarding/darkThemeModal.vue";
import { useAlerts } from "@/composables/useAlerts";
import { useBreakpoints } from "@/composables/useBreakpoints";
import {
  BANK_ACCOUNT_STATUS_OPTIONS,
  BANK_ACCOUNT_TYPE_OPTIONS,
  DISTRIBUTION_METHODS,
  DISTRIBUTION_METHOD_OPTIONS,
  APPROVAL_STATUS
} from "@/constants/common";
import { getFileName, removeFileFromPath } from "@/helper/hqSuite/formatHelper";
import { DocumentTypes, makeDocumentPath } from "@/helper/hqSuite/pathHelper";
import DirectDepositAccount, {
  MetaFieldT,
} from "@/models/onboarding/OnboardingDirectDeposit";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingDirectDepositStore } from "@/stores/onboardingDirectDepositStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { isFileSizeValid } from "@/utilities/fileUtils";
import {
  capitalizeFirstChar,
  randomString,
  showLastNChar,
  fsCurrencyConfig
} from "@/utilities/formatUtils";
import { Store } from "@bryntum/grid";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle,
  faEye,
  faEyeSlash,
  faPenToSquare,
  faPlus,
  faTimes,
  faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import {
  faArrowUpFromBracket,
  faAsterisk,
  faExclamationCircle,
  faSync,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { isBoolean, isEqual } from "lodash-es";
import { storeToRefs } from "pinia";
import { Ref, computed, onMounted, ref, toRaw, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
const acceptFileList = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const azureB2CAuthStore = useAzureB2CAuthStore();
const { setLoading } = useLoadingStore();
const { responsive } = useBreakpoints();
const { notifyError, notifySuccess } = useAlerts();
const hqSuiteStore = useHQSuiteStore();
const clientId = computed(
  () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
library.add(
  faAsterisk,
  faPenToSquare,
  faEye,
  faPlus,
  faEyeSlash,
  faExclamationCircle,
  faArrowUpFromBracket,
  faCheckCircle,
  faTimes,
  faSync,
  faTrashCan
);

const {
  fetchAccount,
  updateCurAccountList,
  deleteAccount,
  addAccount,
  updateCurAccountListOrder,
  updateSelectedAccountId,
  submitAccounts,
  getMetaData,
} = useOnboardingDirectDepositStore();
const {
  selectedAccountId,
  curAccountList,
  accountList,
  startAtMode,
  approvalStatusOptions,
  bankAccountTypeOptions, 
  distributionMethodOptions
} = storeToRefs(useOnboardingDirectDepositStore());
const isLoading = ref(true);
const { markOnboardingSidenavItemAsDone } = useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const router = useRouter();
const route = useRoute();
const currentNavItem = ref(null);
const isSm = ref<boolean>();
const isMd = ref<boolean>();
const isLg = ref<boolean>();
const isXl = ref<boolean>();
const isAccNumbDuplicated = ref(false);
const employeeId = computed(() => Number(route.params.id));
const unSupportedFileTypeError =
  "The file should be uploaded in JPEG/JPG/PNG/PDF/DOC/DOCX/PPT/PPTX format";
const form = ref(null);
const removedUploadFiles = ref<string[]>([]);
const removeAccountIds = ref<Array<string | number>>([])
const tableKey = ref(null);
const hideAccountNumber = ref(true);
const hideRoutingNumber = ref(true);
const hideAccountNumberConfirm = ref(true);
const openDeleteConfirmModal = ref(false);
const openDiscardConfirmModal = ref(false);
const deleteAccountId = ref(null);
const accountNumberConfirm = ref("");
const isEditMode = ref(true);
const canSubmit = ref(false);
const bankAccountType = ref<MetaFieldT>({} as MetaFieldT);
const distributionMethod = ref<MetaFieldT>({} as MetaFieldT);
const accountStatus = ref<{ id: boolean; name: string }>(
  {} as { id: boolean; name: string }
);

type FormFileT = {
  fileName?: string;
  filePath?: string;
  fileObject?: File;
  fileUrl?: string;
  payload?: {
    id: string | number;
  };
};

const selectedAccount = ref<DirectDepositAccount & { id?: string | number }>();

const uploadFiles = ref<Partial<FormFileT>[]>([
  {
    fileName: "",
    filePath: "",
    fileObject: null,
    fileUrl: "",
    payload: {
      id: "",
    },
  },
]);
const grid = ref(null);
const inputPadding = ref("16px");
const fileInput = ref(null);
const openSaveChangeModal = ref(false);
const unSaveChange = ref(false);
const toPath = ref("");
const isForcePush = ref(false);
const gridConfig = ref({
  minHeight: 50,
  maxHeight: isSm.value && 350,
  rowHeight: 50,
  autoHeight: true,
  features: {
    cellEdit: false,
    headerMenu: {
      disabled: false,
    },
    rowReorder: {
      showGrip: true,
      listeners: {
        gridRowDrop: async ({ context }) => {
          const parentIndex = context.records[0].originalData.parentIndex;
          const valid = await validateForm();
          // Prevent dragging other accounts to below remaining account
          if (
            parentIndex === curAccountList.value.length - 1 ||
            context.records[0].originalData?.distributionMethod?.name ===
            DISTRIBUTION_METHODS.remaining
          ) {
            gridStore.value.data = [];
            gridStore.value.data = curAccountList.value;
          } else if (valid && !isAccNumbDuplicated.value) {
            curAccountList.value =
              gridStore.value.toJSON() as DirectDepositAccount[];
            selectedAccountId.value = context.records[0].originalData.employeeDirectDepositId;
            updateCurAccountListOrder(curAccountList.value);
          } else {
            grid.value?.instance.value.selectRow({
              record: selectedAccount.value.id,
            });
          }
        },
      },
    },
  },
  emptyText: "",
  columns: [
    {
      flex: 4,
      type: "template",
      groupable: false,
      sortable: true,
      htmlEncode: false,
      template: ({ record }: { record: any }) => {
        const displayOrder = record.originalData.parentIndex + 1;
        const isActive = record.isActive;
        return [
          {
            style: {
              border: `solid 2px #03A9F4`,
            },
            class: `py-1 px-2 me-2 text-blue fw-bold`,
            text: `${record.distributionMethodName === DISTRIBUTION_METHODS.remaining
                ? `R`
                : displayOrder
              }`,
          },
          isBoolean(isActive) && {
            class: isActive
              ? `bg-success me-2 fw-bold rounded-circle`
              : `bg-secondary me-2 fw-bold rounded-circle`,
            html: `<div class="p-1"><div/>`,
          },
          {
            class: `me-2 fw-bold`,
            text: `${record.accountTypeName
                ? capitalizeFirstChar(record.accountTypeName)
                : "New Account"
              }`,
          },
          {
            class: `fw-bold`,
            html: `${record.bankAccountNumber ? showLastNChar(record.bankAccountNumber) : ""
              }`,
          },
        ];
      },
    },
    {
      fixed: "right",
      flex: 1,
      type: "action",
      id: "action",
      autoWidth: true,
      columnDragToolbar: false,
      enableHeaderContextMenu: false,
      enableCellContextMenu: false,
      cellCls: "b-action-cell--hover",
      actions: [
        {
          visible: true,
          renderer: () => {
            return '<i class="px-2 b-action-item b-fa b-fa-trash-alt cursor-pointer no-underline text-danger"></i>';
          },
          onClick: async (context) => {
            deleteAccountId.value = context.record.originalData.employeeDirectDepositId;
            openDeleteConfirmModal.value = true;
          },
        },
      ],
    },
  ],
  listeners: {
    cellClick: async ({
      column,
      record,
    }: {
      record: any;
      column: any;
    }) => {
      if (column.type !== "action") {
        const valid = await validateForm();
        if (valid && !isAccNumbDuplicated.value) {
          selectedAccountId.value = record.data.employeeDirectDepositId;
        } else {
          grid.value?.instance.value.selectRow({
            record: selectedAccount.value.id,
          });
        }
      }
    },
  },
});

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
  })
);

const populateBryntumStore = async () => {
  gridStore.value.data = curAccountList.value;
}

const validateAccountList = () => {
  // must have only one remaining account
  const isOnlyRemainingAcc =
    curAccountList.value.filter(
      (account) =>
        account.distributionMethodName === DISTRIBUTION_METHODS.remaining
    ).length === 1;

  // remove redundant parentIndex prop in currentAccountList taken from gridStore.value
  const _curAccountList = curAccountList.value.map((account) => {
    const { parentIndex, id, ...filterItem } = account;
    filterItem.distributionAmount = Number(filterItem.distributionAmount);
    return filterItem;
  });

  const _accountList = accountList.value.map((account) => {
    const obj = {};
    Object.assign(obj, account);
    return obj;
  });

  const isSame = isEqual(_curAccountList, _accountList);

  checkDuplicateAccountNumber();

  canSubmit.value = !isSame && isOnlyRemainingAcc && !isAccNumbDuplicated.value;

  return {
    isOnlyRemainingAcc,
    isSame,
  };
};

const checkDuplicateAccountNumber = () => {
  isAccNumbDuplicated.value = curAccountList.value.some((accountA) => {
    return (
      curAccountList.value.filter(
        (accountB) => accountB.bankAccountNumber === accountA.bankAccountNumber
      ).length > 1
    );
  });
};

// trigger file input from clicking custom upload button
function chooseFile() {
  const element = document.getElementById("upload_file") as HTMLInputElement;
  element.value = "";
  element.click();
}

function isFileTypeSupported(fileType: string) {
  return acceptFileList.includes(fileType);
}

async function saveFile(filePath: string, file: File, fileName: string) {
  await hqSuiteStore.uploadDocument(
    { path: filePath, file: file, fileName: fileName },
    true
  );
}

const handleUploadFile = async (event: Event) => {
  setLoading(true);
  const target = event.target as HTMLInputElement;
  const files = target.files;
  for (let i = 0; i < files.length; i++) {
    if (!isFileTypeSupported(files[i].type)) {
      setLoading(false);
      notifyError(unSupportedFileTypeError);
      return;
    }
    if (!isFileSizeValid(files[i])) {
      setLoading(false);
      return;
    }
    const pathForEmployeeDoc = await makeDocumentPath(
      DocumentTypes.HrOnboardDirectDeposit,
      `${clientId.value}`,
      employeeId.value.toString()
    );
    const reader = new FileReader();

    reader.onload = () => {
      const fileUrl = reader.result.toString();
      const data = {
        fileName: files[i].name,
        filePath: pathForEmployeeDoc,
        fileObject: new File([files[i]], files[i].name),
        fileUrl: fileUrl,
        payload: {
          id: selectedAccountId.value,
        },
      };
      uploadFiles.value.push(data);
      selectedAccount.value.voidedCheckFilePath = `${pathForEmployeeDoc}/${files[i].name}`;
    };
    reader.readAsDataURL(files[i]);
  }
  setLoading(false);
};

const handlePreviewFile = async (files: FormFileT[]) => {
  const file = files.find(
    (item) => item.payload.id === selectedAccountId.value
  );
  setLoading(true);
  if (!file) return;
  if (file?.fileObject) {
    if (file.fileUrl) {
      const newTab = window.open("", "_blank");
      newTab?.document.write(
        '<iframe src="' +
        file?.fileUrl +
        '" style="width: 100%; height: 100%"></iframe>'
      );
    }
  } else {
    const fullFileName = file.filePath;
    // CHECK FILE TYPE
    let fileType = "";
    const parts = file.fileName.split(".");
    if (parts.length > 1) {
      fileType = parts[parts.length - 1].toLowerCase();
    } else {
      fileType = "";
    }
    // WITH TYPE PDF
    if (fileType === "pdf") {
      const newTab = window.open("", "_blank");
      const res = await hqSuiteStore.previewPDFFile(fullFileName);
      newTab?.document.write(
        '<iframe src="' + res + '" style="width: 100%; height: 100%"></iframe>'
      );
    } else if (["png", "jpg", "jpeg"].includes(fileType)) {
      //WITH TYPE IMAGE
      const res = await hqSuiteStore.previewImageFile(fullFileName);
      const newTab = window.open("", "_blank");
      newTab?.document.write(
        '<iframe src="' + res + '" style="width: 100%; height: 100%"></iframe>'
      );
    }
  }
  setLoading(false);
};

const handleRemoveFileItem = (files) => {
  const curFile = files.find((item) => item?.payload.id === selectedAccountId.value)
  setLoading(true);
  if (curFile?.fileName && !curFile?.fileObject) {
    removedUploadFiles.value.push(curFile.fileName);
  }
  (selectedAccount.value.voidedCheckFilePath = ""),
    (uploadFiles.value = uploadFiles.value.filter(
      (file) => file?.payload.id !== selectedAccountId.value
    ));

  setLoading(false);
};

const onSaveForm = () => {
  updateCurAccountList(selectedAccount.value);
};

const addNewForm = () => {
  isEditMode.value = false;
  const newSequence = curAccountList.value.length;
  const newId = `add_${randomString(16)}`;
  const approvalStatusPendingHrm = approvalStatusOptions.value.find(
    (item) => item.name === APPROVAL_STATUS.pendingHRM
  )?.id
  // reset form
  bankAccountType.value = null;
  distributionMethod.value = null;
  accountStatus.value = {
    id: true,
    name: "Active"
  };
  accountNumberConfirm.value = "";
  selectedAccount.value = {
    ordinalPosition: newSequence,
    id: newId,
    employeeDirectDepositId: newId,
    voidedCheckFilePath: "",
    approvalStatusName: APPROVAL_STATUS.pendingHRM,
    approvalStatusId: approvalStatusPendingHrm,
    accountTypeId: null,
    accountTypeName: "",
    distributionMethodName: "",
    distributionMethodId: null,
    bankRoutingNumber: "",
    bankAccountNumber: "",
    isActive: true,
    employeeId: employeeId.value,
    isPrenoteRequired: false,
    distributionAmount: null,
    description: "",
    status: "Active",
    rowUniqueId: null,
  };

  addAccount(selectedAccount.value);
  selectedAccountId.value = newId;
  // re-populate store
  gridStore.value.data = [];
  gridStore.value.data = curAccountList.value;
  grid.value?.instance.value.selectRow({ record: newId });
};

const onAdd = async () => {
  if (curAccountList.value.length === 0) {
    addNewForm();
  } else if (curAccountList.value.length > 0) {
    if (
      selectedAccount.value.distributionMethodName ===
      DISTRIBUTION_METHODS.remaining &&
      !accountStatus.value?.id
    ) {
      form.value.setFieldError("isActive", "Remaining account must be Active");
    } else {
      const valid = await validateForm();
      if (valid && !isAccNumbDuplicated.value) {
        addNewForm();
        setTimeout(() => {
          form.value.setErrors([]);
        });
      }
    }
  }
};

const onDelete = async () => {
  setLoading(true);
  removeAccountIds.value.push(deleteAccountId.value);
  curAccountList.value = curAccountList.value.filter((account) => account.employeeDirectDepositId !== deleteAccountId.value)
  deleteAccountId.value = null;
  gridStore.value.data = [];
  gridStore.value.data = curAccountList.value;
  if (curAccountList.value && curAccountList.value.length > 0) {
    curAccountList.value
      .map((account) => account.employeeDirectDepositId)
      .includes(selectedAccountId.value)
      ? updateSelectedAccountId(selectedAccountId.value)
      : updateSelectedAccountId(curAccountList.value[0].employeeDirectDepositId);

    grid.value?.instance.value.selectRow({ record: selectedAccount.value[0]?.id });
  }
  openDeleteConfirmModal.value = false;
  setLoading(false);
};

const resetAll = async () => {
  isForcePush.value = true;
  await fetchAccount(employeeId.value);
  await router.push({ name: "onboardingDirectDeposit" });
};

const onReset = () => {
  isForcePush.value = true;
  const { isSame } = validateAccountList();
  isSame
    ? router.push({ name: "onboardingDirectDeposit" })
    : (openDiscardConfirmModal.value = true);
};

const submitAll = async () => {
  isForcePush.value = true;
  setLoading(true);

// remove deleted uploadFiles before upload form data
if (removedUploadFiles.value.length > 0) {
    removedUploadFiles.value.map((removeFile) => {
      removeFileFromPath(removeFile);
    })
  }

  // remove deleted accounts before upload form data
  if(removeAccountIds.value.length > 0){
    await Promise.all(
      removeAccountIds.value.map(async (id: string | number) => {
        await deleteAccount({employeeId: employeeId.value, directDepositId: id});
      })
      )
    }
    removeAccountIds.value = [];

  const selectedAccountFile = uploadFiles.value.find(
    (file) => file?.payload.id === selectedAccountId.value
  );
  if (selectedAccountFile?.fileObject) {
    await saveFile(
      selectedAccountFile?.filePath,
      selectedAccountFile?.fileObject,
      selectedAccountFile?.fileName
    );
  }
  curAccountList.value.forEach((account) => {
    account.approvalStatusId =
      approvalStatusOptions.value.find(
        (item) => item.name === account.approvalStatusName
      )?.id || null;
    account.status = BANK_ACCOUNT_STATUS_OPTIONS.find(
      (item) => item.id === account.isActive
    )?.name;
  });

  const rawData = toRaw(curAccountList.value);

  rawData.forEach((account) => {
    if (String(account.employeeDirectDepositId).startsWith("add_")) {
      account.isActive = true;
    }
  });

  const remainingAccIndex = rawData.findIndex(
    (account) =>
      account.distributionMethodName === DISTRIBUTION_METHODS.remaining
  );
  rawData[remainingAccIndex].isActive = true;
  rawData[remainingAccIndex].distributionAmount = 0;

  rawData.push(rawData.splice(remainingAccIndex, 1)[0]);

  const sortedData = rawData.map((item, index) => {
    if (item.distributionMethodName === DISTRIBUTION_METHODS.remaining) {
      item.ordinalPosition = -1;
    } else {
      item.ordinalPosition = index + 1;
    }
    
    if (String(item.employeeDirectDepositId).startsWith('add_')){
      item.employeeDirectDepositId = null;
    }

    return item;
  });

  await Promise.all([submitAccounts({ updateAccountList: sortedData, employeeId: employeeId.value }),
  markOnboardingSidenavItemAsDone(
    currentNavItem.value?.progressSidebarId,
    true,
    employeeId.value
  )
  ]).catch((error) => {
    console.error(error)
  })
  if (accountList.value.length === 0) {
    notifySuccess('Direct deposit information added.')
  } else {
    notifySuccess('Direct deposit information updated.')
  }
  await router.push({ name: "onboardingDirectDeposit" });
  setLoading(false);
};

const onSubmit = async () => {
  if (
    selectedAccount.value.distributionMethodName ===
    DISTRIBUTION_METHODS.remaining &&
    !accountStatus.value?.id
  ) {
    form.value.setFieldError("isActive", "Remaining account must be Active");
  } else {
    const valid = await validateForm();
    const { isOnlyRemainingAcc, isSame } = validateAccountList();
    if (valid && canSubmit.value) {
      submitAll();
    } else if (!isOnlyRemainingAcc) {
      notifyError("There must be 1 Remaining account!");
    } else if (isSame) {
      notifyError("No changes made");
    } else {
      return;
    }
  }
};

watch(
  () => selectedAccountId.value,
  async (newId, oldId, _cb) => {
    setLoading(true);
    // switch between edit and add mode by id determination
    isEditMode.value = !String(newId).startsWith(`add_`);
    selectedAccount.value =
      curAccountList.value.find((account) => {
        return account.employeeDirectDepositId === selectedAccountId.value;
      }) || ({} as DirectDepositAccount);

    bankAccountType.value = {
      id: selectedAccount.value?.accountTypeId,
      name: selectedAccount.value?.accountTypeName,
    };
    distributionMethod.value = {
      id: selectedAccount.value?.distributionMethodId,
      name: selectedAccount.value?.distributionMethodName,
    };
    accountStatus.value = {
      id: selectedAccount.value?.isActive,
      name: BANK_ACCOUNT_STATUS_OPTIONS.find((item) => item.id === selectedAccount.value?.isActive)?.name,
    };
    if (selectedAccount.value.bankAccountNumber) {
      accountNumberConfirm.value = String(
        selectedAccount.value.bankAccountNumber
      );
    }
    grid.value?.instance.value.selectRow({ record: newId });
    setLoading(false);
  }
);

watch(
  () => selectedAccount.value,
  async () => {
    checkDuplicateAccountNumber();
    if (isEditMode.value) {
      const valid = await validateForm();
      if (valid && !isAccNumbDuplicated.value) {
        onSaveForm();
        tableKey.value++;

        setTimeout(() => {
          grid.value?.instance.value.selectRow({
            record: selectedAccount.value.id,
          });
        }, 0);
      }
    }
  },
  {
    deep: true,
  }
);

watch([() => responsive.breakpoint, () => responsive.screenWidth], () => {
  isSm.value = responsive.breakpoint === "sm";
  isMd.value = responsive.breakpoint === "md";
  isLg.value = responsive.breakpoint === "lg";
  isXl.value = responsive.breakpoint === "xl";

  if (isSm.value) {
    gridConfig.value.minHeight = 150;
    gridConfig.value.maxHeight = 350;
    inputPadding.value = "6px";
    tableKey.value++;
  } else if (isMd.value) {
    inputPadding.value = "6px";
  } else if (isLg.value) {
    inputPadding.value = "12px";
  } else if (isXl.value) {
    inputPadding.value = "16px";
  }
});

onMounted(async () => {
  setLoading(true);
  isLoading.value = true;
  await Promise.all([
    fetchAccount(employeeId.value),
    getMetaData(employeeId.value),

  ]);
  currentNavItem.value = onboardingSideNavItem.value.find(
    (item) =>
      item.progressSidebarUrl.trim().toLowerCase() ===
      "onboardingDirectDeposit".trim().toLocaleLowerCase()
  );

  uploadFiles.value = curAccountList.value.map((item) => {
    if (item.voidedCheckFilePath){   
      const uploadFile = {
        filePath: item.voidedCheckFilePath,
        fileName: getFileName(item.voidedCheckFilePath, true),
        payload: {
          id: item.employeeDirectDepositId
      }
    };
    return uploadFile;
  }
  });

  if (startAtMode.value === "add" || accountList.value.length === 0) {
    addNewForm();
    setTimeout(() => {
      form.value.setErrors([]);
    }, 0);  
  } else if (startAtMode.value === "edit") {
    selectedAccountId.value = selectedAccountId.value
      ? selectedAccountId.value
      : curAccountList.value[0].employeeDirectDepositId;
    selectedAccount.value = curAccountList.value.find((account) => {
      return account.employeeDirectDepositId === selectedAccountId.value;
    });

    if (selectedAccount.value){
      bankAccountType.value.id = selectedAccount.value.accountTypeId;
      bankAccountType.value.name = bankAccountTypeOptions.value.find((item => item.id ===selectedAccount.value.accountTypeId)).name;
      distributionMethod.value.id = selectedAccount.value.distributionMethodId;
      distributionMethod.value.name = distributionMethodOptions.value.find((item => item.id === selectedAccount.value.distributionMethodId)).name
      accountStatus.value.id = selectedAccount.value.isActive;
      accountStatus.value.name = BANK_ACCOUNT_STATUS_OPTIONS.find((item) => item.id === selectedAccount.value.isActive)?.name;
      accountNumberConfirm.value = String(selectedAccount.value.bankAccountNumber);
    }
  }

  await populateBryntumStore();
  setTimeout(() => grid.value?.instance.value.selectRow({ record: selectedAccount.value.id }));
  isLoading.value = false;
  setLoading(false);
});

onBeforeRouteLeave((to, from, next) => {
  if (isForcePush.value) {
    next();
    return true;
  }
  const { isSame } = validateAccountList();
  if (isSame) {
    next();
    return true;
  } else {
    toPath.value = to.fullPath;
    next(false);
    openSaveChangeModal.value = true;
    return false;
  }
});

const handleDiscardOnRouteChange = () => {
  unSaveChange.value = true;
  openSaveChangeModal.value = false;
  isForcePush.value = true;
  router.push(toPath.value);
};

const handleCancelDiscardOnRouteChange = () => {
  unSaveChange.value = false;
  openSaveChangeModal.value = false;
};

watch(
  [
    () => bankAccountType.value,
    () => accountStatus.value,
    () => distributionMethod.value,
  ],
  () => {
    selectedAccount.value.accountTypeName = bankAccountType.value?.name;
    selectedAccount.value.accountTypeId = bankAccountType.value?.id;
    selectedAccount.value.distributionMethodName =
      distributionMethod.value?.name;
    selectedAccount.value.distributionMethodId = distributionMethod.value?.id;
    selectedAccount.value.isActive = accountStatus.value?.id;
    selectedAccount.value.status = BANK_ACCOUNT_STATUS_OPTIONS.find(
      (item) => item.id === accountStatus.value?.id
    )?.name;
  },
  {
    deep: true,
  }
);

const validateForm = async () => {
  if (!selectedAccount.value.accountTypeName) {
      await form.value.setFieldValue('bankAccountType', null)
    }

    if (isEditMode.value) {
      if (selectedAccount.value.isActive === undefined) {
        form.value.setFieldValue('isActive', null)
      }
    }

    if (!selectedAccount.value.distributionMethodName) {
      await form.value.setFieldValue('distributionMethod', null)
    }

    const { valid } = await form.value.validate();

    return valid
}

const uploadedFileName = computed(() => {
  return uploadFiles.value.find((file) => file?.payload.id === selectedAccountId.value)?.fileName
})
</script>

<template>
  <div class="hq-pg__grid bg-white h-100" v-if="!isLoading">
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain border-bottom border-2 border-cyan" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
      <fs-row class="px-3 d-flex justify-content-between align-items-center">
        <fs-col class="text-truncate">
          <h2 class="hq-pg__title">Manage Bank Accounts</h2>
        </fs-col>
        <fs-col cols="auto" class="ms-auto">
          <div class="d-flex">
            <fs-button variant="outline-secondary" class="me-2" @click="onReset">Cancel</fs-button>
            <fs-button variant="success" @click="onSubmit">Save</fs-button>
          </div>
        </fs-col>
      </fs-row>
    </fs-container>
    <fs-container fluid class="px-0">
      <fs-row class="h-100" no-gutters>
        <fs-col sm="12" md="5" lg="3">
          <div class="border-end d-flex flex-column  pt-0 h-100">
            <div >
              <div class="sub-title p-3 d-flex justify-content-between align-items-center">
                <div>Sequence</div>
                <fs-button @click="onAdd" class="bg-cyan text-white" variant="outlined" v-if="isSm">
                  <font-awesome-icon icon="fal fa-plus" class="me-2" />
                  Add account
                </fs-button>
              </div>
              <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
            </div>
            <div class="d-flex w-100 p-3 border-top" v-if="!isSm">
              <fs-button @click="onAdd" variant="cyan" block>
                <font-awesome-icon icon="fal fa-plus" class="me-2" />
                Add account
              </fs-button>
            </div>
          </div>
        </fs-col>

        <fs-col >
          <fs-container fluid class="p-0">
            <div v-if="!isSm" class=" contain sub-title pe-3 py-3 border-bottom" :class="[isSm ? 'ps-4' : '']">
              Account Information
            </div>
            <fs-container class="contain flex-grow-1 py-3" v-if="curAccountList.length">
              <VeeForm ref="form" style="height: 100%" :class="[isSm ? 'ps-3' : '']" id="accountForm">
                <fs-row>
                  <fs-col md="12" lg="6">
                    <div>
                      <fs-input name="bankAccountType" type="fsMultiselectList" label="Bank Account Type" :required="true"
                        :rules="{ required: true }" v-model="bankAccountType" :typeaheaddata="BANK_ACCOUNT_TYPE_OPTIONS"
                        typeaheadvalueattribute="id" typeaheadkey="name" showClear />
                    </div>
                  </fs-col>

                  <fs-col md="12" lg="6">
                    <div v-show="isEditMode">
                      <fs-input name="isActive" type="fsMultiselectList" label="Status" :required="true"
                        :rules="{ required: true }" v-model="accountStatus" :typeaheaddata="BANK_ACCOUNT_STATUS_OPTIONS"
                        typeaheadvalueattribute="id" typeaheadkey="name" showClear />
                    </div>
                  </fs-col>
                </fs-row>

                <fs-row>
                  <fs-col md="12" lg="6">
                    <div>
                      <fs-input name="distributionMethod" type="fsMultiselectList" label="Distribution Method"
                        :required="true" :rules="{ required: true }" v-model="distributionMethod"
                        :typeaheaddata="DISTRIBUTION_METHOD_OPTIONS" typeaheadvalueattribute="id" typeaheadkey="name"
                        showClear />
                    </div>
                  </fs-col>

                  <fs-col md="12" lg="6">
                      <div v-if="!selectedAccount?.distributionMethodName ||
                        selectedAccount?.distributionMethodName ===
                        DISTRIBUTION_METHODS.amount
                        ">
                          <fs-input type="fsCurrencyInput" v-model="selectedAccount.distributionAmount" label="Distribution Amount"
                          name="distributionAmount" prepend="$" showCharacterCount 
                          :config="{
                            ...fsCurrencyConfig,
                            valueRange: {
                              min: 0.01,
                              max: 9999999999.99
                            }
                          }" :step="0.01" :rules="{
                            required: true,
                          }" :required="true" />
                      </div>

                      <div v-if="selectedAccount?.distributionMethodName ===
                        DISTRIBUTION_METHODS.remaining
                        ">
                        <fs-input label="Distribution Amount" type="fsTextInput" name="distributionAmount" :disabled="true"
                          prepend="$" />
                      </div>

                      <div v-if="selectedAccount?.distributionMethodName ===
                        DISTRIBUTION_METHODS.percentageNet ||
                        selectedAccount?.distributionMethodName ===
                        DISTRIBUTION_METHODS.percentageRemaining
                        ">
                        <fs-input label="Distribution Percentage" type="fsTextInput" name="distributionAmount"
                          v-model="selectedAccount.distributionAmount" :required="true" :rules="{
                            required: true,
                            between: [0.01, 99.99],
                          }" :step="0.01" maskFormat="###" append="%" />
                      </div>
                    </fs-col>
                </fs-row>

                <fs-row>
                  <fs-col md="12" lg="6">
                    <div :class="isAccNumbDuplicated && 'position-relative'">
                      <fs-input type="fsTextInput" label="Account Number"
                        :input-type="hideAccountNumber ? 'password' : 'text'" name="bankAccountNumber"
                        v-model="selectedAccount.bankAccountNumber" :required="true" :rules="{ max: 25, required: true }"
                        :maxlength="25" maskFormat="#########################">
                        <template #input-group-content>
                          <fs-button class="fs-input__overlap-button" @click="hideAccountNumber = !hideAccountNumber"
                            variant="outline-secondary">
                            <font-awesome-icon :icon="hideAccountNumber
                                ? 'fa-light fa-eye'
                                : 'fa-light fa-eye-slash'
                              " />
                          </fs-button>
                        </template>
                      </fs-input>
                      <div class="fs-input__message fs-input__message--error" v-if="isAccNumbDuplicated"
                        style="position: absolute, bottom: 20px">
                        Duplicate account number
                      </div>
                    </div>
                  </fs-col>

                  <fs-col md="12" lg="6">
                    <div>
                      <fs-input label="Re-Enter Account Number" type="fsTextInput" :input-type="hideAccountNumberConfirm ? 'password' : 'text'
                        " name="accountNumberConfirm" v-model="accountNumberConfirm" :required="true"
                        :rules="{accountNumberMatch: { verify: selectedAccount.bankAccountNumber }}"  maskFormat="#########################">
                        <template #input-group-content>
                          <fs-button class="fs-input__overlap-button" @click="
                            hideAccountNumberConfirm = !hideAccountNumberConfirm
                            " variant="outline-secondary">
                            <font-awesome-icon :icon="hideAccountNumberConfirm
                                ? 'fa-light fa-eye'
                                : 'fa-light fa-eye-slash'
                              " />
                          </fs-button>
                        </template>
                      </fs-input>
                    </div>
                  </fs-col>
                </fs-row>

                <fs-row>
                  <fs-col md="12" lg="6">
                    <fs-input :input-type="hideRoutingNumber ? 'password' : 'text'" label="Routing Number"
                      type="fsTextInput" name="bankRoutingNumber" v-model="selectedAccount.bankRoutingNumber" :required="true"
                      :rules="{ max: 25, required: true }" :maxlength="25" maskFormat="#########################">
                      <template #input-group-content>
                        <fs-button class="fs-input__overlap-button" @click="hideRoutingNumber = !hideRoutingNumber"
                          variant="outline-secondary">
                          <font-awesome-icon :icon="hideRoutingNumber
                              ? 'fa-light fa-eye'
                              : 'fa-light fa-eye-slash'
                            " />
                        </fs-button>
                      </template>
                    </fs-input>
                  </fs-col>
                </fs-row>

                <fs-row>
                  <fs-col cols="6">
                    <div class="py-0 form-group fs-input__form-group">
                      <div class="fs-input__label">Voided Check</div>
                      <input multiple id="upload_file" type="file" @change="(event) => handleUploadFile(event)" hidden
                        accept="
                            image/jpeg, 
                            image/jpg, 
                            image/png, 
                            application/pdf, 
                            application/msword, 
                            application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
                            application/vnd.ms-powerpoint, 
                            application/vnd.openxmlformats-officedocument.presentationml.presentation" ref="fileInput" />
                      <label for="upload_8850" class="me-4" style="padding-top: 16px">
                        <fs-button variant="outline-primary" @click="chooseFile()">
                          <font-awesome-icon icon="fa-light fa-arrow-up-from-bracket" class="me-2" />
                          Upload
                        </fs-button>
                      </label>
                      <div v-if="uploadedFileName" class="mt-2">
                        <a style="width: 200px" class="text-success d-flex justify-content-between align-items-center my-2">
                          <span @click="handlePreviewFile(uploadFiles)"><font-awesome-icon class="me-2"
                              :icon="['fal', 'paperclip']" />{{ uploadedFileName }}</span>
                          <div class="d-inline ms-3 px-1" @click="handleRemoveFileItem(uploadFiles)">
                            <font-awesome-icon :icon="faTrashCan" class="text-danger cursor--pointer" />
                          </div>
                        </a>
                      </div>
                    </div>
                  </fs-col>
                </fs-row>

                <fs-row>
                  <fs-col cols="12">
                    <fs-input label="Description" type="fsTextArea" v-model="selectedAccount.description" name="description"
                      :rules="{ max: 30 }" :rows="3" placeholder="Enter something..." />
                  </fs-col>
                </fs-row>
              </VeeForm>
            </fs-container>
          </fs-container>
        </fs-col>
      </fs-row>      
    </fs-container>

    <dark-theme-modal :showModal="openDiscardConfirmModal" title="Discard changes" okText="discard changes"
      okTextVariant="success" cancelText="cancel" cancelBtnVariant="light" @close="openDiscardConfirmModal = false"
      @ok="resetAll">
      <template #content>
        <span class="d-flex">
          <font-awesome-icon :class="['me-2', 'text-warning']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
          <div>Do you really want to discard this?</div>
        </span>
      </template>
    </dark-theme-modal>

    <dark-theme-modal :showModal="openDeleteConfirmModal" title="Delete Account" okText="delete" okTextVariant="danger"
      cancelText="cancel" cancelBtnVariant="light" @close="openDeleteConfirmModal = false" @ok="onDelete">
      <template #content>
        <span class="d-flex">
          <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
          <div>
            Do you really want to delete this account?
            <br />
            This process cannot be undone.
          </div>
        </span>
      </template>
    </dark-theme-modal>

    <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved changes" okText="YES, LEAVE"
      okTextVariant="danger" cancelText="STAY" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
      @ok="handleDiscardOnRouteChange">
      <template #content>
        <span class="d-flex py-3">
          <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
          <div>
            Are you sure you want to leave this page?
            <br />
            You have unsaved changes, your data will be lost.
          </div>
        </span>
      </template>
    </dark-theme-modal>
  </div>
</template>
<style scoped lang="scss">
input {
  height: 36px;
}

.icon-eye {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 3%;
}

:deep(.distributionAppend) {
  width: calc(100% - 36px);
  padding-left: 5px;
  border: 1px solid #a7b0bc;
}

:deep(.distributionPrepend) {
  width: calc(100% - 36px);
  padding-left: 5px;
  border: 1px solid #a7b0bc;
}

.message-error {
  margin: 5px 0;
  color: #f23648;
  display: block;
}

:deep(.b-grid-header-scroller) {
  display: none;
}

.textarea-form:focus {
  color: #212529;
  background-color: #ffffff;
  border-color: #03a9f4;
  outline: 0;
  box-shadow: 0 0 0 0.1rem rgb(3 169 244 / 50%);
}

:deep(.form-control:valid) {
  background-image: none;
}

:deep(.b-grid-cell.b-template-cell) {
  border: none;
}

.form-eye {
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #a7b0bc;
  padding-right: 6px;
}

:deep(#account-number-confirm) {
  border: none;
}

:deep(#account-number) {
  border: none;
}

:deep(#account-number-confirm) {
  border: none;
}

:deep(input[type="file"] > span[aria-hidden="true"]) {
  display: none;
}

.fs-border {
  border: 1px solid #a7b0bc;
}

:deep(.b-grid-cell.b-action-cell) {
  visibility: hidden;
  transition: all ease-in-out 0.3s;
}

:deep(.b-grid-row:hover .b-grid-cell.b-action-cell) {
  visibility: visible;
}

:deep(.b-action-item:hover) {
  transform: none;
}

.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
}

.sub-title {
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
}

.row-wrapper {
  height: calc(100% - 74px);
}

.file-item:hover {
  background-color: #e1e4e880;
  transition: all ease-in-out 0.3s;
}

.delete-btn {
  visibility: hidden;
}

.file-item:hover .delete-btn {
  visibility: visible;
}

.cursor-pointer {
  cursor: pointer;
}

:deep(.multiselect__option--selected.multiselect__option--highlight), 
:deep(.multiselect__option--selected.multiselect__option--highlight:after){
  background-color: transparent;
}
</style>
