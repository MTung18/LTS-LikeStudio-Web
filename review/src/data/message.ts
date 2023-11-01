
export const MESSAGE: any = {
    COMMON: {
        YES: 'Yes',
        NO: 'No',
        SAVE: 'Save',
        OK: 'Ok',
        CANCEL: 'Cancel',
        DISCARD: 'Discard',
        SUBMIT: 'Submit',
        SUBMIT_NOW: 'Submit Now',
        SUBMIT_LATER: 'Submit Later',
        ACTIVE: 'Active',
        INACTIVE: 'Inactive',
        UPLOAD: 'Upload',
        DOWNLOAD: 'Download',
        VIEW: 'View',
        EDIT: 'Edit',
        DELETE: 'Delete',
        WARNING: 'Warning!',
        ERROR_LOG: 'An unexpected error occurred attempting to <<action>> the <<type>>.',
        DOWNLOADING: 'Downloading File',
        UPLOADING: 'Uploading File',
        UPLOAD_SUCCESS: 'File(s) uploaded successfully.',
        UPLOAD_ERROR: 'Failed to upload file(s).',
        DISCARD_CHANGES_TITLE: 'Discard Changes',
        DISCARD_CHANGES_MESSAGE: 'Are you sure you want to discard unsaved changes?',
        NO_DATA: 'No data available',
        FILE_YET_TO_UPLOAD: 'File yet to be uploaded.',
        CANCEL_CONFIRMATION_TITLE: 'Cancel Confirmation',
        CANCEL_CONFIRMATION_MESSAGE: 'Would you like to Save or Discard your changes?',
    },
    PAYROLL: {
        MANAGE_ACCOUNTS: 'Manage Accounts'
    },
    PAYMENT_SWITCHER: {
        PAYMENTMETHOD_UPDATE: 'Payment Method Updated to <<type>>.',
        PAYMENTMETHOD_UPDATE_FAILED: 'Failed to update Payment Method to <<type>>.',
        CHANGE_PAYMENT_METHOD: "Change Payment Method",
        CHANGE_PAYMENT_TITLE:  "Payment Method Confirmation",
        PC_TO_DD: "",
        DD_TO_PC: `Changing the payment method to Paper Checks will not delete the employee's bank accounts, however they will all be set to "Inactive" status.`,
        SWITCH_TO_PC: "SWITCH TO PAPER CHECKS",
        SWITCH_TO_DD: "SWITCH TO DIRECT DEPOSITS",
        CLIENT_EMPLPOYEE_SWITCH_MESSAGE : 'As a part of this process, the system will smoothly transition the employee to the newly selected payment method in the background. Subsequently, the selected payment method will undergo the necessary approval process, if applicable.',
        CLIENT_EMPLPOYEE_SWITCH_ERROR_MESSAGE :"Your company's payment method could not be updated. Please try again or contact support.",
        CLIENT_EMPLPOYEE_SWITCH_BANNER_MESSAGE: "There are employees who currently have pending direct deposit changes that will need approved or rejected in Foundation before the payment method can be switched."
    },
    DIRECT_DEPOSIT: {
        ADD_ACCOUNT: ' Add Account',
        NEW_ACCOUNT: 'New Account',
        ACCOUNT_DETAILS: 'Account Details',
        MANAGE_ACCOUNTS: 'Manage Bank Accounts',
        DEPOSIT_ORDER: 'Deposit Order',
        SAVE_SUCCESS: 'Account information saved.',
        UPDATE_CREATE_ERROR: 'Failed to create/update account. Try again.',
        REMAINDER_ACCOUNT_DELETE: 'You cannot delete the Remainder account. Please edit the account to update or change bank account information.',
        DELETE_CONFIRMATION_MESSAGE: 'Are you sure you want to delete this account?',
        DELETE_SUCCESS: 'Account has been deleted.',
        DELETE_ERROR: 'Error occurred while deleting account.',
        SUBMIT_SUCCESS: 'Direct Deposit changes submitted.',
        REMAINDER_ACCOUNT_MANDATORY: 'At least one remaining account is mandatory',
        PERCENT_DISTRIBUTION_AMOUNT_EXCEED: "The sum of the <b>Distribution Amount</b> should not exceed 100% for accounts with the '% of Net' Distribution method. Please correct the <b>Distribution Amount</b> for the below accounts:",
        SUBMIT_NOTIFICATION_MANAGE_ACCOUNT: 'Unsubmitted changes have been found - please review and submit.',
        SUBMIT_NOTIFICATION: 'Unsubmitted changes have been made - please review select \'Manage Bank Accounts\' to review.',
        SUNMIT_NOTIFIICATION_MESSSAGE: 'There are accounts with changes that haven\'t been submitted. Would you like to submit them now?',
        SUNMIT_NOTIFIICATION_TITLE: 'Accounts Not Submitted',
        STATUS_INPROGRESS_DELETE: 'Approval process is in-progress. Cannot delete this direct deposit.',
        STATUS_INPROGRESS_UPDATE: 'Approval process is in-progress. Cannot update this direct deposit.',
        SETUP_DIRECTDEPOSIT_HEADER: 'Set Up <<FIRSTNAME>>\'s Direct Deposit',
        SETUP_DIRECTDEPOSIT_SUBTEXT: 'This employee does not have any bank <br/>accounts for Direct Deposit.',
        PAPERCHECKS_HEADER: 'This employee is receiving Paper Checks.',
        PAPERCHECKS_SUBTEXT: 'Paper checks provide a paper trail and <br/>give employees stubs immediately.',
        CANNOT_EDIT_TEXT: 'Cannot edit account when it is pending approval.',
        CANNOT_ADD_TEXT: 'Cannot add new account when it is pending approval.',
        MANAGE_ACCOUNTS_BUTTON_TEXT: "Manage Accounts",
        SWITCH_TO_DIRECT_DEPOSIT_BUTTON_TEXT: "Switch to direct deposit",
        PERCENT_DISTRIBUTION_AMOUNT: "Distribution Amount in %",
        ACCOUNT_NUMMBER: "Account Number",
        NEW_ACCOUNT_CANCEL: "Are you sure you want to leave without entering a direct deposit account?",
        NEW_ACCOUNT_SUBMIT_CANCEL : "This user will receive a paper check without direct deposit account information entered.",
        NEW_ACCOUNT_SUBMIT_CANCEL_TITLE: "Paper Check"

    },
    DOCUMENT_META: {
        ADD_DOCUMENT: 'ADD DOCUMENT',
        SAVE_SUCCESS: 'Document saved successfully',
        SAVE_ERROR: 'Error occurred while saving document.',
        DELETE_SUCCESS: 'Document(s) has been deleted.',
        DELETE_ERROR: 'Error occurred while deleting file.',
        DELETE_MESSAGE: 'Once a document(s) is deleted, it cannot be retrieved. Are you sure you want to delete this document(s)?',
        NO_RECORD: 'No document(s) found'
    },
    NOTES: {
        SAVE_SUCCESS: 'Notes saved successfully',
        VIEW_NOTE: 'View Note',
        DELETE_NOTE: 'Delete Note',
        DELETE_SUCCESS: 'Employee notes has been deleted.',
        DELETE_ERROR: 'Error occurred while deleting employee notes.',
        DELETE_MESSAGE: 'Are you sure you want to delete this Note?',
        NO_RECORD: 'No notes found'
    },
    DEAFULT_TEMPLATE: {
        SAVE_SUCCESS: '<<TYPE>> saved successfully.',
        DELETE_SUCCESS: '<<TYPE>> has been deleted.',
        DELETE_ERROR: 'Error occurred while deleting <<TYPE>>',
        DELETE_MESSAGE: 'Are you sure you want to delete this <<TYPE>>?',
        NO_RECORD: 'No <<TYPE>> found'

    },
    HQSUITE: {
        FILE_SIZE_10MB: 'File size must be under 10MB.',
        DIRECTDEPOSIT_ALLOWED_EXTENSION : 'The file should be uploaded in JPEG/JPG/PNG/PDF/DOC/DOCX/PPT/PPTX format.'
    },
    HR_APPROVAL: {
        UPDATE_ERROR_DETAIL_RESPONSE: 'Profile locked pending Foundation approval',
        UPDATE_ERROR: 'Updates not saved, another user has already submitted changes for this page.'
    }
};
