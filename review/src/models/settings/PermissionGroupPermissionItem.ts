import { PermissionSetting } from "@/enums/settings/PermissionSetting";

export default class PermissionGroupPermissionItem {
    public permissionGroupPermissionItemId: number;
    public permissionGroupId: number;
    public permissionItemId: number;
    public permissionSettingId: PermissionSetting;

    public constructor(init?: PermissionGroupPermissionItem) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
