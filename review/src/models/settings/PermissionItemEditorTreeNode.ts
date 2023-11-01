import { PermissionSetting } from "@/enums/settings/PermissionSetting";
import { PermissionItem } from "./PermissionItem";

export class PermissionItemEditorTreeNode {
    public permissionItem: PermissionItem;
    public currentPermissionSettingId: PermissionSetting;
    public parent: PermissionItemEditorTreeNode;
    public children: PermissionItemEditorTreeNode[];
    public depth: number;
}
