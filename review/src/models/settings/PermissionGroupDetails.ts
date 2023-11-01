import PermissionGroupPermissionItem  from './PermissionGroupPermissionItem';
import PermissionGroupUser from './PermissionGroupUser';

//Model used to display the in-depth information (Views -> permissionGroupDetails)
export default class PermissionGroupDetails {
  public id: number = 0;
  public name: string = '';
  public description: string = '';
  public isDefaultPermissionGroup: boolean = false;
  public isAdminGroup: boolean = false;
  public isSupervisorGroup: boolean = false;
  public permissionGroupPermissionItems: PermissionGroupPermissionItem[] = [];
  public users: PermissionGroupUser[] = [];

  public constructor(init?: PermissionGroupDetails) {
    if (init) {
        let users = init.users;
        delete init.users;

        Object.assign(this, init);

        if(users)
        {
          users.forEach(user => this.users.push(new PermissionGroupUser(user)));
        }
    }
  }
}