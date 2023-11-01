import { PermissionSetting } from "@/enums/settings/PermissionSetting";

export class PermissionItem {
    public permissionItemId: number;
    public menuOrdinal: number;
    public permissionItemName: string;
    public parent_PermissionItemId: number;
    public isActive: boolean;
    public isLabel: boolean;
    public permissionSettingId: PermissionSetting;
    public isChildmost: boolean;

    public constructor(init?: PermissionItem) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
