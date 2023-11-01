import { HrApprovalCategory } from '../../enums/HrApprovalCategory'

export default class PendingApprovalResult {
    public status: boolean | null
    public hrApprovalCategory: HrApprovalCategory
    public rejectionComment: string

  public constructor(category: HrApprovalCategory) {
    this.status = null
    this.hrApprovalCategory = category
    this.rejectionComment = ''
  }
}
