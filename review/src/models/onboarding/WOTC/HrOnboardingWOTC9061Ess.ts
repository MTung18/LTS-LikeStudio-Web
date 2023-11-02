import { StateT, UploadFileStateFormT } from "./UploadPayload";

export interface OnboardingWOTC9061Ess {
    status: string;
    isActive: boolean;
    isFormDone: boolean;
    lastName: string;
    firstName: string;
    middleInitial: string;
    socialSecurityNumber: string;
    isHaveWorkedBefore: boolean;
    lastDateEmployment: string;
    isLastAgeSixteenUnderForty: boolean;
    dateOfBirth1: string;
    dateOfBirth2: string;
    isVeteranUSAForces: boolean;
    isUSAVeteranStatus: boolean;
    cityBenefitReceived1: string;
    stateBenefitReceived1: StateT;
    isVeteranServiceConnected: boolean;
    isDischargedOrReleased: boolean;
    isUnemployedCombinedPeriod: boolean;
    isMemberOfFamily: boolean;
    isNoLongerReceiving: boolean;
    namePrimaryRecipient1: string;
    cityBenefitReceived2: string;
    stateBenefitReceived2: StateT;
    isIsReferredToEmployer: boolean;
    isEmploymentNetwork: boolean;
    isDepartmentVeteransAffairs: boolean;
    isReceivedTANFAssistance: boolean;
    isReceivedTANFBenefit: boolean;
    isFamilyStopEligibleTANF: boolean;
    isMemberFamilyReceivedTANF: boolean;
    namePrimaryRecipient2: string;
    cityBenefitReceived3: string;
    stateBenefitReceived3: StateT;
    isConvictedFelonyOrReleasedFrom: boolean;
    dateOfConvicted: string;
    dateOfRelease: string;
    isFederalState?: boolean;
    isLiveEmpowermentZoneRRC: boolean;
    isLiveEmpowermentZone: boolean;
    isReceiveSupplementalSecurity: boolean;
    isVeteranUnemployedSixMonth: boolean;
    isVeteranUnemployedFourWeek: boolean;
    isIndividualPeriodUnemployment: boolean;
    receivedUnemployment: StateT;
    employeeSignaturePath: string;
    dateSignatureUTC: string;
    uploadFileStateForms: UploadFileStateFormT[];
    formFiles: string;
  }
  