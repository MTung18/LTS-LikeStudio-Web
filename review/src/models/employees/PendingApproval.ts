import PendingApprovalChange from "./PendingApprovalChange"

export default class PendingApproval {
  public employeeId: number
  public hrApprovalCategory: number
  public changes: PendingApprovalChange[]

  public constructor(init?: Partial<PendingApproval>) {
    Object.assign(this, init)
  }
}
