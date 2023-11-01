//Model used to display the high level information of a permission group (Views -> userAndPermissions)
export default class PermissionGroup {
  public id: number = 0;
  public name: string = '';
  public description: string = '';
  public userCount: number = 0;

  public constructor(init?: Partial<PermissionGroup>) {
      if (init) {
          Object.assign(this, init);
      }
  }
}