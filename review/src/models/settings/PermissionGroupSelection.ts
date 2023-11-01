import PermissionGroup from "./PermissionGroup";

export default class PermissionGroupSelection extends PermissionGroup {
    public isSelected: boolean = false;

    public constructor(init?: Partial<PermissionGroupSelection>) {
        super();
        Object.assign(this, init);
    }
}