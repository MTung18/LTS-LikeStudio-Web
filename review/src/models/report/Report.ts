import { ReportTypeGuid } from '@/enums/ReportType';
export interface IField {
    name: string,
    id: number,
    guid: string,
    default: boolean,
    referenceInformation: string,
    sortByField: string
    reportingSupervisorPhqId?: number
}

export interface IReportGet {
    dateRange?: IField[],
    status?: IField[],
    consentStatus?: IField[],
    employees?: IField[],
    reportingSupervisors?: IField[],
    trades?: IField[],
    unions?: IField[]
    departments?: IField[],
}

export interface IReportPost {
    name: string,
    value: IField[]
}

export interface IData {
    isOpen: boolean,
    type: ReportTypeGuid,
    title: string
}