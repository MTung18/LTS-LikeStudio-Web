import Honorific from "./Honorific"
import Supervisor from "./Supervisor";
import PermissionGroup from "./PermissionGroup";
import PayrollStateTaxCode from "./PayrollStateTaxCode";


export default class CreateEmployeeDropdownData {
    honorifics: Honorific[];
    supervisors: Supervisor[];
    permissionGroups: PermissionGroup[];
    workLocations: PayrollStateTaxCode[];

}