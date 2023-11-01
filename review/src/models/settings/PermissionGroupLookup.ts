//Model used for the permission group dropdown 
export default class PermissionGroupLookup {
    public id: number = 0;
    public name: string = '';

    public constructor(init?: PermissionGroupLookup) {
        if (init) {
            Object.assign(this, init);
        }
    }
}