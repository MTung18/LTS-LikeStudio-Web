import { formatUTCToLocalDate } from "@/functions/DateUtilityFunctions";
import { flattenObject, formatLabel } from "@/functions/FormatterUtilityFunction";
import { DetailItemType } from "./employees/detailItemType";
import { maskify } from "@/helper/hqSuite/formatHelper";
import { MESSAGE } from "@/data/message";
import { ExtendedEmployeeDirectDeposit } from "./directDeposit/extendedEmployeeDirectDeposit";
import { EssApprovalStatus } from "@/enums/EssApprovalStatus";

export default class DetailsPanelInfo {
    public label: string;
    public property: string;
    public value: string;
    public message: string
    public icon: string;
    public order: number;
    public isVisible: boolean = true;
    public isDownloadable: boolean = true;
    public downloadableTitle: string = MESSAGE.COMMON.FILE_YET_TO_UPLOAD;
    public maskValue: string = null;
    public type: DetailItemType = DetailItemType.ReadOnly;
    public constructor(init?: Partial<DetailsPanelInfo>) {
        Object.assign(this, init);
    }

    public static ConvertNotes(notes: any) {
        const selectedNote = [];
        const propertyToShow: string[] = ['date', 'title', 'createdBy', 'note'];
        const propertyDataList: any = Object.entries(flattenObject(notes));
        for (const item of propertyDataList) {
            const property: any = item[0];
            let actualValue: any = item[1];
            const index = propertyToShow.indexOf(property)
            if (index >= 0) {
                const computedValue = property === 'date' ? formatUTCToLocalDate(actualValue) : actualValue;
                selectedNote.push(new DetailsPanelInfo({ label: formatLabel(property), value: computedValue, isVisible: true, order: index }))
            }

        }
        return selectedNote;
    }

    public static ConvertDirectDeposit(data: ExtendedEmployeeDirectDeposit) {
        let fileName = data.voidedCheckFilePath;
        let isDownloadable = true;
        if (data.file && data.file.fileName != '') {
            fileName = data.file.fileName;
            isDownloadable = false;
        }
        let statusClass = '';
        if (data.approvalStatusId === EssApprovalStatus.PendingHRM || data.approvalStatusId === EssApprovalStatus.PendingFoundation) {
            statusClass = 'text--status-pending';
        } else if (data.approvalStatusId === EssApprovalStatus.Approved) {
            statusClass = 'text--status-active';
        } else if (data.approvalStatusId === EssApprovalStatus.Rejected) {
            statusClass = 'text--status-inactive';
        }
        const config: DetailsPanelInfo[] = [
            new DetailsPanelInfo({
                label: 'Status',
                property: 'isActive',
                type: DetailItemType.ReadOnlyWithIcon,
                icon: `b-fa-solid b-fa-circle ${data.isActive ? 'text--status-active' : 'text--status-inactive'} `,
                order: 1,
                value: data.isActive ? MESSAGE.COMMON.ACTIVE : MESSAGE.COMMON.INACTIVE
            }),
            new DetailsPanelInfo({
                label: 'Sequence',
                property: 'ordinalPosition',
                type: DetailItemType.ReadOnly,
                order: 2,
                value: data.ordinalPosition?.toString()
            }),
            new DetailsPanelInfo({
                label: 'Bank Account Type',
                property: 'accountTypeId',
                type: DetailItemType.ReadOnlyWithIcon,
                order: 3,
                value: data.accountTypeName
            }),
            new DetailsPanelInfo({
                label: 'Pre-Note',
                property: 'isPrenoteRequired',
                type: DetailItemType.ReadOnly,
                order: 4,
                value: data.isPrenoteRequired ? MESSAGE.COMMON.YES : MESSAGE.COMMON.NO
            }),
            new DetailsPanelInfo({
                label: 'Distribution Method',
                property: 'distributionMethodId',
                type: DetailItemType.ReadOnlyWithIcon,
                order: 5,
                value: data.distributionMethodName
            }),
            new DetailsPanelInfo({
                label: 'Distribution Amount',
                property: 'distributionAmount',
                type: DetailItemType.ReadOnlyWithIcon,
                order: 5,
                value: data.distributionAmount?.toString()
            }),
            new DetailsPanelInfo({
                label: 'Routing Number',
                property: 'bankRoutingNumber',
                type: DetailItemType.Sensitive,
                maskValue: maskify(data.bankRoutingNumber),
                order: 6,
                value: data.bankRoutingNumber
            }),
            new DetailsPanelInfo({
                label: 'Account Number',
                property: 'bankAccountNumber',
                type: DetailItemType.Sensitive,
                maskValue: maskify(data.bankAccountNumber),
                order: 7,
                value: data.bankAccountNumber
            }),
            new DetailsPanelInfo({
                label: 'Voided Check',
                property: 'voidedCheckFilePath',
                type: DetailItemType.Downloadable,
                isDownloadable: isDownloadable,
                order: 8,
                value: fileName
            }),
            new DetailsPanelInfo({
                label: 'Description',
                property: 'voidedCheckFilePath',
                type: DetailItemType.ReadOnly,
                order: 9,
                value: data.description
            })
        ];
        return config;
    }
}