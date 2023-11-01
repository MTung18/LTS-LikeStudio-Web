
export const MAIN_BUS: string = 'main-bus';
export const ROOT_BUS: string = 'root-bus';

// Declared event bus name to define Uniqueness

export enum BusEventName {
    // Input Wrapper
    Validate = 'validate',
    // Edit page template
    ScrollToSection = 'scrollToSection',
    FocusSection = 'focusSection',
    ActivateHeader = 'activateHeader',
    Save = 'save',
    ResetSaveButton = 'resetSaveButton',
    ShowCloseSaveModal = 'showCloseSaveModal',
    // Emit in Edit page template
    CloseSaveModalOpen = 'closeSaveModalOpen',
    ActivateSideNavLink = 'activateSideNavLink',
    // Emit in SideNav & Edit page template
    ResetDailyLogsDate = 'resetDailyLogsDate',

    ReachedTop = 'reachedTop',
    CloseDocument = 'closeDocument',
    CancelClicked = 'cancelClicked',
    SaveFailed = 'saveFailed',
    ResetFroalaFullscreen = 'resetFroalaFullscreen',
    // Lookup editor
    CancelEdits = 'cancelEdits',
    DeletedItem = 'deletedItem',
    LinkItem = 'linkItem',
    // Lookup item list
    ShowSubmenu = 'showSubmenu',
    // Option Editor
    UpdateFailed = 'updateFailed',

    // Document Store
    SetDocumentInfo = 'setDocumentInfo',

    // Report Mixins
    CheckForValidDate = 'checkForValidDate',
    SetParentDateMessages = 'setParentDateMessages',
    UpdateOptionList = 'updateOptionList',
    GetWeather = 'getWeather',
    MultiSelectOpen = 'multiSelectOpen',
    MultiSelectClose = 'multiSelectClose',
    PermissionSettingIdChange = 'permissionSettingIdChange'
}

export enum RootEventName {
    BV_SCROLLSPY_ACTIVATE = 'bv::scrollspy::activate'
}